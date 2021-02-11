'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  // We're going to use some sequelize validation here.
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1,99],
        msg: 'Name must be between 1 and 99 characters.'
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid Email.'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8,99],
        msg: 'Password must be between 8 and 99 characters',
      },
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  // NEW NEW we add a hook to change intercept the event of a user being created
  user.addHook('beforeCreate', (pendingUser) => {
    // Very simlar to client side js events, but these are lifecycle events!
    // Lookup sequalize hooks and lifecycle event to find all other events and call order.
    let hash = bcrypt.hashSync(pendingUser.password, 12); // encryption up to 12 binary numbers
  
    // I had heard that bcrypt isn't actually what we should be using in production for node.js apps...
    // OK wait after some research it appears that bcrypt has dependancies that make the password vulnarable?

    // LOL ok even more research, bcrypt (node built in sycrpt) could not be the best solutions,
    // reason being: 
    //    -they might not be as safe as we think
    //    -The computation time nessary to get a safe hash is not worth the security it provides.
    
    // simplecrypt is an alternative for very simple encryptions and decryptions.
    // bcrypt.js is another alternative that has NO dependancies, it's comparable to C++ bcrypt binding.
    pendingUser.password = hash;
  });
  
  // Here we create a method function for checking if the hashed password is 
  user.prototype.validPassword = function(typedPassword) {
    return bcrypt.compareSync(typedPassword, this.password);
  }
  
  // just a way to return the user instance object as JSON and remove the password.
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;
    return userData;
  }
  
  // I'm going to write some other code that uses bcrypt.js just because there are problems with bcrypt.
  return user;
};


