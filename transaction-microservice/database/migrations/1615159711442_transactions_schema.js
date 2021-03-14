'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TransactionsSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments();
      table.integer('account_id').references('id').inTable('accounts').unsigned();
      table.integer('value').defaultTo(0);
      table.timestamp('transaction_date');
      table.timestamps();
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionsSchema
