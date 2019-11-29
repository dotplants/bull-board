module.exports = async function handler(ctx) {
  try {
    const {
      queues,
      params: { queueName },
    } = ctx

    const queue = queues[queueName]
    if (!queue) {
      ctx.status = 404
      ctx.body = { error: 'queue not found' }
      return
    }

    const jobs = await queue.getJobs('failed')
    await Promise.all(jobs.map(job => job.retry()))

    ctx.status = 200
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
