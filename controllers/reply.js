const {replyList,insertReply} = require("../lib/mysql.js");

const fn_list = async (ctx, next) => {
  const {articleId} = ctx.request.body;
  await replyList({articleId}).then(res =>{
    const data = {
      code:200,
      data:res
    }
    ctx.response.body = data;
  }).catch(error=>{
    const data = {
      code:100,
      msg:"查询失败！",
      serverConsole:error.message
    }
    ctx.response.body = data;
    return;
  })
};
const fn_comment = async (ctx, next) => {
  const {articleId,commentId,content } = ctx.request.body;
  if(ctx.session.userinfo &&　Object.keys(ctx.session.userinfo).length){
    const userId = ctx.session.userinfo.userId
    await insertReply({articleId,commentId,content,userId}).then(res =>{
      const data = {
        code:200,
        msg:"评论成功！",
        server:res
      }
      ctx.response.body = data;
    }).catch(error=>{
      const data = {
        code:100,
        msg:"评论失败！",
        serverConsole:error.message
      }
      ctx.response.body = data;
      return;
    })
  }else{
    ctx.response.status = 401
  }
};

module.exports = {
  'POST /reply/list':fn_list,
  'POST /reply/comment':fn_comment,
}