// 两个状态
const STATUS_STOP = 'stop'
const STATUS_RUNNING = 'running'

class Particle {
  constructor(ctx, width, height, opts) {
    this._timer = null
    this._options = opts || {}
    this.ctx = ctx
    this.status = STATUS_STOP
    this.w = width
    this.h = height
    this._init()
  }

  _init() {}

  _draw() {}

  run() {
    if (this.status !== STATUS_RUNNING) {
      //更改状态
      this.status = STATUS_RUNNING
      //绘制循环
      this._timer = setInterval(() => {
        this._draw()
      }, 30)
    }
  }

  stop() {
    //清理定时器，修改状态
    this.status = STATUS_STOP
    clearInterval(this._timer)
    return this
  }

  clear() {
    this.stop()
    this.ctx.clearRect(0, 0, this.w, this.h)
    this.ctx.draw()
    return this
  }
}

class Rain extends Particle {
  _init() {
    let ctx = this.ctx
    ctx.setLineWidth(2)
    ctx.setLineCap('round')
    let h = this.h
    let w = this.w
    let i
    let amount = this._options.amount || 100
    let speedFactor = this._options.speedFactor || 0.03
    let speed = speedFactor * h
    let ps = (this.particles = [])
    for (i = 0; i < amount; i++) {
      let p = {
        x: Math.random() * w,
        y: Math.random() * h,
        l: 2 * Math.random(),
        xs: -1,
        ys: 10 * Math.random() + speed,
        color: 'rgba(255, 255, 255, 0.1)'
      }
      ps.push(p)
    }
  }

  _draw() {
    let ps = this.particles
    let ctx = this.ctx
    ctx.clearRect(0, 0, this.w, this.h)
    for (let i = 0; i < ps.length; i++) {
      let s = ps[i]
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x + s.l * s.xs, s.y + s.l * s.ys)
      ctx.setStrokeStyle(s.color)
      ctx.stroke()
    }
    ctx.draw()
    return this._update()
  }

  _update() {
    let { w, h } = this
    for (let ps = this.particles, i = 0; i < ps.length; i++) {
      let s = ps[i]
      s.x += s.xs
      s.y += s.ys
      if (s.x > w || s.y > h) {
        s.x = Math.random() * w
        s.y = -10
      }
    }
    return this
  }
}

class Snow extends Particle {
  _init() {
    let { w, h } = this
    let colors = this._options._colors || ['#ccc', '#eee', '#fff', '#ddd']
    // 雪的大小用数量来计算
    let amount = this._options.amount || 100

    let speedFactor = this._options.speedFactor || 0.03
    // 速度
    let speed = speedFactor * h * 0.15

    let radius = this._options.radius || 2
    let ps = (this.particles = [])

    for (let i = 0; i < amount; i++) {
      let x = Math.random() * w
      let y = Math.random() * h
      // console.log(x, y)
      ps.push({
        x,
        y,
        // 原始 x 坐标，后面计算随机雪摆动是以此为基础
        ox: x,
        // 向下运动动能变量
        ys: Math.random() + speed,
        // 雪的半径大小
        r: Math.floor(Math.random() * (radius + 0.5) + 0.5),
        // 颜色随机取
        color: colors[Math.floor(Math.random() * colors.length)],
        rs: Math.random() * 80
      })
    }
  }
  _draw() {
    let ps = this.particles
    let ctx = this.ctx
    ctx.clearRect(0,0,this.w,this.h)
    for (let i=0;i<ps.length;i++){
      let {x,y,r,color} = ps[i]
      ctx.beginPath()
      //绘制下雪的效果
      ctx.arc(x,y,r,0,Math.PI * 2 ,false)
      ctx.setFillStyle(color)
      ctx.fill()
      ctx.closePath()
    }
    ctx.draw()
    return this._update()
  }

  _update(){
    let {w,h} = this
    let v = this._options.speedFactor /10
    for (let ps = this.particles, i = 0; i < ps.length; i++){
      let p = ps[i]
      let {ox,ys} = p
      p.rs +=v
      //这里使用了cos,做成随机左右摆动的效果
      p.x = ox + Math.cos(p.rs) *w /2
      p.y += ys
      if (p.x > w || p.y > h) {
        p.x = Math.random() * w
        p.y = -10
      }
    }
  }
}

export default (ParticleName, id, width, height, opts) => {
  switch (ParticleName.toLowerCase()) {
    case 'rain':
      return new Rain(id, width, height, opts)
      break
    case 'snow':
      return new Snow(id, width, height, opts)
      break
  }
}