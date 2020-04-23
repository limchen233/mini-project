//index.js
const app = getApp()

Page({
  data: {
    scrollHeight:0
  },

  onLoad: function() {
    // 计算高度
    this.calcScrollHeight()

    // 获取用户的位置信息
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     const longitude = res.longitude
    //     const latitude = res.latitude

    //     // 调用地理坐标逆转码接口，将经纬度转换成文字信息显示
    //     wx.request({
    //       url: 'https://api.gugudata.com/location/geodecode?appkey=K4QAH3UY2NRR&longitude='+longitude+'&latitude='+latitude,
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       success(res) { // 请求成功后的回调
    //         const province = res.data.Data[0].Province
    //         console.log(province)

    //         // 获取当前位置的Code
    //         wx.request({
    //           url: 'https://api.gugudata.com/weather/weatherinfo/region?appkey=ECY2VNVKKV72&keyword=' + province,
    //           header: {
    //             'content-type':'application/json'
    //           },
    //           success(res) {
    //             console.log(res.data)
    //             const code = res.data.Data[0].Code

    //             // 根据Code查询天气详情
    //             wx.request({
    //               url: 'https://api.gugudata.com/weather/weatherinfo?appkey=ECY2VNVKKV72&code=' + code + '&days=1',
    //               header: {
    //                 'content-type':'application/json'
    //               },
    //               success(res) {
    //                 console.log(res.data)
    //               }
    //             })
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
  },

  calcScrollHeight(){
    let that = this
    // 节点对象
    let query = wx.createSelectorQuery().in(this)
    
    query.select('.top').boundingClientRect(rect => {
      // 上半部分top的高度
      let topHeight = rect.height
      // 可使用窗口宽度
      let windowHeight = wx.getSystemInfoSync().windowHeight

      // 下半部分list的高度
      let scrollHeight = windowHeight - topHeight
      that.setData({
        scrollHeight:scrollHeight
      })
    })
  }

})
