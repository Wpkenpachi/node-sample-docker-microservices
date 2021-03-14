'use strict'

const Transaction = use('App/Models/Transaction')
const BankStatementService = use('App/Services/BankStatementService')
const Database  = use('Database');
const { validate } = use('Validator');
const moment = require('moment');

class AccountController {
    async create({ request, response }) {
        const data = request.all();
        const validation = await validate(data, {
            name: 'required',
            documentNumber: 'required|unique:persons,document_number',
            bornDate: 'required|date',
            accountType: 'required|integer'
        });

        if (validation.fails()) {
            console.log(validation.messages());
            return response.status(422).send(validation.messages());
        }

        const trx = await Database.beginTransaction();
        try {
            const [person_id] = await trx.insert({
                name:               data.name,
                document_number:    data.documentNumber,
                born_date:          data.bornDate,
                created_at:         moment().toDate(),
                updated_at:         moment().toDate()
            }).into('persons').returning('id');
            await trx.insert({
                person_id:          person_id,
                balance:            0,
                max_daily_withdraw: 100000,
                account_type:        data.accountType,
                created_at:         moment().toDate(),
                updated_at:         moment().toDate()
            }).into('accounts').returning('id');
            await trx.commit();
            return response.json({
                status: 'Account Successfully created'
            });
        } catch (error) {
            await trx.rollback();
            return response.json(error);
        }
    }

    async getBalance({ request, response }) {
        const data = request.all();
        const validation = await validate(data, {
            accountId: 'required'
        });

        if (validation.fails()) {
            console.log(validation.messages());
            return response.status(422).send(validation.messages());
        }

        const [balance] = await Database
                .table('accounts')
                .where('id', data.accountId)
                .where('active_flag', 1)
                .pluck('balance');

        if (!balance) {
            return response.status(404).json({
                msg: "Account not found"
            });
        }

        return response.send({balance});
    }

    async blockAccount({ request, response }) {
        const data = request.all();
        const validation = await validate(data, {
            accountId: 'required'
        });

        if (validation.fails()) {
            console.log(validation.messages());
            return response.status(422).send(validation.messages());
        }

        const trx = await Database.beginTransaction();
        try {
            const [id] = await trx.table('accounts')
                .where('id', data.accountId)
                .update({ active_flag: 0 })
                .returning('id');
            await trx.commit();
            return response.json(id);
        } catch (error) {
            await trx.rollback();
            return response.json(error);
        }
    }

    async getBankStatement({ request, response }) {
        const data = request.all();
        const validation = await validate(data, {
            accountId: 'required'
        });

        const { start, end } = request.get();

        if (validation.fails()) {
            return response.status(422).json(validation.messages());
        }

        const page = ('page' in data) ? data.page : 1;

        let total_amount = null;
        let transaction = null;
        if (start && end) {
            transaction = await BankStatementService.getByDate(start, end, data.accountId, page);
        } else if (start) {
            transaction = await BankStatementService.getByStartDate(start, data.accountId, page);
        } else if (end) {
            transaction = await BankStatementService.getByEndDate(end, data.accountId, page);
            console.log(transaction);
        } else {
            transaction = await Database
            .table('transactions')
            .where('account_id', data.accountId)
            .select('id', 'value', 'transaction_date')
            .paginate(page);
        }

        if (transaction && ('data' in transaction)) {
            total_amount = (transaction.data.map(trx => trx.value)).reduce((acc, cur) => {
                return Number(acc) + Number(cur);
            });
            transaction.metadata = { total_amount: Number(total_amount) };
        }

        response.json(transaction);
    }
}

module.exports = AccountController
