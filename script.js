const permissionHash = new Object;
const mdnURL = 'https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/';
const selfId = runtime.id;

const getExtensionUrl = (hostPermissions = []) => {
    const host = hostPermissions.filter(h => h.includes('moz-extension'))[0] || '';
    return host.replace('*', '');
}

const getIcon = (icons = [], eUrl) => {
    const { url = '' } = icons.pop() || {};
    if (url != '') {
        return `${eUrl}${url}`;
    } else {
        return runtime.getURL('permissions/developer.svg')
    }
}

const createTile = ({
    name,
    description,
    id,
    permissions,
    hostPermissions,
    icons
}) => {
    const extensionUrl = getExtensionUrl(hostPermissions);
    const mainDiv = createNode({ type: 'div', id, custom: [{ attr: 'data-id', val: id }], className: 'extension' })
    const imageDiv = createNode({ type: 'div', className: 'imageDiv' })
    const contentDiv = createNode({ type: 'div', className: 'contentDiv' })
    mainDiv.appendChild(imageDiv)
    mainDiv.appendChild(contentDiv)
    const imageUrl = getIcon(icons, extensionUrl);
    imageDiv.appendChild(createNode({ type: 'img', src: imageUrl }));
    const heading = createNode({ type: 'p', textContent: name });
    contentDiv.appendChild(heading);
    contentDiv.appendChild(createNode({ type: 'h5', textContent: description }));
    const permissionHolder = createNode({ type: 'ul', className: 'permissionHolder' });
    contentDiv.appendChild(permissionHolder);
    if (permissions && permissions.length != 0) {
        permissions.forEach(p => {
            if (!permissionsGlossary[p]) {
                console.log(`${p} - Permission not found`);
            } else {
                permissionHolder.appendChild(createNode({ type: 'li', custom: [{ attr: 'data-permission', val: p }], textContent: permissionsGlossary[p].text }));
                if (permissionHash[p]) {
                    permissionHash[p].push({ id, name, description, imageUrl });
                } else {
                    permissionHash[p] = [{ id, name, description, imageUrl }];
                }
            }
        });
    }

    extensionsPage.appendChild(mainDiv);
}

const setPermissionPage = () => {
    Object.keys(permissionHash).forEach(p => {
        const permObj = permissionsGlossary[p] || {};
        let permUrl = `${mdnURL}${p}`;
        if (permObj.url == 'no') {
            permUrl = ''
        } else if (permObj.absolute) {
            permUrl = permObj.absolute;
        } else if (permObj.url) {
            permUrl = `${mdnURL}${permObj.url}`;
        }
        const mainDiv = createNode({ type: 'div', id: p, className: 'permissions' })
        const imageDiv = createNode({ type: 'a', className: 'imageDiv', custom: [{ attr: 'href', val: permUrl }, { attr: 'title', val: permUrl }, { attr: 'target', val: '_blank' }, { attr: 'rel', val: 'noreferrer noopener' }] })
        const contentDiv = createNode({ type: 'div', className: 'contentDiv' })
        imageDiv.appendChild(createNode({ type: 'img', src: runtime.getURL(`permissions/${p}.svg`) }))
        imageDiv.appendChild(createNode({ type: 'h4', textContent: p }));
        contentDiv.appendChild(createNode({ type: 'p', textContent: permObj.text || '' }))
        const addonsDiv = createNode({ type: 'div', className: 'addonsDiv' })
        permissionHash[p].forEach(a => {
            const addon = createNode({ type: 'div', className: 'addon', title: a.description || '' });
            addon.appendChild(createNode({ type: 'img', src: a.imageUrl }))
            addon.appendChild(createNode({ type: 'h4', textContent: a.name }))
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
            if (perms.includes('http://*/*') || perms.includes('https://*/*') || perms.includes('<all_urls>')) {
                hostPerms.add(translated("allDomain"));
            } else {
                perms.filter(p => p.includes('://')).forEach(p => hostPerms.add(gethostPerms(p)));
            }
            const permDiv = document.querySelector(`[data-id="${addon.guid}"] ul`);
            if (addon.icon_url) {
                const image = document.querySelector(`[data-id="${addon.guid}"] .imageDiv img`);
                image.src = addon.icon_url;
            }
            if (addon.url != '') {
                const heading = document.querySelector(`[data-id="${addon.guid}"] .contentDiv p`);
                const manifestUrl = createNode({ type: 'a', textContent: translated("moreInfo"), custom: [{ attr: 'href', val: addon.url }, { attr: 'title', val: addon.url }, { attr: 'target', val: '_blank' }, { attr: 'rel', val: 'noreferrer noopener' }] })
                heading.appendChild(manifestUrl)
            }
            hostPerms.forEach(p => {
                permDiv.appendChild(createNode({ type: 'li', custom: [{ attr: 'data-permission', val: p }], textContent: `${translated("modifyDomain")} ${p}` }));
            })
        })
    } catch (e) {
        console.log('Argh...', e)
    }
}
const getMorePermissions = (extensions = []) => {
    const allIds = extensions.map(e => e.id).join(',');
    const addonURL = `https://services.addons.mozilla.org/api/v3/addons/search/?guid=${allIds}&lang=en-US`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', addonURL, true);
    xhr.responseType = 'jsonp';
    xhr.onload = function (e) {
        updatePermissions(this.response);
    };
    xhr.send();
}
function gotAll(infoArray = []) {
    const allExtensions = infoArray.filter(e => e.type == 'extension' && e.id != selfId);
    if (allExtensions.length == 0) return;
    allExtensions.forEach(createTile);
    getMorePermissions(allExtensions);
    setPermissionPage();
}

getAll.then(gotAll);
