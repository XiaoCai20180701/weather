const path = require('path')
const express = require('express')
const { PORT } = require('../config.server.json')

const test = require('./cloud-functions/test/').main
const test2 = require('./cloud-functions/test2/').main
const heWeather = require('./cloud-functions/he-weather/').main
const heAir = require('./cloud-functions/he-air/').main

const app = express()

// 添加static
app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    index: false,
    maxage: '30d'
  })
)

// 添加云函数mock
app.get('/api/test2', (req, res, next) => {
  test2(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
})
app.get('/api/test', (req, res, next) => {
  test(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
})

// 添加中间件

app.get('/api/he-weather', (req, res, next) => {
  heWeather(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
})
app.get('/api/he-air', (req, res, next) => {
  heAir(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

app.listen(PORT, () => {
  console.log(`开发服务器启动成功：http://192.168.2.108:${PORT}`)
})