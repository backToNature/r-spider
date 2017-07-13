/**
 * Created by darkh on 2017/7/12.
 */
const request = require('request');
const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const shell = require('shelljs');

const tmpdir = path.join(os.tmpdir(), 'r-spider-cache');
const ext_map = require('./ext_map.js');


let fetchFile = (resourceUrl, downPath, opt) => {
    // create directory and file
    if (!fs.existsSync(tmpdir)) {
        shell.mkdir(tmpdir);
    }
    const fileName = crypto.createHash('md5').update(resourceUrl).digest('hex') + new Date().valueOf(), filePath = path.join(tmpdir, fileName);
    let ext = '';

    if (!fs.existsSync(filePath)) {
        shell.touch(filePath);
    }
    return new Promise((resolve, reject) => {
        let ws = fs.createWriteStream(filePath);
        ws.on('close', () => {
            let finalFileName = path.basename(resourceUrl, ext);
            if (opt.fileNameStamp) {
                finalFileName += '-' + new Date().valueOf();
                finalFileName = crypto.createHash('md5').update(finalFileName).digest('hex');
            }
            shell.cp(filePath, path.join(downPath, `${finalFileName}${ext}`));
            shell.rm('-rf', filePath);
            resolve({
                fileName: `${finalFileName}${ext}`,
                path: path.join(downPath, `${finalFileName}${ext}`)
            });
        });
        request
            .get(resourceUrl)
            .on('response', res => {
                // get file's extname
                ext = path.extname(resourceUrl);
                // get file's type
                if (!ext) {
                    let contentType = res.headers['content-type'];
                    //
                    let currentType = ext_map.filter(item => item.type === contentType);
                    if (currentType.length) {
                        ext = currentType[0].ext;
                    } else {
                        console.log(`content-type: ${contentType} don't support`);
                        reject({
                            err: true
                        });
                        return;
                    }
                }
            })
            .pipe(ws);

    });
};

let entry = (one, two, three) => {
    let resourceUrl, downPath, fn, opt = {};
    if (typeof three === 'function') {
        resourceUrl = one;
        downPath = two;
        fn = three;
    } else {
        resourceUrl = one.url;
        downPath = one.destPath || process.cwd();
        fn = two;
        opt = one;
    }
    if (typeof resourceUrl === 'string') {
            fetchFile(resourceUrl, downPath, opt).then((res) => {
                fn(res);
            }).catch(err => {
                fn(err);
            });
    } else if (resourceUrl.length > 0) {
        let result = [];
        resourceUrl.forEach(item => {
            fetchFile(item, downPath, opt).then((res) => {
                result.push(res);
                if (result.length === resourceUrl.length) {
                    fn(result);
                }
            }).catch(err => {
                result.push(err);
                if (result.length === resourceUrl.length) {
                    fn(result);
                }
            })
        });
    }
};
module.exports = entry;