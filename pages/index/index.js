//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
  },
  //事件处理函数
  bindViewTap: function(e) {
    var path = e.currentTarget.dataset.path;
    console.log(path)
    wx.navigateTo({
      url:'/pages/browse/browse?url='+path
    });
  },
  onLoad: function () {
    this.getactivetlist();
  },
  getactivetlist(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/activity/list',
      method:'GET',
      success: function(res) {
        var data = res.data;
        if(data.code == 1){
          var list = data.body.items;
          that.setData({
            list:list,
          })
        }
      }
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
    this.getactivetlist();
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
