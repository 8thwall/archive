// @rule(js_cli)
// @package(npm-discord-activity)

/* eslint-disable no-console */

import cors from 'cors'
import express, {
  type Application,
  type Request,
  type Response,
} from 'express'

import {validateEnvironment} from './environment'

const env = validateEnvironment()

const app: Application = express()
const port: number = Number(env.PORT) || 8888

app.use(express.json())
app.use(cors())

// Fetch token from developer portal and return to the embedded app
app.post('/api/token', async (req: Request, res: Response) => {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.body.code,
    }),
  })

  const {access_token: accessToken} = (await response.json()) as {
    'access_token': string
  }
  res.send({access_token: accessToken})
})

app.use(express.static(env.DISCORD_CLIENT_HOST_PATH))

app.listen(port, () => {
  console.log(`App is listening on port ${port} !`)
})

process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`)
})
