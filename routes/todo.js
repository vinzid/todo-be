const { Client } = require('pg');

module.exports = {
  get: async ctx => {
    const client = new Client();
    let result, subtasks;
    try{
      await client.connect();
      result = await client.query(`SELECT id, title, status, created_at FROM todo ORDER BY id`);
      subtasks = await client.query(`SELECT id, title, todo_id, status, created_at FROM subtask ORDER BY id`);
      client.end();
    }catch(e) {
      console.log('todo post error', e);
    }
    if(result && result.rows) {
      if(subtasks && subtasks.rows)
      result.rows.forEach(v => {
        v.subtasks = subtasks.rows.filter(w => v.id === w.todo_id);
        let completed = v.subtasks.filter(w => 'completed' === w.status)
        v.completed = completed.length;
      });
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
    if(!title) {
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
      return;
    }
    let result;
    try{
      await client.connect()
      result = await client.query(`UPDATE todo SET status = '${status}' WHERE id = ${id}`);
      if(result && 1 === result.rowCount) {
        await client.query(`UPDATE subtask SET status = '${status}' WHERE todo_id = ${id}`);
      }
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