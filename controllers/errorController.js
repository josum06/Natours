const { JsonWebTokenError } = require('jsonwebtoken');
const AppError = require('../utils/appError');


const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again!',401);

const handleJWTError = () => new AppError('Invalid token. Please log in again!',401);

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message,404);
}

const handleDuplicateKeyErrorDB = err => {
   const errors =Object.values(err.errors).map(el => el.message);

    const value = err.keyValue.name;
    console.log(value);
    const message = `Duplicate field of ${value} : please use another value`
    return new AppError(message,400);
}

const handleValidationErrorDB = err => {
    const errors =Object.values(err.errors).map(el => el.message)
    const message = `Inavlid input data .${errors.join('.')}`;
    return new AppError(message,400);
}

const sendErrorDev = (err,req,res)=>{
    // API
    if(req.originalUrl.startsWith('/api')){
            return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
         });
    }
    console.error('ERROR 🐱‍🏍🐱‍🏍🐱‍🏍',err)
        // RENDERED WEBSITE
            return res.status(err.statusCode).render('error' ,{
            title: 'Something went wrong',
            msg: err.message
    })
}

const sendErrorProd = (err,req,res)=>{

    if(req.originalUrl.startsWith('/api')){
         // operational error , trusted error.
        if(err.isoperational){
            return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
         });
        } 
           console.error('ERROR 🐱‍🏍🐱‍🏍🐱‍🏍',err);
            // 2 send generic message 
                return  res.status(500).json({
                status:'error',
                message: 'Something went wrong'
            });

    }
        // RENDERED WEBSITE
        if(err.isoperational){
                return res.status(err.statusCode).render('error' ,{
                title: 'Something went wrong',
                msg: err.message
            });
        } 
        // unknown error
               console.error('ERROR 🐱‍🏍🐱‍🏍🐱‍🏍',err)
                // 2 send generic message 
                    return  res.status(err.statusCode).render('error' ,{
                    title: 'Something went wrong',
                    msg: 'please try again later'
                })
}
module.exports = (err,req,res,next) => {
    

     err.statusCode = err.statusCode || 500;
     err.status = err.status || 'error';
    
      if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err,req,res);
      }else if(process.env.NODE_ENV.trim() === 'production'){

        let error = {...err};
        error.message = err.message;
        error.name = err.name;
        
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        
        if(error.code === 11000) error = handleDuplicateKeyErrorDB(error);

        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);


        if(error.name === 'JsonWebTokenError') error= handleJWTError();

        if(error.name === 'TokenExpiredError') error= handleJWTExpiredError();
        sendErrorProd(error,req, res);
      }
      
}