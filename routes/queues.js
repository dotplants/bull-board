const getDataForQeues = require('./getDataForQeues')

module.exports = async function handler(ctx) {
  ctx.body = await getDataForQeues({
    queues: ctx.queues,
    query: ctx.query,
  })
}
