const isFirefox = typeof browser != 'undefined' ? true : false;
const translated = key =>  isFirefox ? browser.i18n.getMessage(key) : chrome.i18n.getMessage(key);
const runtime = isFirefox ? browser.runtime : chrome.runtime;
const mdnURL = 'https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/';

// This Object will have platform specific functions which will be defined in firefox/chrome.js
const platform = new Object;

let getAll;

if (isFirefox) {
    getAll = browser.management.getAll();
} else {
    getAll = new Promise(resolve => chrome.management.getAll(resolve))
}