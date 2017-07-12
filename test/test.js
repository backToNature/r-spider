const rSpider = require('../index.js');
const path = require('path');
rSpider('http://inews.gtimg.com/newsapp_bt/0/1763805398/641', path.join(__dirname, 'download') , (res) => {
    if (!res.err) {
        console.log(res.fileName);
        console.log(res.path)
    }
});