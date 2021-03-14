'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountsSchema extends Schema {
  up () {
    const AccountType = {
      SAVINGS_ACCOUNT: 1,
      CHECKING_ACCOUNT: 2
    };

    this.create('accounts', (table) => {
      table.increments();
      table.integer('person_id').references('id').inTable('persons').unsigned();
      table.integer('balance').defaultTo(0);
      table.integer('max_daily_withdraw');
      table.boolean('active_flag').defaultTo(true);
      table.enu('account_type', [AccountType.SAVINGS_ACCOUNT, AccountType.CHECKING_ACCOUNT]);
      table.timestamps();
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountsSchema
