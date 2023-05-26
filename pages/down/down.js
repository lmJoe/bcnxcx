// pages/down/down.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageid:0,
    isDown: false,
    percent: 0,
    downlist:[],
    selectfiles:0,
    isAll:false,
    fileslist:[]
  },
  getdatalist(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/course/get',
      method:'GET',
      data:{
        id:this.data.pageid
      },
      success: function(res) {
        console.log(res)
        var data = res.data;
        if(res.data.code == 1){
          var arrs = data.body;
          for(var i=0;i<arrs.items.length;i++){
            arrs.items[i].sele = false;
            arrs.items[i].down = false;
            arrs.items[i].progress = 0;
          }
          that.setData({
            downlist:arrs.items
          });
        }
      }
    });
  },
  isClickdown(){
    wx.navigateTo({
      url:'/pages/downmanage/downmanage'
    });
  },
  isSelect(e){
    var idx = e.currentTarget.dataset.idx;
    var data = e.currentTarget.dataset.data;
    this.data.downlist[idx].sele = !this.data.downlist[idx].sele;
    if(!this.data.downlist[idx].sele){
      this.data.isAll = false;
    }
    var flies = this.data.downlist.filter(res=>{return res.sele});
    flies = flies.length;
    this.setData({
      downlist:this.data.downlist,
      isAll:this.data.isAll,
      selectfiles:flies
    })
  },
  isAllselect(){
    this.data.isAll = !this.data.isAll;
    var data = this.data.downlist;
    var files = 0;
    for(var i=0;i<data.length;i++){
      if(this.data.isAll){
        data[i].sele = true;
        files = data.length;
      }else{
        data[i].sele = false;
        files = 0
      }
    }
    this.setData({
      downlist:data,
      isAll:this.data.isAll,
      selectfiles:files
    })
  },
  handleDownload(e){
    var that = this;
    class newfiles{
      init(index,data){
        wx.downloadFile({
          url:'https://'+data[index].resource,
          success:function (res) {
            console.log(res)
            var path = res.tempFilePath
            // wx.saveFile({
            //   tempFilePath: path,
            //   success(res) {
            //     var savedFilePath = res.savedFilePath;
            //   }
            // })
            var item = {
              url:path,
              title:data[index].title,
              extension:data[index].extension
            }
              var value = wx.getStorageSync('Filslist')
              if (value) {
                var newarr = JSON.parse(value);
                newarr.push(item);
              }else{
                var newarr = [];
                newarr.push(item);
              }
              var filesdata = JSON.stringify(newarr);
              try {
                console.log('设置数据')
                wx.setStorageSync('Filslist', filesdata)
              } catch (e) { }
            wx.showToast({
              title: '下载完成',
              icon: 'success',
              duration: 2000
            })
            that.data.downlist[index].down = false;
          },
          fail:function(e){
            console.log(e)
          }
        }).onProgressUpdate((res) => {
          that.data.downlist[index].progress = res.progress;
          that.setData({
            downlist:that.data.downlist
          });
        })
      }
    }
    var data = this.data.downlist;
    for(var i=0;i<data.length;i++){
      if(data[i].sele && data[i].down == false){
        var index = i;
        data[i].down = true;
        new newfiles().init(index,data);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pageid = options.id;
    this.setData({pageid})
    this.getdatalist();
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