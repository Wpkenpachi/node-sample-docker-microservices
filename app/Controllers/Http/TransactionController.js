'use strict'

const { validate } = use('Validator');
const TransactionService = use('App/Services/TransactionService')

class TransactionController {
  async deposit({ request, response }) {
    const data = request.all();
    const validation = await validate(data, {
      accountId: 'required|integer',
      amount: 'required|integer'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    try {
      const transactionId = await TransactionService.deposit(data)

      return response.json({
        data: { transactionId }
      });
    } catch (error) {
      return response.status(400).json({
        msg: 'Successfully Deposited',
        error: error.message
      });
    }
  }

  async withdraw({ request, response }) {
    const data = request.all();
    const validation = await validate(data, {
      accountId: 'required|integer',
      amount: 'required|integer'
    });

    if (validation.fails()) {
      console.log(validation.messages());
      response.status(422).send(validation.messages());
    }

    try {
      const transactionId = await TransactionService.withdraw(data);
      return response.json({
        msg: 'Successfully Withdraw',
        data: { transactionId }
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message
      });
    }
  }
}

module.exports = TransactionController
