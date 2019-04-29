var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  // 点击提交登录信息验证账户密码
  formSubmit:function(e){
    var that=this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    wx.getUserInfo({  //获取用户信息
      lang: "zh_CN",
      success: res => {
        var region = res.userInfo.province + res.userInfo.city
        that.setData({
          userInfo:res.userInfo
        })
        wx.setStorageSync('userInfo', that.data.userInfo)
        //  登录
        wx.login({  //调用登陆接口
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              wx.request({
                url: app.globalData.baseUrl + '/auth/nursing_supervisor_login',
                method: 'POST',
                data: {
                  code: res.code,
                  nickname: that.data.userInfo.nickName,
                  avatar: that.data.userInfo.avatarUrl,
                  sex: that.data.userInfo.gender,
                  region:region,
                  acctNo: e.detail.value.input_name,  //账户
                  loginPass: e.detail.value.input_password, //密码
                }, 
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                success: function (res){
                  console.log(res)
                  if(res.data.code==200){  //如果返回200则把以下数据存到本地
                    console.log('token=' + res.data.data.token)
                    console.log('openId=' + res.data.data.openId)
                    wx.setStorageSync('token', res.data.data.token)
                    wx.setStorageSync('openId', res.data.data.openId)
                    wx.setStorageSync('instId', res.data.data.instId)  //机构id
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }else{  //否则提示错误信息
                    wx.showToast({
                      title: res.data.errorMsg,
                      icon: 'none',
                      duration: 1000,
                    });
                  }
                
                },
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
        if (that.userInfoReadyCallback){
          that.userInfoReadyCallback(res)
        }
      }
    })
  },
  onLoad: function (options) {
    
  },

  
  onReady: function () {
    
  },

  
  onShow: function () {
    
  },

  
  onHide: function () {
    
  },

  
  onUnload: function () {
    
  },

  
  onPullDownRefresh: function () {
    
  },

  onReachBottom: function () {
    
  },

 
  onShareAppMessage: function () {
    
  }
})