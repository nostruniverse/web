import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";


export interface Account {
    pubk: string;
    prvk?: string;
    name?: string;
    createdAt: number;
}

interface AccountStorage {
    accounts: Account[];
}

const ACCOUNT_STORAGE_LOCALSTORAGE_KEY = "acct_storage"
const SELECTED_ACCOUNT_LOCALSTORAGE_KEY = "acct_selected"


@Injectable()
export class AcctMgmtService {

    private accountStorage: AccountStorage | null;
    private accountStorageSub: BehaviorSubject<AccountStorage | null>;
    public accountStorage$: Observable<AccountStorage | null>;
    
    private selectedAccount: Account | null;
    private selectedAccountSub: BehaviorSubject<Account | null>;
    public selectedAccount$: Observable<Account | null>;
    constructor() {
        this.accountStorage = this.readAcctStorageFromLocalStorage()
        this.accountStorageSub = new BehaviorSubject(this.accountStorage);
        this.accountStorage$ = this.accountStorageSub.asObservable();
        this.accountStorage$.subscribe(storage => this.writeAcctStorageToLocalStorage(storage));

        this.selectedAccount = this.readSelectedAcctFromLocalStorage();
        this.selectedAccountSub = new BehaviorSubject(this.selectedAccount);
        this.selectedAccount$ = this.selectedAccountSub.asObservable();
        this.selectedAccount$.subscribe(acct => {
            localStorage.setItem(SELECTED_ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(acct));
        })
    }

    addAccount(acct: Account): void {
        if(this.accountStorage == null){
            this.accountStorage = {
                accounts: []
            }
        }
        const newStorage = Object.assign({}, this.accountStorage);
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
        localStorage.setItem(ACCOUNT_STORAGE_LOCALSTORAGE_KEY, val)
    }
}