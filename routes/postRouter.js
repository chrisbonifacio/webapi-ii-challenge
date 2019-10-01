const express = require("express")
const Posts = require("../data/db")

const router = express.Router()

// GET posts
router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => res.status(500).json({ error: err }))
})

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

// GET comments from post by ID
router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comments => {
      if (!comments.length) {
        res.status(500).json({
          error: "The comments information could not be retrieved."
        })
      }
      res.status(200).json(comments)
    })
    .catch(err => {
      res.status(404).json({
        error: "The post with the specified ID does not exist."
      })
    })
})

// POST new comment on post by ID
router.post("/:id/comments", async (req, res) => {
  const id = req.params.id
  const commentData = { post_id: id, text: req.body.text }

  try {
    var { id: commentID } = await Posts.insertComment(commentData)
  } catch (e) {
    res.status(500).json({
      error: "There was an error while saving the comment to the database"
    })
  }

  try {
    var comment = await Posts.findCommentById(commentID)
    res.status(201).json(comment)
  } catch (e) {
    res.status(500).json({
      error: "There was a problem retrieving the comment from the database"
    })
  }
})

// DELETE post by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id

  try {
    var post = await Posts.findById(id)
  } catch (e) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist" })
  }

  try {
    await Posts.remove(id)
    res.status(200).json(post)
  } catch (e) {
    res.status(500).json({ error: "The post could not be removed" })
  }
})

module.exports = router
