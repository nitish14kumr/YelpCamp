require('dotenv').config();

var methodOverride  = require("method-override"),
    LocalStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    express         = require("express"),
    flash           = require("connect-flash"),
    faker           = require("faker"),
    app             = express();
    
var Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    resetRoutes         = require("./routes/reset"),
    indexRoutes         = require("./routes/index");

// console.log(process.env);
// var dburl = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";  
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(flash());
app.locals.moment = require('moment');
// seedDB();

// PASSPORT CONFIGURATION
// maintain this order
app.use(require("express-session")({
    secret: "This is good",
    resave: false,
    saveUninitialized: false
}));
// then this
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(resetRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("Server Started!");
});