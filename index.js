const Queue = require('bull')
const path = require('path')
const Router = require('koa-router')
const serve = require('koa-send')

const queues = {}

function UI(app) {
  const router = new Router()

  app.context.queues = queues

  router.get('/queues', require('./routes/queues'))
  router.put('/queues/:queueName/retry', require('./routes/retryAll'))
  router.put('/queues/:queueName/:id/retry', require('./routes/retryJob'))
  router.put('/queues/:queueName/clean', require('./routes/cleanAll'))
  router.get('/dashboard', require('./routes/index'))
  router.get('/static/*', ctx =>
    serve(ctx, ctx.path.split('/static')[1], {
      root: path.resolve(__dirname, 'static'),
    }),
  )

  return router
}

module.exports = {
  UI,
  setQueues: bullQueues => {
    if (!Array.isArray(bullQueues)) {
      bullQueues = [bullQueues]
    }

    bullQueues.forEach(item => {
      queues[item.name] = item
    })

    return queues
  },
  createQueues: redis => {
    return {
      add: (name, opts) => {
        const queue = new Queue(name, redis, opts)
        queues[name] = queue

        return queue
      },
    }
  },
}
