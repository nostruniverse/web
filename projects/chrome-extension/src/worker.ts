import { Relay, getEventHash, nip04, relayInit, signEvent, Sub, Event, UnsignedEvent, Filter } from 'nostr-tools';

const ACCOUNT_STORAGE_LOCALSTORAGE_KEY = "acct_storage"
const SELECTED_ACCOUNT_LOCALSTORAGE_KEY = "acct_selected"


interface BaseWorkerRequest {
    id: string;
}

interface WorkerResponse<T = any> {
    success: boolean,
    data?: T
}

function messageHandlerWrapper(request:any, sender:any, sendResponse:any){
    messageHandler(request, sender, sendResponse);
    return true;
}

function newWorkerResponse<T = any>(success: boolean, data?: T): WorkerResponse<T> {
    return {
        success,
        data
    }
}

const requestIdDispatcher = {
    "nw.nip07.getPublicKey" : async (request:any) => {
        const result = await chrome.storage.local.get([SELECTED_ACCOUNT_LOCALSTORAGE_KEY]);
        const acct = result[SELECTED_ACCOUNT_LOCALSTORAGE_KEY];
        return newWorkerResponse(true, acct.pubk)
    },
    "nw.nip07.signEvent": async (request:any) =>  {
        const result = await chrome.storage.local.get([SELECTED_ACCOUNT_LOCALSTORAGE_KEY]);
        const acct = result[SELECTED_ACCOUNT_LOCALSTORAGE_KEY];
        const pubk = acct.pubk;
        if(!acct.prvk){
            throw new Error("missing private key");
        }
        const event = request.data;
        event.pubkey = pubk;
        event.id = getEventHash(event);
        event.sig = signEvent(event, acct.prvk);
        return newWorkerResponse(true, event)
    },
    "nw.nip07.getRelays":async (request:any) => {
        // TODO
        return newWorkerResponse(true, [])
    },
    "nw.nip04.encrypt":async (request:any) => {
        const result = await chrome.storage.local.get([SELECTED_ACCOUNT_LOCALSTORAGE_KEY]);
        const acct = result[SELECTED_ACCOUNT_LOCALSTORAGE_KEY];
        if(!acct.prvk){
            throw new Error("missing private key");
        }
        const cipherText = nip04.encrypt(acct.prvk, request.data.pk, request.data.plainText)
        return newWorkerResponse(true, cipherText)
    },
    "nw.nip04.decrypt":async (request:any) => {
        const result = await chrome.storage.local.get([SELECTED_ACCOUNT_LOCALSTORAGE_KEY]);
        const acct = result[SELECTED_ACCOUNT_LOCALSTORAGE_KEY];
        if(!acct.prvk){
            throw new Error("missing private key");
        }
        const plainText = nip04.decrypt(acct.prvk, request.data.pk, request.data.cipherText)
        return newWorkerResponse(true, plainText)
    },
}

async function messageHandler(request:any, sender:any, sendResponse:any) {
    console.log(request, sender);
    if(request.id == "nw-extension-hello"){
        return sendResponse(newWorkerResponse(true));
    } 
    else if(request.id == "nw-extension-sync-acct-storage") {
        const {storage} = request.data;
        // const result = await chrome.storage.local.get([ACCOUNT_STORAGE_LOCALSTORAGE_KEY]);

        // const existingStorage = result[ACCOUNT_STORAGE_LOCALSTORAGE_KEY];
        
        await chrome.storage.local.set({[ACCOUNT_STORAGE_LOCALSTORAGE_KEY]: storage});
        console.log("update acct storage", storage);
        return sendResponse(newWorkerResponse(true))
    }
    else if(request.id == "nw-extension-sync-acct-selected") {
        const {account} = request.data;
        await chrome.storage.local.set({[SELECTED_ACCOUNT_LOCALSTORAGE_KEY]:account});
        console.log("update acct selection", account)
        return sendResponse(newWorkerResponse(true))
    }
    else if(request.id == "nw-extension-get-acct-storage") {
        const result = await chrome.storage.local.get([ACCOUNT_STORAGE_LOCALSTORAGE_KEY]);
        const acctStorage = result[ACCOUNT_STORAGE_LOCALSTORAGE_KEY];
        return sendResponse(newWorkerResponse(true, acctStorage))
    } else if(request.id == "nw-extension-get-selected-acct") {
        const result = await chrome.storage.local.get([SELECTED_ACCOUNT_LOCALSTORAGE_KEY]);
        const acct = result[SELECTED_ACCOUNT_LOCALSTORAGE_KEY];
        return sendResponse(newWorkerResponse(true, acct))
    } else if( request.id in requestIdDispatcher) {
        const res = await (requestIdDispatcher as any)[request.id](request);
        return sendResponse(res)
    } else {
        sendResponse(newWorkerResponse(false));
    }
}

chrome.runtime.onMessageExternal.addListener(messageHandlerWrapper);
chrome.runtime.onMessage.addListener(messageHandlerWrapper);