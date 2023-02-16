// pages/homegood/homegood.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: [
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a46d.png",
        "page":"../swiper_laws/swiper_laws"
      },
      {
        "url":"https://pic.imgdb.cn/item/627f515409475431292589ef.png",
        "page":"../swiper_teach/swiper_teach"
      },
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a4ab.png",
        "page":"../swiper_rules/swiper_rules"
      }
    ],
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    lbcolor: '#18B458',
    lcolor: 'white',
    rbcolor: 'white',
    rcolor: '#18B458',
    list: [],
    vis: false,
    tabbarHeight: 0,
    margin: 0,
    switchOldMode: false,
    pageSize: 8,
    pageIndex: 1,
    windowHeight: 0,
    triggered: false,
    vis2: app.globalData.vis
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(options.url){
      let url = decodeURIComponent(options.url);
      wx.navigateTo({
        url
      })
    }
    const {windowHeight} = wx.getWindowInfo()
    this.setData({ 
      tabbarHeight: app.globalData.tabbarHeight,
      margin: (app.globalData.screenWidth * 750 / wx.getSystemInfoSync().windowWidth - 730),
      windowHeight: windowHeight -  app.globalData.tabbarHeight / 750 * wx.getSystemInfoSync().windowWidth,
      list: []
    })

    var img1 = [
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a46d.png",
        "page":"../swiper_laws/swiper_laws"
      },
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a46d.png",
        "page":"../swiper_teach/swiper_teach"
      },
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a46d.png",
        "page":"../swiper_rules/swiper_rules"
      }
    ]

    var img2 = [
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a46d.png",
        "page":"../swiper_laws/swiper_laws"
      },
      {
        "url":"https://pic.imgdb.cn/item/627f515409475431292589ef.png",
        "page":"../swiper_teach/swiper_teach"
      },
      {
        "url":"https://pic.imgdb.cn/item/627c8dd9094754312913a4ab.png",
        "page":"../swiper_rules/swiper_rules"
      }
    ]

    if (!this.data.vis2) {
      this.setData({ 
        img: img1
      })
    }
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
      list: []
    })
    if (this.data.vis == false)
      this.getHomeGood('commodity')
    else
      this.getHomeGood('demand')
  },

  /**
   * 上拉加载
   */
  scrolltolower() {
    this.setData({
      pageIndex: this.data.pageIndex += 1
    })
    if (this.data.vis == false)
      this.getHomeGood('commodity')
    else
      this.getHomeGood('demand')
  },

  async getHomeGood(database) {
    // console.log(this.data.pageIndex)
    const {result: {data}} = await wx.cloud.callFunction({
      name: 'getHomeGood',
      data: {
        database: database,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      }
    })
    this.setData({
      list: Array.from(new Set(this.data.list.concat(...data).map(item => JSON.stringify(item)))).map(item => JSON.parse(item)),
      triggered: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.tabBar();
    this.setData({
      pageIndex: 1,
      switchOldMode: app.globalData.switchOldMode
    })
    // db.collection('commodity').limit(this.data.pageSize).get().then(res => {
    //     // console.log(res)
    //     var t = [];
    //     for (let i = 0; i < res.data.length; i++) {
    //       t.push(res.data[i]);
    //     }
    //     this.setData({
    //       list: t
    //     })
    //   }).catch(err => {})
    if (this.data.vis == false)
      this.getHomeGood('commodity')
    else
      this.getHomeGood('demand')
  },

  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
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

  onSearch: function(event){
    wx.navigateTo({
      url: '../homesearch/homesearch'
    })
  },

  onhomegood: function(options) {
    var lbgColor = this.data.lbcolor == 'white' ? '#18B458': '#18B458';
    var lColor = this.data.lcolor == '#18B458' ? 'white' : 'white';
    var rbgColor = this.data.rbcolor == '#18B458' ? 'white': 'white';
    var rColor = this.data.rcolor == 'white' ? '#18B458' : '#18B458';

    this.setData({
      pageIndex: 1,
      list: []
    })
    this.getHomeGood('commodity')
    this.setData({
      lbcolor: lbgColor,
      lcolor: lColor,
      rbcolor: rbgColor,
      rcolor: rColor,
      vis: false
    })
  },

  onhomedemand: function(options){
    var lbgColor = this.data.lbcolor == '#18B458' ? 'white': 'white';
    var lColor = this.data.lcolor == 'white' ? '#18B458' : '#18B458';
    var rbgColor = this.data.rbcolor == 'white' ? '#18B458': '#18B458';
    var rColor = this.data.rcolor == '#18B458' ? 'white' : 'white';

    this.setData({
      pageIndex: 1,
      list: []
    })
    this.getHomeGood('demand')
    this.setData({
      lbcolor: lbgColor,
      lcolor: lColor,
      rbcolor: rbgColor,
      rcolor: rColor,
      vis: true
    })
  },

  ongood: function(e){
    var idx = e.currentTarget.dataset.index;
    var good = {}
    var userInfo = {}
    var openid = ""
    if (!this.data.vis) {

        // console.log(res)
        var good = this.data.list[idx]
        // console.log(good)
        openid = this.data.list[idx].openid
        good = JSON.stringify(good)
        db.collection('user').where({
          openid: openid
        }).get().then(res1 => {
          userInfo = res1.data[0]
          userInfo = JSON.stringify(userInfo)
          wx.navigateTo({
            url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
          })
        }).catch(err => {})

    } else {

        var good = this.data.list[idx]
        openid = this.data.list[idx].openid
        good = JSON.stringify(good)
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

  Search: function(e) {
    wx.navigateTo({
      url: '../../pages/homesearch/homesearch',
    })
  },

  Lunbo: function(e) {
    var pages = e.currentTarget.dataset.url
    wx.navigateTo({
      url: pages
    })
  },

  onteach: function(e){
    wx.navigateTo({
      url: '../../pages/swiper_teach/swiper_teach',
    })
  }
})