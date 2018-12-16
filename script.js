const permissionHash = new Object;
const extensionsHandle = document.getElementById('extension');
const permissionsHandle = document.getElementById('permission');
const extensionsPage = document.getElementById('extensionsPage');
const permissionsPage = document.getElementById('permissionsPage');

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
    const mainDiv = createElement({type: 'div', id, className: 'extension'})
    const imageDiv = createElement({type: 'div', className: 'imageDiv'})
    const contentDiv = createElement({type: 'div', className: 'contentDiv'})
    mainDiv.appendChild(imageDiv)
    mainDiv.appendChild(contentDiv)
    const imageUrl = getIcon(icons, extensionUrl);
    imageDiv.appendChild(createElement({type: 'img', src: imageUrl}));
    imageDiv.appendChild(createElement({type: 'h4', textContent: `${enabled? 'Enabled': 'Disabled'}`}));
    const heading = createElement({type: 'p', textContent: name});
    if(extensionUrl != '') {
        const manifestUrl = createElement({type: 'a', textContent: 'Show Manifest', custom: [{attr: 'href', val: `${extensionUrl}manifest.json`}, {attr: 'target', val: '_blank'}, {attr: 'rel', val: 'noreferrer noopener'}]})
        heading.appendChild(manifestUrl)
    }
    contentDiv.appendChild(heading);
    contentDiv.appendChild(createElement({type: 'h5', textContent: description}))
    if (permissions && permissions.length != 0) {
        const permissionHolder = createElement({type: 'ul', className: 'permissionHolder'})
        permissions.forEach(p => {
            permissionHolder.appendChild(createElement({type: 'li', custom: [{attr: 'data-permission', val: p}] ,textContent: permissionsGlossary[p].text}));
            if(permissionHash[p]) {
                permissionHash[p].push({id, name, description, imageUrl});
            } else {
                permissionHash[p] = [{id, name, description, imageUrl}];
            }
        });
        contentDiv.appendChild(permissionHolder)
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

function gotAll(infoArray = []) {
    const allExtensions = infoArray.filter(e => e.type == 'extension' && e.id != 'addonManager@web-ext-labs');
    allExtensions.forEach(createTile);
    setPermissionPage();
}

browser.management.getAll().then(gotAll);
