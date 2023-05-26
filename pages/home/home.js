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
    list1: [

    ],
    isdel:false,
    newlist:[],
    newlist1:[],
    type:1,
    pageIndex1:1,
    totalPages1:1,
    videoLink:'',
    playindex:-1,
    likeids:[],
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
  jumpList(e){
    var path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url:'/pages/browse/browse?url='+path
    });
  },
  addflow(){
    var path = 'https://mp.weixin.qq.com/s/UaS-s6qeX1ahfBdvDNuFVg';
    wx.navigateTo({
      url:'/pages/browse/browse?url='+path
    });
  },
  getListdata(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/post/articles',
      header: {
        'token': app.globalData.userCode
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
          pagelist.push(...res.data.body.items)
          that.setData({
            list: pagelist,
            totalPages:res.data.body.totalPages,
            newlist:res.data.body.items
          })
          that.isLeft();

        }else if(res.data.code == -1){
          wx.switchTab({
            url:'/pages/login/login'
          });
        }
      }
    })
  },
  clickChange(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      type: id
    })
  },
  bindViewTap1(e){
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
    var postdata = that.data.list1;
    postdata[index].collected=!postdata[index].collected
   that.setData({
    list1: postdata
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
  bindViewTap(e){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    var id = e.currentTarget.dataset.id; 
    var index = e.currentTarget.dataset.index; 
    var type = e.currentTarget.dataset.type; 
    var token = wx.getStorageSync('token')
    var that = this;
    if(type=='1'){
      var postdata = that.data.leftList;
    postdata[index].likes=postdata[index].collected?postdata[index].likes-1:postdata[index].likes+1;
    postdata[index].collected=!postdata[index].collected;
    that.setData({
      leftList: postdata
    })
    }
    if(type=='2'){
      var postdata = that.data.rightList;
    postdata[index].likes=postdata[index].collected?postdata[index].likes-1:postdata[index].likes+1;
    postdata[index].collected=!postdata[index].collected;
    that.setData({
      rightList: postdata
    })
    }

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
  getBannerdata(){
    var that = this;
    var token = wx.getStorageSync('token')

    wx.request({
      url: app.globalData.apiUrl+'/sp/post/banner',
      header: {
        'token': token
      },
      data:{
      },
      method:'POST',
      success: function(res) {
        if(res.data.code == 1){
          that.setData({
            bannerImgs: res.data.body.items,
          })
        }else if(res.data.code == -1){
          wx.switchTab({
            url:'/pages/login/login'
          });
        }
      }
    })
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
        that.getvideoListdata();

      }
    })
  },
  getvideoListdata(){
    var that = this;
    var token = wx.getStorageSync('token')

    wx.request({
      url: app.globalData.apiUrl+'/sp/post/videos',
      header: {
        'token': token
      },
      data:{
        pageIndex:this.data.pageIndex1,
        pageSize:10,
      },
      method:'POST',
      success: function(res) {
      let pagelist1 = that.data.list1

        var data = res.data.body;
        if(res.data.code == 1){
          var getitmes = res.data.body.items;
          for(let i=0;i<getitmes.length;i++){
            if(that.data.likeids.indexOf(getitmes[i].id)>0){
              getitmes[i].collected = true;
            }else{
              getitmes[i].collected = false;

            }
          } 
          pagelist1.push(...getitmes)
          that.setData({
            list1: pagelist1,
            totalPages1:res.data.body.totalPages,
            newlist1:res.data.body.items
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
    this.getListdata();
    this.getBannerdata();
    this.getmylikes();
  },
  async isLeft() {
    const { list, leftList, rightList,newlist } = this.data;
    query = wx.createSelectorQuery();
    for (const item of newlist) {
     leftHeight <= rightHeight ? leftList.push(item) : rightList.push(item); //判断两边高度，来觉得添加到那边
     await this.getBoxHeight(leftList, rightList);
    }
   },
   getBoxHeight(leftList, rightList) { //获取左右两边高度
    return new Promise((resolve, reject) => {
     this.setData({ leftList, rightList }, () => {
      query.select('#left').boundingClientRect();
      query.select('#right').boundingClientRect();
      query.exec((res) => {
       leftHeight = res[0].height; //获取左边列表的高度
       rightHeight = res[1].height; //获取右边列表的高度
       resolve();
      });
     });
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
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
    this.setData({
      pageIndex: 1,
      totalPages:0,
      list:[],
      type:1
    })
    this.getBannerdata();
    this.getListdata();
    this.getmylikes();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.type)
    if(this.data.type==1){
      if(this.data.totalPages==this.data.pageIndex){
        return;
      }
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getListdata()
    }
    if(this.data.type==2){
      if(this.data.totalPages1==this.data.pageIndex1){
        return;
      }
      this.setData({
        pageIndex1: this.data.pageIndex1 + 1
      })
      this.getvideoListdata()
    }
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