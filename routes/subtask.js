module.exports = {
  get: async ctx => {
    ctx.body = 'subtask get';
  },
  post: async ctx => {
    ctx.body = 'subtask post';
  },
  put: async ctx => {
    ctx.body = 'subtask put';
  }
}