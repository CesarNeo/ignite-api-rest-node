import { knex as knexLib } from 'knex'

export const knex = knexLib({
  client: 'sqlite',
  connection: { filename: './tmp/app.db' },
})
