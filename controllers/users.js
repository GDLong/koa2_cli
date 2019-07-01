const {findUserData,findUserInfo} = require("../lib/mysql.js");

const fn_login = async (ctx, next) => {
  const {name,password } = ctx.request.body;
  await findUserData(name).then(res =>{
    const {userName,userPassword} = res[0];
    const data = {code:200}
    if(name !== userName || password !== userPassword){
      data.code = 100,
      data.msg = "用户名或密码填写错误"
    }else{
      data.msg = "登录成功"
    }
    ctx.response.body = data;
    return;
  }).catch(error=>{
    const data = {
      code:100,
      msg:"用户名错误！",
      serverConsole:error.message
    }
    ctx.response.body = data;
    return;
  })
};

const fn_userInfo = async (ctx,next )=>{
  await findUserInfo().then(res => {
    const data = {
      code:200,
      msg:"请求成功",
      data:res[0]
    }
    ctx.body = data;
    return;
  }).catch(error=>{
    const data = {
      code:100,
      msg:"用户名错误！",
      serverConsole:error.message
    }
    ctx.body = data;
    return;
  })
}

module.exports = {
  'POST /user/login':fn_login,
  'POST /user/userInfo':fn_userInfo,
}