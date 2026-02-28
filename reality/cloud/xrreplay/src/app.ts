import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import path from 'path'

import {Log, Recording} from './models'

const app: Express = express()
app.use(express.json({limit: '100mb'}))
app.use(cors())
const port: number = 3003

const logSaving = async (req: Request, res: Response) => {
  if (!req.body.events) {
    res.status(404).send({msg: 'You need to supply body.events'})
    return
  }

  const recordingId = parseInt(req.params.recordingId)
  // Should we verify the log id?
  const parsedEvents = req.body.events
  try {
    await Promise.all(parsedEvents.map((event: any) =>
      Log.create({
        timestamp: event.timestamp,
        type: event.type,
        content: JSON.stringify(event),
        recordingId
      })
    ))
    const numEvents = await Log.count({where: {recordingId}})
    console.log(`Total num of events ${numEvents}`)
    res.status(200).json({numEvents})
  } catch(e) {
    res.status(500).json(`Error saving events ${e}`)
  }
}

const logGet = async (req: Request, res: Response) => {
  const recordingId = parseInt(req.params.recordingId)
  const logs = await Log.findAll({where: {recordingId}})
  console.log(`Found ${logs.length} logs`)
  res.status(200).json({logs})
}

const recordingNew = async (req: Request, res: Response) => {
  const newLog = await Recording.create({name: `log-${performance.now()}`})
  res.status(200).json(newLog.toJSON())
}

const recordingGet = async (req: Request, res: Response) => {
  const recordings = await Recording.findAll({limit: 100})
  res.status(200).json({recordings: recordings.map(r => r.toJSON())})
}

app.use(express.static(path.join(__dirname, 'client')))
// app.options('*', cors())
app.post('/recording/:recordingId/log', logSaving)
app.get('/recording/:recordingId/log', logGet)
app.post('/recording/', recordingNew)
app.get('/recording/', recordingGet)

app.listen(port, () => {
  console.log(`xrreplay running at http://localhost:${port}`)
})
