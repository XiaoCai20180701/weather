//index.js
import {
  geocoder
} from '../../lib/api'
import {
  getWeather,
  getAir
} from '../../lib/api-mock'
//获取应用实例
const app = getApp()
let isUpdate = false

Page({
  data: {
    // 页面数据
    statusBarHeight: 32,
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    current: {
      temp: '0',
      weather: '数据获取中',
      humidity: '1',
      icon: 'xiaolian'
    },
    today: {
      temp: 'N/A',
      weather: '暂无'
    },
    tomorrow: {
      temp: 'N/A',
      weather: '暂无'
    },
    // hourlyData
    hourlyData: [],
    city: '北京',
    weeklyData: [],
    width: 375,
    scale: 1,
    address: '定位中',
    lat: 40.056974,
    lon: 116.307689
  },
  getWeatherData(cb) {
    wx.showLoading({
      title: '获取数据中',
      mask: true
    })
    const fail = (e) => {
      wx.hideLoading()
      if (typeof cb === 'function') {
        cb()
      }
      // console.log(e.message, e)
      wx.showToast({
        title: '加载失败，请稍后再试',
        icon: 'none',
        duration: 3000
      })
    }
    const { lat, lon, province, city, county } = this.data
    getWeather(lat, lon)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        console.log('获取天气数据', res.result)
        if (res.result) {
          this.render(res.result)
        } else {
          fail()
        }
      })
      .catch(fail)

    // 获取空气质量
    getAir(city)
      .then((res) => {
        if (res && res.result) {
          this.setData({
            air: res.result
          })
        }
      })
      .catch((e) => { })

    // 获取心情
    // getMood(province, city, county, (res) => {
    //   let result = (res.data || {}).data
    //   if (result && result.tips) {
    //     let tips = result.tips.observe
    //     let index = Math.floor(Math.random() * Object.keys(tips).length)
    //     tips = tips[index]
    //     this.setData({ tips })
    //   }
    // })
  },
  // 处理逆经纬度
  getAddress(lat, lon, name) {
    wx.showLoading({
      title: '定位中',
      mask: true
    })
    let fail = (e) => {
      // console.log(e)
      this.setData({
        address: name || '北京市海淀区西二旗北路'
      })
      wx.hideLoading()

      this.getWeatherData()
    }
    geocoder(
      lat,
      lon,
      (res) => {
        wx.hideLoading()
        let result = (res.data || {}).result
        // console.log(1, res, result)

        if (res.statusCode === 200 && result && result.address) {
          let { address, formatted_addresses, address_component } = result
          if (formatted_addresses && (formatted_addresses.recommend || formatted_addresses.rough)) {
            address = formatted_addresses.recommend || formatted_addresses.rough
          }
          let { province, city, district: county } = address_component
          this.setData({
            province,
            county,
            city,
            address: name || address
          })
          this.getWeatherData()
        } else {
          //失败
          fail()
        }
      },
      fail
    )
  },
  updateLocation(res) {
    let { latitude: lat, longitude: lon, name } = res
    let data = {
      lat,
      lon
    }
    if (name) {
      data.address = name
    }
    this.setData(data)
    this.getAddress(lat, lon, name)
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: this.updateLocation,
      fail: (e) => {
        // console.log(e)
        this.openLocation()
      }
    })
  },
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        let { latitude, longitude } = res
        let { lat, lon } = this.data
        if (latitude == lat && lon == longitude) {
          this.getWeatherData()
        } else {
          this.updateLocation(res)
        }
      }
    })
  },
  openLocation() {
    wx.showToast({
      title: '检测到您未授权使用位置权限，请先开启哦',
      icon: 'none',
      duration: 3000
    })
  },
  onLocation() {
    wx.getSetting({
      success: ({ authSetting }) => {
        can = authSetting['scope.userLocation']
        if (can) {
          this.chooseLocation()
        } else {
          this.openLocation()
        }
      }
    })
  },
  indexDetail(e) {
    const { name, detail } = e.currentTarget.dataset
    wx.showModal({
      title: name,
      content: detail,
      showCancel: false
    })
  },
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth
        let scale = width / 375
        // console.log(scale * res.statusBarHeight*2+24)
        this.setData({
          width,
          scale,
          paddingTop: res.statusBarHeight + 12
        })
      }
    })
    // return
    // console.log(location, getCurrentPages())
    const pages = getCurrentPages() //获取加载的页面
    const currentPage = pages[pages.length - 1] //获取当前页面的对象
    const query = currentPage.options
    if (query && query.address && query.lat && query.lon) {
      let { province, city, county, address, lat, lon } = query
      this.setData(
        {
          city,
          province,
          county,
          address,
          lat,
          lon
        },
        () => {
          this.getWeatherData()
        }
      )
    } else {
      // 获取缓存数据
      //   this.setDataFromCache()
      this.getLocation()
    }
  },
  onPullDownRefresh() {
    this.getWeatherData(() => {
      wx.stopPullDownRefresh()
    })
  },
  //
  render(data) {
    isUpdate = true
    console.log("render---------", data)
    const { width, scale } = this.data
    const { current, lifeStyle, oneWord = '' } = data
    const { backgroundColor, backgroundImage } = current

    // const _today = daily[0],
    //   _tomorrow = daily[1]
    // const today = {
    //   temp: `${_today.minTemp}/${_today.maxTemp}°`,
    //   icon: _today.dayIcon,
    //   weather: _today.day
    // }
    // const tomorrow = {
    //   temp: `${_tomorrow.minTemp}/${_tomorrow.maxTemp}°`,
    //   icon: _tomorrow.dayIcon,
    //   weather: _tomorrow.day
    // }

    // daily.forEach((v) => {
    //   v.time = v.time + 24 * 60 * 60 * 1000
    // })
    // console.log(hourly)
    this.setData({
      //  hourlyData: hourly,
      //   weeklyData: daily,
      current: current,
      backgroundImage,
      backgroundColor,
        // today,
        // tomorrow,
      oneWord: oneWord,
      lifeStyle: lifeStyle
    })

  },


})