//index.js
const app = getApp()

Page({
  data: {
    scrollHeight:0,
    location:'loading...',
    weatherDataGenerateDataTime:'loading...',
    weatherArray:[],
    listArray:[],
    tips:'loading',
    weatherIcon:'/images/icons/weather_icon_40.svg',
    currentTemperature:'',
    weatherInfo:''
  },

  onLoad: function() {
    // 计算高度
    this.calcScrollHeight()

    let that = this

    // 获取用户的位置信息
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const longitude = res.longitude
        const latitude = res.latitude

        // 调用地理坐标逆转码接口，将经纬度转换成文字信息显示
        wx.request({
          url: 'https://api.gugudata.com/location/geodecode?appkey=K4QAH3UY2NRR&longitude='+longitude+'&latitude='+latitude,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) { // 请求成功后的回调
            that.setData({
              location: res.data.Data[0].District
            })

            // 获取当前位置的Code
            wx.request({
              url: 'https://api.gugudata.com/weather/weatherinfo/region?appkey=ECY2VNVKKV72&keyword=' + res.data.Data[0].Province,
              header: {
                'content-type':'application/json'
              },
              success(res) {
                let code = ''
                if(res.data.Data.length > 0){
                  code = res.data.Data[0].Code
                } else {
                  wx.showToast({
                    title: '区域不存在',
                    icon: 'none',
                    duration: 2000
                  })
                }
                
                // 根据Code查询天气详情
                wx.request({
                  url: 'https://api.gugudata.com/weather/weatherinfo?appkey=ECY2VNVKKV72&code=' + code + '&days=7',
                  header: {
                    'content-type':'application/json'
                  },
                  success(res) {
                    console.log(res.data)
                    let weatherDataGenerateDataTime = ''

                    if (res.data.Data.length > 0) {
                      let reg = /(\d{2}:\d{2}):\d{2}/g.exec(res.data.Data[0].WeatherDataGenerateDateTime)
                      weatherDataGenerateDataTime = reg[1]
                      that.setData({
                        weatherArray: (res.data.Data).splice(1),
                        weatherDataGenerateDataTime: weatherDataGenerateDataTime,
                        currentTemperature: res.data.Data[0].TemperatureHigh + '/' + res.data.Data[0].TemperatureLow,
                        tips: res.data.Data[0].LifeHelperWear.HelperContent.replace('。',''),
                        weatherIcon: that.getWeatherIcon(res.data.Data[0].weatherInfo),
                        weatherInfo: res.data.Data[0].WeatherInfo
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  calcScrollHeight(){
    let that = this
    // 创建节点对象
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
  },

  // 获取天气图标
  getWeatherIcon(weather){
    switch(weather){
      case '多云转中雨':
        return '/images/icons/weather_icon_17.svg'
      case '多云转晴':
        return '/images/icons/weather_icon_3.svg'
      case '中雨转多云':
        return '/images/icons/weather_icon_8.svg'
      case '晴转多云':
        return '/images/icons/weather_icon_3.svg'
      case '多云':
        return '/images/icons/weather_icon_2.svg'
    }
  }

})
