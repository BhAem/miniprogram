// pages/look1/look1.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myPublish: [],
    price: "22.33",
    desc: "null",
    title: "青菜",
    imageURL: "https://636c-cloud1-3g192wyqd9d72719-1311228133.tcb.qcloud.la/imags/good.jpg?sign=7e59d02671d9218389f2ea3f4f581ca0&t=1651480548",
    vis: true,
    switchOldMode: false,
    pageSize: 8,
    pageIndex: 1,
    windowHeight: 0,
    triggered: false,
    flag: app.globalData.vis
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {windowHeight} = wx.getWindowInfo()
    this.setData({
      windowHeight: windowHeight
    })
    // console.log(app.globalData.myopenid)
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
      myPublish: [],
    })
    this.getMyPublish()
  },

  /**
   * 上拉加载
   */
  scrolltolower() {
    this.setData({
      pageIndex: this.data.pageIndex += 1
    })
    this.getMyPublish()
  },

  async getMyPublish() {
    await wx.cloud.callFunction({
      name: 'getMyPublish',
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      }
    }).then(res => {
      // console.log(res)
      if (res.result.data.length != 0) {
        this.setData({
          vis: false,
        })
      }
      var t = [];
      for (let i = 0; i < res.result.data.length; i++) {
        t.push(res.result.data[i]);
      }
      this.setData({
        myPublish: Array.from(new Set(this.data.myPublish.concat(t).map(item => JSON.stringify(item)))).map(item => JSON.parse(item)),
        triggered: false
      })
    }).catch(err => {})
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      switchOldMode: app.globalData.switchOldMode,
      pageIndex: 1,
    })
    if (app.globalData.myopenid != null) {
      this.getMyPublish()
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
    var idx = e.currentTarget.dataset.index;

      var good = this.data.myPublish[idx]
      good = JSON.stringify(good)
      var temp = app.globalData.userInfo
      var userInfo = {'userInfo': temp}
      // console.log(userInfo)
      userInfo = JSON.stringify(userInfo)
      wx.navigateTo({
        url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
      })

  },

  edit: function(e) {
    if (app.globalData.myopenid == null) {
      wx.showToast({
        title: '请登录',
        icon: 'error'
      })
    } else {
      var idx = e.currentTarget.dataset.index;
      var good = this.data.myPublish[idx]
      good = JSON.stringify(good)
      wx.navigateTo({
        url: '../../pages/check1/check1?obj=' + good,
      })
    }
  },


  delete: function(e){
    var that = this
    if (app.globalData.myopenid == null) {
      wx.showToast({
        title: '请登录',
        icon: 'error'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定下架？',
        success: function (res) {
          if (res.confirm) {
            var idx = e.currentTarget.dataset.index;
              // console.log(res.data[idx]._id)
              wx.cloud.callFunction({
                name: 'deleteMorD',
                data: {    
                  _id: that.data.myPublish[idx]._id,
                  database: "commodity"
                }
              }).then(res2 => {
                  //刷新，重回当前页面
                  const pages = getCurrentPages()
                  const perpage = pages[pages.length - 1]
                  {
                    wx.redirectTo({
                      url: '/' + perpage.route
                    })
                  }
                  wx.showToast({
                    title: '下架成功',
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