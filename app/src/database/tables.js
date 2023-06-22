export const createUsersTable =
  'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY NOT NULL,name TEXT,password TEXT);';

export const createConfigTable =
  'CREATE TABLE IF NOT EXISTS config( \
userId INTEGER NOT NULL,\
appVersion INTEGER NOT NULL,\
authenticationCode TEXT NOT NULL,\
serverURL TEXT NOT NULL,\
syncInterval REAL,\
syncWifiOnly TINYINT,\
lang VARCHAR(255) DEFAULT "en" NOT NULL,\
UNIQUE(userId));';

export const createFormsTable =
  'CREATE TABLE IF NOT EXISTS forms( \
id INTEGER PRIMARY KEY NOT NUll,\
formId INTEGER NOT NULL,\
version INTEGER,\
name VARCHAR(255),\
json TEXT,\
createdAt DATETIME);';

export const createDatapointsTable =
  'CREATE TABLE IF NOT EXISTS datapoints( \
id INTEGER PRIMARY KEY NOT NUll,\
form INTEGER NOT NULL,\
user INTEGER NOT NULL,\
name VARCHAR(255),\
submitted TINYINT,\
duration REAL,\
createdAt DATETIME,\
submittedAt DATETIME,\
syncedAt DATETIME,\
json TEXT);';
