//app.js
var util = require('./utils/utils.js');
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      hasUserInfo:false,
      userInfo:{},
      user:{},
      myopenid: null,
      tabbarHeight: 0,
      screenWidth: 0,
      screenHeight: 0,
      switchOldMode: false,
      vis: false
    }

    var h1 = Date.parse(util.formatTime(new Date()))
    var h2 = Date.parse(util.formatTime('2022-07-15 10:00:00'))
    if (h1 > h2) { this.globalData.vis = true }

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.tabbarHeight = (e.screenHeight - e.screenHeight - e.statusBarHeight ) * e.pixelRatio *(-1)
        this.globalData.screenWidth = e.screenWidth
        this.globalData.screenHeight = e.screenHeight
      }
    })
  },
})
