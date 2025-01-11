const fs=require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')

// Load environment variables from config.env
dotenv.config({ path: './config.env' });


// Replace placeholder in the database URL with the actual password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Only this is needed in modern Mongoose versions
  })
  .then(() => console.log('DB connection successful 🐱‍🚀'))

  // Read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));


  // import data into db
const importData = async()=>{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);

        console.log('Data succesfully loaded');
        process.exit();
    }catch(err){
        console.log(err)
    }
}

// delete all data
const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data succesfully deleted ');
        process.exit();
    }catch(err){
        console.log(err)
    }
}

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] == '--delete'){
    deleteData();
}
