// pages/detail/detail.js
const app = getApp();
// const txvContext = requirePlugin("tencentvideo")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filelist:[],
    savelist:[],
    views:0,
    showclasslist:false,
    overImg:'',
    title:'',
    projectName:'',
    videoUrl:'',
    flies:0,//文件数
    pageid:0,
    videoid:'',
    showvideo:false
  },
  getdetaildata(){
    var that = this;
    var sessionId = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.apiUrl+'/sp/course/get',
      method:'GET',
      data:{
        id:this.data.pageid
      },
      header: {
        'token': sessionId
      },
      success: function(res) {
        console.log(res)
        var data = res.data;
        if(data.code == 1){
          var arrs = data.body;
          that.setData({
            filelist:arrs.items,
            savelist:arrs.items,
            overImg:arrs.cover,
            title:arrs.title,
            projectName:arrs.projectName,
            flies:arrs.flies,//文件数
          })
        }else if(res.data.code == -1){
          wx.navigateTo({
            url:'/pages/login/login'
          });
        }
      }
    })
  },
  isclickDown(){
    wx.navigateTo({
      url: '/pages/down/down?id='+this.data.pageid
    });
  },
  isFilereda(e){
    var that = this;
    var data = e.currentTarget.dataset;
    console.log(data);
      if(data.video == false){
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        var urls = 'https://'+data.resource;
        console.log(urls);
        wx.downloadFile({
          url: urls,
            success: function (res) {
              console.log('downloadFile', res.tempFilePath);
              const filePath = res.tempFilePath
              if(data.extension.indexOf('png')>-1 || data.extension.indexOf('jpg')>-1){
                wx.previewImage({
                  current: filePath,
                  urls: [filePath],
                  success:function(res){
                    wx.hideLoading()
                    console.log('打开图片成功')
                  }
                })
              }else{
                wx.openDocument({
                  filePath: filePath,
                  showMenu: true,
                  success: function (res) {
                    console.log(res);
                    wx.hideLoading()
                    console.log('打开文档成功')
                    wx.hideLoading()
                  },
                  fail: function (res) { 
                    console.log('打开失败',res)
                    wx.hideLoading()
                  },
                })
              }
            },
            fail:function(res){
              wx.hideLoading()
              console.log(res)
            }
          })
        }else{
          var videoid = data.resource
          console.log('视频',videoid)
          this.setData({
            videoid:videoid,
            showvideo:true
          })
        }
  },
  isChildsfile(e){
    var that = this;
    var data = e.currentTarget.dataset;
    var childs = data.childs;
    if(childs.length>0){
      that.setData({
        filelist:childs,
        showclasslist:true
      })
    }
  },
  backClasslist(){
    var list = this.data.savelist;
    this.setData({
      filelist:list,
      showclasslist:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageid:options.id,
      views:options.views
    })
    this.getdetaildata();
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