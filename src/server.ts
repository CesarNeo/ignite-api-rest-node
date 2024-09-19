import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async (request, reply) => {
  const teste = await knex('sqlite_schema').select('*')

  return teste
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server running on http://localhost:3333')
})
