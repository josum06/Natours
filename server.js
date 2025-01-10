const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException' ,err => {
  console.log(err.name , err.message);
  console.log('UNCAUGHT EXCEPTION ! 🐭🐭 shutting down..... ');
  process.exit(1);
})

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const app = require('./app');

// Replace placeholder in the database URL with the actual password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, // Only this is needed in modern Mongoose versions
    autoIndex: true
  })
  .then(() => console.log('DB connection successful 🐱‍🚀'));

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name , err.message);
  console.log('UNHANDLED REJECTION ! 🐭🐭 shutting down..... ');
  server.close(() => {
    process.exit(1); 
  });
})

 