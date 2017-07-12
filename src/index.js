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


let fetchFile = (resourceUrl, downPath, fn) => {
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
                        console.log(`content-type: ${content-type} don't support`);
                        reject({
                            err: true
                        });
                        return;
                    }
                }
                res.on('end', () => {
                    let finalFileName = path.basename(resourceUrl, ext);
                    shell.cp(filePath, path.join(downPath, `${finalFileName}${ext}`));
                    shell.rm('-rf', filePath);
                    resolve({
                        fileName: `${finalFileName}${ext}`,
                        path: path.join(downPath, `${finalFileName}${ext}`)
                    });
                });
            })
            .pipe(fs.createWriteStream(filePath));
    });
};

let entry = (resourceUrl, downPath, fn) => {
    if (typeof resourceUrl === 'string') {
        fetchFile(resourceUrl, downPath).then((res) => {
            fn(res);
        }).catch(err => {
            fn(err);
        });
    } else if (resourceUrl.length > 0) {
        let result = [];
        resourceUrl.forEach(item => {
            fetchFile(item, downPath).then((res) => {
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