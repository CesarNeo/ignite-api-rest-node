import { knex as knexLib, type Knex } from 'knex'
import { env } from './env'

export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: { filename: env.DATABASE_URL },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = knexLib(knexConfig)
