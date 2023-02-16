// custom-tab-bar/index.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    vis: app.globalData.vis,
    duration: 300,
    position: 'bottom',
    round: false,
    overlay: true,
    overlayStyle: '',
    customStyle: 'height: 100%',
    tabList: [
      {
        "pagePath": "pages/homegood/homegood",
        "text": "首页",
      },
      {
        "pagePath": "pages/classify/classify",
        "text": "分类",
      },
      {
        "pagePath": "pages/mycollection/mycollection",
        "text": "收藏",
      },
      {
        "pagePath": "pages/person/person",
        "text": "我的",
      }
    ]
  },

  attached: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      let key = Number(e.currentTarget.dataset.index);
      let tabList = this.data.tabList;
      let selected= this.data.selected;
      
      if(selected !== key){
        this.setData({
          selected:key
        });
        wx.switchTab({
          url: `/${tabList[key].pagePath}`,
        })
      }
    },
     popup(e) {
      const position = e.currentTarget.dataset.position
      let duration = this.data.duration
      this.setData({
        position,
        show: true,
        duration
      })
     },
     onpublishdemand: function(options){
      if (app.globalData.myopenid == null) {
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
              app.globalData.hasUserInfo = true;
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
        })
      } else {
        wx.navigateTo({
          url: '../check2/check2'
        })
      }
    },
    onpublishgood: function(options){
      if (app.globalData.myopenid == null) {
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
              app.globalData.hasUserInfo = true;
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
        })
      } else {
        wx.navigateTo({
          url: '../check1/check1'
        })
      }
    },
    exit() {
      this.setData({show: false})
      // wx.navigateBack()
    },
  }
})
