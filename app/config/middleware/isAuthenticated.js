
//MiddlewarE for restricting routes a user is not allowed to visit if not logged in

module.exports = function(req, res, next)  {
    //Once the user logs in, then allow the user to continue down the restricted route
    if (req.user)   {
        return next();
    }

    //If the user isn't logged in, restrict them to the home page
    return res.redirect("/index.html");
};

