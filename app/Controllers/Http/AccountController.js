'use strict'

const Transaction = use('App/Models/Transaction')
const BankStatementService = use('App/Services/BankStatementService')
const AccountService = use('App/Services/AccountService')
const Database = use('Database');
const { validate } = use('Validator');

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

    try {
      const accountId = await AccountService.createAccount(data);
      return response.json({
        status: 'Account Successfully created',
        data: { accountId }
      });
    } catch (error) {
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

    try {
      const balance = await AccountService.queryBalance(data.accountId);
      return response.send({ balance });
    } catch (error) {
      return response.status(400).json({
        error: error.message
      });
    }
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

    try {
      const accountId = await AccountService.blockAccount(data)
      return response.json({
        status: 'Account has been blocked',
        data: { accountId }
      });
    } catch (error) {
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
    } else {
      console.log('Else')
      transaction = await Database
        .table('transactions')
        .where('account_id', data.accountId)
        .select('id', 'value', 'transaction_date')
        .orderBy('id', 'desc')
        .paginate(page, 100);
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
