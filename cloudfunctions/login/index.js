// 云函数入口文件
const cloud = require('wx-server-sdk')
var isNot = true
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    await db.collection("user")
      .get()
      .then(res => {
        for (i = 0; i < res.data.length; i++) {
          if (res.data[i].openid == wxContext.OPENID) {
            isNot = false
          }
        }
        if (isNot) {
          return db.collection('user').add({
            data: {
              openid: wxContext.OPENID,
              userInfo: event.userInfo,
              phone: "",
              wechatid: ""
            }
          })
        }
      })
  } catch (err) {}
}