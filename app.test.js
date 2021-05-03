const Koa = require('koa');

it('app exported', () => {
  const app = require('./app');
  expect(app).toBeInstanceOf(Koa)
});