var config = require('../../config');
var async = require('async');
var crypto = require('crypto');
var path = require('path');
var util = require('../util');
var fs = require('fs');
var nconf = require('nconf');
var debug = require('debug')('download');
var ProgressBar = require('progress');
var bar, barDir;
var cachePath = config.cachePath;
/**
 * 每次请求下载的块大小
 */
var chunkSize = 10;

/**
 * 获取加密后的文件名字
 */
var getFilename = function(filePath, len) {
	var len = len || 16;
	var hmac = crypto.createHmac('md5', 'KS3');
	hmac.update(filePath);
	var str = hmac.digest('base64');
	return (new Buffer(str).toString('base64')) + '.cache'
}

/**
 * Bin: ks3 download -b $BUCKET -k $KEY -p $path
 */

function download(params, cb) {
	var bucketName = params.Bucket || this.bucketName || '';;
	var key = util.encodeKey(params.Key) || null;
	var filePath = path.resolve(__dirname, params.filePath) || null;

	if (!bucketName) {
		throw new Error('require the bucketName');
	}

	if (!key) {
		throw new Error('require the object Key');
	}
	if (!filePath) {
		throw new Error('require the file path');
	}

	var self = this;
	var ak = self.ak;
	var sk = self.sk;

	// 缓存文件地址
	var fileName = getFilename(filePath);
	// 用户要下载生成的文件
	var downFileName = filePath + '.download';
	var configFile = path.join(cachePath, fileName);
	nconf.file({
		file: configFile
	});
	var range = 10 * 1024 ;
	var count = 0;
	var index = 0;

	async.auto({
		/**
		 * 初始化或者读取configFile
		 * 1. 获取文件大小
		 * 2. 并且根据分块大小计算出总共请求次数
		 */
		init: function(callback) {
			/**
			 * 设置或读取基本数据
			 */
			if (fs.existsSync(configFile)) { // 之前已经有配置信息了
				range = nconf.get('range');
				chunkSize = nconf.get('chunkSize');
				count = nconf.get('count');
			} else {
				nconf.set('BUCKET', bucketName);
				nconf.set('KEY', key);
				nconf.set('path', filePath);
				nconf.set('range', range);
				nconf.set('chunkSize', chunkSize);
				nconf.set('count', 0);
				nconf.set('index', 0);
				nconf.save();
				// 如果已经存在重名下载文件,先删除他
				if(fs.existsSync(downFileName)){
					fs.unlinkSync(downFileName);
				}
			}
			/**
			 * 获取文件信息
			 */
			if (nconf.get('count') == 0) {
				debug('远程获取元数据')
				self.object.head(params, function(err, data, res) {
					if (err) throw err;
					var length = res.headers['content-length'];
					count = parseInt(length / range) + (length % range == 0 ? 0: 1);
					// 后端返回 文件大小为0
					if (count == 0) {
						callback({
							msg: '文件大小为0'
						})
					} else {
						nconf.set('count',count);
						callback(null);
					}
				});
			} else {
				debug('本地读取数据')
				count = nconf.get('count');
				index = nconf.get('index');
				callback(null);
			}
		},
		/**
		 * 下载分块数据,并追加到文件末尾
		 */
		down: ['init', function(callback, result) {
			// 下载逻辑
			bar = new ProgressBar(' 正在下载 '+filePath+' [:bar] :percent  ', {
				total: count
			});
			var downHandler = function() {
				if (index + 1 > count) { // 下载结束
					debug('下载结束')
					callback(null);
				} else { // 还没下载完,继续进行下载
					debug('进行下载:',index,'/',count);
					self.object.get({
						Key: key,
						range: 'bytes=' + index * range + '-' + ((index + 1) * range - 1)
					},
					function(err, data, res) {
						if (err) throw err;
						fs.appendFileSync(downFileName, (new Buffer(data)), {
							encoding: 'utf8'
						});
						index = index + 1;
						bar.tick();
						nconf.set('index',index);
						nconf.save();
						downHandler();
					});
				}
			};
			downHandler();
		}],
	},
	function(err, results) {
		if (err) throw err;
		fs.unlinkSync(configFile);
		fs.renameSync(downFileName,filePath);
		if (cb) {
			cb(err, {},
			null)
		}
	})

}

module.exports = {
	start: download
}

