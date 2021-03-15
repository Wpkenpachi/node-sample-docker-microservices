'use strict'

const Database = use('Database');
const moment = require('moment');

class PersonService {
  static async createPerson(data) {
    const trx = await Database.beginTransaction();
    try {
      const [personId] = await trx.insert({
        name: data.name,
        document_number: data.documentNumber,
        born_date: data.bornDate,
        created_at: moment().toDate(),
        updated_at: moment().toDate()
      }).into('persons').returning('id');
      await trx.commit();
      return personId
    } catch (error) {
      await trx.rollback();
      throw new Error(error.message)
    }
  }
}

module.exports = PersonService;