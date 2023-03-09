import express from 'express';
var router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (req.session.isAuthenticated) {
      let username = req.body.username;
      let user = await req.models.User.findOne({username: username});
      console.log(user);

      let url = req.body.url;
      let video = await req.models.Post.findOne({url: url});
      console.log(video);

      let savedVids = user.saved_videos;
      savedVids.push(video);

      await req.models.User.updateOne({username: username}, {saved_videos: savedVids});
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"status": "error", "error": "error"});
  }
});

router.get('/', async (req, res, next) => {
  let username = req.query.username;

  try {
    let user = await req.models.User.findOne({username: username});
    let savedVids = user.saved_videos;

    res.json(savedVids);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"status": "error", "error": err.message});
  }
});

// TODO: BACKEND FOR DELETE FUNCTION
router.delete('/', async (req, res, next) => {

});

export default router;