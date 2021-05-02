const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();

const todo = require('./routes/todo.js');
const subtask = require('./routes/subtask.js');

app.use(bodyParser());
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  if (ctx.request.method === 'OPTIONS') {
    ctx.status = 204;
  } else {
    await next();
  }
});

routes = ['/', '/subtask'];
[todo, subtask].forEach((v, i) => {
  ['get', 'post', 'put'].forEach(w => {
    router[w](routes[i], v[w]);
  });
});
app.use(router.routes())

app.listen(3001);