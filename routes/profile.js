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
//   if(req.query.search && req.xhr) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//       // Get all campgrounds from DB
//       Campground.find({name: regex}, function(err, allCampgrounds){
//          if(err){
//             console.log(err);
//          } else {
//             res.status(200).json(allCampgrounds);
//          }
//       });
//   } else {
   var currentUser = res.locals.currentUser;
   console.log("Current user: " + currentUser.username);
      // Get all campgrounds from DB
      Campground.find({}).exec(function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allCampgrounds);
            } else {
               let userCampgrounds = [];
            allCampgrounds.forEach(campground => {
               console.log("Campground User: " + campground.author.username)
               if(currentUser.username == campground.author.username)
                  {userCampgrounds.push(campground)}; 
            });
            console.log("all user's campgrounds: ")
            console.log(userCampgrounds);
            res.render("profile",{campgrounds: userCampgrounds, page: 'profile'});
            }
         }
      });
  });

module.exports = router;

