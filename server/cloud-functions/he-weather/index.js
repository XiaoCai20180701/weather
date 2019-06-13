const cloud = require('wx-server-sdk')
cloud.init()

const API_URL = 'https://free-api.heweather.net/s6/weather'
// const KEY = '39a99e9fec4d47f8911a7be8235e29d1'
const request = require('request')

// const $ = require('../../inline/utils')
// 引入云函数功能工具方法，跟空气质量公用
// gulp prod 打包的时候将公共 utils 库嵌入式引入
/*<jdists import="../../inline/utils.js" />*/

// 普通 mock server 的代码直接将 utils 库当模块引入
/*<remove>*/
const $ = require('../../inline/utils')
/*</remove>*/


exports.main = async (event) => {
  const { lat, lon} = event
  let location = `${lat},${lon}`
  let params = {
    location,
    key: '39a99e9fec4d47f8911a7be8235e29d1' //和风天气中应用的密钥
  }
  let query = []
  for (let i in params) {
    query.push(`${i}=${encodeURIComponent(params[i])}`)
  }
  let url = API_URL +'?' + query.join('&')
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error)
      } else {
        try {
          let rs = $.handlerData(JSON.parse(body))
          resolve(rs)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}