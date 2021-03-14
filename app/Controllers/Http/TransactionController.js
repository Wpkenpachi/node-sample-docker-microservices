'use strict'

const Database  = use('Database');
const Account   = use('App/Models/Account');
const Transaction = use('App/Models/Transaction');
const { validate } = use('Validator');
const moment = require('moment');

class TransactionController {
    async deposit({ request, response }){
        const data = request.all();
        const validation = await validate(data, {
            accountId: 'required|integer',
            amount: 'required|integer'
        });

        if (validation.fails()) {
            return response.status(422).json(validation.messages());
        }

        const account = await Account.find(Number(data.accountId));
        const amount = Number(data.amount);
        try {
            if (amount < 0) return response.status(400).json({ msg: 'Deposit amount must be greater than 0' });
            account.balance += amount;
            await account.save();

            await Transaction.create({
                account_id:         account.id,
                value:              amount,
                transaction_date:   moment(new Date, 'YYYY-MM-DD').toDate(),
                created_at:         moment().toDate(),
                updated_at:         moment().toDate()
            });

            return response.json({
                msg: 'Successfully Deposited'
            });
        } catch (error) {
            return response.status(400).json({
                error: 'Error trying to Deposit'
            });
        }
    }

    async withdraw({ request, response }){
        const data = request.all();
        const validation = await validate(data, {
            accountId: 'required|integer',
            amount: 'required|integer'
        });

        if (validation.fails()) {
            console.log(validation.messages());
            response.status(422).send(validation.messages());
        }

        const account = await Account.find(Number(data.accountId));
        const amount = Number(data.amount);
        try {
            if (account.balance < amount) return response.status(400).json({ msg: "You don't have enough funds" });
            account.balance -= amount;
            await account.save();

            await Transaction.create({
                account_id:         account.id,
                value:              (amount * -1),
                transaction_date:   moment(new Date, 'YYYY-MM-DD').toDate(),
                created_at:         moment().toDate(),
                updated_at:         moment().toDate()
            });

            return response.json({
                msg: 'Successfully Withdraw'
            });
        } catch (error) {
            return response.status(400).json({
                error: 'Error trying to withdraw'
            });
        }
    }
}

module.exports = TransactionController
