/* 
 * Function create dom elements with all required attributes
**/
const createNode = ({
    type, className, id, textContent, value, src, custom, title
}) => {
    const ele = document.createElement(type);
    if (className) ele.classList = className;
    if (id) ele.setAttribute('id', id);
    if (title) ele.setAttribute('title', title);
    if (textContent) ele.textContent = textContent;
    if (custom && custom.length > 0) {
        custom.forEach(c => ele.setAttribute(c.attr, c.val));
    }
    if (src) ele.src = src;
    if (value) ele.value = value;

    return ele;
}

document.title = translated("pageTitle");

/* 
 * Creates the header section of the page
**/
const header = document.createElement('header');
const extensionsHandle = createNode({ type: 'div', id: 'extension', className: 'active' });
const permissionsHandle = createNode({ type: 'div', id: 'permission' });
header.appendChild(extensionsHandle)
header.appendChild(permissionsHandle)
document.body.appendChild(header);
extensionsHandle.textContent = translated("extensions");
permissionsHandle.textContent = translated("permissions");


/* 
 * Creates the extension and permission pages
**/
const extensionsPage = createNode({ type: 'div', id: 'extensionsPage', custom: [{ attr: 'data-type', val: 'page' }] });
const permissionsPage = createNode({ type: 'div', id: 'permissionsPage', className: 'hide', custom: [{ attr: 'data-type', val: 'page' }] });
extensionsPage.appendChild(createNode({ type: 'center', textContent: translated("extensionsHeadingText")}));
permissionsPage.appendChild(createNode({ type: 'center', textContent: translated("permissionsHeadingText")}));
document.body.appendChild(extensionsPage);
document.body.appendChild(permissionsPage);

/* 
 * Show/hide pages on handle click
**/
const toggle = e => {
    switch (e.target.id) {
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

header.addEventListener('click', toggle)