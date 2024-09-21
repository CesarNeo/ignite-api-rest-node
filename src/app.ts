import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import { TablesEnum } from './enums/tables'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

app.register(transactionsRoutes, { prefix: TablesEnum.TRANSACTIONS })
