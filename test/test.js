const rSpider = require('../index.js');
const path = require('path');
rSpider('http://inews.gtimg.com/newsapp_bt/0/1763805398/641', path.join(__dirname, 'download') , (res) => {
    if (!res.err) {
        console.log(res.fileName);
        console.log(res.path)
    }
});

// const options = {
//     url: 'https://image.uc.cn/o/wemedia/s/upload/17052215145b7c3785e746ae4d1824fdd80c7c4cc0;,3,jpegx;3,310x',
//     destPath:  path.join(__dirname, 'download'),// your download path
//     fileNameStamp: true // default false
// };
// rSpider(options, (res) => {
//     res.forEach(item => {
//         if (!item.err) {
//             console.log(item.fileName);
//             console.log(item.path);
//         }
//     });
// });