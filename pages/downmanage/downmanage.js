// pages/downmanage/downmanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth:100,
    data:[{title:'1、 皮肤的真皮层.pdf',right:0},
    {title:'1、 皮肤的真皮层.pdf',right:0},
    {title:'1、 皮肤的真皮层.pdf',right:0},
    {title:'1、 皮肤的真皮层.pdf',right:0}],
    isScroll:true,
    windowWidth:0,
    windowHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    });
    this.getFileslist();
  },
  getFileslist(){
    var value = wx.getStorageSync('Filslist');
    console.log(value)
    if(value){
      var data = JSON.parse(value);
      console.log(data)
      this.setData({data})
    }else{

    }
  },
  drawStart: function (e) {
    console.log("drawStart");  
    var touch = e.touches[0]

    for (var index in this.data.data) {
      var item = this.data.data[index]
      item.right = 0
    }
    this.setData({
      data: this.data.data,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.data[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX;
    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        data: this.data.data
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data
      })
    }
  },
  drawEnd: function (e) {
    var item = this.data.data[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        data: this.data.data,
      })
    }
  },
  openFiles(e){
    console.log(11)
    var file = e.currentTarget.dataset.file;
    console.log(file)
    wx.openDocument({
      filePath: file,
      success: function (res) {
        console.log('成功')
      },fail(err){
        console.log(err)
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