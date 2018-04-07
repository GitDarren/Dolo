var db = require('../models')
var passport = require("../config/passport.js");

module.exports = function(app) {


  // //CREATE ORG
  // app.post("/api/orgs", function(req, res) {
  //   console.log(req.body)
  //   db.Org.create({
  //     name: req.body.name,
  //     description: req.body.description,
  //     web: req.body.web,
  //     org_categoryID: req.body.org_categoryID
  //   }).then(dbOrg=>res.json(dbOrg))
  //   .catch(err=>res.json(err));
  // });

  //====================Donation CRUD Routes=====================
  //=============================================================

    //GET route to return ALL Donations (need?)
    // app.get("/api/donations", function(req, res) {
    //   db.Donation.findAll({}).then(dbDonation=>res.json(dbDonation));
    // });

    // GET route for returning all Donations of a specific user
    app.get("/api/donations/:uid", function(req, res) {
      //console.log(req.user.uid);
      db.Donation.findAll({
        where: {
          uid: req.params.uid
        }
      })
      .then(function(dbDonation) {
        res.json(dbDonation);
      });
    });

    // GET route for returning all Donations by category
    app.get("/api/donations/item_categoryID/:item_categoryID", function(req, res) {
      db.Donation.findAll({
        where: {
          item_categoryID: req.params.item_categoryID

        }
      })
      .then(function(dbDonation) {
        res.json(dbDonation);
      });
    });

    // CREATE a donation
    app.post("/api/donations/:uid", function(req, res) {
      console.log("test");
      console.log(req.body);
      db.Donation.create({
        name: req.body.name,
        description: req.body.description,
        uid: req.params.uid,
        //uid: 3,
        item_categoryID: req.body.item_categoryID,
        type: req.body.type
      }).then(dbDonation=>res.json(dbDonation))
      // .catch(err=>res.json(err));

    });

    //GET route for retrieving a donation to edit
    // app.get("/api/donations/:id", function(req, res) {
    //   db.Donation.findById({ where: {id: req.params.id} }).then(data=>res.json(data));
    // });

    app.get("/api/donations/id/:id", function(req, res) {
      console.log("this should be a item ID "+ req.params.id);
      //console.log(req.body);
      db.Donation.findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbDonation) {
        res.json(dbDonation);
      });
    });

    // PUT route for updating Donation
    app.put("/api/donations/id/:id", function(req, res) {
      // console.log(req.params.id);
      // console.log(req.body);
      db.Donation.update({
        description: req.body.description,
        name: req.body.name,
        item_categoryID: req.body.item_categoryID
      },
        {
          where: {
            id: req.params.id
          }
        })
      .then(function(dbDonation) {
        res.json(dbDonation);
      });
    });

    // DELETE route for deleting Donation
    app.delete("/api/donations/:id", function(req, res) {
      db.Donation.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(function(dbDonation) {
        res.json(dbDonation);
      });
    });

  //=============orgs can search donations by category=================
  //===================================================================
  // GET route for returning all Donations by category
  app.get("/api/donations/:item_categoryID", function(req, res) {
    db.Donation.findAll({
      where: {
        //item_categoryID: 2
        item_categoryID: req.params.item_categoryID
      }
    })
    .then(function(dbDonation) {
      res.json(dbDonation);
    });
  });

  //=============donors can search requests by category================
  //===================================================================
  // GET route for returning requests of a specific category
  app.get("/api/requests/item_categoryID/:item_categoryID", function(req, res) {
    db.Request.findAll({
      where: {
        //item_categoryID: 2
        item_categoryID: req.params.item_categoryID
      }
    })
    .then(function(dbRequest) {
      res.json(dbRequest);
    });
  });

  //====================Request/Needs CRUD Routes======================
  //===================================================================

  //GET route to return ALL requests/needs
  // app.get("/api/requests", function(req, res) {
  //   db.Request.findAll({}).then(dbRequest=>res.json(dbRequest));
  // });

   // GET route for returning all Donations of a specific user
   app.get("/api/requests/:uid", function(req, res) {
    db.Request.findAll({
      where: {
        uid: req.user.id
        //uid: 2
      }
    })
    .then(function(dbRequest) {
      res.json(dbRequest);
    });
  });


  // Get route for retrieving a request to edit
  app.get("/api/requests/:id", function(req, res) {
    db.Request.findById(req.params.id).then(data=>res.json(data));
  });

  // app.get("/api/requests/:id", function(req, res) {
  //   db.Request.findOne({
  //     where: {
  //       id: req.params.id
  //     }
  //   })
  //   .then(function(dbRequest) {
  //     res.json(dbRequest);
  //   });
  // });


  //CREATE Request
  app.post("/api/requests", function(req, res) {
    db.Request.create({
      name: req.body.name,
      description: req.body.description,
      uid: req.user.uid,
      item_categoryID: req.body.item_categoryID,
      type: req.body.type
    }).then(dbRequest=>res.json(dbRequest))
    //.catch(err=>res.json(err));
  });

  // PUT route for updating request
  app.put("/api/requests/:id", function(req, res) {
    db.Request.update(req.body,
      {
        where: {
          id: req.params.id
        }
      })
    .then(function(dbRequest) {
      res.json(dbRequest);
    });
  });
  

  // DELETE route for deleting request
  app.delete("/api/requests/:id", function(req, res) {
    db.Request.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function(dbRequest) {
      res.json(dbRequest);
    });
  });
  
  //======================Authentication Routes=========================
  //===================================================================

    //Using the passport.authenticate middleware with our local strategy.
    //If the user has valid login, they will be sent to the donations or organization page
    //Otherwise the user will be given an error
  
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the donations page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/donations");

    //NEED IF statement here to send users to either /donations or /organization 
  });

  app.post("/api/users", function(req, res) {
    db.User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      donor: req.body.donor,
      name: req.body.name,
      phone: req.body.phone,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      orgId: req.body.orgId
    }).then(function(err) {
      dbUser=>res.json(dbUser)
      res.redirect(307, "/api/login");
    }).catch(function(err)  {
      console.log(err);
      res.json(err);
    })
  });


    //CREATE ORG
    app.post("/api/orgs", function(req, res) {
      console.log(req.body)
      db.Org.create({
        name: req.body.name,
        description: req.body.description,
        web: req.body.web,
        org_categoryID: req.body.org_categoryID
      }).then(dbOrg=>res.json(dbOrg))
      .catch(err=>res.json(err));
    });

      //Route for logging user out
      app.get("/logout", function(req, res)   {
        req.session.destroy(err => {
          res.redirect("/index");
        });

    });

    // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email
      res.json({
        name: req.user.name,
        street: req.user.street,
        city: req.user.city,
        state: req.user.state,
        email: req.user.email, 
        phone: req.user.phone,
        zip: req.user.zip,
        id: req.user.id
      });
    }
  });
  

}