

const ACCOUNT_STORAGE_LOCALSTORAGE_KEY = "acct_storage"
const SELECTED_ACCOUNT_LOCALSTORAGE_KEY = "acct_selected"

chrome.runtime.onMessageExternal.addListener(async function(request, sender, sendResponse) {
    console.log(request, sender); 
    if(request.id == "nw-extension-hello"){
        return sendResponse(true);
    } 
    else if(request.id == "nw-extension-sync-acct-storage") {
        const {storage} = request.data;
        // const result = await chrome.storage.local.get([ACCOUNT_STORAGE_LOCALSTORAGE_KEY]);

        // const existingStorage = result[ACCOUNT_STORAGE_LOCALSTORAGE_KEY];
        
        await chrome.storage.local.set({[ACCOUNT_STORAGE_LOCALSTORAGE_KEY]: storage});
        console.log("update acct storage", storage);
        return sendResponse(true)
    }
    else if(request.id == "nw-extension-sync-acct-selected") {
        const {account} = request.data;
        await chrome.storage.local.set({[SELECTED_ACCOUNT_LOCALSTORAGE_KEY]:account});
        console.log("update acct selection", account)
        return sendResponse(true)
    }
    else if(request.id == "nw-extension-get-acct-storage") {
        const result = await chrome.storage.local.get([ACCOUNT_STORAGE_LOCALSTORAGE_KEY]);
        const acctStorage = result[ACCOUNT_STORAGE_LOCALSTORAGE_KEY];
        return sendResponse(acctStorage)
    } else if(request.id == "nw-extension-get-selected-acct") {
        const result = await chrome.storage.local.get([SELECTED_ACCOUNT_LOCALSTORAGE_KEY]);
        const acct = result[SELECTED_ACCOUNT_LOCALSTORAGE_KEY];
        return sendResponse(acct)
    }
});