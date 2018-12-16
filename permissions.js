const permissionsGlossary = {
    "pkcs11": {
        short: "Access PKCS #11 modules",
        text: "make PKCS #11 modules accessible to the browser as sources of keys and certificates",
    },
    "geckoProfiler": {
        text: "Firefox Only"
    },
    "sessions": {
        short: "Access browser session",
        text: "Can list and restore, tabs and windows that have been closed while the browser has been running"
    },
    "contextualIdentities": {
        short: "Access browser containers",
        text: "Can list, create, remove, and update contextual identities/ containers"
    },
    "dns": {
        short: "Can resolve DNS",
        text: "Enables an extension to resolve domain names."
    },
    "management": {
        text: "Access info about all installed addons"
    },
    "privacy": {
        short: "Access privacy-related browser settings",
        text: "Access and modify various privacy-related browser settings."
    },
    "proxy": {
        text: "Can proxy webRequests"
    },
    "nativeMessaging": {
        short: "Access message from native apps",
        text: "Native messaging enables an extension to exchange messages with a native application installed on the user's computer",
        url: "Native_messaging"
    },
    "telemetry": {
        text: "Firefox Only",
        url: "no"
    },
    "theme": {
        text: "Enables browser extensions to update the browser theme"
    },
    "clipboardRead": {
        text: "Can copy the data from web page",
        url: "no"
    },
    "geolocation": {
        text: "Can know your geolocation",
        url: "no"
    },
    "idle": {
        "text": "Find out when the user's system is idle, locked, or active."
    },
    "notifications": {
        text: "Display notifications, using the underlying operating system's notification mechanism"
    },
    "bookmarks": {
        text: "Can interact with and manipulate the browser's bookmarking system"
    },
    "find": {
        text: "Can find text in a web page, and highlights matches."
    },
    "history": {
        text: "Can interact and manipulate the browser history."
    },
    "menus.overrideContext": {
        text: "Firefox Only",
        url: "no"
    },
    "search": {
        text: "Can list all search engine and search with a specific search engine"
    },
    "activeTab": {
        text: "Can access data from any active tab and can inject code and style to active tab",
        absolute: "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#activeTab_permission"
    },
    "tabs": {
        text: "Can get a list of opened tab and can open, update, move, reload, and remove tab"
    },
    "tabHide": {
        text: "Can make the tab hidden",
        url: "no"
    },
    "browserSettings": {
        text: "Can change global browser settings, like allowing popups"
    },
    "cookies": {
        text: "Can get and set cookies, and be notified when they change"
    },
    "downloads": {
        text: "Can download files, cancel, pause, resume downloads"
    },
    "downloads.open": {
        text: "Can open any downloaded item.",
        url: "downloads/open"
    },
    "topSites": {
        text: "Can get pages that the user has visited often and frequently."
    },
    "webNavigation": {
        text: "Can intercept every HTTP request made by browser"
    },
    "webRequest": {
        text: "Can intercept every HTTP request made by browser"
    },
    "webRequestBlocking": {
        text: "Can block and modify the request made by browser."
    },
    "alarms": {
        text: "Can genrate alarm at given intervals"
    },
    "mozillaAddons": {
        text: "Firefox Only"
    },
    "storage": {
        text: "Can store data upto 5 MB"
    },
    "unlimitedStorage": {
        text: "Can store any amount of data"
    },
    "browsingData": {
        text: "Can clear all data which is collected while browsing Cookies/passwords/Cache/history/downloads/formData"
    },
    "devtools": {
        text: "Can create a developer tool panel"
    },
    "identity": {
        text: "Can generate OAuth2 authorization code or access token and use to access user data"
    },
    "menus": {
        text: "Can create/manipulate right-click menu items"
    },
    "contextMenus": {
        text: "Can create/manipulate right-click menu items"
    },
}