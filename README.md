# 接口文档

## 目录：
[1、上传文章](#1上传文章)<br/>
[2、添加标签](#2添加标签)<br/>
[3、查询文章列表](#3查询文章列表)<br/>
[4、按文章id查询文章](#4按文章id查询 文章)<br/>[5、添加短句](#5添加短句)<br/>[6、查询随机短句](#6查询随机短句)<br/>


## 1、上传文章

### 请求URL：
	http://localhost:4000/admin/blog.insert

### 请求方式：
	POST

### 参数类型

| 参数       | 是否必选 | 类型   | 说明         |
| ---------- | -------- | ------ | ------------ |
| title      | Y        | string | 文章标题     |
| body       | Y        | string | 副标题       |
| context    | Y        | string | 文章内容     |
| createDate | N        | string | 文章创建时间 |
| witch      | N        | int    | 观看次数     |
| tagsID     | N        | array  | 文章标签     |

### 返回示例：

	成功:
	{
	    "code": 0,
	    "msg": "文章插入成功",
	    "data": {
	        "blogID": 54,
	        "title": "用快捷指令更换壁纸",
	        "createDate": "2020-12-01"
	    }
	}
	失败
	    {
	    "code": 1,
	    "msg": "文章插入失败",
	    "data": {
	        "name": "SequelizeValidationError",
	        "errors": [
	            {
	                "message": "tb_blogs.title cannot be null",
	                "type": "notNull Violation",
	                "path": "title",
	                "value": null,
	                "origin": "CORE",
	                "instance": {
	                    "createDate": "2020-12-01",
	                    "witch": 0,
	                    "blogID": null,
	                    "body": "aaaa",
	                    "context": "bbbb"
	                },
	                "validatorKey": "is_null",
	                "validatorName": null,
	                "validatorArgs": []
	            }
	        ]
	    }
	}


## 2、添加标签

### 请求URL：
	http://localhost:4000/admin/tagstype.add

### 请求方式：
	POST

### 参数类型

| 参数    | 是否必选 | 类型   | 说明     |
| ------- | -------- | ------ | -------- |
| tagname | Y        | string | 标签名称 |
### 返回示例：

	成功:
	    {
	        "code": 0,
	        "msg": "插入标签成功",
	        "data": {
	            "tagTypeID": 9,
	            "tagName": "asdf"
	        }
	    }
	失败
	    除非你是傻逼 否则不可能失败

## 3、查询文章列表

### 请求URL：
	http://localhost:4000/user/blog.list

### 请求方式：
	get

### 参数类型：

| 参数     | 是否必选 | 类型 | 说明             |
| -------- | -------- | ---- | ---------------- |
| pageSize | Y        | int  | 每页多少条数据   |
| pageNum  | Y        | int  | 当前是第几页     |
| tagID    | N        | int  | 根据标签进行查询 |

### 返回示例：

	成功:
	    {
	        "code": 0,
	        "msg": "列表查询成功",
	        "allPageNum": 4,//总共有多少页
	        "data": [
	            {
	                "blogID": 4,
	                "title": "用快捷指令更换壁纸",
	                "body": "aaaa",
	                "createDate": "2020-12-02",
	                "witch": 0,
	                "Tags": [
	                    {
	                        "tagTypeID": 2,
	                        "tagName": "ios"
	                    }
	                ]
	            }
	        ]
	    }
	失败
		只要给我的是数字我就能查询成功 



## 4、按文章id进行查询文章

### 请求URL：
	http://localhost:4000/user/blog.one

### 请求方式：
	GET

### 参数类型

| 参数   | 是否必选 | 类型 | 说明   |
| ------ | -------- | ---- | ------ |
| blogID | Y        | int  | 文章id |



### 返回示例：
	成功:
	    {
	        "code": 0,
	        "msg": "文章查询成功",
	        "data": {
	            "blogID": 3,
	            "title": "用快捷指令更换壁纸",
	            "body": "aaaa",
	            "context": "bbbb",
	            "createDate": "2020-12-02",
	            "witch": 0,
	            "Tags": [
	                {
	                    "tagTypeID": 2,
	                    "tagName": "ios"
	                },
	                {
	                    "tagTypeID": 3,
	                    "tagName": "vue"
	                }
	            ]
	        }
	    }
	失败
	    {
	        "code": 1,
	        "msg": "文章查询失败，没有ID",
	        "data": {}
	    }

## 5、添加短句

### 请求URL：

	http://localhost:4000/admin/sentence.add

### 请求方式：

	post

### 参数类型

| 参数            | 是否必选 | 类型   | 说明     |
| --------------- | -------- | ------ | -------- |
| sentenceName    | Y        | string | 短句作者 |
| sentenceContext | Y        | string | 短句内容 |



### 返回示例：

	成功:
	    {
	        "code": 0,
	        "msg": "插入短句成功",
	        "data": {
	            "sentenceID": 12,
	            "sentenceName": "短句",
	            "sentenceContext": "你喜欢什么样的女生？ 大概不这么喜欢我的"
	        }
	    }
	失败
	    {
	        "code": 1,
	        "msg": "内容和作者是必填内容",
	        "data": {}
	    }

## 6、获取随机短句

### 请求URL：

	http://localhost:4000/user/getsentence.rander

### 请求方式：

	get

### 参数类型

| 参数 | 是否必选 | 类型 | 说明 |
| ---- | -------- | ---- | ---- |
| 无   | 无       | 无   | 无   |



### 返回示例：

	成功:
	    {
	        "code": 0,
	        "msg": "短句查询成功",
	        "data": {
	            "sentenceID": 11,
	            "sentenceName": "《全球高武》",
	            "sentenceContext": "这里的一切都有始有终，却能容纳所有不期而遇和久别重逢。\n世界灿烂盛大。\n欢迎回家。"
	        }
	    }
	失败
	    {
	        "code": 1,
	        "msg": "短句数量为0",
	        "data": {}
	    }

