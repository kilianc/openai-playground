import { stripIndent as s } from 'common-tags'
import { config as loadDotEnvIfPresent } from 'dotenv'

loadDotEnvIfPresent()

const errors = []

if (process.env.OPENAI_API_KEY == null) {
  errors.push(s`
    error: missing required env "OPENAI_API_KEY=******"
           see "https://platform.openai.com/account/api-keys"
  `)
}

if (errors.length > 0) {
  console.error(errors.join('\n\n'))
  process.exit(1)
}

const tryParseInt = (n: string | null | undefined, fallback: number) => {
  const parsed = Number.parseInt(n ?? '', 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const config = {
  APP_NAME: process.env.APP_NAME,
  REVISION: process.env.REVISION,
  EXIT_SIGNALS: ['SIGINT', 'SIGTERM'],
  LOG_INDENT: tryParseInt(process.env.LOG_INDENT, 0),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
}
