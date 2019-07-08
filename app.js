const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')
const cors = require('koa2-cors');
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logUtil = require('./utils/log_util')
const controller = require('./controller')
// const index = require('./routes/index')
// const users = require('./routes/users')

app.use(cors({
  // origin:'http://192.168.0.99:8000',
  credentials:true
}))

// error handler
onerror(app)

app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
// 配置session
app.keys = ['some secret hurr']
const CONFIG = {  
  key: 'koa:sess', /**  cookie的key。 (默认是 koa:sess) */
  maxAge: 6000,   /**  session 过期时间，以毫秒ms为单位计算 。*/
  autoCommit: true, /** 自动提交到响应头。(默认是 true) */
  overwrite: true, /** 是否允许重写 。(默认是 true) */
  httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
  signed: true, /** 是否签名。(默认是 true) */
  rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
  renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
};
app.use(session(CONFIG, app));
// logUtil
app.use(async (ctx, next) => {
  const start = new Date();
  let ms;
  try {
    await next()
    ms = new Date() - start
    //记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
})
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(controller())
// app.use(ctx => {
//   // ignore favicon
//   if (ctx.path === '/favicon.ico') return;
 
//   let n = ctx.session.views || 0;
//   ctx.session.views = ++n;
//   ctx.body = n + ' views';
// });
// routes  作用：启动路由  ***  当请求出错时的处理逻辑
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
