import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { from, iif, lastValueFrom, map, withLatestFrom, combineLatest, tap, BehaviorSubject } from "rxjs";

export enum ExtensionMode {
    BrowserSync,
    Local,
    NostrWorldSync
}

enum StorageKeys {
    ExtensionMode = "ExtensionMode"
}

export interface ExtensionConfiguration {
    extensionMode?: ExtensionMode | null;
}

@Injectable({
    providedIn: "root"
})
export class ConfigService {

    private changeSubject = new BehaviorSubject<ExtensionConfiguration | null>(null);
    change$: Observable<ExtensionConfiguration | null> = this.changeSubject.asObservable();

    constructor() {
        chrome.storage.onChanged.addListener((changes, area) => {
            const newValueChange = Object.keys(changes).reduce((prev, key) => {
                prev[key] = changes[key].newValue;
                return prev
            }, {} as Record<string, any>)
            this.changeSubject.next(newValueChange);
        })

        this.get({
            extensionMode: null
        } as ExtensionConfiguration)
        .subscribe({
            next: res => {
                this.changeSubject.next(res);
            }
        })
    }

    private get(keys: string | string[] | Record<string, any>): Observable<Record<string, any>> {
        return combineLatest([chrome.storage.sync.get(keys), chrome.storage.local.get(keys)])
        .pipe(
            map(([syncRes, localRes]) => {
                console.debug(syncRes, localRes);
                let final:Record<string, any> = {};
                let keysToCheck:string[];
                if(typeof keys === "string"){
                    keysToCheck = [keys];
                }
                else if (Array.isArray(keys)){
                    keysToCheck = keys;
                } else {
                    keysToCheck = Object.keys(keys);
                }
                for (let key of keysToCheck) {
                        final[key] = localRes[key] || syncRes[key]
                }
                return final;
            } ),
            tap(res => {
                console.debug("get", keys, res);
            })
        )
    }

    private set(config: ExtensionConfiguration): Observable<void> {
        console.debug("set", config);
        return from(chrome.storage.sync.set(config))
    }

    setExtensionMode(extensionMode: ExtensionMode | null): Observable<void> {
        return this.set({
            extensionMode
        })
    }

    getExtensionMode(): Observable<ExtensionConfiguration["extensionMode"]> {
        const key = "extensionMode";
        return this.get(key).pipe(
            map(res => res[key])
           
        )
    }

}