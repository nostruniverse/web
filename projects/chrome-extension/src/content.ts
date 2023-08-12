declare const browser:any;
declare const chrome:any;

let runtime:any = (typeof browser != "undefined" ? browser : chrome).runtime

async function sendRequestToExtension(reqId: string,  data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (runtime) {
        runtime.sendMessage(runtime.id, {
          id: reqId,
          data
        }, null, (res: any) => {
          if (!res) {
            return reject(runtime.lastError)
          }
          return resolve(res);
        });


      } else {
        reject("no runtime object")
      }
    })
  }


// Nostr NIP07
(window as any).nostr = {
    getPublicKey: async function() {
        const res = await sendRequestToExtension("nw.nip07.getPublicKey")
        return res.data;
    },
    signEvent: async function(event:any) {
        const res = await sendRequestToExtension(
             "nw.nip07.signEvent",
            event
        )
        return res.data;
    },
    getRelays: async function() {
        const res = await sendRequestToExtension(
            "nw.nip07.getRelays"
        )
        return res.data
    },
    nip04: {
        encrypt: async function(pk:string, plainText:string) {
            const res = await sendRequestToExtension(
                 "nw.nip04.encrypt",
                 {
                  pk,
                  plainText
                 }
            )
            return res.data;
        },
        decrypt: async function(pk:string, cipherText:string) {
            const res = await sendRequestToExtension(
                "nw.nip04.decrypt",
                {
                  pk,
                  cipherText
                 }
            )
            return res.data;
        }
    }
}

