# KS3 命令行文档


## 安装


### 准备条件
1. 安装[nodejs]以及[npm]

### 安装

- 稳定版安装   

```
npm install -g ks3
```
- 最新版安装

```
git clone $gitpath --depth=1
npm install -g ./ks3-node-sdk
```

## 命令解释

- ks3 reset   
重置开发者配置,清空历史记录

```
ks3 reset
```


- ks3 init   
主要执行初始化操作.在初始化过程中,可以指定开发者的`AK`和`SK`.    
命令行使用分为两种模式: 直接指定,或者进入交互模式.在`交互模式`下,会指导你填写必须的参数.如果所需参数没有提供完全,也会进入`交互模式`.

```
ks3 init -a [ak] -s [sk] -b [bucket]
```

`-a --ak` : 开发者的AK(Access Key)   
`-s --sk` : 开发者AK对应的SK(Access Key Secret)   
`-b --bucket` : 开发要使用哪个Bucket,非必须,可以在每个具体命令中指定

也可以直接输入`ks3 init`进入交互模式

- ks3 upload   
上传文件以及文件夹.程序会根据文件大小进行`简单上传`和`分块上传`.

```
ks3 upload -p [path] -b [bucket] -k [key] --withsubdir
```
`-p --path` : 开发者制定要上传文件夹或者文件的地址   
`-b --bucket` : 制定上传文件存储的bucket   
`-k --key` : 如果上传的path为文件,则为文件名,如果上传的path是文件夹,则为文件夹名称   
`--withsubdir` : 在上传文件夹的过程中,是否上传子文件夹,默认不上传,加上本参数,上传子文件夹内容   

例如:   

1. 把`/Users/ren/Desktop/Life\ Of\ Johnson.txt`传递到 `ks3-sdk-test` bucket根目录下

	```
	ks3 upload /Users/ren/Desktop/Life\ Of\ Johnson.txt
	// 或者
	ks3 upload "/Users/ren/Desktop/Life Of Johnson.txt"
	// 然后进入交互模式 填写bucket和key
	
	// 也可以直接传递参数
	ks3 upload "/Users/ren/Desktop/Life Of Johnson.txt" -b ks3-sdk-test -k "Life Of Johnson.txt" 
	
	```
2.  把 `D:\Program Files (x86)\Foxmail` 整个文件夹(包括子文件夹)上传,如下:

	```
	ks3 upload -p "D:\Program Files (x86)\Foxmail" --withsubdir
	// 进入交互模式 填写bucket和key
	```

也可以直接输入`ks3 upload`进入交互模式

## 帮助说明

- 如何获取自己的`AK`和`SK`?   
访问 [官方文档-权限管理](http://ks3.ksyun.com/doc/console/index.html#%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86)

- 什么是`分块上传`?   
  简单说就是把大文件拆成小文件上传,并且全部传完以后再合并生成大文件.避免大文件在上传过程中出意外,必须从头开始上传的问题.查看[官方文档-分块上传](http://ks3.ksyun.com/doc/api/multipart_upload.html)


[nodejs]:http://nodejs.org/
[npm]:https://www.npmjs.org