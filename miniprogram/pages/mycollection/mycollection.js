// pages/mycollection/mycollection.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCollection: [],
    myMandD: [],
    price: "22.33",
    desc: "null",
    title: "青菜",
    imageURL: "https://636c-cloud1-3g192wyqd9d72719-1311228133.tcb.qcloud.la/imags/good.jpg?sign=7e59d02671d9218389f2ea3f4f581ca0&t=1651480548",
    vis: true,
    switchOldMode: false,
    pageSize: 8,
    pageIndex: 1,
    windowHeight: 0,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.myopenid)
    const {windowHeight} = wx.getWindowInfo()
    this.setData({
      tabbarHeight: app.globalData.tabbarHeight,
      windowHeight: windowHeight - app.globalData.tabbarHeight/2,
    })

    // console.log(this.data.myMandD.length)
    // if (app.globalData.myopenid != null && this.data.myMandD.length != 0) {
    //   this.setData({
    //     vis: false,
    //   })
    //   console.log(this.data.vis)
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

    /**
   * 下拉刷新
   */
  refresherrefresh() {
    this.setData({
      pageIndex: 1,
      myCollection: [],
      myMandD: [],
    })
    this.getCollection()
  },

    /**
   * 上拉加载
   */
  scrolltolower() {
    this.setData({
      pageIndex: this.data.pageIndex += 1
    })
    this.getCollection()
  },

  async getCollection() {
    // console.log(this.data.pageIndex)
    await wx.cloud.callFunction({
      name: 'getCollection',
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      }
    }).then(res2 => {
      // console.log(res2)
      if (res2.result.length != 0 && res2.result[0] != null) {
        this.setData({
          vis: false,
        })
      } else {
        if(this.data.myMandD.length == 0) {
          this.setData({
            vis: true,
            triggered: false
          })
          return
        }
      }
      this.setData({
        myCollection: res2.result
      })
      for (let i = 0; i < this.data.myCollection.length; i++) {
        var obj = this.data.myCollection[i];
        // console.log(obj)
        // console.log(obj.DB)
        // console.log(obj._id)
        if (obj.DB == "commodity") {
           db.collection('commodity').doc(obj._id).get().then(res2 => {
            this.setData({
              myMandD: Array.from(new Set(this.data.myMandD.concat(res2.data).map(item => JSON.stringify(item)))).map(item => JSON.parse(item)),
              triggered: false
            })
          }).catch(err => {})
        } else {
          db.collection('demand').doc(obj._id).get().then(res2 => {
            this.setData({
              myMandD: Array.from(new Set(this.data.myMandD.concat(res2.data).map(item => JSON.stringify(item)))).map(item => JSON.parse(item)),
              triggered: false
            })
          }).catch(err => {})
        }
      }
    }).catch(err => {})
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.tabBar();
    this.setData({
      switchOldMode: app.globalData.switchOldMode,
      pageIndex: 1,
    })
    
    if (app.globalData.myopenid != null) {
      this.getCollection()
    }
  },

  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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

  showDetail: function(e) {

    // console.log(this.data.myMandD)
    var idx = e.currentTarget.dataset.index;
    var arr = Object.keys(this.data.myMandD[idx])
    var cnt = 0
    var userInfo = {}
    var openid = ""
    if (arr.length == 10) {

        for (let j = 0; j < this.data.myMandD.length; j++) {
          if (this.data.myMandD[j]._id == this.data.myMandD[idx]._id) {
            break
          }
          cnt++
        }
        var good = this.data.myMandD[cnt]
        good = JSON.stringify(good)
        openid = this.data.myMandD[cnt].openid
        db.collection('user').where({
          openid: openid
        }).get().then(res3 => {
          userInfo = res3.data[0]
          userInfo = JSON.stringify(userInfo)
          wx.navigateTo({
            url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
          })
        }).catch(err => {})

    } else {

        for (let j = 0; j < this.data.myMandD.length; j++) {
          if (this.data.myMandD[j]._id == this.data.myMandD[idx]._id) {
            break
          }
          cnt++
        }
        var good = this.data.myMandD[cnt]
        good = JSON.stringify(good)
        openid = this.data.myMandD[cnt].openid
        db.collection('user').where({
          openid: openid
        }).get().then(res1 => {
          userInfo = res1.data[0]
          userInfo = JSON.stringify(userInfo)
          wx.navigateTo({
            url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
          })
        }).catch(err => {})

    }
},

  unCollect: function(e) {
    var that = this;  
    if (app.globalData.myopenid == null) {
      wx.showToast({
        title: '请登录',
        icon: 'error'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '取消收藏？',
        success: function (res) {
          if (res.confirm) {
            var idx = e.currentTarget.dataset.index;
            // console.log(that.data.myMandD[idx]._id)
            var arr = Object.keys(that.data.myMandD[idx])
            var obj = {}
            if (arr.length == 10) {
              obj = {"DB": "commodity", "_id": that.data.myMandD[idx]._id}
            } else {
              obj = {"DB": "demand", "_id": that.data.myMandD[idx]._id}
            }
            wx.cloud.callFunction({
              name: 'deleteCollection',
              data: {
                obj: obj
              }
            }).then(res2 => {
                //刷新，重回当前页面
                const pages = getCurrentPages()
                const prepage = pages[pages.length - 1]
                {
                  wx.reLaunch({
                    url: '/' + prepage.route
                  })
                }
                wx.showToast({
                  title: '取消成功',
                  duration: 1500
                })
                // wx.navigateBack();
            }).catch(err => {})
          }
        }
      })
    }
  },
})