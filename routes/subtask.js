const { Client } = require('pg');

module.exports = {
  get: async ctx => {
    const client = new Client();
    let result
    try{
      await client.connect();
      result = await client.query(`SELECT id, title, todo_id, status FROM subtask ORDER BY id`);
      client.end();
    }catch(e) {
      console.log('subtask post error', e);
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
    const { title, todo_id } = ctx.request.body;
    if(!title || !todo_id) {
      ctx.status = 401;
      ctx.body = {
        error: [{
          status: 401,
        }]
      }
      return;
    }
    let result;
    try{
      await client.connect();
      result = await client.query(`INSERT INTO subtask (title, todo_id) VALUES (E'${title.replace(/(['\\])/, "\\$1")}', ${todo_id})`);
      if(result && 1 === result.rowCount) {
        await client.query(`UPDATE todo SET status = 'pending' WHERE id = ${todo_id}`);
      }
      client.end();
    }catch(e) {
      console.log('subtask post error', e);
    }
    if(result && 1 === result.rowCount) {
      ctx.body = {
        data: {
          title,
          todo_id,
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
    const { id, status, todo_id } = ctx.request.body;
    if(!id || !status) {
      ctx.status = 401;
      ctx.body = {
        error: [{
          status: 401,
        }]
      }
      return;
    }
    let result;
    try{
      await client.connect()
      result = await client.query(`UPDATE subtask SET status = '${status}' WHERE id = ${id}`);
      if(result && 1 === result.rowCount) {
        let updateTodo = false;
        if('pending' === status) {
          updateTodo = true;
        } else if(todo_id) {
          let pending = await client.query(`SELECT COUNT(*) FROM subtask WHERE todo_id = ${todo_id} AND status <> '${status}'`);
          if(pending && pending.rows && '0' === pending.rows[0].count) {
            updateTodo = true;
          }
        }
        if(updateTodo) {
          await client.query(`UPDATE todo SET status = '${status}' WHERE id = ${todo_id}`);
        }
      }
      client.end();
    }catch(e) {
      console.log('subtask post error', e);
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