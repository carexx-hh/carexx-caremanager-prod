var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token'),
      instId: wx.getStorageSync('instId')
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var certificationStatus = app.certificationStatus;    //护工认证状态
    var id = app.id;                                //护工主键id
    var instName = app.instName;                    //护工所属机构名称
    var serviceInstName = app.serviceInstName;      //护工服务机构名称
    var realName = app.realName;               //护工姓名
    var idNo = app.idNo;                     //护工身份证
    var sex = app.sex;                       //护工性别
    var birthday = app.birthday;        //护工出生日期
    var phone = app.phone;             //护工电话
    var address = app.address;         //护工地址
    that.setData({
      nurse_Status: certificationStatus,
      id: id,
      instName: instName,
      serviceInstName: serviceInstName,
      realName: realName,
      idNo: idNo,
      sex: sex,
      birthday: birthday,
      phone: phone,
      address: address,
    })
    // 1为未认证  2已通过认证  3已拒绝
    if (certificationStatus==1){
      that.setData({
        show: true
      })
    }else if(certificationStatus==2){
      that.setData({
        show: false,
        show_o:'已通过认证',
        color: '#5489FD'
      })
    } else if (certificationStatus == 3) {
      that.setData({
        show: false,
        show_o: '已拒绝',
        color: '#A5AAB8'
      })
    };
  },
  // 通过该护工认证
  click_t_g:function(){
   var that=this;
    wx.showModal({
      cancelColor: '#333333',
      confirmText: '确认',
      cancelText: '取消',
      content: '确认该护工通过认证?',
      confirmColor: '#5489FD',
      success(res) {
        if (res.confirm) {  //点击确认是进行请求
          wx.request({
            url: app.globalData.baseUrl + '/inststaff/agree_certification/' + that.data.id,
            method: 'get',
            header: {
              'content-Type': 'application/x-www-form-urlencoded',
              'auth-token': that.data.token
            },
            success: function (res) {
              console.log(res)
             if(res.data.code==200){  //返回200表示认证成功
               wx.showToast({
                 title: '认证成功',
                 icon: 'success',
                 duration: 1000
               })
               setTimeout(function () {
                 wx.switchTab({
                   url: '../nurse_certification/nurse_certification',
                 })
               }, 1000)
             }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 拒绝该护工的认证
  click_pass:function(){
    var that = this;
    wx.showModal({
      cancelColor: '#333333',
      confirmText: '确认',
      cancelText: '取消',
      content: '确认拒绝该护工认证?',
      confirmColor: '#5489FD',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/inststaff/refused_certification/' + that.data.id,
            method: 'get',
            header: {
              'content-Type': 'application/x-www-form-urlencoded',
              'auth-token': that.data.token
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == 200) {  //拒绝成功时页面
                wx.showModal({
                  content: '拒绝认证成功',
                  showCancel:false,
                  confirmText: '返回',
                  confirmColor: '#5489FD',
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../nurse_certification/nurse_certification',
                      })
                    }else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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