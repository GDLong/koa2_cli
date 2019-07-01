// 链接数据库
const mysql = require('mysql');
const config = require('../config/default.js');
// 创建数据池
const pool = mysql.createPool({
    host: config.database.host,   // 数据库地址
    user: config.database.user,    // 数据库用户
    password: config.database.password,   // 数据库密码
    database: config.database.database  // 选中数据库
})
// 在数据池中进行会话操作
let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
/**
 * 调用相关接口
 */
let findUserData  = function (name) {
    let _sql = `select * from user where userName="${name}";`
    return query(_sql)
}
let findUserInfo  = function (name) {
    let _sql = `select * from userInfo where userId=2;`
    return query(_sql)
}
let registerUser = function (value) {
    let _sql = "insert into user set name=?,password=?;"
    return query(_sql, value)
}

// 查询分页
let findArticleList  = function(value){
    const {currentPage,pageSize} = value;
    let page_size = pageSize || 10;
    let startPage = (currentPage -1)*page_size;
    if(startPage < 0 || !startPage) startPage = 0;

    let _sql = `SELECT SQL_CALC_FOUND_ROWS * FROM article WHERE isDel != 0 limit ${startPage},${page_size};`
    return query(_sql)
}
let findArticle  = function(id){
    let _sql = `SELECT * FROM article WHERE id=${id};`
    return query(_sql)
}
//查询所有数据total
let findPageCount  = function(value){
    let _sql = "SELECT found_rows() AS total;"
    return query(_sql)
}

//插入文章
let insertArticle  = function(value){
    const {title,content,keyword} = value;
    const date = (new Date()).toLocaleString();
    let _sql = `INSERT INTO article(author,title,keyword,content,createdAt,updatedAt) 
                VALUES('小火','${title}','${keyword}','${content}','${date}','${date}')`

    return query(_sql)
}
// || 编辑文章
let updateArticle  = function(value){
    const {title,content,keyword,id} = value;
    const date = (new Date()).toLocaleString();
    const text = content.replace(/'/g,'"');
    let _sql = `UPDATE article
                SET
                    title='${title}',
                    keyword='${keyword}',
                    content='${text}',
                    updatedAt='${date}'
                WHERE
                    id = ${id}`

    return query(_sql)
}
//删除文章 ==》 这里不做删除只改变 isDel 的状态
let deleteArticle  = function(value){
    let keys = value.join()
    let _sql = `UPDATE article
                SET
                    isDel = 0
                WHERE
                    id in (${keys})`
    return query(_sql)
}
module.exports = {
    registerUser,
    findUserData,
    findUserInfo,
    findArticleList,
    findArticle,
    findPageCount,
    insertArticle,
    updateArticle,
    deleteArticle
}