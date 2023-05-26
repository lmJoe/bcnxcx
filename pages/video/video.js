// pages/home/home.js
const app = getApp();
let leftHeight = 0, rightHeight = 0; //分别定义左右两边的高度
let query;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImgs:[
    ],
    navImgs:[
    ],
    infolist:[],
    motto: 'Hello World',
    userInfo: {},
    pageIndex:1,
    hasUserInfo: false,
    imgWidth:0,imgHeight:0,
    leftList: [],
    rightList: [],
    totalPages:1,
    list: [

    ],
    isdel:false,
    newlist:[],
    videoLink:'',
    playindex:-1,
    likeids:[]
  },
  clickTaps(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id
    });
  },
  closetip(){
    this.setData({
      isdel: !this.data.isdel,
    })
  },
  addflow(){
    var path = 'https://mp.weixin.qq.com/s/UaS-s6qeX1ahfBdvDNuFVg';
    wx.navigateTo({
      url:'/pages/browse/browse?url='+path
    });
  },
  getmylikes(){
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.apiUrl+'/sp/my/likes',
      method:'post',
      header: {
        'token': token
      },
      success: function(res) {
        var data = res.data;
        if(data.code == 1){
          var items = data.body.items;
          for(let i=0;i<items.length;i++){
            that.data.likeids.push(items[i].postId);
          }
        }
        that.getListdata();

      }
    })
  },
  bindViewTap(e){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    var id = e.currentTarget.dataset.id; 
    var index = e.currentTarget.dataset.index; 
    var token = wx.getStorageSync('token')
    var that = this;
    var postdata = that.data.list;
    postdata[index].collected=!postdata[index].collected
   that.setData({
    list: postdata
  })
    wx.request({
      url: app.globalData.apiUrl+'/sp/post/like',
      method:'post',
      header: {
        'token': token
      },
      data:{
        id:id
      },
      success: function(res) {
        var data = res.data;
        if(data.code == 1){

        }
      }
    })
  },
  gotoTv(e){
    var url = e.currentTarget.dataset.url;
    var key = e.currentTarget.dataset.key;
    this.videoContext = wx.createVideoContext('videoId'+key)
    this.setData({
      playindex:key,
      videoLink: url	//获取视频连接
    })
    var that = this;

    setTimeout(function() {
      that.videoContext.play()
    }, 500)
    this.videoContext.requestFullScreen()

},
closetip(){
  this.setData({
    isdel: !this.data.isdel,
  })
},
gototag(e){
  var tagid = e.currentTarget.dataset.id;
  var title = e.currentTarget.dataset.title;

  wx.navigateTo({
    url: '/pages/tagvideos/tagvideos?tagid='+tagid+'&title='+title
  });
},
leaveVideo: function() {
  this.videoContext.pause()
  this.setData({
    videoLink: null
  })
},
  jumpList(e){
    var path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url:path
    });
  },
  getListdata(){
    var that = this;
    var token = wx.getStorageSync('token')

    wx.request({
      url: app.globalData.apiUrl+'/sp/post/videos',
      header: {
        'token': token
      },
      data:{
        pageIndex:this.data.pageIndex,
        pageSize:10,
      },
      method:'POST',
      success: function(res) {
      let pagelist = that.data.list

        var data = res.data.body;
        if(res.data.code == 1){
          // var bannerImgs = data.banner;
          // var navImgs = data.menus;
          // var infolist = data.projects;
          // that.setData({
          //   bannerImgs,
          //   navImgs,
          //   infolist
          // })
          var getitmes = res.data.body.items;
          for(let i=0;i<getitmes.length;i++){
            if(that.data.likeids.indexOf(getitmes[i].id)>0){
              getitmes[i].collected = true;
            }else{
              getitmes[i].collected = false;

            }
          } 
          pagelist.push(...getitmes)
          that.setData({
            list: pagelist,
            totalPages:res.data.body.totalPages,
            newlist:res.data.body.items
            // pageIndex: this.data.pageIndex + 1
          })

        }else if(res.data.code == -2){
          wx.switchTab({
            url:'/pages/mine/mine'
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmylikes()
    // this.getListdata();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.videoContext = wx.createVideoContext('videoId')
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
    this.setData({
      pageIndex: 1
    })
    this.setData({
      list: [],
      totalPages:0,
    })
    this.getListdata();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.totalPages==this.data.pageIndex){
      return;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.getListdata()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let title = options.target.dataset.title;
    let pic = options.target.dataset.pic;
    let id = options.target.dataset.id;

    return {
      title: title,
      desc:title,
      path: '/pages/detail/detail?id='+id,
      imageUrl:'http://'+pic,
      }
  },
  onShareTimeline() {
    
  }
})