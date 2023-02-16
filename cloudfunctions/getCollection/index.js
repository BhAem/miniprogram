// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var t = []
  await db.collection('collection').where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    for (let i = ((event.pageIndex-1)*event.pageSize); i < ((event.pageIndex-1)*event.pageSize) + event.pageSize; i++) {
      if (i == res.data[0].c_id.length) 
        break;
      t.push(res.data[0].c_id[i]);
    }
  })
  return t
}

