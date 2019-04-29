var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectAllStatus:true,
    show:false,            //自定义状态
    show_bj:true,
    show_cz: false,
    border_top: '1rpx solid #DBDBDB',
    listid:[],
    dxlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token'),
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
  onShow: function (e){
    var that=this;
    // 请求所有的消息
    wx.request({
      url: app.globalData.baseUrl + '/msg/all',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        // 时间戳处理，转换为时间格式
        var timestamp = [];
        for (var i = 0; i < res.data.data.length; i++) {
          timestamp.push(new Date(res.data.data[i].createTime));
          var arr = [];
          for (var j = 0; j < timestamp.length; j++) {
              y = timestamp[j].getFullYear(),
              m = timestamp[j].getMonth() + 1,
              d = timestamp[j].getDate();
            arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp[j].toTimeString().substr(0, 8));
          }
        }
        that.setData({
          coupons: res.data.data,
          time:arr
        })
        // 页面css样式js控制调整
        var height = (res.data.data.length*70+50)+'px'
        if (res.data.data.length>0){  //数据长度>0时的操作
          that.setData({
            height: height
          })
        }else if (res.data.data.length == 0) {
          that.setData({
            show_bj: false,
            show_cz:false,
            height: 0,
            show:false
          });
          wx.showToast({
            title: '暂时并无消息',
            icon: 'none',
            duration: 2500,
          });
        }
        
      }
  })
  },
  //  编辑
  click_bj:function(){
    var that=this;
    let coupons = that.data.coupons;
    let selectAllStatus = that.data.selectAllStatus;
    for (let i = 0; i < that.data.coupons.length; i++) {
      coupons[i].active = selectAllStatus;
    }
      that.setData({
        show:true,
        show_bj:false,
        show_cz:true,
        border_top:'none',
        coupons: coupons,
        margin_top:'108'
      })
  },
  // 取消
  click_cancel: function () {
    var that = this;
    let coupons = that.data.coupons;
    let selectAllStatus = that.data.selectAllStatus;
    for (let i = 0; i < that.data.coupons.length; i++) {
      coupons[i].active = selectAllStatus;
    }
    that.setData({
      show: false,
      show_bj: true,
      show_cz: false,
      selectAllStatus:true,
      coupons: coupons,
      margin_top: '0'
    })
  },
  // 全选
  selectAll:function(){
    var that = this;
    let selectAllStatus = that.data.selectAllStatus;    
    selectAllStatus = !selectAllStatus;
    let coupons = that.data.coupons;
    var listid=[];
    for (let i = 0; i <coupons.length; i++) {    //全选状态下获取所有列表的主键id
      coupons[i].active = selectAllStatus;
      if (that.data.selectAllStatus == true){
        listid.push(coupons[i].id)
      }else if(that.data.selectAllStatus==false){
      listid:''
      }
  }
    // console.log(listid)
    that.setData({
      selectAllStatus: selectAllStatus,
      coupons: coupons,
      listid: listid
    })
  },
  // 单选
  selectList:function(e){
    var that=this
    const index = e.currentTarget.dataset.index;
    let coupons = that.data.coupons;                    
    var active = coupons[index].active;
    coupons[index].active = !active;
    that.setData({
      coupons: coupons,
    }) 
    for(var j=0 ;j<coupons.length;j++){  //改变状态
      if(coupons[j].active==true){
        that.setData({
          selectAllStatus:true
        })
      }
    }
  },
  // 删除
  click_del:function(){
    var that=this;
    wx.showModal({
      cancelColor: '#333333',
      confirmText: '确认',
      cancelText: '取消',
      content: '确认要删除选中消息?',
      confirmColor: '#5489FD',
      success(res) {
        if (res.confirm) {
          let coupons = that.data.coupons;
          var dxlist = new Array
          for (var i = 0; i < coupons.length; i++) {   //把要删除的信息id放到dxlist数组里
            if (coupons[i].active == false){
              dxlist.push(coupons[i].id)
            }
          }
          that.setData({
            dxlist: dxlist
          })
          // 删除消息请求
          wx.request({
            url: app.globalData.baseUrl + '/msg/delete/' + dxlist,
            method: 'get',
            header: {
              'content-Type': 'application/x-www-form-urlencoded',
              'auth-token': that.data.token
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == 200) {  //返回200显示已删除
                wx.showToast({
                  title: '已删除',
                  icon: 'success',
                  duration: 1500,
                  success(res) {
                    that.onShow();
                  }
                });
                if(that.data.coupons.length==0){  //如果数据为0时则改变状态
                that.setData({
                  show:false,
                  show_bj:false,
                  height:0
                })
                }
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 点击列表进入消息详情
  click_status:function(e){
    var that=this
    // 同时请求数据表示此条消息已阅读，这里状态会变为灰色
    wx.request({
      url: app.globalData.baseUrl + '/msg/read/' + e.currentTarget.dataset.id,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
      }
    });
    const msgId = e.currentTarget.dataset.id;    //消息ID
    const orderNo = e.currentTarget.dataset.orderno;      //订单号
    const orderStatus = e.currentTarget.dataset.orderstatus;    //订单状态
    const msgStatus = e.currentTarget.dataset.msgstatus;    //消息状态
    app.msgId = msgId
    app.orderNo = orderNo
    app.msgStatus = msgStatus
    app.orderStatus = orderStatus
    if (orderStatus == 5 || orderStatus == 6) {  //如果订单状态为5或6则跳转页面到message_details详情页
    wx.navigateTo({
      url: '../message_details/message_details',
    })
    } else if (orderStatus == 1 || orderStatus == 4) {  //如果订单状态为1或4则跳转页面到details详情页
      wx.navigateTo({
        url: '../details/details',
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