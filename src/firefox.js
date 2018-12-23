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

// exported into platform object which can be used in script.js if firefox platform
if(isFirefox) {
    platform.addMeta = (extensions = []) => {
        const allIds = extensions.map(e => e.id).join(',');
        const addonURL = `https://services.addons.mozilla.org/api/v3/addons/search/?guid=${allIds}&lang=en-US`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', addonURL, true);
        xhr.responseType = 'jsonp';
        xhr.onload = () => updatePermissions(xhr.response);
        xhr.send();
    }
}
