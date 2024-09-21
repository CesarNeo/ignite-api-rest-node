// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'
import type { TablesEnum } from '../enums/tables'

declare module 'knex/types/tables' {
  export interface Tables {
    [TablesEnum.TRANSACTIONS]: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
