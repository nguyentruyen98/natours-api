const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED_REJECTION! Shutting down...');
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED_EXCEPTION! Shutting down...');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connect success');
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running ${PORT}`);
});
