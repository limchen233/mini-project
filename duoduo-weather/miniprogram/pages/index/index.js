//index.js
const app = getApp()

Page({
  data: {
    
  },

  onLoad: function() {
    // 获取用户的位置信息
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude,longitude)
      }
    })
  },

})
