// pages/detail/detail.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filelist:[],
    overImg:'../../images/nav5.png',
    title:'',
    nick:'',
    avatar:'../../images/nav4.png',
    likes:12,
    views:22,
    content:'',
    time:'2021/3/31',
    projectName:'',
    videoUrl:'',
    flies:0,//文件数
    pageid:0,
    videoid:'',
    showvideo:false,
    collected:false,
    imgheights: [],
    current: 0,
    ispublish:true,
    inputvalue:'',
    parentid:0,
    comments:[],
    focus:false,
    hasnick:false
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
            if(parseInt(items[i].postId)==parseInt(that.data.pageid)){
              that.setData({
                collected:true
              })
            }
          }
        }
      }
    })
  },
  getcomments(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/post/comments',
      method:'POST',
      data:{
        postId:this.data.pageid
      },
      success: function(res) {
        var data = res.data;
        if(data.code == 1){
          that.setData({ comments: data.body.items})
        }
      }
    })
  },
  getdetaildata(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/sp/post/article/detail',
      method:'GET',
      data:{
        id:this.data.pageid
      },
      success: function(res) {
        console.log(res)
        var data = res.data;
        if(data.code == 1){
          var arrs = data.body;
          that.setData({
            content:arrs.content,
            overImg:arrs.cover,
            title:arrs.title,
            likes:arrs.likes,
            views:arrs.views,
            nick:arrs.nick,
            time:arrs.time,
            tags:arrs.tags,
            id:arrs.id,
            type:arrs.type,
            video:arrs.video,
            ref:arrs.ref,
            avatar:'../../images/avatar'+(arrs.nick=='官方发布'?'guanfang':'default')+'.png',
            bannerImgs:arrs.albums
          })
          WxParse.wxParse('article', 'html', arrs.content, that, 5); 
        }
      }
    })
  },
  tocomment(e){
    var id = e.currentTarget.dataset.id;
    this.setData({ parentid: id,focus:true})
  },
  showcomment(e){
    var index = e.currentTarget.dataset.index;
    var comments = this.data.comments;
    comments[index].isshow=comments[index].isshow?false:true;
    this.setData({
      comments: comments
    })
  },
  gototag(e){
    var tagid = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
  
    wx.navigateTo({
      url: '/pages/tagarticles/tagarticles?tagid='+tagid+'&title='+title
    });
  },
  watchvalue: function (event) {
    if(event.detail.value){
      this.setData({ ispublish: false,inputvalue:event.detail.value })
    }else{
      this.setData({ ispublish: true,inputvalue:event.detail.value,parent:0 })
    }

  },
  publistvalue(){
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      method : 'GET',
      data : {
        grant_type: 'client_credential',
        appid: 'wxb5cbcb6989fbfde5',
        secret: 'daac54e28a0cc638fade54af72ec4e7b'
      },
      success : function(res){
        var access_token = res.data.access_token;
        that.verityword(access_token,that.data.inputvalue);
        //正常返回结果
        //{"access_token":"ACCESS_TOKEN","expires_in":7200}
      }
    })
  },
  verityword(access_token,content){
    var that = this;
    wx.request({
      url:  'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='+access_token,
      method: 'POST',
      data: {
        content: content
      },
      success: function (res) {
       //当content内含有敏感信息，则返回87014
        if (res.data.errcode !== 87014) {
             // 合格
             that.confirmpublish();
         }else{
          wx.showToast({
            title: '您输入内容含有违规内容,请检查后再发布',
            icon: 'none',
            duration: 2000
          })
         }
      }
    })
  },
  confirmpublish(){
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: app.globalData.apiUrl+'/sp/comment/add',
      method:'post',
      header: {
        'token': token
      },
      data:{
        postId:this.data.pageid,
        content:this.data.inputvalue,
        parent:this.data.parentid,
      },
      success: function(res) {
        var data = res.data;
        if(data.code == 1){
          wx.showToast({
            title: '评论已提交,请等待审核通过',
            icon: 'none',
            duration: 2000
          })
          that.getcomments();
          that.setData({inputvalue:'',ispublish:true })
        }
      }
    })
  },
  getUserProfile:function(e){
    var that = this;
    if(wx.getStorageSync('token')){
      that.publistvalue();
      return;
    }
    wx.getUserProfile({
      desc: '获取用户昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.rawData)
        var rawData = JSON.parse(res.rawData);
        wx.setStorage({
          key: 'nick',
          data: rawData.nickName,
          success: function (data) {
            console.log('nickname',data);
            that.setData({hasnick:true});
            wx.login({
              success: res => {
                app.globalData.userCode = res.code;
               that.getUserconnectdata(rawData.nickName);
              }
            })
          }
        }) 
      }
    })
    // wx.getUserProfile({
    //   success:(res)=>{
    //     console.log(res.rawData)
    //     var rawData = JSON.parse(res.rawData);
    //     wx.setStorage({
    //       key: 'nick',
    //       data: rawData.nickName,
    //       success: function (data) {
    //         console.log('nickname',data);
    //         that.setData({hasnick:true});
    //         wx.login({
    //           success: res => {
    //             app.globalData.userCode = res.code;
    //            that.getUserconnectdata(rawData.nickName);
    //           }
    //         })
    //       }
    //     }) 
    //   }
    // });
  },
  getUserconnectdata(nickName){
    wx.request({
      url: app.globalData.apiUrl+'/sp/user/connect?code='+app.globalData.userCode, 
      method:'post',
      data: {
        code:app.globalData.userCode,
        nick:nickName
      },
      success: function(res) {
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
  yulan:function(event){
    var that = this;
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList =JSON.parse(JSON.stringify(that.data.bannerImgs)) ;//获取data-list
    imgList.forEach((element,index) => {
      imgList[index] = 'https://'+element
    });
    // console.log(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  removeHTMLTag:function(str) {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,' ');//去掉&nbsp;
    return str;
},
  copy: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.title,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  copy1: function (e) {
    var that = this;
    var content = JSON.parse(JSON.stringify(that.data.content));
    content = this.removeHTMLTag(content);
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
         imgheight = e.detail.height,
    //宽高比  
         ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
       imgheights[e.target.dataset.id] = imgheight;
    this.setData({
         imgheights: imgheights
       })
     },
     bindchange: function (e) {
      // console.log(e.detail.current)
      this.setData({ current: e.detail.current })
       },
  bindViewTap(e){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    var id = e.currentTarget.dataset.id; 
    var token = wx.getStorageSync('token');
    var that = this;
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
          that.setData({
            collected:!that.data.collected,
            likes:that.data.collected?that.data.likes-1:that.data.likes+1,
          })
        }
      }
    })
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
        wx.downloadFile({
          url: urls,
            success: function (res) {
              console.log('downloadFile', res);
              const filePath = res.tempFilePath
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log(res);
                  wx.hideLoading()
                  console.log('打开文档成功')
                  wx.hideLoading()
                },
                fail: function (res) { 
                  console.log('打开失败')
                  wx.hideLoading()
                },
              })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageid:options.id
    })
    this.getmylikes();
    this.getdetaildata();
    this.getcomments();
    if(wx.getStorageSync('token')){
      this.setData({
        hasnick:true
      })
    }
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
    return {
      title: this.data.title,
      query: 'id='+this.data.pageid, // 需要携带的参数, 无法自定义路径，只能是当前的分享页
      imageUrl:'http://'+this.data.overImg,
    }
  }
})