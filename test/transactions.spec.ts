import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { TablesEnum } from '../src/enums/tables'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  beforeAll(async () => await app.ready())
  afterAll(async () => await app.close())
  beforeEach(async () => {
    execSync('pnpm run rollback -- --all')
    execSync('pnpm run migration')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/'.concat(TablesEnum.TRANSACTIONS))
      .send({
        title: 'Salário',
        amount: 3000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/'.concat(TablesEnum.TRANSACTIONS))
      .send({
        title: 'Salário',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/'.concat(TablesEnum.TRANSACTIONS))
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Salário',
        amount: 3000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/'.concat(TablesEnum.TRANSACTIONS))
      .send({
        title: 'Salário',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/'.concat(TablesEnum.TRANSACTIONS))
      .set('Cookie', cookies ?? [])
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get('/'.concat(TablesEnum.TRANSACTIONS, '/', transactionId))
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Salário',
        amount: 3000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/'.concat(TablesEnum.TRANSACTIONS))
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/'.concat(TablesEnum.TRANSACTIONS))
      .set('Cookie', cookies ?? [])
      .send({
        title: 'Debit transaction',
        amount: 3000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/'.concat(TablesEnum.TRANSACTIONS, '/summary'))
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 2000,
    })
  })
})
