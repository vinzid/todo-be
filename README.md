## Todo Backend
Use [Koa](koa) to bootstrap

### Software
Necessary software and the version used in development
- [Node](node) v14.16.1
- [PostgreSQL](postgresql) v12.6-3

### Data
#### Database
create database in PostgreSQL
```
DROP DATABASE IF EXISTS todo_app;
CREATE DATABASE todo_app;
USE todo_app;
```
#### Table
Connect to the database above and create tables
```
DROP TYPE IF EXISTS status;
CREATE TYPE status as enum('pending', 'completed');
DROP SEQUENCE IF EXISTS todo_id_seq;
CREATE SEQUENCE IF NOT EXISTS todo_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
DROP TABLE IF EXISTS todo;
CREATE TABLE IF NOT EXISTS todo
(
    id integer NOT NULL DEFAULT nextval('todo_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status status NOT NULL DEFAULT 'pending'::status,
    created_at date NOT NULL DEFAULT now(),
    CONSTRAINT todo_pkey PRIMARY KEY (id)
);

DROP SEQUENCE IF EXISTS subtask_id_seq;
CREATE SEQUENCE IF NOT EXISTS subtask_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
DROP TABLE IF EXISTS subtask
CREATE TABLE IF NOT EXISTS subtask
(
    id integer NOT NULL DEFAULT nextval('subtask_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    todo_id integer NOT NULL,
    status status NOT NULL DEFAULT 'pending'::status,
    created_at date NOT NULL DEFAULT now(),
    CONSTRAINT subtask_pkey PRIMARY KEY (id),
    CONSTRAINT subtask_todo FOREIGN KEY (todo_id)
        REFERENCES public.todo (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
```
#### Record
Insert some test record (optional), which can also be added via frontend
```
INSERT INTO todo (title) VALUES
    ('Do laudry'),
    ('Do something else');

INSERT INTO subtask (title, todo_id) VALUES
    ('Pick up the clothes', 1),
    ('Throw the clothes in the machine', 1),
    ('Turn on the machine', 1),
    ('Bring back the clothes', 1),
    ('Dry the clothes', 1);
```

### Environment
Please change the specific items base on your configuration
```
export PGUSER=postgres
export PGHOST=127.0.0.1
export PGPASSWORD=123456
export PGDATABASE=todo_app
export PGPORT=5432
```

### Install
Install the npm dependency
>npm i

### Run
Start the server
>npm start

### Test
Test for the api
>npm test

### Access
>http://localhost:3001


[koa]: https://koajs.com
[node]: https://nodejs.org
[postgresql]: https://www.postgresql.org