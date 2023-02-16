// pages/check2/check2.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
import { areaList } from '../../miniprogram_npm/@vant/area-data/area-data';
var Ttime  = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduction:"",
    fileList: [],
    value: '',
    tabIndex: 0,
    chan: [],
    height: 1208,
    show: false,
    areaList,
    province: "",
    city: "",
    district: "",
    address: "",
    chosenTag: '',
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    title: "",
    content: "",
    _id: "",
    flag: false,
    phone: "",
    showPage: false,
    vis: app.globalData.vis
  },

  tap(){
    this.setData({
      showPage: true
    });
  },

  tap1() {
    this.setData({
      showPage: false
    })
  },

  showPopup() {
    this.setData({ show: true });
  },

  onConfirm(value, index) {
    // console.log(value)
    let ads = value.detail.values
    this.setData({
      province: ads[0].name,
      city: ads[1].name,
      district: ads[2].name,
      address: ads[0].name + ads[1].name + ads[2].name,
      show: false
    })
    // console.log(this.data.address)
    },

  onClose() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    if (options.obj != null) {
      var obj = JSON.parse(options.obj)
      var province = obj.site.province;
      var city = obj.site.city;
      var district = obj.site.district;
      var address = province + " " + city + " " + district;
      var chosenTag = obj.tag;
      var imgbox = obj.img;
      var title = obj.title;
      var content = obj.content;
      var _id = obj._id;
      var phone = obj.phone;
      if (imgbox.length >= 4 && imgbox.length < 8) {
        this.setData({
          height: 1208+155
        })
      }
      else if (imgbox.length >=8) {
        this.setData({
          height: 1208+155*2
        })
      }
      this.setData({
        province: province,
        city: city,
        district: district,
        address: address,
        chosenTag: chosenTag,
        imgbox: imgbox,
        title: title,
        content: content,
        _id: _id,
        phone: phone
      })
    }
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
        chosenTag: e.currentTarget.id,
        showPage: false
      })
    },
  
    // 删除照片 &&
    imgDelete1: function (e) {
      let that = this;
      let index = e.currentTarget.dataset.deindex;
      let imgbox = this.data.imgbox;
      imgbox.splice(index, 1) //删除数据
      if(imgbox.length < 4)
      {
        that.setData({
          height: 1208
        })
      }
      else if (imgbox.length >= 4 && imgbox.length < 8) {
        that.setData({
          height: 1208+155
        })
      }
      else if (imgbox.length >=8) {
        that.setData({
          height: 1208+155*2
        })
      }
      that.setData({
        imgbox: imgbox
      });
    },
  
    previewImage: function (e) {
      var that = this;
      var dataid = e.currentTarget.dataset.id;
      var imageList = that.data.imgbox;
      wx.previewImage({
        current: imageList[dataid],
        urls: this.data.imgbox
      })
    },
  
    // 选择图片 &&&
    addPic1: function (e) {
      var imgbox = this.data.imgbox;
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 指定是原图还是压缩图
        sourceType: ['album', 'camera'], // 指定来源是相册还是相机
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为image标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          if (imgbox.length == 0) {
            imgbox = tempFilePaths
          } else {
            imgbox = imgbox.concat(tempFilePaths);
          }
          if (imgbox.length >= 4 && imgbox.length < 8) {
            that.setData({
              height: 1208+155
            })
          }
          else if (imgbox.length >=8) {
            that.setData({
              height: 1208+155*2
            })
          }
          that.setData({
            imgbox: imgbox
          });
        }
      })
    },
  
    //图片
    imgbox: function (e) {
      this.setData({
        imgbox: e.detail.value
      })
    },
    //提交表单进数据库
    btnSub(res1) {
      // console.log(this.data.province)
      // console.log(this.data._id)      
      db.collection('demand').doc(this.data._id).get().then(
        res2 => {
          wx.showLoading({
            title: '修改中',
          })
        var promiseArr = []
        //一张张上传 遍历临时的图片数组
        for (let i = 0; i < this.data.imgbox.length; i++) {
          let filePath = this.data.imgbox[i]
          var str = filePath[0]
          // console.log(str)
          if (str != 'c') {
            //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
            promiseArr.push(new Promise((resolve, reject) => {
              let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
              wx.cloud.uploadFile({
                cloudPath: new Date().getTime()+ i.toString() + suffix,
                filePath: filePath, // 文件路径
              }).then(res3 => {
                // console.log(res3.fileID\
                resolve(res3)
                this.setData({
                  fileIDs: this.data.fileIDs.concat(res3.fileID)
                })
              }).catch(error => {
                reject(error)
                // console.log(error)
              })
            }))
          } else {
            this.setData({
              fileIDs: this.data.fileIDs.concat(filePath)
            })
          }
        }
        Promise.all(promiseArr).then(res4 => {
          var openid = app.globalData.myopenid;
          var tag = res1.detail.value.tag;
          var title = res1.detail.value.title;
          var content = res1.detail.value.content;
          var phone = res1.detail.value.phone;
          var province = this.data.province;
          var city = this.data.city;
          var district = this.data.district;
          var site = {"province": province, "city": city, "district": district};
          var timestamp  = new Date().getTime()
          var times = Ttime.formatTime(timestamp,'Y/M/D h:m:s')
          if (openid == null) {
            wx.showToast({
              title: '请先登录',
              icon: 'error',
            })
          } else if (tag == "") {
            wx.showToast({
              title: '请选择标签',
              icon: 'error',
            })
          } else if (title == "") {
            wx.showToast({
              title: '请输入商品名称',
              icon: 'error',
            })
          } else if (province == "" || city == "" || district == "") {
            wx.showToast({
              title: '请选择地址',
              icon: 'error',
            })
          } else if (phone == "") {
            wx.showToast({
              title: '请输入电话',
              icon: 'error',
            })
          } else {
            let imgs = this.data.fileIDs
            if (this.data.fileIDs.length == 0) {
                imgs = ['cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/nopic.png']
            }
            wx.cloud.callFunction({
              name: 'editDemand',
              data: {
                _id: this.data._id,
                openid: app.globalData.myopenid,
                tag: tag,
                title: title,
                content: content,
                site: site,
                img: imgs,
                time: times,
                phone: phone
              }
            }).then(res5 => {
              wx.hideLoading()
              wx.showToast({
                title: '修改成功',
                duration: 1500
              })
              setTimeout(function() {
                wx.navigateBack()
              }, 700)
            }).catch(err => {})
          }
        })
      }).catch(
        err => {
          wx.showLoading({
            title: '提交中',
          })  
          var promiseArr = []
          //一张张上传 遍历临时的图片数组
          for (let i = 0; i < this.data.imgbox.length; i++) {
            let filePath = this.data.imgbox[i]
            var str = filePath[0]
            // console.log(str)
            if (str != 'c') {
              //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
              promiseArr.push(new Promise((resolve, reject) => {
                let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
                wx.cloud.uploadFile({
                  cloudPath: new Date().getTime()+ i.toString() + suffix,
                  filePath: filePath, // 文件路径
                }).then(res3 => {
                  // console.log(res3.fileID)
                  resolve(res3)
                  this.setData({
                    fileIDs: this.data.fileIDs.concat(res3.fileID)
                  })
                }).catch(error => {
                  reject(error)
                  // console.log(error)
                })
              }))
            } else {
              this.setData({
                fileIDs: this.data.fileIDs.concat(filePath)
              })
            }
          }
          Promise.all(promiseArr).then(res4 => {
            var openid = app.globalData.myopenid;
            var tag = res1.detail.value.tag;
            var title = res1.detail.value.title;
            var content = res1.detail.value.content;
            var phone = res1.detail.value.phone;
            var province = this.data.province;
            var city = this.data.city;
            var district = this.data.district;
            var site = {"province": province, "city": city, "district": district};
            var timestamp  = new Date().getTime()
            // console.log(timestamp)
            var times = Ttime.formatTime(timestamp,'Y/M/D h:m:s')
            // console.log(times)

            if (openid == null) {
              wx.showToast({
                title: '请先登录',
                icon: 'error',
              })
            } else if (tag == "") {
              wx.showToast({
                title: '请选择标签',
                icon: 'error',
              })
            } else if (title == "") {
              wx.showToast({
                title: '请输入商品名称',
                icon: 'error',
              })
            } else if (province == "" || city == "" || district == "") {
              wx.showToast({
                title: '请选择地址',
                icon: 'error',
              })
            } else if (phone == "")  {
              wx.showToast({
                title: '请输入电话',
                icon: 'error',
              })
            } else {
                let imgs = this.data.fileIDs
                if (this.data.fileIDs.length == 0) {
                    imgs = ['cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/imags/nopic.png']
                }
                wx.cloud.callFunction({
                  name: 'addDemand',
                  data: {
                    openid: app.globalData.myopenid,
                    tag: tag,
                    title: title,
                    content: content,
                    site: site,
                    img: imgs,
                    time: times,
                    phone: phone
                  }
                }).then(res5 => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '发布成功',
                    duration: 1500
                  })
                  setTimeout(function() {
                    wx.reLaunch({
                      url: '../../pages/homegood/homegood'
                    })
                  }, 700)
                }).catch(err => {})
            }
          })
        }
      )
  },
  



})