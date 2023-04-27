const userSchema = require('../schemas/userSchema');
const mongoose = require('mongoose');
const User = mongoose.model('User', userSchema, "Users");


module.exports = function (app) {
  //Return a user by their name
  app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({ name: username })
      .then(user => {
        if (!user) {
          // If the user doesn't exist, return a 404 Not Found error
          return res.status(404).json({ message: 'User not found' });
        }
        // Send the user as a JSON object to the front-end
        res.json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server Error');
      });
  });
  // Return all items in collection
  app.get('/users', function (req, res) {
    User.find()
      .then(users => {
        if (!users) {
          return res.status(404).send('User(s) not found');
        }
        res.send(users);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving users from database');
      });
  });

  //Login the user if name and password matches
  app.post('/users/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ name: username, pass: password})
      .then(user => {
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).send(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving user from database');
      });
  });

  //Add a user to the collection
  app.post('/register', (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const gender = req.body.gender;
    const email = req.body.email;
    const favnum = req.body.favnum;
  
    User.findOne({name: username})
      .then(user => {
        if (user) {
          // a user with the same name already exists, send an error response
          res.status(400).send('User with that name already exists');
        } else {
          // no user with the same name exists, create a new user and save it to the database
          const newUser = new User({
            name: username,
            pass: password,
            gender: gender,
            email: email,
            favnum: favnum
          }, {versionKey: false});
          
          newUser.save()
            .then(() => {
              // user saved successfully, send a response or redirect
              res.status(200).send('User created successfully');
            })
            .catch(err => {
              // an error occurred, handle the error
              console.error(err);
              res.status(500).send('Internal server error');
            });
        }
      })
      .catch(err => {
        // an error occurred, handle the error
        console.error(err);
        res.status(500).send('Internal server error');
      });
  });

  // Remove user from collection
  app.get('/users/remove/:name', (req, res) => {
    const name = req.params.name;
    User.findOneAndDelete({ name: name })
      .then(result => {
        if (result) {
          res.status(200).send('User deleted successfully');
        } else {
          res.status(400).send('User not found');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
      });
  });
}
