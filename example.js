const { setQueues, UI } = require('./')
const Queue = require('bull')
const cluster = require('cluster')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const sleep = t => new Promise(resolve => setTimeout(resolve, t * 1000))

const redisOptions = {
  redis: {
    port: 6379,
    host: 'localhost',
    password: '',
    tls: false,
  },
}

const workers = 10
const example = new Queue('example', redisOptions)

const run = () => {
  const app = new Koa()
  const router = new Router()

  router.all('/add', ctx => {
    for (let i = 0; i < 20; i++) {
      example.add({ title: ctx.query.title })
    }
    ctx.body = { ok: true }
  })

  setQueues(example)
  const ui = UI(app)
  router.use('/ui', ui.routes(), ui.allowedMethods())

  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(3000)

  console.log('Running on 3000...')
  console.log('For the UI, open http://localhost:3000/ui')
  console.log('Make sure Redis is running on port 6379 by default')
  console.log('To populate the queue, run:')
  console.log('  curl http://localhost:3000/add?title=Example')
}

if (cluster.isMaster) {
  for (let i = 0; i < workers; i++) {
    cluster.fork()
  }

  run()
} else {
  example.process(async job => {
    for (let i = 0; i <= 100; i++) {
      await sleep(Math.random())
      job.progress(i)
      if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`)
    }
  })
}
