'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome');

Route.group(function () {
    Route.post('create', 'AccountController.create');
    Route.post('balance', 'AccountController.getBalance');
    Route.post('block', 'AccountController.blockAccount');
    Route.post('bankstatement', 'AccountController.getBankStatement');
}).prefix('api/account');

Route.group(function () {
    Route.post('deposit', 'TransactionController.deposit');
    Route.post('withdraw', 'TransactionController.withdraw');
}).prefix('api/transaction');

