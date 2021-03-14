# Sample NodeJS Project (JS)
This sample was based on this challenge <a href="ORIGINAL_README.md" target="_blank"> desafio-dev-api-rest </a>

# Local Running Steps
First of all, install project dependencies
```bash

$ npm install

```


#### Database Config
Find environment file _.env_ on root directory and config these Parameteres
- Obs: You can specifie another database. For more information follow the adonis [docs](https://adonisjs.com/docs/4.0/database)

```env
DB_CONNECTION=pg

DB_HOST=127.0.0.1

DB_PORT=5432

DB_USER=postgres

DB_PASSWORD=postgres

DB_DATABASE=node-sample-project-js

```

#### Run migrations
To create project tables after database credentials set
```bash
$ adonis migration:run
```


#### Serving Api
You can specify custom _HOST_ and _PORT_ on environment file _.env_ on root directory
```bash
$ npm start

> adonis-fullstack-app@4.1.0 start

> node server.js


info: serving app on http://127.0.0.1:3333
```

# Api Doc
Api endpoints and request and response cmoposition

## Create Account
Create Account endpoint will create behind the scenes:
- A Person. With documentNumber and name infos
- A Account. With the person id

### Request
- Url: http://localhost:3333/api/account/create
- Method: POST
- Headers:
```json
{
  "Content-Type": "application/json"
}
```

- Request Body
```bash
{
  "name": "Wesley Paulo", // Fullname String
  "documentNumber": "04203377099", //  Cpf String
  "bornDate": "1996-06-17", //  YYYY-MM-DD String
  "accountType": 2 // 1: Savings Account, 2: Checking Account Number
}
```

- Response Body
```bash
{
  "status": "Account Successfully created",
  "data": {
    "accountId": 7
  }
}
```

## GetAccountBalance
Get Account balance endpoint will get an account balance:
- Obs: The balance will be returned only if the account is not blocked

### Request
- Url: http://localhost:3333/api/account/balance
- Method: POST
- Headers:
```json
{
  "Content-Type": "application/json"
}
```

- Body
```bash
{
  "accountId": 2 // accountId as number
}
```

- Response Body
```json
{
  "balance": 0
}
```

## Deposit on Account
Deposit on Account endpoint will deposit some amount of value on person account, and create a transaction register:

- Obs: The deposit and the transaction will be done only if the account is not blocked


### Request

- Url: http://localhost:3333/api/transaction/deposit

- Method: POST

- Headers:

```json

{
  "Content-Type": "application/json"
}

```


- Body

```bash

{
  "accountId": 2, // accountId as number
  "amount": 15000 // amount as number ( amount in cents 15000 -> R$ 150,00 )
}

```


- Response Body

```json

{
  "data": {
    "transactionId": 3
  }
}

```

## Get Bank Statement
Get Bank Statement endpoint will return your transactions between two
dates (start and end):

Obs:
- Alternatively you can pass just one specific date.

- If passing just start date, you'll fetch transactions starting from that date until the last one transaction register

- If passing just end date, you'll fetch transactions registers from the first transaction date until the end date specified 

- Obs: For start and end dates -> paginated with limited 500 results

- Obs: For single start/end date -> paginated with limited 100 results

- Obs: If no date is specified, will be return the last 100 transactions


### Request

- Url: http://localhost:3333/api/account/bankstatement

- Method: POST

- Headers:

```json

{
  "Content-Type": "application/json"
}

```


- QueryString 

```

start=2021-01-01  // (Optional) YYYY-MM-DD

end=2021-02-01    // (Optional) YYYY-MM-DD

```


- Body

```bash

{
  "accountId": 2,  // accountId as number
  "page": 1        // [Optional] page number
}

```


- Response Body

```bash

{
  "total": "2",
  "perPage": 100,
  "page": 1,
  "lastPage": 1,
  "data": [ // data has a list of transactions
    {
      "id": 3,
      "value": 21000,
      "transaction_date": "2021-03-14T17:28:57.478Z"
    },
    {
      "id": 2,
      "value": 20000,
      "transaction_date": "2021-01-25T17:27:46.000Z"
    }
  ],
  "metadata": {
    "total_amount": 41000 // This metadata has a sum of transaction values
  }
}

```

## Block Account
Block account endpoint will block some account from accountId:
- Obs: Accounts blocked cannont query bank statements, balance, make deposits or withdrawns

### Request
- Url: http://localhost:3333/api/account/block
- Method: POST
- Headers:
```json
{
  "Content-Type": "applicatin/json"
}
```

- Body
```bash
{
  "accountId": 2 // accountId as number
}
```

- Response Body
```json
{
  "status": "Account has been blocked",
  "data": {
    "accountId": 6
  }
}
```

## Manually Testing
You can also import [insomnia yml file](node-sample-project-js-insomnia.yaml) to test each endpoints
