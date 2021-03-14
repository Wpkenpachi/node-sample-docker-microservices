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
}

module.exports = AccountService;