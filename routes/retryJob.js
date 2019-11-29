module.exports = async function retryJob(ctx) {
  try {
    const {
      queues,
      params: { queueName, id },
    } = ctx

    const queue = queues[queueName]

    if (!queue) {
      ctx.status = 404
      ctx.body = { error: 'queue not found' }
      return
    }

    const job = await queue.getJob(id)

    if (!job) {
      ctx.status = 404
      ctx.body = { error: 'job not found' }
      return
    }

    await job.retry()
    ctx.status = 204
    return
  } catch (e) {
    ctx.body = {
      error: 'queue error',
      details: e.stack,
    }
    ctx.status = 500
    return
  }
}
