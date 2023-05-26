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
    title:'',
    list:[
    ]
  },
  clickTaps(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var pageid = options.id;
    var title = options.title;

    this.setData({
      pageid:pageid,
      title:title,
    });
    this.getProjectlist();
  },
  getProjectlist(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/topic/detail',
      method:'GET',
      data:{
        topicId:this.data.pageid
      },
      success: function(res) {
        console.log(res)
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