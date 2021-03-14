'use strict'

const Account = use('App/Models/Account')
const Database = use('Database')
const moment = require('moment')

class TransactionService {
  static async deposit(data) {
    const trx = await Database.beginTransaction();
    try {
      const account = await Account.query()
        .where('id', Number(data.accountId))
        .where('active_flag', true)
        .first()

      const amount = Number(data.amount);

      if (!account) throw new Error('Unavailable Account')
      if (amount < 0) throw new Error('Deposit amount must be greater than 0')

      account.balance = Number(account.balance) + amount;
      await account.save();

      const [transactionId] = await trx.insert({
        account_id: account.id,
        value: amount,
        transaction_date: moment(new Date, 'YYYY-MM-DD').toDate(),
        created_at: moment().toDate(),
        updated_at: moment().toDate()
      }).into('transactions').returning('id');

      await trx.commit();
      return transactionId
    } catch (error) {
      await trx.rollback();
      throw new Error(error.message)
    }
  }

  static async withdraw(data) {
    const trx = await Database.beginTransaction();
    try {
      const account = await Account
        .query()
        .where('id', Number(data.accountId))
        .where('active_flag', true)
        .first()

      const amount = Number(data.amount);
      if (!account) throw new Error('Unavailable Account')
      if (Number(account.balance) < amount) throw new Error("You don't have enough funds")

      account.balance = Number(account.balance) - amount;
      await account.save();

      const [transactionId] = await trx.insert({
        account_id: account.id,
        value: (amount * -1),
        transaction_date: moment(new Date, 'YYYY-MM-DD').toDate(),
        created_at: moment().toDate(),
        updated_at: moment().toDate()
      }).into('transactions').returning('id');

      return transactionId
    } catch (error) {
      await trx.rollback();
      throw new Error(error.message)
    }
  }
}

module.exports = TransactionService;