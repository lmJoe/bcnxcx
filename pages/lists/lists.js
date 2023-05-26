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
    list:[
    ],
    type:1,
    infolist:[],
    isshow:false,
    phone:'',
    password:'',
    index:0,
    showphone:false,
    flat:false,
  },
  clickTaps(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/topic/topic?id='+id+'&title='+title
    });
  },
  clickTaps1(e){
    var path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
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
    this.getListdata();
  },
  clickChange(e){
    var id = e.currentTarget.dataset.id;
    if(id==2&&!wx.getStorageSync('phone')){
      this.setData({
        isshow: true
      })
      return;
    }else{
      this.setData({
        type: id
      })
    }
  },
  getListdata(){
    var that = this;
    var sessionId = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.apiUrl+'/sp/home/index',
      header: {
        'token': sessionId
      },
      method:'POST',
      success: function(res) {
        console.log(res)
        var data = res.data.body;
        if(res.data.code == 1){
          var infolist = data.projects;
          that.setData({
            infolist:infolist
          })
        }else if(res.data.code == -2){
          wx.switchTab({
            url:'/pages/mine/mine'
          });
        }else if(res.data.code == -1){
          wx.navigateTo({
            url:'/pages/login/login'
          });
        }
      }
    })
  },
  getProjectlist(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/topic/list',
      method:'post',
      data:{
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
  watchphonevalue:function(e){
    var phone = e.detail.value;
    this.setData({
      phone: phone,
    })
  },
  watchpasswordvalue:function(e){
    var password = e.detail.value;
    this.setData({
      password: password,
    })
  },
  zanbubind(){
    this.setData({
      isshow: false,
      showphone:false,
      flat:false
    })
  },
  confirmbind(){
  //   if(!(/^1[3456789]\d{9}$/.test(this.data.phone))){ 
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '手机号不合法',
  //       success: function(res) {
  //       if (res.confirm) {
  //       } else if (res.cancel) {
  //       }
  //       }
  //       })
  //     return false; 
  // }
  var that = this;
  wx.request({
    url: app.globalData.apiUrl+'/sp/user/login', 
    method:'post',
    data: {
      userName:this.data.phone,
      pass:this.data.password
    },
    success: function(res) {
      console.log(res)
      if(res.data.code == 1){
        wx.setStorage({
          key: 'phone',
          data: that.data.phone,
          success: function (data) {
          }
        })
        wx.setStorage({
          key: 'password',
          data: that.data.password,
          success: function (data) {
  
          }
        }) 
        that.setData({
          isshow: false,
          showphone:false,
          flat:false
        })
        wx.showToast({
          title: '绑定成功',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '账号密码不匹配',
          icon: 'none',
          duration: 2000
        })
      }      
    }
  }) 

  },
  zanbu:function(e){
    let data = e.currentTarget.dataset
    let index = data.index;
    this.data.isshow = false;
    this.setData({
      isshow: false,
      showphone:false,
      flat:false
    })
  },
  binddata(){
    this.setData({
      isshow: false,
      showphone:true
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
        selected: 3
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
    this.getProjectlist();
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