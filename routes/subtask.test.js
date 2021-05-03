const app = require('../app');
const supertest = require('supertest')
const request = supertest(app.listen());

it('subtask get api', async done => {
  const response = await request.get('/subtask')
  expect(response.status).toBe(200);
  expect(response.body.data).toBeInstanceOf(Array);
  done();
});

it('subtask post api', async done => {
  const response = await request.post('/subtask')
  expect(response.status).toBe(401);
  expect(response.body.error[0].status).toBe(401);
  done();
});

it('subtask put api', async done => {
  const response = await request.put('/subtask')
  expect(response.status).toBe(401);
  expect(response.body.error[0].status).toBe(401);
  done();
});