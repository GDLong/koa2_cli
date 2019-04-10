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
    let _sql = `select * from user where name="${name}";`
    return query(_sql)
}
// 注册用户
let registerUser = function (value) {
    let _sql = "insert into user set name=?,password=?;"
    return query(_sql, value)
}


module.exports = {
    registerUser,
    findUserData 
}