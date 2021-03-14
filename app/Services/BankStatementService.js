'use strict'

const Database = use('Database');
const moment = require('moment');

class BankStatementService {
  static async getByStartDate(start, accountId, page = 1) {
    if (moment(start, 'YYYY-MM-DD').isValid()) {
      try {
        return await Database
          .table('transactions')
          .where('account_id', accountId)
          .select('id', 'value', 'transaction_date')
          .whereRaw("transaction_date > ?", [
            moment(start, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00:00')
          ])
          .paginate(page, 100);
      } catch (error) {
        throw new Error(error);
      }
    } else return [];
  }

  static async getByEndDate(end, accountId, page = 1) {
    if (moment(end, 'YYYY-MM-DD').isValid()) {
      try {
        return await Database
          .table('transactions')
          .where('account_id', accountId)
          .select('id', 'value', 'transaction_date')
          .whereRaw("transaction_date < ?", [
            moment(end, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59')
          ])
          .paginate(page, 100);
      } catch (error) {
        throw new Error(error);
      }
    } else return [1];
  }

  static async getByDate(start, end, accountId, page = 1) {
    if (moment(start, 'YYYY-MM-DD').isValid() && moment(end, 'YYYY-MM-DD').isValid()) {
      try {
        return await Database
          .table('transactions')
          .where('account_id', accountId)
          .select('id', 'value', 'transaction_date')
          .whereRaw("transaction_date BETWEEN ? AND ?", [
            moment(start, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00:00'),
            moment(end, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59')
          ])
          .paginate(page, 500);
      } catch (error) {
        throw new Error(error);
      }
    } else return [];
  }

  static async getLastHundred(data) {
    const numberToFetch = 100
    try {
      return await Database
        .table('transactions')
        .where('account_id', data.accountId)
        .select('id', 'value', 'transaction_date')
        .orderBy('id', 'desc')
        .paginate(1, numberToFetch);
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = BankStatementService;