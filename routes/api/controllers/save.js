import express from 'express';
var router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (req.session.isAuthenticated) {
      let username = req.body.username;
      let user = await req.models.User.findOne({username: username});

      let url = req.body.url;
      let video = await req.models.Post.findOne({url: url});

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


router.post('/delete', async (req, res, next) => {
  let username = req.body.username;

  try {
    let user = await req.models.User.findOne({username: username});
    let savedVids = user.saved_videos;

    let index = savedVids.indexOf(req.body.url);
    savedVids.splice(index, 1);
    console.log(savedVids);

    await req.models.User.updateOne({username: username}, {saved_videos: savedVids});
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"status": "error", "error": err.message});
  }
});

export default router;