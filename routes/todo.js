module.exports = {
  get: async ctx => {
    ctx.body = 'todo get';
  },
  post: async ctx => {
    ctx.body = 'todo post';
  },
  put: async ctx => {
    ctx.body = 'todo put'
  }
}