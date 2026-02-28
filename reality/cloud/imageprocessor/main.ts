// @rule(js_cli)
// @name(imageprocessor)
// @attr[](data = "//reality/cloud/imageprocessor:calc-score")
// @attr(npm_rule = "@npm-c8//:npm-c8")

import express from 'express'

import {handleComputeRequest} from './compute'

const app = express()
app.use(express.json())

const port = 80

app.post('/compute', handleComputeRequest)

app.get('/status8', (req, res) => {
  res.send('server is healthy')
})

app.listen(port)
