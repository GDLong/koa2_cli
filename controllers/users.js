// const router = require('koa-router')()

// router.prefix('/users')

// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })

// module.exports = router
const fn_hello = async (ctx,next) =>{
  var name = ctx.params.name;
  ctx.response.body = `<h1>Hello,${name}!</h1>`;
};
// router.post('/doAdd', upload.single('face'), async (ctx, next) => {
//   ctx.body = {
//       filename: ctx.req.file.filename,//返回文件名
//       body:ctx.req.body
//   }
// });
const fn_multer = async (ctx,next) =>{
  ctx.body = {
      filename: ctx.req.file.filename,//返回文件名
      body:ctx.req.body
  }
}
module.exports = {
  'GET /hello/:name':fn_hello,
  'GET /multer':fn_multer
}