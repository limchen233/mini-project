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
        const longitude = res.longitude
        const latitude = res.latitude
        console.log(longitude,latitude)


        wx.request({
          url: 'https://api.gugudata.com/location/geodecode?appkey=K4QAH3UY2NRR&longitude='+longitude+'&latitude='+latitude,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data.Data[0].Province)
          }
        })
      }
    })
  },

})
