// pages/browse/browse.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgeList:[],
    imgeList1:[{url:"clubr.iceground.cn//image/2021/09/12/3ahd18uraa9svus.png",id:786},{url:"clubr.iceground.cn//image/2021/09/12/3ahd1917x8nic0k.png",id:790}],
    taglist:[
      {
        id:1,
        name:'加拿大冰川泥深层清洁面膜'
      },
      {
        id:2,
        name:'冰川赋活修复水'
      },
      {
        id:3,
        name:'冰川泥生态净肤皂'
      },
      {
        id:4,
        name:'冰川赋活修复霜'
      },
    ],
    selected:[],
    selectedstr:'',
    tags:[],
    isHidden:true,
    pageid:0,
  },
  clickdel:function(e){
    let id = e.currentTarget.dataset.id;
    this.data.imgeList.splice(this.data.imgeList.findIndex(e => e.id === id), 1)
    console.log(this.data.imgeList)
    this.setData({
      imgeList:this.data.imgeList
  })
  },
  clickadd(){
    var that = this;
    var token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.apiUrl+'/sp/resource/upload',
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              file: tempFilePaths[i]
            },
            header: {
              'token': token
            },
            success: function (res) {
              wx.hideLoading();
              var data = res.data;
              if(JSON.parse(res.data).code == 1){
                var sorcedata = that.data.imgeList;
                var obj = {
                  url:JSON.parse(res.data).body.url,
                  id:JSON.parse(res.data).body.resourceId,
                }
                sorcedata.push(obj);
                that.setData({
                  imgeList:sorcedata,
              })

              }
              if(JSON.parse(res.data).code == -1){
                wx.navigateTo({
                  url: '/pages/login/login'
                });
              }

            }
          });
          wx.showLoading({
            title: '正在上传...',
          })
        }
        
      },
      fail: function (res) {
        console.log(res, '失败');
      },
      complete: function (res) { 
        console.log(res)
      },
    })
  },
  backhome:function(){
    wx.navigateBack({
      delta: 1,  // 返回上一级页面。
      success: function() {
          console.log('成功！')
      }
    })
  },
  
  loginForm: function(data) {
    console.log(data.detail.value)//  {username: "hgj", password: "fsdfsd"}
    var title = data.detail.value.title
    var content = data.detail.value.content;
    var that = this;
    var token = wx.getStorageSync('token');
    var imgarr = [];
    this.data.imgeList.forEach(element => {
      imgarr.push(element.id)
    });
    if(!title){
      wx.showModal({
        title: '提示',
        content: '请输入标题',
        showCancel: false,
        success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
        }
        })
        return;
    }
    if(!content){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入内容',
        success: function(res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
        }
        })
        return;
    }
    wx.request({
      url: app.globalData.apiUrl+'/sp/post/save',
      method:'post',
      header: {
        'token': token
      },
      data:{
        title:title,
        content:content,
        tags:this.data.tags,
        type:1,
        albums:imgarr,
        coverResourceId:imgarr[0]
      },
      success: function(res) {
        var data = res.data;
        if(data.code == 1){
          that.data.isHidden = false;
          that.setData({
            isHidden:false,
            pageid:data.body.id
        })
        }
      }
    })
  },
  checkdetail(){
    wx.navigateTo({
      url: '/pages/detail/detail?id='+this.data.pageid
    });
  },
  clicktags:function(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let index = e.currentTarget.dataset.index;
    var that = this;
    var isincloud = false;
    this.data.selected.forEach(element => {
      if(element.id==id){
        isincloud = true;
        // that.data.selected.push(element)
      }
    });
    if(isincloud){
      this.data.selected.splice(this.data.selected.findIndex(e => e.id === id), 1)

    }else{
      that.data.selected.push(this.data.taglist[index])
    }
    var arr = [];
    that.data.selected.forEach(element => {
      arr.push(element.name)
    });
    // that.data.selectedstr = that.data.selected.join(",")
        this.setData({
        selectedstr:arr.join(","),
        tags:arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(JSON.parse(options.imgeList))
    this.setData({
      imgeList:JSON.parse(options.imgeList)
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