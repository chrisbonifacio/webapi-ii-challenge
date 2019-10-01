const express = require("express")
const Posts = require("../data/db")

const router = express.Router()

// POST new post
router.post("/", (req, res) => {
  const { title, contents } = req.body
  if (!title || !contents) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" })
  } else {
    Posts.insert(req.body)
      .then(id => {
        res.status(201).json(id)
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        })
      })
  }
})

// GET posts
router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => res.status(500).json({ error: err }))
})

module.exports = router
