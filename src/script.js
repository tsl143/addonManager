const permissionHash = new Object;
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

function gotAll(infoArray = []) {
    const allExtensions = infoArray.filter(e => e.type == 'extension' && e.id != selfId);
    if (allExtensions.length == 0) return;
    allExtensions.forEach(createTile);
    if (platform.getPermissionsAMO) platform.getPermissionsAMO(allExtensions);
    setPermissionPage();
}

getAll.then(gotAll);
