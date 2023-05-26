// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'游客',
    head:'./../../images/head.jpg'
  },
  isClicktap(){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/collect/collect'
    })
  },
  isClickbiji(){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/mylist/mylist'
    })
  },
  isClickrule(){
    wx.navigateTo({
      url: '/pages/clause/clause'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.setData({
        head:app.globalData.userInfo.avatarUrl,
        userName:app.globalData.userInfo.nickName
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
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
    wx.stopPullDownRefresh();
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
  onShareTimeline() {
    
  }
})