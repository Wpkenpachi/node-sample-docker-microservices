'use strict'

const PersonService = use('App/Services/PersonService')
const { validate } = use('Validator');

class PersonController {
  async create({ request, response }) {
    const data = request.all();
    const validation = await validate(data, {
      name: 'required',
      documentNumber: 'required|unique:persons,document_number',
      bornDate: 'required|date'
    });

    if (validation.fails()) {
      console.log(validation.messages());
      return response.status(422).send(validation.messages());
    }

    try {
      const personId = await PersonService.createPerson(data);
      return response.json({
        status: 'Account Successfully created',
        data: { personId }
      });
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

module.exports = PersonController
