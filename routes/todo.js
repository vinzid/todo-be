const { Client } = require('pg');

module.exports = {
  get: async ctx => {
    const client = new Client();
    let result
    try{
      await client.connect();
      result = await client.query(`SELECT id, title, status, created_at FROM todo ORDER BY id`);
      client.end();
    }catch(e) {
      console.log('todo post error', e);
    }
    if(result && result.rows) {
      ctx.body = {
        data: result.rows
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: [{
          status: 500,
        }]
      }
    }
  },
  post: async ctx => {
    const client = new Client();
    const { title } = ctx.request.body;
    let result;
    try{
      await client.connect();
      result = await client.query(`INSERT INTO todo (title) VALUES (E'${title.replace(/(['\\])/, "\\$1")}')`);
      client.end();
    }catch(e) {
      console.log('todo post error', e);
    }
    if(result && 1 === result.rowCount) {
      ctx.body = {
        data: {
          title
        }
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: [{
          status: 500,
        }]
      }
    }
  },
  put: async ctx => {
    const client = new Client();
    const { id, status } = ctx.request.body;
    if(!id || !status) {
      ctx.status = 401;
      ctx.body = {
        error: [{
          status: 401,
        }]
      }
    }
    let result;
    try{
      await client.connect()
      result = await client.query(`UPDATE todo SET status = '${status}' WHERE id = ${id}`);
      client.end();
    }catch(e) {
      console.log('todo post error', e);
    }
    if(result && 1 === result.rowCount) {
      ctx.body = {
        data: {
          id,
          status,
        }
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: [{
          status: 500,
        }]
      }
    }
  }
}