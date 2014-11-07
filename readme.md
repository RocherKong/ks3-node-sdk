# KS3-SDK-Nodejs

本代码库为`金山云存储KS3`服务.主要提供`KS3 nodejs SDK`和`命令行工具`.

[![Build Status](https://api.travis-ci.org/StoneRen/ks3-node-sdk.svg)](https://api.travis-ci.org/StoneRen/ks3-node-sdk.svg)

## Nodejs-sdk

### 安装

```
npm install ks3
```

### 测试

请先安装 `mocha`

```
npm install -g mocha
```

然后进行测试

```
// 全部测试
mocha

// 指定自己ak,sk和bucket做测试
AK=$ak SK=$sk BUCKET=$bucket mocha

// 大文件(大于5M)上传测试
BIGFILE=$path mocha test/upload.js

// 文件夹上传测试
UPDIR=$path mocha test/upload.js
```

### 使用


```
var KS3 = require('ks3');
var client = new KS3(AK,SK);
```

### api

`ks3.service.get`   
`ks3.bucket.put`   
`ks3.bucket.del`     
`ks3.bucket.get`   
`ks3.bucket.head`   
`ks3.bucket.getACL`   
`ks3.bucket.putACL`   
`ks3.bucket.getLocation`   
`ks3.bucket.getLogging`   
`ks3.bucket.putLogging`   
`ks3.object.del`  
`ks3.object.get`  
`ks3.object.put`  
`ks3.object.getAcl`  
`ks3.object.putAcl`  
`ks3.object.headObject`  
`ks3.object.multitpart_upload_init`  
`ks3.object.upload_part`  
`ks3.object.upload_complete`  
`ks3.object.upload_abort`  
`ks3.object.upload_list_part`  
`ks3.upload.start`
 




## KS3   
关于命令行工具,文档请查看 `./bin/readme.md`,或者[查看这里](https://github.com/StoneRen/ks3-node-sdk/tree/master/bin#user-content-ks3-命令行文档)

功能包括上传文件和文件夹.上传过程中会根据文件大小进行简单上传和分块上传

如果大文件在上传过程中发生意外,限次上传文件的时候会从上次断开的地方续传.