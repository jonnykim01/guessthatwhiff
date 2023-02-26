import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    // find Posts in database
    console.log("finding posts in database")
    let posts = await req.models.Post.find()

    // Get the count of all users
    req.models.Post.count().exec(function (err, count) {

      // Get a random entry
      var random = Math.floor(Math.random() * count)

      // Query all users but only fetch one offset by our random #
      req.models.Post.findOne().skip(random).exec(
        function (err, result) {
          // console.log(result)
          let postData = {"id": result._id, "url" : result.url, "rank": result.rank, "created_date": result.created_date}

          console.log("sending post data")
          // console.log(postData)
          res.json(postData)
        })
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({"status": "error", "error": err.message})
  }
})

router.post('/', async (req, res) => {
  console.log('Attempting to POST: ' + req.body)

  try {
    // create a new Post object and fill in its contents
    const newPost = new req.models.Post({
      url: req.body.url,
      rank: req.body.rank,
      created_date: new Date()
    })

    // save post to database
    await newPost.save()

    // return json status
    res.json({"status" : "success"})
  } catch (err) {
    console.log(err.message)
    res.status(500).json({"status": "error", "error": err.message})
  }
})

export default router;