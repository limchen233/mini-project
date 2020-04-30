import {baseUrl} from './util.js'
class HTTP{
  request(params){
    // 参数 url,data,method
    // if(!params.method) {
    //   params.method('get')
    // }
    wx.request({
      url:baseUrl + params.url,
      // method:params.method,
      data:params.data,
      header:{
        'content-type': 'application/json'
      },
      success: res => {
        let code = res.statusCode.toString()
        if(code.startsWith('2')){
          params.success(res.data)
        } else {
          wx.showToast({
            title:'错误',
            icon:'none',
            duration:1500
          })
        }
      },
      fail: err => {
        wx.showToast({
          title:'错误',
          icon:'none',
          duration:1500
        })
      }
    })
  }
}

export {HTTP}