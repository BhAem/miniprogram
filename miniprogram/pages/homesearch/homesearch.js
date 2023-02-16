// pages/homesearch/homesearch.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    history: [],
    hot: [],
    switchOldMode: false
  },

  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    // console.log(this.data.value)
    var tag = this.data.value;

    if (app.globalData.myopenid != null) {
      db.collection('history').where({
        _openid: app.globalData.myopenid
      }).get().then(
        res=>{
          var len = res.data[0].myHistory.length
          if (len == 10) {
            db.collection('history').where({
              _openid: app.globalData.myopenid
            }).update({
              data: {
                myHistory: _.shift()
              }
            })
          }
          if (tag != "") {
            db.collection('history').where({
              _openid: app.globalData.myopenid
            }).update({
              data: {
                myHistory: _.addToSet(tag)
              }
            })
          }
        }
      ).catch(err => {})
    }

    db.collection('hot').where({
      name: tag
    }).get().then(
      res11 => {
        if (res11.data.length != 0) {
          if (tag != "") {
            db.collection('hot').where({
              name: tag
            }).update({
              data: {
                count: _.inc(1)
              }
            })
          }
        } else {
          if (tag != "") {
            db.collection('hot').add({
              data: {
                "count": 1,
                "name": tag
              }
            })
          }
        }
      }
    ).catch(err => {})

    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },

  onClick() {
    // console.log(this.data.value)
    var tag = this.data.value;

    if (app.globalData.myopenid != null) {
      db.collection('history').where({
        _openid: app.globalData.myopenid
      }).get().then(
        res=>{
          var len = res.data[0].myHistory.length
          if (len == 10) {
            db.collection('history').where({
              _openid: app.globalData.myopenid
            }).update({
              data: {
                myHistory: _.shift()
              }
            })
          }
          if (tag != "") {
            db.collection('history').where({
              _openid: app.globalData.myopenid
            }).update({
              data: {
                myHistory: _.addToSet(tag)
              }
            })
          }
          }
      ).catch(err => {})
    }

    db.collection('hot').where({
      name: tag
    }).get().then(
      res11 => {
        if (res11.data.length != 0) {
          if (tag != "") {
            db.collection('hot').where({
              name: tag
            }).update({
              data: {
                count: _.inc(1)
              }
            })
          }
        } else {
          if (tag != "") {
            db.collection('hot').add({
              data: {
                "count": 1,
                "name": tag
              }
            })
          }
        }
      }
    ).catch(err => {})

    // console.log(tag)
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + tag
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.myopenid != null) {
      db.collection('history').where({
        _openid: app.globalData.myopenid
      }).get().then(
        res=>{
          this.setData({
            history: res.data[0].myHistory
          })
        }
      ).catch(err => {})
    }
    
    db.collection('hot').get().then(
      res=>{
        // console.log(res)
        var t = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].count > 10) {
            t.push(res.data[i])
          }
        }

        function sortDsc(a, b) {
          return b.count - a.count;
        }
        t = t.sort(sortDsc)

        var hotag = []
        for (let i = 0; i < 10; i++) {
          if(i < t.length)
            hotag.push(t[i].name)
        }

        this.setData({
          hot: hotag
        })
      }
    ).catch(err => {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      switchOldMode: app.globalData.switchOldMode
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //选择标签
  chosen(e) {
    this.setData({
      value: e.currentTarget.id
    })
    wx.navigateTo({
      url: '../../pages/detailed/detailed?tag=' + e.currentTarget.id
    })
  },

})