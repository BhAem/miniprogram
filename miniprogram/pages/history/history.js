// pages/history/history.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    history1: [],
    history2: [],
    history3: [],
    history4: [],
    history5: [],
    history6: [],
    history7: [],
    time1: "",
    time2: "",
    time3: "",
    time4: "",
    time5: "",
    time6: "",
    time7: "",
    vis: true,
    switchOldMode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    var curtime = util.formatTime(new Date())
    var time1 = this.getDateStr(null,0)
    var time2 = this.getDateStr(null,-1)
    var time3 = this.getDateStr(null,-2)
    var time4 = this.getDateStr(null,-3)
    var time5 = this.getDateStr(null,-4)
    var time6 = this.getDateStr(null,-5)
    var time7 = this.getDateStr(null,-6)
    this.setData({
      time1: time1,
      time2: time2,
      time3: time3,
      time4: time4,
      time5: time5,
      time6: time6,
      time7: time7,
    })
    var year = curtime.substring(0,4)
    var month = curtime.substring(5,7)
    var day = curtime.substring(8,10)
    var detailTime = '23:59:59'
    var baseline = year+'-'+month+'-'+day+' '+detailTime
    var temstart=new Date(baseline.replace(/-/g, '/'));
    var toDelete = []
    var history1 = []
    var history2 = []
    var history3 = []
    var history4 = []
    var history5 = []
    var history6 = []
    var history7 = []
    if (app.globalData.myopenid != null) {
      this.setData({
        history: [],
        history1: [],
        history2: [],
        history3: [],
        history4: [],
        history5: [],
        history6: [],
        history7: [],
      })
      wx.cloud.callFunction({
        name: 'getRecord'
      }).then(res2 => {
        // console.log(res2)
        if (res2.result.length != 0) {
          this.setData({
            vis: false
          })
        }
        this.setData({
          history: res2.result
        })
        for (let i = 0; i < this.data.history.length; i++) {
          var obj = this.data.history[i];
          // console.log(obj)
          var temend=new Date(obj.time.replace(/-/g, '/'));
          var day = parseInt((temstart.getTime()-temend.getTime())/(24*3600*1000));
          // console.log(day)
          if (day == 0) {
            history1.push(obj)
          } else if (day == 1) {
            history2.push(obj)
          } else if (day == 2) {
            history3.push(obj)
          } else if (day == 3) {
            history4.push(obj)
          } else if (day == 4) {
            history5.push(obj)
          } else if (day == 5) {
            history6.push(obj)
          } else if (day == 6) {
            history7.push(obj)
          } else if (day >= 7) {
            toDelete.push(obj)
          }  
        }

        this.get1History(history1)
        this.get2History(history2)
        this.get3History(history3)
        this.get4History(history4)
        this.get5History(history5)
        this.get6History(history6)
        this.get7History(history7)

        db.collection('record').where({
          _openid: app.globalData.myopenid
        }).update({
          data: {
            history: _.pullAll(toDelete)
          }
        })
      }).catch(err => {})
    }
  },

getDateStr: function(today, addDayCount) {
  var date;
  if(today) {
    date = new Date(today);
  }else{
    date = new Date();
  }
  date.setDate(date.getDate() + addDayCount);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    if(m < 10){
      m = '0' + m;
    };
    if(d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },

  async get1History(history1) {
    for (let i = 0; i < history1.length; i++) {
      var ht = history1[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time1: strTIme
        })
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history1: this.data.history1.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history1: this.data.history1.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history1.length-1) {
        this.setData({
          history1: this.data.history1.reverse()
        })
      }
    }
  },

  async get2History(history2) {
    for (let i = 0; i < history2.length; i++) {
      var ht = history2[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var detailTime = time.substring(11)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time2: strTIme
        })
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history2: this.data.history2.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history2: this.data.history2.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history2.length-1) {
        this.setData({
          history2: this.data.history2.reverse()
        })
      }
    }
  },

  async get3History(history3) {
    for (let i = 0; i < history3.length; i++) {
      var ht = history3[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var detailTime = time.substring(11)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time3: strTIme
        })
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history3: this.data.history3.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history3: this.data.history3.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history3.length-1) {
        this.setData({
          history3: this.data.history3.reverse()
        })
      }
    }
  },

  async get4History(history4) {
    for (let i = 0; i < history4.length; i++) {
      var ht = history4[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var detailTime = time.substring(11)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time4: strTIme
        }) 
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history4: this.data.history4.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history4: this.data.history4.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history4.length-1) {
        this.setData({
          history4: this.data.history4.reverse()
        })
      }
    }
  },

  async get5History(history5) {
    for (let i = 0; i < history5.length; i++) {
      var ht = history5[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var detailTime = time.substring(11)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time5: strTIme
        })
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history5: this.data.history5.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history5: this.data.history5.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history5.length-1) {
        this.setData({
          history5: this.data.history5.reverse()
        })
      }
    }
  },

  async get6History(history6) {
    for (let i = 0; i < history6.length; i++) {
      var ht = history6[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var detailTime = time.substring(11)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time6: strTIme
        })
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history6: this.data.history6.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history6: this.data.history6.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history6.length-1) {
        this.setData({
          history6: this.data.history6.reverse()
        })
      }
    }
  },

  async get7History(history7) {
    for (let i = 0; i < history7.length; i++) {
      var ht = history7[i]
      if (i == 0) {
        var time = ht.time
        var year = time.substring(0,4)
        var month = time.substring(5,7)
        var day = time.substring(8,10)
        var detailTime = time.substring(11)
        var strTIme = year+'-'+month+'-'+day
        this.setData({
          time7: strTIme
        })
      }
      if (ht.DB == "commodity") {
        await db.collection('commodity').doc(ht._id).get().then(res2 => {
          this.setData({
            history7: this.data.history7.concat(res2.data),
          })
        }).catch(err => {})
      } else {
        await db.collection('demand').doc(ht._id).get().then(res2 => {
          this.setData({
            history7: this.data.history7.concat(res2.data),
          })
        }).catch(err => {})
      }
      if (i == history7.length-1) {
        this.setData({
          history7: this.data.history7.reverse()
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      switchOldMode: app.globalData.switchOldMode
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  showDetail1: function(e) {
    // console.log(this.data.myMandD)
    var idx = e.currentTarget.dataset.index;
    var arr = Object.keys(this.data.history1[idx])
    var cnt = 0
    var userInfo = {}
    var openid = ""
    if (arr.length == 10) {
      db.collection('commodity').get().then(res2 => {
        for (let j = 0; j < res2.data.length; j++) {
          if (res2.data[j]._id == this.data.history1[idx]._id) {
            break
          }
          cnt++
        }
        var good = res2.data[cnt]
        good = JSON.stringify(good)
        openid = res2.data[cnt].openid
        db.collection('user').where({
          openid: openid
        }).get().then(res3 => {
          userInfo = res3.data[0]
          userInfo = JSON.stringify(userInfo)
          wx.navigateTo({
            url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
          })
        }).catch(err => {})

      }).catch(err => {})
    } else {
      db.collection('demand').get().then(res2 => {
        for (let j = 0; j < res2.data.length; j++) {
          if (res2.data[j]._id == this.data.history1[idx]._id) {
            break
          }
          cnt++
        }
        var good = res2.data[cnt]
        good = JSON.stringify(good)
        openid = res2.data[cnt].openid
        db.collection('user').where({
          openid: openid
        }).get().then(res1 => {
          userInfo = res1.data[0]
          userInfo = JSON.stringify(userInfo)
          wx.navigateTo({
            url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
          })
        }).catch(err => {})
      }).catch(err => {})
    }
},

showDetail2: function(e) {
  // console.log(this.data.myMandD)
  var idx = e.currentTarget.dataset.index;
  var arr = Object.keys(this.data.history2[idx])
  var cnt = 0
  var userInfo = {}
  var openid = ""
  if (arr.length == 10) {
    db.collection('commodity').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history2[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res3 => {
        userInfo = res3.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})

    }).catch(err => {})
  } else {
    db.collection('demand').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history2[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res1 => {
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    }).catch(err => {})
  }
},

showDetail3: function(e) {
  // console.log(this.data.myMandD)
  var idx = e.currentTarget.dataset.index;
  var arr = Object.keys(this.data.history3[idx])
  var cnt = 0
  var userInfo = {}
  var openid = ""
  if (arr.length == 10) {
    db.collection('commodity').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history3[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res3 => {
        userInfo = res3.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})

    }).catch(err => {})
  } else {
    db.collection('demand').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history3[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res1 => {
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    }).catch(err => {})
  }
},

showDetail4: function(e) {
  // console.log(this.data.myMandD)
  var idx = e.currentTarget.dataset.index;
  var arr = Object.keys(this.data.history4[idx])
  var cnt = 0
  var userInfo = {}
  var openid = ""
  if (arr.length == 10) {
    db.collection('commodity').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history4[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res3 => {
        userInfo = res3.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})

    }).catch(err => {})
  } else {
    db.collection('demand').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history4[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res1 => {
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    }).catch(err => {})
  }
},

showDetail5: function(e) {
  // console.log(this.data.myMandD)
  var idx = e.currentTarget.dataset.index;
  var arr = Object.keys(this.data.history1[idx])
  var cnt = 0
  var userInfo = {}
  var openid = ""
  if (arr.length == 10) {
    db.collection('commodity').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history5[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res3 => {
        userInfo = res3.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})

    }).catch(err => {})
  } else {
    db.collection('demand').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history5[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res1 => {
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    }).catch(err => {})
  }
},

showDetail6: function(e) {
  // console.log(this.data.myMandD)
  var idx = e.currentTarget.dataset.index;
  var arr = Object.keys(this.data.history6[idx])
  var cnt = 0
  var userInfo = {}
  var openid = ""
  if (arr.length == 10) {
    db.collection('commodity').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history6[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res3 => {
        userInfo = res3.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})

    }).catch(err => {})
  } else {
    db.collection('demand').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history6[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res1 => {
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    }).catch(err => {})
  }
},

showDetail7: function(e) {
  // console.log(this.data.myMandD)
  var idx = e.currentTarget.dataset.index;
  var arr = Object.keys(this.data.history7[idx])
  var cnt = 0
  var userInfo = {}
  var openid = ""
  if (arr.length == 10) {
    db.collection('commodity').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history7[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res3 => {
        userInfo = res3.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/good/good?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})

    }).catch(err => {})
  } else {
    db.collection('demand').get().then(res2 => {
      for (let j = 0; j < res2.data.length; j++) {
        if (res2.data[j]._id == this.data.history7[idx]._id) {
          break
        }
        cnt++
      }
      var good = res2.data[cnt]
      good = JSON.stringify(good)
      openid = res2.data[cnt].openid
      db.collection('user').where({
        openid: openid
      }).get().then(res1 => {
        userInfo = res1.data[0]
        userInfo = JSON.stringify(userInfo)
        wx.navigateTo({
          url: '../../pages/demand/demand?obj=' + good + '&user=' + userInfo,
        })
      }).catch(err => {})
    }).catch(err => {})
  }
},



})