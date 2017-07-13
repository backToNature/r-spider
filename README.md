# r-spider

fetch resource from other site, now only support image.

## Quick Start

***install***

`$ npm install r-spider`

### download single file

provide a resource's url,`r-spider`can download this file and auto supplement the file's suffix

	const rSpider = require('r-spider');
	rSpider('http://inews.gtimg.com/newsapp_bt/0/1763805398/641', <your download path>, (res) => {
		if (!res.err) {
			console.log(res.fileName)
			console.log(res.path)
		}
	});

### download multi files

provide url list, `r-spider` will download all the files and return all response in a Array;


	const rSpider = require('r-spider');
	const url = ['http://inews.gtimg.com/newsapp_bt/0/1763805398/641', 'http://inews.gtimg.com/newsapp_bt/0/1763805398/641'];
	rSpider(url, <your download path>, (res) => {
		res.forEach(item => {
			if (!item.err) {
				console.log(item.fileName);
				console.log(item.path);
			}
		});
	});

### option

#### hash fileName

	const rSpider = require('r-spider');
	const options = {
	    url: 'http://inews.gtimg.com/newsapp_bt/0/1763805398/641',
	    destPath:  <your download path>,// your download path
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

## changelog

* 1.1.0: add hash fileName
