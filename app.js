const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

// app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( express.static( "views" ) );
mongoose.connect(process.env.DB_ADDRESS);

// Creating Schema 
const courseSchema = new mongoose.Schema({
    Title: String,
    Category: Number,
    Cost: Number,
    Mode: String,
    Date: String,
    Location: String,
    Facilities: String,
    Thumbnail: String,
    organizer: String,
    Description: String
});
const Courses = mongoose.model("courses", courseSchema, 'courses');

const userSchema = new mongoose.Schema({
    Name: String,
    Gender: String,
    Age: Number,
    Mobile: Number,
    Email: String,
    PasswordSalt: String,
    PasswordHash: String,
    Username: String,
    RegisterdCourse: String
});
const User = mongoose.model("user", userSchema);

const volunteerSchema = new mongoose.Schema({
    Title: String,
    Location: String,
    Duration: String,
    Description: String,
    Image: String,
    Contact: Number,
    Date: String
})
const Volunteer = mongoose.model("volunteer", volunteerSchema, 'Volunteers');

const featuredSchema = new mongoose.Schema({
    Title: String,
    Image: String,
    Duration: String,
    Location: String
});
const FeaturedCourse = mongoose.model("FeaturedCourse", featuredSchema, "Featured_courses");

app.get("/", async function(req,res){
    res.render('index', {
        featured_courses: await FeaturedCourse.find({})
    });
});

app.get("/register", function(req,res){
  res.render('register.ejs');
});

app.get("/register/application_submitted", function(req,res){
  res.render('applicationsubmitted.ejs');
});

app.get("/payment", function(req,res){
  res.render('payment.ejs');
});
// Define a route using app.get
app.get('/advanced_courses', async (req, res) => {
    try {
      const advanced_courses = await Courses.find({ Category: 1 });
      res.render('courses', { heading:"Advanced Courses", courselist: advanced_courses }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/basic_courses', async (req, res) => {
    try {
      const basic_courses = await Courses.find({ Category: { $in: [3, 2] } });
      res.render('courses', { heading:"Basic Courses", courselist: basic_courses }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.get('/volunteer', async (req, res) => {
    try {
      const volunteering = await Volunteer.find();
      res.render('courses', { heading:"Volunteering", courselist: volunteering }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/volunteer', async (req, res) => {
    try {
      const volunteering = await Volunteer.find();
      res.render('courses', { heading:"Volunteering", courselist: volunteering }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/courses/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    
    Courses.findOne({ _id: courseId })
      .then(course => {
        if (!course) {
          return res.status(404).send('Course not found');
        }
        // Render the course description page with EJS and pass the course data
        res.render('course-description', { course });
      })
      .catch(err => {
        // Handle errors here
        res.status(500).send('Error fetching course details');
      });
  });


app.get('/volunteer/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    Volunteer.findOne({ _id: courseId })
        .then(course => {
        if (!course) {
            return res.status(404).send('Course not found');
        }
        // Render the course description page with EJS and pass the course data
        res.render('volunteer-description', { course });
        })
        .catch(err => {
        // Handle errors here
        res.status(500).send('Error fetching course details');
        });
}); 


app.post('/', async (req, res) => {
    // console.log(req.body.searchquery);
    try {
        const searchresults = await Courses.find({ Title: { $regex: req.body.searchquery, $options: "i" } });
        console.log(searchresults);
        res.render('courses', { heading:`Search Results : "${req.body.searchquery}"`, courselist: searchresults }); 
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});
  

app.listen(2000, function() {
    console.log("Server started on port 2000");
}); 

