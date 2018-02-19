process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION', err);
  throw err;
});

process.on('unhandledRejection', (err) => {
  console.log('UNCAUGHT PROMISE', err);
  throw err;
});
