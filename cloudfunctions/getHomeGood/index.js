// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {data} = await db.collection(event.database).limit(event.pageSize).skip((event.pageIndex-1)*event.pageSize).get()
  return {data}
}