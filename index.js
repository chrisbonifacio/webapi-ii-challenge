const express = require("express")
const postRouter = require("./routes/postRouter")

const server = express()

server.get("/", (req, res) => {
  res.json({ api: "running" })
})

server.use(express.json())
server.use("/api/posts", postRouter)

const port = 4000
server.listen(port, () => console.log("serving running on port " + port))
