const {findArticleList,findArticle,findPageCount,insertArticle,updateArticle,deleteArticle} = require("../lib/mysql.js");

const fn_articleList = async (ctx, next) => {
  let {currentPage,pageSize } = ctx.request.query;
  if(!currentPage) {currentPage = 1}else{currentPage = currentPage - 0}
  if(!pageSize) {pageSize = 10}else{pageSize = pageSize - 0 }
  const value = {currentPage,pageSize};
  let list = new Array();
  let total = 0;
  await findArticleList(value).then(res =>{
    list = res
    next()
  })
  await findPageCount().then(res =>{
    total = res[0].total
  })

  ctx.body = {
    list,
    pagination: {total, pageSize, current:currentPage}
  }
  
};

const fn_articleInsert = async (ctx,next)=>{
  const {title,content,keyword} = ctx.request.body
  const value = {title,content,keyword}
  await insertArticle(value).then(res => {
    ctx.body = {
      code:200,
      msg:"添加成功",
      serverRes:res
    }
  }).catch(error=>{
    ctx.body = {
      code:100,
      msg:"添加失败",
      serverRes:error
    }
  })

}

const fn_articleUpdate = async (ctx,next)=>{
  const {title,content,keyword,id} = ctx.request.body
  const value = {title,content,keyword,id}
  await updateArticle(value).then(res => {
    ctx.body = {
      code:200,
      msg:"修改成功",
      serverRes:res
    }
  }).catch(error=>{
    ctx.body = {
      code:100,
      msg:"修改失败",
      serverRes:error
    }
  })
}

const fn_articleDelete = async (ctx,next)=>{
  const {key} = ctx.request.body
  await deleteArticle(key).then(res => {
    ctx.body = {
      code:200,
      msg:"删除成功",
      serverRes:res
    }
  }).catch(error=>{
    ctx.body = {
      code:100,
      msg:"删除失败",
      serverRes:error
    }
  })
}

/* 前端 查询某篇文章*/
const fn_queryArticle = async (ctx, next) => {
  let id = ctx.params.keys
  if(id && parseInt(id)){
    await findArticle(id).then(res=>{
      if(res[0]){
        ctx.body = {
          code:200,
          data:res[0],
        }
        return
      }
      ctx.body = {
        code:202,
        msg:"未查到文章！",
      }
    }).catch(error=>{
      ctx.body = {
        code:100,
        msg:"查询失败",
        serverRes:error
      }
    })
  }
};

module.exports = {
  'GET /article/list':fn_articleList,
  'GET /article/query/:keys':fn_queryArticle,
  'POST /article/insert':fn_articleInsert,
  'POST /article/update':fn_articleUpdate,
  'POST /article/delete':fn_articleDelete,
}