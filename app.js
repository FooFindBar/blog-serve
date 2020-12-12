var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置跨域访问
app.all("*", function (req, res, next) {
  console.log(111111111111111111111111111111111111111);
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin",'*');
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With,token");
  // //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 可以带cookies
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//判断token
app.use((req, res, next) => {
  // 排除登陆注册页面
  console.log(2222);
  
   if (req.url !== '/admin/login' && req.url.indexOf('/user/')===-1) {
   // 不同形式获取token值
     let token = req.headers.token || req.query.token || req.body.token;
     // 如果存在token ---- 验证
     if (token) {
       jwt.verify(token, 'daxunxun', function(err, decoded) {
         if (err) {
           res.json({ 
             code: '10119', 
             message: '没有找到token.' 
           });
         } else {
           req.decoded = decoded;  
           console.log('验证成功', decoded);
           next()
         }
       }) 
     } else { // 不存在 - 告诉用户---意味着未登录
       res.json({ 
         code: '10119', 
         message: '没有找到token.' 
       });
     }
   } else {
     next()
   }
 })

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
