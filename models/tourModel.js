const mongoose = require('mongoose');
const slugify = require('slugify');

const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name:{
         type: String,
         required: [true, 'tour must have a name'],
         unique: true,
         trim:true,
         maxLength: [40,'A tour name must have less than or equal to 40 characters'],
         minLength: [10,'A tour name must have less than or equal to 10 characters'],
    //     validate: [validator.isAlpha , 'Tour name must only contain alpha character']
    },
    slug: String,
    duration:{
         type: Number,
         required: [true, 'A tour must have durations']

    },
    maxGroupSize:{
        type: Number,
        required: [true,'A tour must have a group size']
    },
    difficulty:{
       type: String,
       required:[true,'A tour must have a difficulty'],
       enum: {
        values : ['easy','medium','difficult'],
        messgae: 'Difficulty is either east medium or difficulty'
    }
    },
    ratingAverage: {
         type: Number,
         default:4.5,
         min:[1,"Rating must be above 1.0"],
         max:[5,"Rating must be below 5.0"],
         set: val => Math.round(val * 10) /10 // 4.6666 => 4.5
    },
    ratingQuantity:{
       type:Number,
       default: 0
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price']
    },
    priceDiscount:{
        type: Number,
        validate: function(val){
            // this only point to the curr doc on new document creation
            return val < this.price;
        },
        message: 'Discount price ({VALUE})should be below the regular price'
     },
    summary:{
        type: String,
        trim: true, // remove white space at start and last
        required:[true, 'A tour must have a summary']
    },
    description:{
          type:String,
          trim:true
    },
    imageCover:{
        type: String,
        required: [true, 'A tour must have a image']
    },
    images:[String],
    createAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates : [Date],
    secretTour:{
         type:Boolean,
         default: false
    },
    startLocation:{
        //Geo JSON 
        type:{
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String, 
    },
    locations: [
        {
            type:{
                type:String,
                default:'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
       { 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }

    ]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }  // convert virtual fields to real fields in the output document
 
}
);

tourSchema.index({price : 1 , ratingAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({ startLocation: '2dsphere'});

tourSchema.virtual('durationWeeks').get(function(){
     return this.duration/ 7;   // because 1 week has 7 days 
})

// virtual populated fields 
tourSchema.virtual('reviews', {
    ref :'Review',
    foreignField : 'tour',
    localField: '_id'
});

// document middleware runs before  .save() and .create()
// pre save hook

tourSchema.pre('save',function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

// embedding user guides in tour model


// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// tourSchema.pre('create',function(next){
//     console.log("will save document");
//     next();
// });
// tourSchema.post('save' , function(doc,next){
//     console.log(doc);
//     next();
// });


// query middleware
tourSchema.pre(/^find/, function(next){
     this.find({secretTour : {$ne : true}});
     this.start = Date.now();
     next();
});

tourSchema.pre(/^find/ , function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt' // exclude these fields from the output
      });
      next();
});

// tourSchema.post(/^find/, function(docs,next){
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     next();
// });


// aggregation middleware
// tourSchema.pre('aggregate', function(next){
//   this.pipeline().unshift({$match: {secretTour : {$ne : true}}});
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports  =Tour;