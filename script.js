const permissionHash = new Object;
const extensionsHandle = document.getElementById('extension');
const permissionsHandle = document.getElementById('permission');
const extensionsPage = document.getElementById('extensionsPage');
const permissionsPage = document.getElementById('permissionsPage');

document.title = browser.i18n.getMessage("pageTitle");
extensionsHandle.textContent = browser.i18n.getMessage("extensions");
permissionsHandle.textContent = browser.i18n.getMessage("permissions");

const toggle = e => {
    switch(e.target.id) {
        case 'extension':
            extensionsHandle.classList = 'active';
            permissionsHandle.classList = '';
            extensionsPage.classList = '';
            permissionsPage.classList = 'hide';
            break;
        case 'permission':
            extensionsHandle.classList = '';
            permissionsHandle.classList = 'active';
            extensionsPage.classList = 'hide';
            permissionsPage.classList = '';
            break;
    }
}

document.getElementsByTagName('header')[0].addEventListener('click', toggle)

const createElement = ({
    type, className, id, textContent, value, src, custom, title
}) => {
    const ele = document.createElement(type);
    if(className) ele.classList = className;
    if(id) ele.setAttribute('id', id);
    if(title) ele.setAttribute('title', title);
    if(textContent) ele.textContent = textContent;
    if(custom && custom.length > 0) {
        custom.forEach(c => ele.setAttribute(c.attr, c.val));
    }
    if(src) ele.src = src;
    if(value) ele.value = value;

    return ele;
}

const getExtensionUrl = (hostPermissions = []) => {
    const host = hostPermissions.filter(h => h.includes('moz-extension'))[0] || '';
    return host.replace('*', '');
}

const getIcon = (icons = [], eUrl) => {
    const {url = ''} = icons.pop() || {};
    if (url != '') {
        return `${eUrl}${url}`;
    } else {
        return browser.runtime.getURL('permissions/developer.svg')
    }
}

const createTile = ({
    name,
    description,
    id,
    permissions,
    enabled,
    hostPermissions,
    icons
}) => {
    const extensionUrl = getExtensionUrl(hostPermissions);
    const mainDiv = createElement({type: 'div', id, custom: [{attr: 'data-id', val: id}], className: 'extension'})
    const imageDiv = createElement({type: 'div', className: 'imageDiv'})
    const contentDiv = createElement({type: 'div', className: 'contentDiv'})
    mainDiv.appendChild(imageDiv)
    mainDiv.appendChild(contentDiv)
    const imageUrl = getIcon(icons, extensionUrl);
    imageDiv.appendChild(createElement({type: 'img', src: imageUrl}));
    imageDiv.appendChild(createElement({type: 'h4', textContent: `${enabled? 'Enabled': 'Disabled'}`}));
    const heading = createElement({type: 'p', textContent: name});
    contentDiv.appendChild(heading);
    contentDiv.appendChild(createElement({type: 'h5', textContent: description}));
    const permissionHolder = createElement({type: 'ul', className: 'permissionHolder'});
    contentDiv.appendChild(permissionHolder);
    if (permissions && permissions.length != 0) {
        permissions.forEach(p => {
            if(!permissionsGlossary[p]) {
                console.log(`${p} - Permission not found`);
            }
            permissionHolder.appendChild(createElement({type: 'li', custom: [{attr: 'data-permission', val: p}] ,textContent: permissionsGlossary[p].text}));
            if(permissionHash[p]) {
                permissionHash[p].push({id, name, description, imageUrl});
            } else {
                permissionHash[p] = [{id, name, description, imageUrl}];
            }
        });
    }

    extensionsPage.appendChild(mainDiv);
}

const setPermissionPage = () => {
    Object.keys(permissionHash).forEach(p => {
        const mainDiv = createElement({type: 'div', id: p, className: 'permissions'})
        const imageDiv = createElement({type: 'div', className: 'imageDiv'})
        const contentDiv = createElement({type: 'div', className: 'contentDiv'})
        imageDiv.appendChild(createElement({type: 'img', src: browser.runtime.getURL(`permissions/${p}.svg`)}))
        imageDiv.appendChild(createElement({type: 'h4', textContent: p}));
        contentDiv.appendChild(createElement({type: 'p', textContent: permissionsGlossary[p].text}))
        const addonsDiv = createElement({type: 'div', className: 'addonsDiv'})
        permissionHash[p].forEach( a => {
            const addon = createElement({type: 'div', className: 'addon', title: a.description || ''});
            addon.appendChild(createElement({type: 'img', src: a.imageUrl}))
            addon.appendChild(createElement({type: 'h4', textContent: a.name}))
            addonsDiv.appendChild(addon)
        })
        contentDiv.appendChild(addonsDiv)
        mainDiv.appendChild(imageDiv)
        mainDiv.appendChild(contentDiv)
        permissionsPage.appendChild(mainDiv)
    })
}

const gethostPerms = perm => {
    // regex from addons-frontend
    const match = /^[a-z*]+:\/\/([^/]+)\//.exec(perm);
    return match[1];
}

const updatePermissions = addonString => {
    try {
        const addons = JSON.parse(addonString);
        addons.results.forEach(addon => {
            const hostPerms = new Set;
            let perms = addon.current_version.files[0].permissions;
            if(perms.includes('http://*/*') || perms.includes('https://*/*') || perms.includes('<all_urls>')) {
                hostPerms.add(browser.i18n.getMessage("allDomain"));
            } else {
                perms.filter(p => p.includes('://')).forEach(p => hostPerms.add(gethostPerms(p)));
            }
            const permDiv = document.querySelector(`[data-id="${addon.guid}"] ul`);
            if (addon.icon_url) {
                const image = document.querySelector(`[data-id="${addon.guid}"] .imageDiv img`);
                image.src = addon.icon_url;
            }
            if(addon.url != '') {
                const heading = document.querySelector(`[data-id="${addon.guid}"] .contentDiv p`);
                const manifestUrl = createElement({type: 'a', textContent: browser.i18n.getMessage("moreInfo"), custom: [{attr: 'href', val: addon.url}, {attr: 'title', val: addon.url}, {attr: 'target', val: '_blank'}, {attr: 'rel', val: 'noreferrer noopener'}]})
                heading.appendChild(manifestUrl)
            }
            hostPerms.forEach(p => {
                permDiv.appendChild(createElement({type: 'li', custom: [{attr: 'data-permission', val: p}] ,textContent: `${browser.i18n.getMessage("modifyDomain")} ${p}`}));
            })
        })
    } catch(e) {
        console.log('Argh...', e)
    }
}
const getMorePermissions = (extensions = []) => {
    const allIds = extensions.map(e => e.id).join(',');
    const addonURL = `https://services.addons.mozilla.org/api/v3/addons/search/?guid=${allIds}&lang=en-US`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', addonURL, true);
    xhr.responseType = 'jsonp';
    xhr.onload = function(e) {
        updatePermissions(this.response);
    };
    xhr.send();
}
function gotAll(infoArray = []) {
    const allExtensions = infoArray.filter(e => e.type == 'extension' && e.id != 'addonManager@web-ext-labs');
    if(allExtensions.length == 0) return;
    allExtensions.forEach(createTile);
    getMorePermissions(allExtensions);
    setPermissionPage();
}

browser.management.getAll().then(gotAll);
