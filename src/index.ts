import './lib/process'

import OpenAI from 'openai'
import prompts from 'prompts'

import { config } from './lib/config'
import { logger } from './lib/logger'

logger.setIndent(config.LOG_INDENT)

const main = async () => {
  const openai = new OpenAI()
  const model = 'gpt-4-1106-preview'

  // const { question }: { question: string } = await prompts({
  //   type: 'text',
  //   name: 'question',
  //   message: 'ask something'
  // })

  const response = await openai.beta.chat.completions
    .runFunctions({
      model,
      messages: [
        {
          role: 'user',
          content: 'what is the most popular color around me?'
        }
      ],
      functions: [
        {
          function: getColorStats,
          description: 'Get dataset of colors and their usage count.',
          parameters: { type: 'object', properties: {} }
        },
        {
          function: getMyLocation,
          description: 'Return the location of the user.',
          parameters: { type: 'object', properties: {} }
        }
      ]
    })
    .finalContent()

  logger.info({ message: response })
}

function getMyLocation() {
  return 'San Mateo, CA'
}

function getColorStats() {
  return [
    {
      color: 'blue',
      count: 5,
      location: 'San Francisco, CA'
    },
    {
      color: 'red',
      count: 3,
      location: 'Palo Alto, CA'
    },
    {
      color: 'green',
      count: 12,
      location: 'Los Angeles, CA'
    },
    {
      color: 'yellow',
      count: 12,
      location: 'Los Angeles, CA'
    }
  ]
}

main()
  .then(() => {
    if (process.env.CI == null) return
    process.emit('SIGINT', 'SIGINT')
  })
  .catch((err: Error) => {
    console.error(err)
    process.exit(1)
  })
