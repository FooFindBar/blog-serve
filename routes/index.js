var express = require('express');
var router = express.Router();
// const { BlogModel } = require('../db/models')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// 注册
// router.post('/register', function (req, res, next) {
//   const { username, password, type } = req.body
//   UserModel.findOne({ username }, function (err, user) {
//     if (user) {
//       res.send({ code: 1, msg: '用户已存在' })
//     } else {
//       new UserModel({ username, password: md5(password), type }).save(function (error, user) {
//         res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
//         const data = { _id: user._id, username, type }
//         res.send({ code: 0, data })
//       })
//     }
//   })
// })
// // 登录
// router.post('/login',(req,res,next)=>{
//   const {username,password}=req.body
//   UserModel.findOne({username,password:md5(password)},filter,(error,user)=>{
//     if(user){
//       res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
//       res.send({code:0,data:{user}})
//     }else{
//       res.send({code:1,msg:'账号或密码有误'})
//     } 
//   })
// })

module.exports = router;
