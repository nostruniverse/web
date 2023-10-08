import { Injectable } from "@angular/core";
import { EventTemplate, finishEvent, VerifiedEvent } from "nostr-tools";
import { Observable, from, of, throwError } from "rxjs";


@Injectable({
    providedIn: "root"
})
export class NostrService {
    // takes an event object, adds `id`, `pubkey` and `sig` and returns it
    signEvent(event: EventTemplate, sk?: string): Observable<VerifiedEvent> {
        
        if(sk) {
            return of(finishEvent(event, sk));
        } 
        else if(window.nostr){
            return from(window.nostr.signEvent(event)) as Observable<VerifiedEvent>;
        } 

        return throwError(() => new Error("no private key found from neither window.nostr nor configuration"))
    }
}