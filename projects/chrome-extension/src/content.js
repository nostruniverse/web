
let runtime = (typeof browser != "undefined" ? browser : chrome).runtime

// Nostr NIP07
window.nostr = {
    getPublicKey: async function() {
        return runtime.sendMessage({
            id: "nw.nip07.getPublicKey"
        })
    },
    signEvent: async function(event) {
        return runtime.sendMessage({
            id: "nw.nip07.getPublicKey",
            event
        })
    },
    getRelays: async function() {

    },
    nip04: {
        encrypt: async function(pk, plainText) {

        },
        decrypt: async function(pk, cipherText) {

        }
    }
}

window.addEventListener("message", function(event){

});