// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getUserProfile:function(){
    var that = this;
    wx.getUserProfile({
      desc: '获取用户昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success:(res)=>{
        // console.log(JSON.parse(res.rawData))
        var rawData = JSON.parse(res.rawData);
        wx.setStorage({
          key: 'nick',
          data: rawData.nickName,
          success: function (data) {
            wx.login({
              success: res => {
                
                app.globalData.userCode = res.code;
               that.getUserconnectdata(rawData.nickName);
              }
            })
          }
        }) 
      }
    });
  },
  getUserconnectdata(nickName){
    wx.request({
      url: app.globalData.apiUrl+'/sp/user/connect?code='+app.globalData.userCode, 
      method:'post',
      data: {
        code:app.globalData.userCode,
        nick:nickName
      },
      success: function(res) {
        debugger
        wx.setStorage({
          key: 'token',
          data: res.data.body.token,
          success: function (data) {
            wx.navigateBack({
              delta: 1,  // 返回上一级页面。
              success: function() {
                  console.log('成功！')
              }
            })
          }
        })        
      }
    })
  },
  setvalueName(e){
    var name = e.detail.value;
    this.setData({
      userName:name
    })
  },
  setvaluePass(e){
    var pass = e.detail.value;
    this.setData({
      paddWord:pass
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUserconnectdata();
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
  onShareTimeline() {
    
  }
})