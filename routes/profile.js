var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var { isLoggedIn, checkUserCampground, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment
// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all campgrounds
router.get("/", isLoggedIn, function(req, res){
   var currentUser = res.locals.currentUser;
      // Get all campgrounds from DB
      Campground.find({}).exec(function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allCampgrounds);
            } else {
               // load only the current user's campgrounds
               let userCampgrounds = [];
               allCampgrounds.forEach(campground => {
                  if(currentUser.id == campground.author.id)
                     {userCampgrounds.push(campground)}; 
               });
            // show the user's campground
            res.render("profile",{campgrounds: userCampgrounds, page: 'profile'});
            }
         }
      });
  });

module.exports = router;

