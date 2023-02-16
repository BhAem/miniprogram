// pages/good/good.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    avatarUrl: "https://pic.imgdb.cn/item/6283016e0947543129825fc5.jpg",
    nickname: "null",
    position: "",  //该账户现在所在位置
    address: "",      //商品所在位置
    active: 0,
    star0:"star-o",
    star:"star",
    good: {},
    _id: "",
    collect_flag: false,
    phone: "",
    switchOldMode: false,
    options_obj: "",
    options_user: "",
    vis2: app.globalData.vis
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var time = util.formatTime(new Date())
    this.setData({
      options_obj: options.obj,
      options_user: options.user
    })
    var obj = JSON.parse(options.obj)
    var user = JSON.parse(options.user)
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)

    if (app.globalData.myopenid != null) {
      // console.log(app.globalData.myopenid)
      db.collection('collection').where({
        _openid: app.globalData.myopenid
      }).get().then(
        res => {
          for (let i = 0; i < res.data[0].c_id.length; i++) {
            if (res.data[0].c_id[i]._id == obj._id) {
              this.setData({
                collect_flag: true
              })
              break
            }
          }
        }
      ).catch(err => {})

      db.collection('record').where({
        _openid: app.globalData.myopenid
      }).update({
        data: {
          history: _.push(
            [{
              "DB": "commodity",
              "_id": obj._id,
              "time": time
            }]
          )
        }
      })

    }

    var position = user.userInfo.province + " " + user.userInfo.city;
    this.setData({
      avatarUrl: user.userInfo.avatarUrl,
      nickname: user.userInfo.nickName,
      position: position
    })

    var province = obj.site.province;
    var city = obj.site.city;
    var district = obj.site.district;
    var address = province + " " + city + " " + district;
    var phone = obj.phone
    this.setData({
      good: obj,
      imgUrls: obj.img,
      address: address,
      _id: obj._id,
      phone: phone
    })
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
    var that = this
    let url = encodeURIComponent('../../pages/good/good?obj=' + this.data.options_obj + '&user=' + this.data.options_user);
    return {
      title: "来尝尝俺家的特产-"+that.data.good.title,
      path:'/pages/homegood/homegood?url=' + url, 
      imageUrl: that.data.imgUrls[0]
    }
  },

  collect: function(e) {

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
      if (!this.data.collect_flag) {
        this.setData({collect_flag: true})
        db.collection('collection').where({
          _openid: app.globalData.myopenid
        }).update({
          data: {
            c_id: _.push(
              [{
                "DB": "commodity",
                "_id": this.data._id
              }]
            )
          }
        }) 
        wx.showToast({
          title: '收藏成功'
        })
      } else {
        this.setData({collect_flag: false})
        db.collection('collection').where({
          _openid: app.globalData.myopenid
        }).update({
          data: {
            c_id: _.pull({
              "DB": "commodity",
              "_id": this.data._id
            })
          }
        })
        wx.showToast({
          title: '取消收藏成功'
        })
      }
    }
  },

  phone() {
    // 换行无效
    var that = this;
    wx.showModal({
      title: '免责声明',
      content: "1.建议同城当面验货交易，请不要提前私下转账付款或付定金或付押金，可能会被拉黑物财两空；私下交易转账付款造成的纠纷、损失及不法侵害本平台概不负责。"
     + "\r\n 2.本微信小程序平台不支持用户间在线交易，也不参与用户间资金交易，对资金损失概不负责。",
     success (res) {
      if (res.confirm) {
        // console.log('用户点击确定')
        wx.showModal({
          title: '联系电话',
          content: that.data.phone,
          showCancel: true,
          confirmText: '复制电话',
          success(res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: that.data.phone,
                success(res) {
                  wx.getClipboardData({
                    success(res) {
                      // console.log(res.data) // data
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
    })
  },

  previewImage: function (e) {
    var that = this;
    var dataid = e.currentTarget.dataset.index;
    var imageList = that.data.imgUrls;
    wx.previewImage({
      current: imageList[dataid],
      urls: this.data.imgUrls
    })
  },
  
})