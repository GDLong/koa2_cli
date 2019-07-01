const { findUserData,registerUser} = require("../lib/mysql.js");

const fn_helloKoa = async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa2!'
    })
};

const fn_signin = async (ctx, next) => {
    let name = ctx.request.body.name || '',password = ctx.request.body.password || '';
    await findUserData(name).then(res =>{
        if (name === res[0].userName && password === res[0].userPassword) {
            ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        } else {
            ctx.response.body = `<h1>Login failed!</h1>
            <p><a href="/">Try again</a></p>`;
        }
    })
};

const fn_register = async (ctx, next) => {
    let name = ctx.request.body.name || '',password = ctx.request.body.password || '';
    await registerUser([name, password]).then(res =>{
        console.log('注册成功', res)
    })
};

module.exports = {
  'GET /': fn_helloKoa,
  'POST /signin': fn_signin,
  'POST /register': fn_register,
};
