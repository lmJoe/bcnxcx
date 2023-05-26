//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 登录
    // if(!wx.getStorageSync('token')){
    //   wx.login({
    //     success: res => {
    //      console.log('code',res)
    //      that.globalData.userCode = res.code;
    //      that.getUserconnectdata();
    //     }
    //   })
    //   wx.getUserInfo({
    //     success: res => {
    //       // 可以将 res 发送给后台解码出 unionId
    //       this.globalData.userInfo = res.userInfo;
    //       console.log(res.userInfo.nickName)
    //       wx.setStorage({
    //         key: 'nick',
    //         data: res.userInfo.nickName,
    //         success: function (data) {
    //         }
    //       }) 
    //     }
    //   })
    // }

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log('授权',res.authSetting['scope.userInfo'])
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log(res.userInfo)
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }else{
    //       wx.getUserInfo({
    //         success:(res)=>{
    //           console.log(res)
    //         }
    //       });
    //     }
    //   }
    // })
  },
  getUserconnectdata(){
    console.log(this.globalData.userCode)
    wx.request({
      url: this.globalData.apiUrl+'/sp/user/connect?code='+this.globalData.userCode, 
      method:'post',
      data: {
        code:this.globalData.userCode
      },
      success: function(res) {
        if(res.data.code == -1){
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/login/login'
            });
          },200);
        }
        wx.setStorage({
          key: 'token',
          data: res.data.body.token,
          success: function (data) {
            console.log('状态id',data)
          }
        })        
      }
    })
  },
  globalData: {
    userInfo: null,
    apiUrl:'https://clubsp.iceground.cn/api'
  }
})