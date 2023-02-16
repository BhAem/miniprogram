// pages/swiper_rules/swiper_rules.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchOldMode: false,
    vis: app.globalData.vis,
    imageList: ["cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (1).jpg",
  "cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (2).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (3).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (4).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (5).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (6).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (7).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (8).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (9).jpg",
"cloud://cloud1-3g192wyqd9d72719.636c-cloud1-3g192wyqd9d72719-1311228133/teacher/1 (10).jpg"]
  },


  previewImage: function (e) {
    var dataid = e.currentTarget.dataset.id;
    var imageList = this.data.imageList;
    wx.previewImage({
      current: imageList[dataid],
      urls: this.data.imageList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})