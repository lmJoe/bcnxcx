const app = getApp();
Component({
  data: {
    selected: 0,
    color:"#797B8F",
    selectedColor:"#367fff",
    picArr:[],
    isshow:false,
    phone:'',
    password:'',
    index:0,
    showphone:false,
    flat:false,
    list: [{
      "pagePath":"../../pages/index/index",
      "text":"活动",
      "iconPath":"../images/active.png",
      "selectedIconPath":"../images/active-selected.png"
    },{
      "pagePath":"../../pages/home/home",
      "text":"G粉社区",
      "iconPath":"../images/zhongcao.png",
      "selectedIconPath":"../images/zhongcao-selected.png"
    },{
      "pagePath":"../../pages/video/video",
      "text":"",
      "iconPath":"../images/fabu.png",
      "selectedIconPath":"../images/fabu.png"
    },{
      "pagePath":"../../pages/lists/lists",
      "text":"专题",
      "iconPath":"../images/zhuanti.png",
      "selectedIconPath":"../images/zhuanti-selected.png"
    },{
      "pagePath":"../../pages/mine/mine",
      "text":"我的",
      "iconPath":"../images/wode.png",
      "selectedIconPath":"../images/wode-selected.png"
    }]
  },
  attached() {
    if(!wx.getStorageSync('phone')){
      this.setData({
        flat: true
      })
    }
  },
  methods: {
    topublish:function(){
      console.log(JSON.stringify(this.data.picArr))
      wx.navigateTo({
        url: '/pages/publish/publish?imgeList='+JSON.stringify(this.data.picArr)
      });
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
    switchTab:function(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      var that = this;

      if(data.index!=2){
        wx.switchTab({url})
        this.setData({
          selected: data.index
        })
      }else{
        if(!wx.getStorageSync('token')){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return;
        }
        if(!wx.getStorageSync('phone')){
          this.setData({
            isshow: true
          })
          return;
        }
          var token = wx.getStorageSync('token')
          wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              let tempFilePaths = res.tempFilePaths
              console.log(res)
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
                      var obj = {
                        url:JSON.parse(res.data).body.url,
                        id:JSON.parse(res.data).body.resourceId,
                      }
                      that.data.picArr.push(obj);

                      if(i==(tempFilePaths.length-1)){
                        that.topublish();
                      }
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
      }

    },
    onLoad: function () {
    },
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
  }
})