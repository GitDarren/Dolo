var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

//Instructing passport that we want to use a local strategy, meaning we want a login with a username/email and password

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   },

//   function(username, password, done) {
//      console.log('we are in passport!!')
//   }
// ));

passport.use(new LocalStrategy(
    //Sign in will use an email address
    {
        usernameField: "email",
        passwordField: "password"
    },

    function (email, password, done) {
        console.log("We are in the passport.use");
        //When a user tries to sign in, this code runs
        db.User.findOne({
            where: {
                email: email
            }
        }).then(function (dbUser) {
            console.log("The function to find the user is running");
            //If there's no user with a given email
            if (!dbUser) {
                return done(null, false, {
                    message: "Incorrect email"
                });
            }
            //If there is a user with a given email, but the password the user give us is incorrect
            else if (!dbUser.validPassword(password)) {
                console.log("bad password");
                return done(null, false, {
                    message: "Incorrect password"
                });
            }
            //If none of the above, return the user
            return done(null, dbUser);
        });
    }
));

//In order to help keep authentication state across HTTP requests, 
//Sequelize needs to serialize and deserialize the user
//This is boilerplate to make sure all this works (crosses fingers)

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

//Exporting our configured passport
module.exports = passport;