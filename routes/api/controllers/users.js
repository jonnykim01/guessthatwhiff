import express from 'express';
import session from 'express-session';
var router = express.Router();

/* GET users listing. */
router.get('/myIdentity', function(req, res, next) {
  if(req.session.isAuthenticated){
    res.json({
      status: "loggedin",
      userInfo: {
         name: req.session.account.name,
         username: req.session.account.username}
   });
  } else {
    res.json({
      status: "loggedout",
      userInfo: {
        name: "guest",
        username: "guest"
      }
    });
  }
});

router.get('/', async function(req, res, next) {
  try {
    // need username in query
    let username = req.query.username
    let user = await req.models.User.findOne({username: username});
    let userData = {"username": user.username, "saved_videos": user.saved_videos, "current_streak": user.current_streak, "longest_streak": user.longest_streak, "seen_videos": user.seen_videos}
    res.json(userData)
  } catch(err) {
    res.status(500).json({
      "status": "error",
      "error": err.message
    })
  }
  
});

router.post('/', async (req, res, next) => {
  if(req.session.isAuthenticated){
    let user = await req.models.User.findOne({username: req.body.username});
    if (user == null) {
      const newUser = new req.models.User({
          username: req.body.username,
          saved_videos: [],
          current_streak: 0,
          longest_streak: 0,
          seen_videos: []
      });

      await newUser.save();
    }
  };
});

export default router;
