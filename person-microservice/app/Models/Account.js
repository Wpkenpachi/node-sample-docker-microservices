'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Account extends Model {

    static get table() {
        return 'accounts';
    }
}

module.exports = Account
