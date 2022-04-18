const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// data sanitization agains NoSQL injection
app.use(mongoSanitizer());
// data sanitization agains xss
app.use(xss());
// prevent parameter polltion
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// serving static files
app.use(express.static(`${__dirname}/public`));
// 1 Middlewares
//limit request form same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
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
