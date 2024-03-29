import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      let username = req.query.username;
      var user = await req.models.User.findOne({username: username});
    } else {
      let username = "guest";
      var user = {
        username: username,
        seen_videos: [],
        saved_videos: []
      }
    }
    // find Posts in database
    console.log("finding posts in database");
    let posts = await req.models.Post.find();

    // Get the count of unseen posts
    req.models.Post.count({url: {$nin: user.seen_videos}}).exec(function (err, count) {


      if (count == 0) {
        res.json({content: `
          <div class="mt-2">
            <h2>You watched all of the videos. Would you like to reset and watch the videos again?</h2>
            <button id="reset">Reset!</button>
          </div>
        `});
      } else {
        // Get a random entry
        var random = Math.floor(Math.random() * count);

        // Query all users but only fetch one offset by our random #
        req.models.Post.findOne({url: {$nin: user.seen_videos}}).skip(random).exec(
          function (err, result) {
            //console.log(result)
            let postData = {"id": result._id, "url" : result.url, "rank": result.rank, "created_date": result.created_date};

            console.log("sending post data");
            // console.log(postData)
            res.json(postData);
          });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"status": "error", "error": err.message});
  }
})

router.post('/', async (req, res) => {
  console.log('Attempting to POST: ' + req.body);
  if (req.body.rank == "") {
    res.json({status: "error", error: "rank is not selected"});
  } else {
    try {
      // create a new Post object and fill in its contents
      const newPost = new req.models.Post({
        url: req.body.url,
        rank: req.body.rank,
        created_date: new Date()
      });

      // save post to database
      await newPost.save();

      // return json status
      res.json({"status" : "success"});
    } catch (err) {
      console.log(err.message);
      res.status(500).json({"status": "error", "error": err.message});
    }
  }
})

router.post("/seen", async (req, res, next) => {
  let username = req.body.username;
  let url = req.body.url;
  let correct = req.body.correct;

  try {
    let user = await req.models.User.findOne({username: username});

    let seenVids = user.seen_videos;
    seenVids.push(url);

    let currStreak = user.current_streak;
    let longStreak = user.longest_streak;
    if (correct) {
      currStreak ++;
      if (currStreak > longStreak) {
        longStreak = currStreak;
      }
    } else {
      if (currStreak > longStreak) {
        longStreak = currStreak;
      }
      currStreak = 0;
    }

    await req.models.User.updateOne({username: username}, {seen_videos: seenVids, saved_videos: user.saved_videos, current_streak: currStreak, longest_streak: longStreak});

    res.status(200).json({"status": "success"})
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"status": "error", "error": err.message});
  }
});

router.post("/reset", async (req, res, next) => {
  let username = req.body.username;

  try {
    let user = await req.models.User.findOne({username: username});
    let seenVids = [];

    await req.models.User.updateOne({username: username}, {seen_videos: seenVids, saved_videos: user.saved_videos, longest_streak: user.longest_streak});
  } catch (err) {
    console.log(err.message);
    res.status(500).json({"status": "error", "error": err.message});
  }
});

export default router;