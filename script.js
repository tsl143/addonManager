const createElement = ({
    type, className, id, textContent, value, src, custom
}) => {
    const ele = document.createElement(type);
    if(className) ele.classList = className;
    if(id) ele.setAttribute('id', id);
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

const getIcon = (icons = []) => {
    const {url = ''} = icons.pop() || {};
    return url;
}

// const toggleAddon = (id) => {
//     browser.management.uninstall(id)
//     .then(() => window.location.reload())
//     .catch(console.log)
// }

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
    const imageUrl = getIcon(icons);
    if(imageUrl) {
        const image = createElement({type: 'img', src: `${extensionUrl}${imageUrl}`})
        imageDiv.appendChild(image);
    }
    imageDiv.appendChild(createElement({type: 'p', textContent: `${enabled? 'Enabled': 'Disabled'}`}));
    contentDiv.appendChild(createElement({type: 'h4', textContent: name}))
    contentDiv.appendChild(createElement({type: 'h5', textContent: description}))
    if (permissions && permissions.length != 0) {
        const permissionHolder = createElement({type: 'div', className: 'permissionHolder'})
        permissions.forEach(p => permissionHolder.appendChild(createElement({type: 'span', custom: [{attr: 'data-permission', val: p}] ,textContent: p})));
        contentDiv.appendChild(permissionHolder)
    }
    if(extensionUrl != '') {
        const manifestUrl = createElement({type: 'a', textContent: 'Show Manifest', custom: [{attr: 'href', val: `${extensionUrl}manifest.json`}, {attr: 'target', val: '_blank'}, {attr: 'rel', val: 'noreferrer noopener'}]})
        contentDiv.appendChild(manifestUrl)
    }
    
    // action.addEventListener('click', () =>toggleAddon(id, enabled))
    // mainDiv.appendChild(action)
    document.getElementById('extensions').appendChild(mainDiv);
}

function gotAll(infoArray = []) {
    const allExtensions = infoArray.filter(e => e.type == 'extension' && e.id != 'addonManager@web-ext-labs');
    console.log(allExtensions)
    allExtensions.forEach(createTile)
}

browser.management.getAll().then(gotAll);

