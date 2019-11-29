const fs = require('fs')
const path = require('path')

const html = fs.readFileSync(
  path.resolve(__dirname, '../ui/index.html'),
  'utf8',
)

module.exports = async ctx => {
  ctx.body = html
}
