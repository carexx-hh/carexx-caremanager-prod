 var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token')
    });
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
    var that = this;
    var id = app.id;
    that.setData({
      id: id,
    },function(){
      // 请求护工信息
      wx.request({
        url: app.globalData.baseUrl + '/inststaff/get_staffId/'+that.data.id,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          that.setData({
            coupons: res.data.data
          })
        }
      });
    })
  },
  // 取消护工认证
  click_cencel:function(){
    var that=this;
    wx.showModal({
      cancelColor: '#333333',
      confirmText: '确认',
      cancelText: '取消',
      content: '确认取消该护工认证?',
      confirmColor: '#5489FD',
      success(res) {
        if (res.confirm) {  //点击确认执行取消认证的请求
          wx.request({
            url: app.globalData.baseUrl + '/inststaff/cancel_certification/' + that.data.id,
            method: 'get',
            header: {
              'content-Type': 'application/x-www-form-urlencoded',
              'auth-token': that.data.token
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == 200) {  //返回200时的提示
                wx.showModal({
                  content: '取消认证成功',
                  showCancel: false,
                  confirmText: '返回',
                  confirmColor: '#5489FD',
                  success(res) {
                    if (res.confirm){
                      wx.switchTab({
                        url: '../manage/manage',
                      })
                    }else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }else{
                wx.showToast({
                  title:'取消失败,'+res.data.errorMsg,
                  icon: 'none',
                  duration: 2500,
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 跳转到编辑信息页面
  click_edit:function(){
     var that=this;
     app.id=that.data.id  //护工id
     wx.navigateTo({
      url: '../nurse_info_edit/nurse_info_edit',
    })
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
    wx.switchTab({
      url: '../manage/manage',
    })
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