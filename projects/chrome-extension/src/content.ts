declare const browser:any;
declare const chrome:any;

let runtime:any = (typeof browser != "undefined" ? browser : chrome).runtime

// Nostr NIP07
(window as any).nostr = {
    getPublicKey: async function() {
        return runtime.sendMessage({
            id: "nw.nip07.getPublicKey"
        })
    },
    signEvent: async function(event:any) {
        return runtime.sendMessage({
            id: "nw.nip07.getPublicKey",
            event
        })
    },
    getRelays: async function() {

    },
    nip04: {
        encrypt: async function(pk:string, plainText:string) {

        },
        decrypt: async function(pk:string, cipherText:string) {

        }
    }
}

window.addEventListener("message", function(event){

});