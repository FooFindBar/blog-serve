var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var md5=require('md5');
const { Blog, TagType, Sentence, Admin } = require('../db/models')

//管理员登录
router.post('/login', async (req, res, next) => {
  let { username, password } = req.body;
  // 2、查询有没有该用户
  let admin = await Admin.findOne({
    where: {
      'username': username
    }
  })
  console.log(admin);
  // 2.1 判断有么有该用户
  if (!admin) {
    // 2.2 没有该用户
    res.json({ code: 1, message: '用户名或密码错误', data: {} })
    return 
  } else {
    // 2.3.2 比较 输入的 密码和数据库中的密码
    console.log(md5(password)===admin.password);
    console.log(md5(password));
    console.log(admin.password);

    if (md5(password)===admin.password) {
      // 2.3.3 密码正确,生成token
      console.log(md5(password));
      let adminID = admin.adminID
      let username = admin.username
      let token = jwt.sign({ adminID, username }, 'daxunxun', {
        expiresIn: 60 * 60 * 24// 授权时效24小时
      })
      res.send({
        code: '0',
        message: '登陆成功',
        data:{
          username,
          adminID,
          token
        }
      })
    } else {
      // 2.3.4 密码错误
      res.send({
        code: '1',
        message: '账号或密码错误',
        data:{}
      })
    }
  }
})
//查询短句列表
router.get('/sentence.list', async function (req, res, next) {
  let sentence=await Sentence.findAll({})
    res.json({ code: 0, msg: '查询短句列表成功', data: sentence})
});
//添加短句
router.post('/sentence.add', async function (req, res, next) {
  let { sentenceName, sentenceContext } = req.body;
  if (!sentenceName || !sentenceContext) {
    res.json({ code: 1, msg: '内容和作者是必填内容', data: {} })
    return;
  }
  console.log('用户进行短句插入ing....');
  const sentence = await Sentence.create({ sentenceName, sentenceContext })
  if (sentence.dataValues && sentence.dataValues.sentenceName === sentenceName) {
    console.log('短句插入成功！');
    res.json({ code: 0, msg: '插入短句成功', data: sentence.dataValues })
  } else {
    console.log('短句插入失败！！！！！！');
    res.json({ code: 1, msg: '插入短句失败', data: tagName })
  }
});
//删除短句
router.post('/sentence.delete', async function (req, res, next) {
  let sentenceID = req.body.sentenceID;
  console.log('用户进行短句删除ing....');
  const sentence = await Sentence.destroy({where:{sentenceID}})
  if(sentence>=1){
    res.json({ code: 0, msg: '短句删除成功',data:{}})
  }else{
    res.json({ code: 1, msg: '短句删除失败',data:{}})
  }
});
//修改短句
router.post('/sentence.edit', async function (req, res, next) {
  let { sentenceName, sentenceContext,sentenceID } = req.body;
  let up=await Sentence.update(
    {
      sentenceName,
      sentenceContext
    }, {
      'where': { sentenceID }
    }
  )
  if(up[0]>=0){
    res.json({code:0,msg:'修改成功'})
    return
  }
  res.json({code:1,msg:'修改失败'})
});

//查询标签列表
router.get('/tags.list', async function (req, res, next) {
  let tagList=await TagType.findAll({})
    res.json({ code: 0, msg: '查询标签列表成功', data: tagList})
});
//添加标签
router.post('/tagstype.add', async function (req, res, next) {
  let tagName = req.body.tagname;
  console.log('用户进行标签插入ing....');
  const tagtype = await TagType.create({ tagName })
  if (tagtype.dataValues && tagtype.dataValues.tagName === tagName) {
    console.log('标签插入成功！');
    res.json({ code: 0, msg: '插入标签成功', data: tagtype.dataValues })
  } else {
    console.log('标签插入失败！！！！！！');
    res.json({ code: 1, msg: '插入标签失败', data: tagName })
  }
});
//删除标签
router.post('/tagstype.delete', async function (req, res, next) {
  let tagTypeID = req.body.tagTypeID;
  console.log('用户进行标签删除ing....');
  const tagtype = await TagType.destroy({where:{tagTypeID}})
  if(tagtype>=1){
    res.json({ code: 0, msg: '标签删除成功',data:{}})
  }else{
    res.json({ code: 1, msg: '标签删除失败',data:{}})
  }
});
//修改标签
router.post('/tagstype.edit', async function (req, res, next) {
  let {tagTypeID,tagName} = req.body;
  let up=await TagType.update(
    {
      tagName
    }, {
      'where': { tagTypeID }
    }
  )
  if(up[0]>=0){
    res.json({code:0,msg:'修改成功'})
    return
  }
  res.json({code:1,msg:'修改失败'})
});
//发布文章
router.post('/blog.insert', async function (req, res, next) {
  let { title, body, context, createDate, witch, tagsID } = req.body;
  (createDate === '') && (createDate = undefined);
  (witch === '') && (witch = undefined);
  console.log('用户正在进行文章插入ing....');
  let blog = await Blog.create({ title, body, context, createDate, witch })
  if (!blog.dataValues) {
    console.log('文章插入失败！');
    res.json({ code: 0, msg: '文章插入失败', data: blog })
    return;
  }
  console.log('文章插入成功！');
  console.log(tagsID);
  console.log('用户正在进行文章的标签插入ing....');
  let tags = await TagType.findAll({ where: { tagTypeID: tagsID } })
  blog.setTags(tags)
  console.log('文章标签插入成功！');
  res.json({ code: 0, msg: '文章插入成功', data: { blogID: blog.dataValues.blogID, title, createDate: blog.dataValues.createDate } })
})
//修改文章
router.post('/blog.edit', async (req, res, next) => {
  let {blogID, title, body, context, createDate, witch, tagsID } = req.body;
  
  blogID=parseInt(blogID)
  let up=await Blog.update(
    {
      title, body, context, createDate, witch
    }, {

      'where': { blogID }
    }
  )
  let tags = await TagType.findAll({ where: { tagTypeID:tagsID  } })
  let blog = await Blog.findOne({
    where: {
      blogID
    }
  });
  let aaaa=await blog.setTags(tags)
  console.log(up);
  if(up[0]>=0){
    res.json({code:0,message:'修改成功'})
    return
  }
  res.json({code:1,message:'修改失败'})
})
//删除文章
router.post('/blog.delete', async function (req, res, next) {
  let { blogID } = req.body;
  console.log('用户正在进行文章删除ing....');
  let blog = await Blog.destroy({where:{blogID}})
  console.log(blog);
  if(blog>=1){
    res.json({ code: 0, msg: '文章删除成功',data:{}})
  }else{
    res.json({ code: 1, msg: '文章删除失败',data:{}})
  }
})


module.exports = router;
