const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;
const formatJSON = require('json-format');
const rimraf = require('rimraf');
const JSZip = require('jszip')
const args = process.argv
const isFirefox = args.includes('firefox');
const isChrome = args.includes('chrome');
const isZip = args.includes('zip');

const chromePath = path.join(__dirname, 'chrome');
const firefoxPath = path.join(__dirname, 'firefox');
const buildPath = isFirefox ? firefoxPath : chromePath;
const src = path.join(__dirname, 'src');
ncp.limit = 16;

// convert callback to promises
const promisify = (fn, args) => {
    return new Promise((resolve, reject) => {
        try {
            args.push((...arg) => resolve(arg))
            fn.apply(this, args);
        } catch(e) {
            reject(e);
        }
    })
}

// remove existing directory
promisify(rimraf, [buildPath])
    .then(() => {
        // make directory
        return promisify(fs.mkdir, [buildPath])
    })
    .then(() => {
        // copy all files/folders recursively to destination
        return promisify(ncp, [src, buildPath])
    })
    .then(() => {
        // read manifest.json
        return promisify(fs.readFile, [path.join(buildPath, 'manifest.json'), 'utf8']);
    })
    .then(res => {
        // modify JSON if firefox
        if (res[0]) throw Error('unable to read manifest');
        const fileJson = JSON.parse(res[1]);
        if (isFirefox) {
            fileJson.applications = {
                "gecko": {
                    "id": "permissionInspector@web-ext-labs",
                    "strict_min_version": "55.0"
                }
            }
        }
        return promisify(fs.writeFile, [path.join(buildPath, 'manifest.json'), formatJSON(fileJson)])
    })
    .then(() => {
        // delete chrome/firefox as per build
        const toDelete = path.join(buildPath, isFirefox ? 'chrome.js': 'firefox.js');
        return promisify(fs.unlink, [toDelete]);
    })
    .then(() => {
        // read index.html
        return promisify(fs.readFile, [path.join(buildPath, 'index.html'), 'utf8']);
    })
    .then(res => {
        // remove chrome/firefox script as per build
        if (res[0]) throw Error('unable to read index file');
        const lines = res[1].split('\n');
        const matcher = isFirefox ? 'chrome' : 'firefox';
        const finalArr = lines.filter(l => !l.includes(matcher));
        return promisify(fs.writeFile, [path.join(buildPath, 'index.html'), finalArr.join('\n')]);
    })
    .catch(e => console.log(`Schaize: ${e}`));