module.exports = async function handler(ctx) {
  try {
    const {
      queues,
      params: { queueName },
    } = ctx

    const GRACE_TIME_MS = 5000

    const queue = queues[queueName]
    if (!queue) {
      ctx.status = 404
      ctx.body = { error: 'queue not found' }
      return
    }

    await queue.clean(GRACE_TIME_MS, 'delayed')

    ctx.status = 200
  } catch (e) {
    ctx.body = {
      error: 'queue error',
      details: e.stack,
    }
    ctx.status = 500
  }
}
