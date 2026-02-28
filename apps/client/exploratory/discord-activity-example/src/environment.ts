import dotenv from 'dotenv'

const envSchema = {
  DISCORD_CLIENT_ID: {required: true},
  DISCORD_CLIENT_SECRET: {required: true},
  DISCORD_CLIENT_HOST_PATH: {required: true},
  PORT: {required: false},
} as const

type Environment = {
  [K in keyof typeof envSchema]: typeof envSchema[K]['required'] extends true
    ? string : string | undefined
}

const validateEnvironment = (): Environment => {
  dotenv.config({path: '.env'})

  const requiredVars = Object.entries(envSchema)
    .filter(([, config]) => config.required)
    .map(([key]) => key)

  const missing = requiredVars.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return Object.fromEntries(
    Object.keys(envSchema).map(key => [key, process.env[key]])
  ) as Environment
}

export type {
  Environment,
}

export {
  validateEnvironment,
}
