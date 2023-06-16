export const createExampleTable =
  'create table if not exists examples(id integer primary key not null,\
  name text,\
  example_float real,\
  example_json text);';

export const addExample =
  'insert into examples\
(name, example_float, example_json) \
values (?, ?, ?)';

export const getAllExamples = 'select * from examples';
