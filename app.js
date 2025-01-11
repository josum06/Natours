const path= require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// start express app
const app = express();


app.set('view engine','pug');
app.set('views' ,path.join(__dirname,'./views'));

// 1) GLOBAL MIDDLEWARE
// Set security HTTP headers



// serving static file.
app.use(express.static(path.join(__dirname , 'public')));

//Set security HTTP headers/ security policies
app.use(helmet());
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org','https://js.stripe.com/v3/'];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
  'https://js.stripe.com/v3/'
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://js.stripe.com/v3/',
  'ws://127.0.0.1:54890',
  'ws://127.0.0.1:54016/',
  'ws://127.0.0.1:*',
  'http://127.0.0.1:3000'
];

const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
//set security http headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['https://js.stripe.com/v3/'],
      connectSrc: ["'self'", "ws://127.0.0.1:*", "ws://localhost:*", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);



// development logging
if( process.env.NODE_ENV ==='development' ){
        app.use(morgan('dev'));
}

// limit request from same api
const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000, // for milliseconds
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api',limiter);


//  bodyparer, reading data from body into req.body
app.use(express.json({limit : '10kb'})); // middleware
app.use(express.urlencoded({extended : true ,limit: '10kb'}));
app.use(cookieParser());

// Data santization against NoSQL query injection
app.use(mongoSanitize());



// Data santization against XSS
app.use(xss()); // convert html code into javascript.

// Prevent parameter pollution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));


// Test middleware.
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log('Cookies:',req.cookies);
    next();
})


// 3) ROUTES

app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter); // middle ware
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);



app.all('*',(req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!` ,404));
});

app.use(globalErrorHandler);


module.exports = app;