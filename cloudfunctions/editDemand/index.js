// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  return await db.collection("demand").doc(event._id).update({
    data: {
      "content": event.content,
      "img": event.img,
      "openid": event.openid,
      "tag": event.tag,
      "title": event.title,
      "site": event.site,
      "time": event.time,
      "phone": event.phone        
    }
  })
  // .then(res => {
  //   console.log(res)
  // })
  // .catch(console.error)
}