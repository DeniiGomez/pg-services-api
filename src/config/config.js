module.exports = {
  "development": {
    "username": "root",
    "password": "my_secret",
    "database": "test_login",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || "my_secret",
    "database": process.env.DB_DATABSE || "test_login",
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_CONNECTION || "mysql" || "postgres",
  }
}