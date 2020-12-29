var express = require('express');
var router = express.Router();
const { Blog, TagType, Sentence } = require('../db/models')
const { Sequelize } = require("sequelize");
//引入时间日期格式化字符串
var moment = require('moment');

//增加阅读量
router.post('/readnum.addcount', async function (req, res, next) {
  let { blogID, witch } = req.body
  let up = await Blog.update(
    {
      witch: parseInt(witch) + 1
    },
    {
      where: { blogID }
    }
  )
  if (up >= 0) {
    res.send({ code: 0, msg: '阅读量增加成功', data: up })
  } else {
    res.send({ code: 0, msg: '阅读量增加失败', data: up })
  }
})
//请求归档的文章列表
router.get('/blogarchive.list', async function (req, res, next) {
  let blogList = await Blog.findAll({
    attributes: ['blogID', 'title', 'createDate'],
    order: [['createDate', 'DESC']],
  });
  let yearlist=[]
  let ayear={
    yearname:'',
    yearlist:[]
  }
  let year='0'
  blogList.forEach(item => {
    let newyear=moment(item.createDate).format('YYYY').toString()
    
    if(year!==newyear){
      year=newyear
      ayear.yearname=newyear
      yearlist.push(JSON.parse(JSON.stringify(ayear)))
    }
    yearlist[yearlist.length-1].yearlist.push(item)
  });
  
  res.json({ code: 0, msg: '列表查询成功', data: yearlist})
})
//请求所有文章列表
router.get('/blog.list', async function (req, res, next) {
  const { pageSize, pageNum, tagID } = req.query
  var size = 10
  var offsetnum = 0
  if (pageSize && pageNum) {
    size = parseInt(pageSize)
    offsetnum = parseInt(pageSize * (pageNum - 1))
  }

  let blogList = []
  let allPageNum = 1
  let blogsLength = 1
  if (!tagID || tagID === '') {
    
    allPageNum = await Blog.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'allPageNum'] // 添加聚合...
      ]
    });

    blogsLength = parseInt(allPageNum[0].dataValues.allPageNum)
    allPageNum = Math.ceil(parseInt(allPageNum[0].dataValues.allPageNum) / size)
    
    
    blogList = await Blog.findAll({
      attributes: ['blogID', 'title', 'body', 'createDate', 'witch'],
      include: {
        model: TagType,
        as: 'Tags',
        attributes: ['tagTypeID', 'tagName'],
        through: { attributes: [] },
      },
      limit: size,
      offset: offsetnum,
      order: [['blogID', 'DESC']],

    });
  } else {
    
    allPageNum = await Blog.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'allPageNum'] // 添加聚合...
      ],
      include: {
        model: TagType,
        as: 'Tags',
        through: { attributes: [] },
        where: {
          'tagTypeID': parseInt(tagID)
        }
      },
    });
    blogsLength = parseInt(allPageNum[0].dataValues.allPageNum)
    allPageNum = Math.ceil(parseInt(allPageNum[0].dataValues.allPageNum) / size)
    
    
    blogList = await Blog.findAll({
      attributes: ['blogID', 'title', 'body', 'createDate', 'witch'],
      include: {
        model: TagType,
        as: 'Tags',
        attributes: ['tagTypeID', 'tagName'],
        through: { attributes: [] },
        where: {
          'tagTypeID': parseInt(tagID)
        }
      },
      limit: size,
      offset: offsetnum,
      order: [['blogID', 'DESC']],

    });
  }
  
  
  res.json({ code: 0, msg: '列表查询成功', allPageNum, data: blogList, blogsLength })
})

//按文章id请求文章详情信息
router.get('/blog.one', async function (req, res, next) {
  let { blogID } = req.query
  blogID = parseInt(blogID)
  if (!blogID) {
    res.send({ code: 1, msg: '文章查询失败，没有ID', data: {} })
    return;
  }
  
  blog = await Blog.findOne({
    attributes: ['blogID', 'title', 'body', 'context', 'createDate', 'witch'],
    include: {
      model: TagType,
      as: 'Tags',
      attributes: ['tagTypeID', 'tagName'],
      through: { attributes: [] },
    },
    where: {
      blogID
    }
  });
  
  res.send({ code: 0, msg: '文章查询成功', data: blog })
})

//每页推荐句子
router.get('/getsentence.rander', async function (req, res, next) {
  
  let sentences = await Sentence.findAll()
  if (sentences.length === 0) {
    res.send({ code: 1, msg: '短句数量为0', data: {} })
  }
  
  let index = random(0, parseInt(sentences.length))
  
  
  res.send({ code: 0, msg: '短句查询成功', data: sentences[index] })
})


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
module.exports = router;


