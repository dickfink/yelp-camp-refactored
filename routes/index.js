var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");
var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

//root route
// router.get("/", function(req, res){
//     res.render("/campgrounds");
// });

//   SHOW RANDOM CAMPGROUND
router.get("/", function(req, res){
    if(res.locals.currentUser){
    var currentUser = res.locals.currentUser;
    console.log(currentUser);
       // Get all campgrounds from DB where the author's ID matches the current user's ID
       Campground.find({"author.id": currentUser.id}).exec(function(err, userCampgrounds){
          // choose a random # for the total results
          let random = Math.floor(Math.random() * userCampgrounds.length)
          let randomCampground = userCampgrounds[random];
          if(err){
              console.log(err);
          } else {
             if(req.xhr) {
               res.json(randomCampground);
             } else {
                res.render("random",{campground: randomCampground, page: 'random'});
             }
             
          }
       });}
       else{
        console.log('not logged in')
        res.render("random",{campground: [], page: 'random'});
       }
   });

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", `Successfully Signed Up as ${req.body.username}! Please make a campground.`);
           res.redirect("/campgrounds/new"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to YelpCamp!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/campgrounds");
});


module.exports = router;