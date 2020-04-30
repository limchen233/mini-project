//index.js
import {appkey,appkey2,baseUrl} from '../utils/util.js'
import {HTTP} from '../utils/http.js'
let http = new HTTP() //先实例化

const app = getApp()

Page({
  data: {
    scrollHeight: 0,
    location: 'loading...',
    weatherDataGenerateDataTime: 'loading...',
    weatherArray: [],
    tips: 'loading',
    weatherIcon: '',
    currentTemperature: '',
    weatherInfo: '',
    date: ''
  },

  onLoad: function () {
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
        http.request({
          url:'/location/geodecode?appkey='+ appkey2 +'&longitude=' + longitude + '&latitude=' + latitude,
          success:res => {
            that.setData({
              location: res.Data[0].District
            })

            // 获取当前位置的Code
            http.request({
              url:'/weather/weatherinfo/region?appkey=' + appkey+'&keyword=' + res.Data[0].Province,
              success:res => {
                let code = ''
                if (res.Data.length > 0) {
                  code = res.Data[0].Code
                } else {
                  wx.showToast({
                    title: '区域不存在',
                    icon: 'none',
                    duration: 2000
                  })
                }

                // 根据Code查询天气详情
                http.request({
                  url:'/weather/weatherinfo?appkey='+appkey+'&code=' + code + '&days=7',
                  success:res => {
                    let weatherArray = res.Data
                    // console.log(weatherArray[1], weatherArray[2])
                    weatherArray.map(item => {
                      // 处理数据
                      item.WeatherDate = item.WeatherDate.slice(5).replace('-','/') // 截取日期并替换符号
                      item.weekDay = that.getWeekDay(item.WeatherDataGenerateDateTime) // 添加weekDay
                      item.icon = that.getWeatherIcon(item.WeatherInfo) // 添加图标
                    })

                    let weatherDataGenerateDataTime = ''

                    if (res.Data.length > 0) {
                      let reg = /(\d{2}:\d{2}):\d{2}/g.exec(res.Data[0].WeatherDataGenerateDateTime)
                      weatherDataGenerateDataTime = reg[1]
                      that.setData({
                        weatherArray: weatherArray.splice(1),
                        weatherDataGenerateDataTime: weatherDataGenerateDataTime,
                        currentTemperature: res.Data[0].TemperatureHigh + '/' + res.Data[0].TemperatureLow,
                        tips: res.Data[0].LifeHelperWear.HelperContent.replace('。', ''),
                        weatherIcon: that.getWeatherIcon(res.Data[0].WeatherInfo),
                        weatherInfo: res.Data[0].WeatherInfo
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

  calcScrollHeight() {
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
        scrollHeight: scrollHeight
      })
    })
  },

  // 获取天气图标
  getWeatherIcon(weather) {
    switch (weather) {
      case '晴':
        return '/images/icons/weather_icon_4.svg'
      case '多云':
        return '/images/icons/weather_icon_3.svg'
      case '阴':
        return '/images/icons/weather_icon_2.svg'
      case '小雨':
        return '/images/icons/weather_icon_13.svg'
      case '中雨':
        return '/images/icons/weather_icon_7.svg'
      case '大雨':
        return '/images/icons/weather_icon_16.svg'
      case '多云转小雨':
        return '/images/icons/weather_icon_14.svg'
      case '多云转晴':
        return '/images/icons/weather_icon_3.svg'
      case '多云转阴':
        return '/images/icons/weather_icon_2.svg'
      case '阴转多云':
        return '/images/icons/weather_icon_3.svg'
      case '小雨转多云':
        return '/images/icons/weather_icon_14.svg'
      case '小雨转阴':
        return '/images/icons/weather_icon_14.svg'
      case '中雨转多云':
        return '/images/icons/weather_icon_8.svg'
      case '多云转中雨':
        return '/images/icons/weather_icon_17.svg'
      case '阴转中雨':
        return '/images/icons/weather_icon_32.svg'
      case '小雨转中雨':
        return '/images/icons/weather_icon_32.svg'
      case '晴转多云':
        return '/images/icons/weather_icon_3.svg'
      case '阴转晴':
        return '/images/icons/weather_icon_3.svg'
      case '晴转阴':
        return '/images/icons/weather_icon_2.svg'
      case '雷阵雨':
        return '/images/icons/weather_icon_24.svg'
    }
  },

  // 获取某一天是星期几
  getWeekDay(date) {
    let myDate = new Date(date)
    let day = myDate.getDay()
    let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return weekDay[day]
  }
})
