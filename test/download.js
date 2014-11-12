var KS3 = require('..');
var should = require('should');
require('should-http');
var path = require('path');
var fs = require('fs');

var ak = process.env.AK || 'WRHLHOZQD3OY3VTROMGQ';
var sk = process.env.SK || 'dWSmyMmVcpahaZphUdyVz11myMIoCAsOKeZ6wi4T';
var bucketName = process.env.BUCKET || 'ks3-sdk-test';

describe('download', function() {
	it('should download a file', function(done) {
		var client = new KS3(ak, sk, bucketName);
		var filePath = path.join(__dirname, './assets/test_upload_photo.jpg');
		var key = 'test_upload_photo.jpg';

		client.object.put({
			filePath: filePath,
			Key: key
		},
		function(err, data, res) {
			if (err) throw err;
			client.download.start({
				Key: key,
				filePath: path.join(__dirname, './assets/test_download_photo.jpg')
			},
			function(err, data, res) {
				if (err) throw err;
				done();
			});
		});
	})
});

