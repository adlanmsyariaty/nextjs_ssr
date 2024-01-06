# WEB PLATFORM - SocioX

This Repo includes backend using NodeJS and frontend using NextJS. We use Server Side Rendering.

This apps need to integrate to Twillio as SMS Service (third party API).

## How to Run

### Server

1. go to server folder - `cd ./server`
2. run this command - `npm install`
3. prepare database connection using postgreSQL
4. change file in config/config.json as below.

```
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "db",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

5. create `.env` file and fill the environment value. Example -> `.env.sample`
6. start the application by using this command `npm start`

### Client

1. go to client folder - `cd ./client/sociox`
2. run this command - `npm install`
3. start client using this command - `npm run dev`

Deployment Link:
http://13.229.204.192:3001/
