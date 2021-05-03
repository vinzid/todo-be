const app = require('../app');
const supertest = require('supertest')
const request = supertest(app.listen());

it('todo get api', async done => {
  const response = await request.get('/')
  expect(response.status).toBe(200);
  expect(response.body.data).toBeInstanceOf(Array);
  done();
});

it('todo post api', async done => {
  const response = await request.post('/')
  expect(response.status).toBe(401);
  expect(response.body.error[0].status).toBe(401);
  done();
});

it('todo put api', async done => {
  const response = await request.put('/')
  expect(response.status).toBe(401);
  expect(response.body.error[0].status).toBe(401);
  done();
});