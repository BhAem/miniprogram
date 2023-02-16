//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    avatarUrl: 'https://pic.imgdb.cn/item/6283016e0947543129825fc5.jpg',
    nickName:"点击头像登录",
    userInfo:{},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    user:{},
    flag: false,
    switchOldMode: false,
    vis: app.globalData.vis,
    look1: "环保布袋",
    look2: "联系记录"
  },

  onLoad() {
    wx.cloud.callFunction({
      name: 'findOpenid'
    }).then(res => {
      // app.globalData.myopenid = res.result;
      db.collection('user').where({
          openid: res.result
        }).get()
        .then(res1 => {
          if (res1.data.length == 0) {
            this.flag = 1;
          } else {
            app.globalData.userInfo = res1.data[0].userInfo;
            app.globalData.myopenid = res1.data[0].openid;
            // console.log(app.globalData.userInfo)
            this.setData({
              hasUserInfo: true,
              nickName: res1.data[0].userInfo.nickName,
              avatarUrl: res1.data[0].userInfo.avatarUrl
            })
          }
        }).catch(err => {})
    }).catch(err => {})
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (this.data.vis) {
      this.setData({
        look1: "我的商品", 
        look2: "我的求购"
      })
    }
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl
    })
    this.tabBar();
    this.setData({
      switchOldMode: app.globalData.switchOldMode
    })
    console.log(app.globalData.userInfo)
  },
  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },
  
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
          // console.log(app.globalData.myopenid)
          wx.cloud.callFunction({
            name: 'findOpenid'
          }).then(res => {
            app.globalData.myopenid = res.result;
            // console.log(app.globalData.myopenid)
          }).catch(err => {})
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          })
        if (this.flag) {
          wx.cloud.callFunction({
            name: 'login',
            data: {
              userInfo: res.userInfo
            }
          }),
          db.collection('collection').add({
            data: {
              c_id: []
            }
          }),
          db.collection('record').add({
            data: {
              history: []
            }
          }),
          db.collection('history').add({
            data: {
              myHistory: []
            }
          })
        }
      }
    })
  },

  mySetting: function () {
    if (app.globalData.switchOldMode == false) {
      wx.showModal({
        title: '提示',
        content: '开启长者模式？',
        success: function (res) {
          if (res.confirm) {
            app.globalData.switchOldMode = true
            //刷新，重回当前页面
            const pages = getCurrentPages()
            const prepage = pages[pages.length - 1]
            {
              wx.reLaunch({
                url: '/' + prepage.route
              })
            }
            wx.showToast({
              title: '开启成功',
              duration: 1500
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '关闭长者模式？',
        success: function (res) {
          if (res.confirm) {
            app.globalData.switchOldMode = false
            //刷新，重回当前页面
            const pages = getCurrentPages()
            const prepage = pages[pages.length - 1]
            {
              wx.reLaunch({
                url: '/' + prepage.route
              })
            }
            wx.showToast({
              title: '关闭成功',
              duration: 1500
            })
          }
        }
      })
    }

  },

  myHelp: function () {
    wx.navigateTo({
      url: '../help/help',
    })
  },

  myPublish: function () {
    if (this.data.vis) {
      wx.navigateTo({
        url: '../look1/look1',
      })
    } else {
      wx.showToast({
        title: '暂不开放',
        icon: 'error'
      })
    }
  },
  myDemand: function () {
    if (this.data.vis) {
      wx.navigateTo({
        url: '../look2/look2',
      })
    } else {
      wx.showToast({
        title: '暂不开放',
        icon: 'error'
      })
    }
  },
  myHistory: function () {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  Serve: function () {
    wx.navigateTo({
      url: '../serve/serve',
    })
  },
  Notice: function () {
    wx.navigateTo({
      url: '../notice/notice',
    })
  }
})
