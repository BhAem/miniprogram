var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    option1: [
      { text: '价格排序', value: 0 },
      { text: '升序排序', value: 1 },
      { text: '降序排序', value: 2 },
    ],
    option2: [
      { text: '看看附近', value: 'a' },
      { text: '同城好物', value: 'b' },
      { text: '同区/县好物', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
    switch1: 0,
    preswitch2: 'a',
    switch2: 'a',
    list1: [],
    list2: [],
    list: [],
    listTotal: [],
    vis: false,
    lbcolor: '#18B458',
    lcolor: 'white',
    rbcolor: 'white',
    rcolor: '#18B458',
    province: '', //省
    city: '',  //市
    district: '',
    latitude: '',
    longitude: '',
    switchOldMode: false,
    pageSize: 8,
    pageIndex: 1,
    windowHeight: 0,
    triggered: false,
    tag: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {windowHeight} = wx.getWindowInfo()
    this.setData({
      list: [],
      vis: false,
      windowHeight: windowHeight,
      tag: options.tag
    })

    if (this.data.vis == false)
      this.getDetailed('commodity', options.tag, false, false)
    else
      this.getDetailed('demand', options.tag, false, false)
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
      this.getDetailed('commodity', this.data.tag, true, true)
    else
      this.getDetailed('demand', this.data.tag, true, true)
  },

    /**
   * 上拉加载
   */
  scrolltolower() {
    this.setData({
      pageIndex: this.data.pageIndex += 1
    })
    if (this.data.vis == false)
      this.getDetailed('commodity', this.data.tag, true, true)
    else
      this.getDetailed('demand', this.data.tag, true, true)
  },

  async getDetailed(database, tag, flag1, flag2) {
    // console.log(this.data.pageIndex)
    const {result: {data}} = await wx.cloud.callFunction({
      name: 'getDetailed',
      data: {
        database: database,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        tag: tag
      }
    })
    this.setData({
      list: Array.from(new Set(this.data.list.concat(...data).map(item => JSON.stringify(item)))).map(item => JSON.parse(item)),
      triggered: false,
    })
    this.setData({
      listTotal: this.data.list
    })
    // console.log(this.data.listTotal)
    if (flag1)
      this.sortThePrice()
    if (flag2)
      this.chooseByPos()
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      switchOldMode: app.globalData.switchOldMode,
    })
  },

  sortThePrice() {
    if(this.data.switch1 != 0) {
      function sortAsc(a, b) {
        return a.price - b.price;
      }
      function sortDsc(a, b) {
        return b.price - a.price;
      }
      if (!this.data.vis) {
        var t = this.data.list;
        if (this.data.switch1 == 1) {
          t = t.sort(sortAsc)
        } 
        if (this.data.switch1 == 2) {
          t = t.sort(sortDsc)
        } 
        this.setData({
          list: t
        })
      } else {
        wx.showToast({
          title: '求购无法排序',
          duration: 1500,
          icon: 'error'
        })
      }
    }
  },

  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
    this.sortThePrice()
  },

  judge (e) {

    qqmapsdk = new QQMapWX({
      key: 'XAGBZ-XCWCF-ROJJ4-N2IT2-3ANA6-4CFQZ' 
    });
    var that = this
    wx.getSetting({  //获取用户授权设置
      success: res => {
        // console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '您不同意访问地址TT',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        }
        else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })

  },

  // 微信获得经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log("success "+JSON.stringify(res))
        var latitude = res.latitude  //纬度，范围为 -90~90，负数表示南纬
        var longitude = res.longitude  //经度，范围为 -180~180，负数表示西经
        var speed = res.speed
        var accuracy = res.accuracy;
        // console.log("latitude " + latitude + " ;longitude " + longitude)//这里获取的是经纬度
        that.getLocal(latitude, longitude) //把经纬度传给getLocal方法
      },
      fail: function (res) {
        // console.log('fail ' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) { //把经纬度转换成地理位置
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        app.globalData.province = province
        app.globalData.city = city
        app.globalData.district = district
        that.setData({ //把地理位置省市赋值给声明在data中的变量
          province: province,
          city: city,
          district: district,
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function (res) {
        // console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  chooseByPos() {

      // console.log(this.data.list)
      var t = this.data.listTotal
      var ans = []
      var myprovince = app.globalData.province
      var mycity = app.globalData.city
      var mydistrict = app.globalData.district
      if (this.data.switch2 == 'a') {
        if (this.data.preswitch2 != 'a') {
            this.setData({
              pageIndex: 1,
              list: []
            })
            this.setData({
              preswitch2: 'a'
            })
            if (!this.data.vis) {
              this.getDetailed('commodity', this.data.tag, true, false)
            } else {
              this.getDetailed('demand', this.data.tag, true, false)
            }
        }
        ans = t
      } else {
        if (this.data.switch2 == 'b') {
          for (let i = 0; i < t.length; i++) {
            if (t[i].site.province == myprovince && t[i].site.city == mycity) {
              ans.push(t[i])
            }
          }
        } 
        else if (this.data.switch2 == 'c') {
          for (let i = 0; i < t.length; i++) {
            if (t[i].site.province == myprovince && t[i].site.city == mycity && t[i].site.district == mydistrict) {
              ans.push(t[i])
            }
          }
        } 
        this.setData({
          list: ans
        })
      }

  },

  onSwitch2Change({ detail }) {
    // console.log(detail)
    this.setData({
      preswitch2: this.data.switch2, 
      switch2: detail 
    })
    // console.log(this.data.preswitch2)
    // console.log(this.data.switch2)
    this.chooseByPos()
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
    this.getDetailed('commodity', this.data.tag, true, true)
    this.setData({
      lbcolor: lbgColor,
      lcolor: lColor,
      rbcolor: rbgColor,
      rcolor: rColor,
      vis: false
    })
  },

  onhomedemand: function(options) {
    var lbgColor = this.data.lbcolor == '#18B458' ? 'white': 'white';
    var lColor = this.data.lcolor == 'white' ? '#18B458' : '#18B458';
    var rbgColor = this.data.rbcolor == 'white' ? '#18B458': '#18B458';
    var rColor = this.data.rcolor == '#18B458' ? 'white' : 'white';

    this.setData({
      pageIndex: 1,
      list: []
    })
    this.getDetailed('demand', this.data.tag, true, true)
    this.setData({
      lbcolor: lbgColor,
      lcolor: lColor,
      rbcolor: rbgColor,
      rcolor: rColor,
      vis: true
    })
  },

  ongood: function(e) {
    var idx = e.currentTarget.dataset.index;
    if (!this.data.vis) {
      var good = this.data.list[idx]
      var userInfo = {}
      db.collection('user').where({
        openid: good.openid
      }).get().then(res1 => {
        good = JSON.stringify(good)
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    } else {
      var good = this.data.list[idx]
      var userInfo = {}
      db.collection('user').where({
        openid: good.openid
      }).get().then(res1 => {
        good = JSON.stringify(good)
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
  }

});
