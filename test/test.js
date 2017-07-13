const rSpider = require('../index.js');
const path = require('path');
// rSpider('http://inews.gtimg.com/newsapp_bt/0/1763805398/641', path.join(__dirname, 'download') , (res) => {
//     if (!res.err) {
//         console.log(res.fileName);
//         console.log(res.path)
//     }
// });

const options = {
    url: 'http://inews.gtimg.com/newsapp_bt/0/1763805398/641',
    destPath:  path.join(__dirname, 'download'),// your download path
    fileNameStamp: true // default false
};
rSpider(options, (res) => {
    res.forEach(item => {
        if (!item.err) {
            console.log(item.fileName);
            console.log(item.path);
        }
    });
});