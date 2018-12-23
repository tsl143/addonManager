const handleDisable = e => {
    const { target } = e;
    const status = target.getAttribute('data-enabled');
    const changeStatus = status == 1 ? false : true;
    const id = target.getAttribute('data-button-id');
    chrome.management.setEnabled(id, changeStatus, () => {
        target.setAttribute('data-enabled', changeStatus ? 1 : 0);
        target.textContent = translated(changeStatus ? 'disable' : 'enable')
        document.getElementById(id).setAttribute('data-enabled', changeStatus)
    })
}

const handleuninstall = e => {
    const { target } = e;
    const id = target.getAttribute('data-button-id');
    chrome.management.uninstall(id, () => {
        if (chrome.runtime.lastError) {
            console.log("Argh!!!" + chrome.runtime.lastError.message);
        } else {
            document.getElementById(id).remove();
            window.location.reload();
        }

    })
}

const addBtns = e => {
    const heading = document.querySelector(`[data-id="${e.id}"] .contentDiv p`);
    const actions = createNode({ type: 'span' })
    const enableDisable = createNode({ type: 'button', textContent: translated(e.enabled ? 'disable' : 'enable'), custom: [{ attr: 'data-button-id', val: e.id }, { attr: 'data-enabled', val: e.enabled ? 1 : 0 }] })
    const uninstall = createNode({ type: 'button', textContent: translated('uninstall'), custom: [{ attr: 'data-button-id', val: e.id }] })
    actions.appendChild(enableDisable)
    actions.appendChild(uninstall)
    heading.appendChild(actions)
    enableDisable.addEventListener('click', handleDisable)
    uninstall.addEventListener('click', handleuninstall)
}


if (!isFirefox) {
    platform.addMeta = (extensions = []) => extensions.forEach(addBtns);
}
