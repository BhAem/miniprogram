// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var t = []
  await db.collection('record').where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    for (let i = 0; i < res.data[0].history.length; i++) {
      t.push(res.data[0].history[i]);
    }
  })
  return t
}