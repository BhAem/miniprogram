// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {data} = await db.collection(event.database).where(_.or(
    [{
      tag: db.RegExp({
        regexp: event.tag,
        options: 'i'
      })
    },
    {
      title: db.RegExp({
        regexp: event.tag,
        options: 'i'
      })
    },
    {
      content: db.RegExp({
        regexp: event.tag,
        options: 'i'
      })
    }
    ])).limit(event.pageSize).skip((event.pageIndex-1)*event.pageSize).get()
  return {data}
}