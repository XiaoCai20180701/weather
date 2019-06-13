import effect from '../lib/effect'

//绘制雨雪效果
export const drawEffect = (canvasId, name, width, height, amount) => {
  let rain = effect(name, wx.createCanvasContext(canvasId), width, height, {
    amount: amount || 100,
    speedFactor: 0.03
  })
  return rain.run()
}


export const fixChart = (ctx, width, height) => {
  ctx.canvas = {
    //微信小程序中没有canvas对象，我们造一个
    width,
    height
  }

  ctx.canvas.style = {
    width,
    height,
    display: 'block'
  }

  ctx.canvas.getAttribute = function(name) {
    //添加canvas对象的属性
    if (name == 'width') {
      return ctx.canvas.width
    }
    if (name == 'height') {
      return ctx.canvas.height
    }
  }
}

export const getChartConfig = (data) => {
  data = getChartData(data)
  //配置 chart
  let lineData = {
    labels: data.dates,
    datasets: [{
      data: data.maxData,
      fill: false,
      borderWidth: 2,
      borderColor: '#FFB74D',
      pointStyle: 'circle',
      pointRadius: 3,
      pointBackgroundColor: '#FFB74D',
      pointBorderWidth: 1,
      lineTension: 0.5
    }, {
      data: data.minData,
      fill: false,
      borderWidth: 2,
      borderColor: '#4FC3F7',
      pointStyle: 'circle',
      pointRadius: 3,
      pointBackgroundColor: '#4FC3F7',
      pointBorderWidth: 1,
      lineTension: 0.5
    }]
  }
  return {
    type: 'line',
    data: lineData,
    redraw: true,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      scaleLabel: {
        display: false
      },
      scales: {
        yAxes: [{
          display: false
        }],
        xAxes: [{
          display: false
        }]
      },
      layout: {
        padding: {
          left: 26,
          right: 26,
          top: 30,
          bottom: 30
        }
      }
    }
  }
}

export const getChartData = (data) => {
  let dates = [],
    maxData = [],
    minData = []
  if (data && data.length) {
    data.forEach(({
      date,
      maxTemp,
      minTemp
    }) => {
      dates.push(date)
      maxData.push(maxTemp)
      minData.push(minTemp)
    })
  }
  return {
    dates,
    maxData,
    minData
  }
}