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
    tagid:0,
    tagtitle:''
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
  jumpList(e){
    var path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url:'/pages/browse/browse?url='+path
    });
  },
  getListdata(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/my/likes',
      header: {
        'token': wx.getStorageSync('token')
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
          pagelist.push(...res.data.body.items)
          console.log(pagelist)
          that.setData({
            list: pagelist,
            totalPages:res.data.body.totalPages,
            newlist:res.data.body.items
            // pageIndex: this.data.pageIndex + 1
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListdata();
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
      leftList:[],
      rightList:[],
      list:[]
    })
    this.getListdata();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    // if(this.data.totalPages==this.data.pageIndex){
    //   return;
    // }
    // this.setData({
    //   pageIndex: this.data.pageIndex + 1
    // })
    // this.getListdata()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onShareTimeline() {
    
  }
})