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

router.get('/', function(req, res, next) {
  if(req.session.isAuthenticated){
    res.send(`
      responding with information about the user
      with the name: ${req.session.account.name}
      and the username: ${req.session.account.username}

    `)
  } else {
    res.send('Error: You must be logged in');
  }
});

router.post('/', async (req, res, next) => {
  if(req.session.isAuthenticated){
    let user = await req.models.User.findOne({username: req.body.username});
    if (user == null) {
      const newUser = new req.models.User({
          username: req.body.username,
          saved_videos: [],
          longest_streak: 0,
          seen_videos: []
      });

      await newUser.save();
    }
  };
});

export default router;
