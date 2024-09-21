import type { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { TablesEnum } from '../enums/tables'
import { randomUUID } from 'crypto'
import { CookiesEnum } from '../enums/cookies'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

const createTransactionBodySchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
})

const getTransactionParamsSchema = z.object({ id: z.string().uuid() })

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie(CookiesEnum.SESSION_ID, sessionId, {
        maxAge: 60 * 60 * 24 * 7, // 1 week or 7 days
      })
    }

    await knex(TablesEnum.TRANSACTIONS).insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.code(201).send()
  })

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex(TablesEnum.TRANSACTIONS)
      .where('session_id', sessionId)
      .select()

    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { id } = getTransactionParamsSchema.parse(request.params)
    const { sessionId } = request.cookies

    const transaction = await knex(TablesEnum.TRANSACTIONS)
      .where({ id, session_id: sessionId })
      .first()

    return { transaction }
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex(TablesEnum.TRANSACTIONS)
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )
}
