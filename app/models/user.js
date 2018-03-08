//Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module

var bcrypt = require("bcrypt-nodejs");

//creating the user model
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    donor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: {
      type: DataTypes.STRING,
      validate: {
        len: [2]
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    orgId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orgs',
        key: 'id'
      }
    }
  }, {
      classMethods: {
        associate: function (models) {
          // associations defined here
          models.User.hasMany(models.Donation);
          models.Donation.belongsTo(models.User);
          models.User.hasMany(models.Request);
          models.Request.belongsTo(models.User);
        }
      }
    });


//Creating a custom method for our User model.  This will check if an unhashed password entered by the user can be compared to the hashed password
//sotred in our database
User.prototype.validPassword = function (password) {
  console.log('This is the password and the hashed password:', password, this.password);
  return bcrypt.compareSync(password, this.password);
};
//Hooks are automatic methods that run during various phases of the User Model lifecycle
//IN this case, before a User is created, we will automatically hash their password
User.hook("beforeCreate", function (user) {
  console.log('The  User.hook is running');
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
});
return User;
var Org = require('./org.js');

};