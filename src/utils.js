isFirefox = typeof browser != 'undefined' ? true : false;
const translated = key =>  isFirefox ? browser.i18n.getMessage(key) : chrome.i18n.getMessage(key);
const runtime = isFirefox ? browser.runtime : chrome.runtime;

let getAll;

if (isFirefox) {
    getAll = browser.management.getAll();
} else {
    getAll = new Promise(resolve => chrome.management.getAll(resolve))
}