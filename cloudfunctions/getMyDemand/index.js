// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('demand').where({
    openid: wxContext.OPENID
  }).limit(event.pageSize).skip((event.pageIndex-1)*event.pageSize).get()
}

