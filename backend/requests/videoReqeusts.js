const videoSchema = require('../schemas/videoSchema');
const mongoose = require('mongoose');
const Video = mongoose.model('Video', videoSchema, "Videos");
module.exports = function (app) {
  // Return all videos
  app.get('/videos', function (req, res) {
    Video.find()
      .then(videos => {
        if (!videos) {
          return res.status(404).send('Video(s) not found');
        }
        res.send(videos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving videos from database');
      });
  });
  // Return a specific video
  app.get('/videos/:vid', function (req, res) {
    Video.findOne({ vid: req.params.vid })
      .then(video => {
        if (!video) {
          return res.status(404).send('Video not found');
        }
        res.status(200).send(video.link);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving video from database');
      });
  });
  //Get favourites by username
  app.get('/videos/favorites/:username', function (req, res) {
    Video.find({ favby: req.params.username })
      .then(videos => {
        if (videos.length === 0) {
          return res.status(404).send('No videos found');
        }
        const vids = videos.map(video => video);
        res.status(200).send(vids);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving videos from database');
      });
  });
  //Add video to favourites
  app.post('/videos/:vid/:name', (req, res) => {
    const vid = req.params.vid;
    const name = req.params.name;
  
    Video.findOne({vid: vid, favby: {$in: [name]}})
      .then(result => {
        if (result) {
          res.status(400).send('User already added this video to favourites');
        } else {
          Video.updateOne({vid: vid}, {$addToSet: {favby: name}})
            .then(result => {
              res.status(200).send('Favourites updated successfully');
            })
            .catch(err => {
              console.error(err);
              res.status(500).send('Internal server error');
            });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
      });
  });

  //Remove video from favourites
  app.delete('/videos/remove/:vid/:name', (req, res) => {
    const vid = req.params.vid;
    const name = req.params.name;
  
    Video.findOne({vid: vid, favby: {$in: [name]}})
      .then(result => {
        if (!result) {
          res.status(400).send('User has not added this video to favourites');
        } else {
          Video.updateOne({vid: vid}, {$pull: {favby: name}})
            .then(result => {
              if (result.nModified === 0) {
                res.status(400).send('No changes made to favourites');
                console.log("No changes were made")
              } else {
                res.status(200).send('Favourites updated successfully');
                console.log("Successful writing")
              }
            })
            .catch(err => {
              console.error(err);
              res.status(500).send('Internal server error');
            });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
      });
  });
}