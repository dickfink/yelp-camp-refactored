var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

//INDEX - show all campgrounds belonging to logged in user
router.get("/", isLoggedIn, function(req, res){
   var currentUser = res.locals.currentUser;
      // Get all campgrounds from DB where the author's ID matches the current user's ID
      Campground.find({"author.id": currentUser.id}).exec(function(err, userCampgrounds){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(userCampgrounds);
            } else {
               res.render("profile",{campgrounds: userCampgrounds, page: 'profile'});
            }
         }
      });
  });

//   SHOW RANDOM CAMPGROUND
  router.get("/random", isLoggedIn, function(req, res){
   var currentUser = res.locals.currentUser;
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
      });
  });

module.exports = router;