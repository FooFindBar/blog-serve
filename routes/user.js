var express = require('express');
var router = express.Router();
const { Blog, TagType, Sentence } = require('../db/models')
const { Sequelize } = require("sequelize");



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
  let blogsLength=1
  if (!tagID || tagID === '') {
    console.log('正在查询一共多少条文章ing...')
    allPageNum = await Blog.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'allPageNum'] // 添加聚合...
      ]
    });
    
    blogsLength=parseInt(allPageNum[0].dataValues.allPageNum)
    allPageNum = Math.ceil(parseInt(allPageNum[0].dataValues.allPageNum) / size)
    console.log('查询并计算出了一共多少页')
    console.log('没有标签分类条件开始查询文章列表。。。。')
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
    console.log('正在查询一共多少条文章ing...')
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
    blogsLength=parseInt(allPageNum[0].dataValues.allPageNum)
    allPageNum = Math.ceil(parseInt(allPageNum[0].dataValues.allPageNum) / size)
    console.log('查询并计算出了一共多少页')
    console.log('有标签分类条件开始查询这呢。。。。')
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
  console.log('已完成查询！！！')
  console.log(blogsLength);
  res.json({ code: 0, msg: '列表查询成功', allPageNum, data: blogList,blogsLength })
})

//按文章id请求文章详情信息
router.get('/blog.one', async function (req, res, next) {
  let { blogID } = req.query
  blogID=parseInt(blogID)
  if (!blogID) {
    res.send({ code: 1, msg: '文章查询失败，没有ID', data: {} })
    return;
  }
  console.log('用户进行了文章查询,正查着呢...')
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
  console.log('文章查询完成！！！')
  res.send({ code: 0, msg: '文章查询成功', data: blog })
})

//每页推荐句子
router.get('/getsentence.rander', async function (req, res, next) {  
  console.log('用户进行了短句查询,正查着呢...')
  let sentences = await Sentence.findAll()
  if(sentences.length===0){
    res.send({ code: 1, msg: '短句数量为0', data:{} })
  }
  console.log('开始随机');
    let index=random(1,parseInt(sentences.length))
  console.log('确定返回那条短句！！！',index)
  console.log('短句列表长度！！！',sentences.length)
  res.send({ code: 0, msg: '短句查询成功', data: sentences[index] })
})


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
module.exports = router;


