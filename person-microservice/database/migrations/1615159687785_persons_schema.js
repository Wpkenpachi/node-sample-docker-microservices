'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');
const moment = require('moment');

class PersonsSchema extends Schema {
  up () {
    this.create('persons', (table) => {
      table.increments('id');
      table.string('name');
      table.string('document_number').unique();
      table.date('born_date');
      table.timestamps();
    })
  }

  down () {
    this.drop('persons')
  }
}

module.exports = PersonsSchema
