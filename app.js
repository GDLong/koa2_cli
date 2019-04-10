const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logUtil = require('./utils/log_util')
const controller = require('./controller')
// const index = require('./routes/index')
// const users = require('./routes/users')


// error handler
onerror(app)

app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

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


// routes  作用：启动路由  ***  当请求出错时的处理逻辑
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
