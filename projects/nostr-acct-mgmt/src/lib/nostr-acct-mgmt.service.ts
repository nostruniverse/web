import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, from, of } from "rxjs";
import { Account } from "./account";



interface AccountStorage {
    accounts: Account[];
}

const ACCOUNT_STORAGE_LOCALSTORAGE_KEY = "acct_storage"
const SELECTED_ACCOUNT_LOCALSTORAGE_KEY = "acct_selected"

declare const chrome: any;
declare const browser: any;


const runtime = (typeof browser != "undefined" ? browser : chrome).runtime;
const storage = (typeof browser != "undefined" ? browser : chrome).storage;


@Injectable({
  providedIn: 'root',
})
export class NostrAcctMgmtService {

    private accountStorage!: AccountStorage | null;
    private accountStorageSub!: BehaviorSubject<AccountStorage | null>;
    public accountStorage$!: Observable<AccountStorage | null>;
    
    private selectedAccount!: Account | null;
    private selectedAccountSub!: BehaviorSubject<Account | null>;
    public selectedAccount$!: Observable<Account | null>;

    // FIX ME:
    private extensionID = "dpiahjbchnodmjaohcccfclhbjjgilep"
    constructor() {
      this.selectedAccountSub = new BehaviorSubject(null as any);
      this.selectedAccount$ = this.selectedAccountSub.asObservable();

      this.accountStorageSub = new BehaviorSubject(null as any);
      this.accountStorage$ = this.accountStorageSub.asObservable();
    
         from(this.isBrowserExtensionRunning())
         .pipe(catchError(err=>{
            console.error(err);
            return of(false)
         })).subscribe({
          next:  isExtRunning=>{
            const inExt = this.runInBrowserExtension();
            console.log("extension running", isExtRunning);
            console.log("in extension", inExt);
            if(!inExt && !isExtRunning){
              // in normal web page mode, we are using local storage
              this.accountStorage = this.readAcctStorageFromLocalStorage()
              this.accountStorageSub.next(this.accountStorage)
              this.accountStorage$.subscribe(storage => {
                this.writeAcctStorageToLocalStorage(storage);
              });
    
              this.selectedAccount = this.readSelectedAcctFromLocalStorage();
              this.selectedAccountSub.next(this.selectedAccount);
              this.selectedAccount$.subscribe(acct => {
                  localStorage.setItem(SELECTED_ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(acct));
                  if(!this.runInBrowserExtension()) {
                    this.sendAcctSelectedToExtension(acct).then(()=>{});
                  }
              });
            } else {
              // in extension or web page with extension, we are using service worker API
              from(this.getAcctStorageFromExtension()).subscribe({
                next: storage => {
                  console.log("got storage form service worker", storage)
                  this.accountStorage = storage;
                  this.accountStorageSub.next(this.accountStorage);
                  this.accountStorage$.subscribe(storage => {
                    this.sendAcctStorageToExtension(storage);
                  });
                },
                error: err => {
                  console.error("failed to get storage form service worker", err)
                }
              });

              from(this.getSelectedAcctFromExtension()).subscribe({
                next: acct => {
                  console.log("got selected account form service worker", acct)
                  this.selectedAccount = acct;
                  this.selectedAccountSub.next(this.selectedAccount);
                  this.selectedAccount$.subscribe(acct => {
                    this.sendAcctSelectedToExtension(acct);
                  });
                },
                error: err => {
                  console.error("failed to get selected account from service worker", err)
                }
              });
    
            }
            
    
            
    
            // if running inside of browser extension, 
            // listen to storage or account selection update event
            if(this.runInBrowserExtension()){
    
              storage.onChanged.addListener((data:any)=>{
                console.log("data", data)
              })
            }
  
          }
         })
         
         


    }

    addAccount(acct: Account): void {
        if(this.accountStorage == null){
            this.accountStorage = {
                accounts: []
            }
        }
        const newStorage = Object.assign({}, this.accountStorage);
        if(!newStorage.accounts){
          newStorage.accounts = []
        }
        newStorage.accounts.push(acct);
        this.accountStorage = newStorage;
        this.accountStorageSub.next(this.accountStorage);
    } 

    selectAccount(acct: Account): void {
        this.selectedAccount = acct;
        this.selectedAccountSub.next(this.selectedAccount);
    }

    removeAccount(pubk: string): void {
        const newStorage = Object.assign({}, this.accountStorage);
        newStorage.accounts = newStorage.accounts.filter(acct=> acct.pubk != pubk);
        this.accountStorage = newStorage;
        this.accountStorageSub.next(this.accountStorage);
    }

    addAccountWithExistingPk(pubk:string): void {
        const acct: Account = {
            pubk,
            createdAt: Date.now()
        };
        this.addAccount(acct);
    }

    readAcctStorageFromLocalStorage():AccountStorage | null {
        const res = localStorage.getItem(ACCOUNT_STORAGE_LOCALSTORAGE_KEY);
        if(res == null){
            return null;
        }
        return JSON.parse(res);
    }

    readSelectedAcctFromLocalStorage():Account | null {
        const res = localStorage.getItem(SELECTED_ACCOUNT_LOCALSTORAGE_KEY);
        if(res == null){
            return null;
        }
        return JSON.parse(res);
    }


    writeAcctStorageToLocalStorage(storage: AccountStorage | null): void {
        const val = JSON.stringify(storage);
        localStorage.setItem(ACCOUNT_STORAGE_LOCALSTORAGE_KEY, val);
    }

    runInBrowserExtension(): boolean {
      return chrome && chrome.runtime && chrome.runtime.id != null
    }
    

    async sendRequestToExtension(extId:string, reqId:string, data?: any): Promise<any> {
      return new Promise((resolve, reject)=>{
        if(runtime){
          runtime.sendMessage(extId, {
            id: reqId,
            data
          }, null, (res:any)=>{
            if(!res){
              return reject(runtime.lastError)
            }
            return resolve(res);
          });


        } else {
          reject()
        }
      })
    }

    async isBrowserExtensionRunning(): Promise<boolean> {
      return this.sendRequestToExtension(this.extensionID, "nw-extension-hello", null);
    }

    async sendAcctStorageToExtension(storage: AccountStorage | null){
      return this.sendRequestToExtension(this.extensionID, "nw-extension-sync-acct-storage", {
        storage
      });
    }

    async sendAcctSelectedToExtension(account: Account | null){
      return this.sendRequestToExtension(this.extensionID, "nw-extension-sync-acct-selected", {
        account
      });
    }

    getAcctStorageFromExtension(): Promise<AccountStorage | null> {
      return this.sendRequestToExtension(this.extensionID, "nw-extension-get-acct-storage")
    }

    getSelectedAcctFromExtension(): Promise<Account | null> {
      return this.sendRequestToExtension(this.extensionID, "nw-extension-get-selected-acct")
    }

}