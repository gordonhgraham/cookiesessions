module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/authorization',
    pool: {
      min: 1,
      max: 1
    }
  }
};
