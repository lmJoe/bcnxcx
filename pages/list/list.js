// pages/list/list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageid:0,
    imgCover:1,
    className:'',
    list:[]
  },
  clickTaps(e){
    var id = e.currentTarget.dataset.id;
    var views = e.currentTarget.dataset.views;
    console.log(id)
    wx.navigateTo({
      url: '/pages/adetail/adetail?id='+id+'&views='+views
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var pageid = options.id;
    this.setData({
      pageid:pageid
    });
    this.getProjectlist();
  },
  getProjectlist(){
    var that = this;
    var sessionId = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.apiUrl+'/sp/project/get',
      method:'GET',
      data:{
        id:that.data.pageid
      },
      header: {
        'token': sessionId
      },
      success: function(res) {
        console.log(res)
        var data = res.data;
        if(data.code == 1){
          var imcover = data.body.cover;
          var list = data.body.items;
          var name = data.body.name
          console.log(imcover,list)
          that.setData({
            imgCover:imcover,
            list:list,
            className:name
          })
        }else if(res.data.code == -1){
          wx.navigateTo({
            url:'/pages/login/login'
          });
        }
      }
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