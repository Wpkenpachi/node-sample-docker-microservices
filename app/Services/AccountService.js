'use strict'

const Database = use('Database');
const moment = require('moment');

class AccountService {
  static async createAccount(data) {
    const trx = await Database.beginTransaction();
    try {
      const [personId] = await trx.insert({
        name: data.name,
        document_number: data.documentNumber,
        born_date: data.bornDate,
        created_at: moment().toDate(),
        updated_at: moment().toDate()
      }).into('persons').returning('id');

      const [accountId] = await trx.insert({
        person_id: personId,
        balance: 0,
        max_daily_withdraw: 100000,
        account_type: data.accountType,
        created_at: moment().toDate(),
        updated_at: moment().toDate()
      }).into('accounts').returning('id');
      await trx.commit();
      return accountId
    } catch (error) {
      await trx.rollback();
      throw new Error(error.message)
    }
  }

  static async queryBalance(accountId) {
    try {
      const [balance] = await Database
        .table('accounts')
        .where('id', accountId)
        .where('active_flag', 1)
        .pluck('balance');

      return balance
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async blockAccount(data) {
    const trx = await Database.beginTransaction();
    try {
      const [accountId] = await trx.table('accounts')
        .where('id', data.accountId)
        .update({ active_flag: 0 })
        .returning('id')
      await trx.commit()
      return accountId
    } catch (error) {
      await trx.rollback()
      throw new Error(error.message)
    }
  }
}

module.exports = AccountService;