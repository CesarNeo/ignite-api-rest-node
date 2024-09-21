import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import { TablesEnum } from './enums/tables'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

app.register(transactionsRoutes, { prefix: TablesEnum.TRANSACTIONS })

app.listen({ port: env.PORT }).then(() => {
  console.log('Server running on http://localhost:3333')
})
