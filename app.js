const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// 1 Middlewares
app.use((req, res, next) => {
  console.log('Time:', new Date().toLocaleString());
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// Ở chỗ này thằng cuối cùng phải là end res cycle, nếu không thì phải truyền err trong hàm next() để đi đến thằng middleware tiếp theo
// app.use((err, req, res, next) => {
//   console.log('App successfully');
//   next();
// });
// app.use((err, req, res, next) => {
//   console.log('App successfully1');
//   next();
// });
// app.use((err, req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

module.exports = app;
