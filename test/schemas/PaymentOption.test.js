import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/PaymentOption/mutation.js';
import query from '../../src/schemas/PaymentOption/query.js';
import db from '../../db/models/index.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';

let tester;
beforeAll(async () => {
  const Model = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { name: 'Credit Card', price: 10 },
    { name: 'PayPal', price: 20 },
    { name: 'Cash', price: 0 }
  ]);

  const typeDefs = `
    ${query.typeDef}
    ${mutation.typeDef}
  `;

  tester = new EasyGraphQLTester(typeDefs, {
    ...query.resolvers,
    ...mutation.resolvers,
  });
  return tester;
});

test('paymentOptions queries fetches all payment options', async () => { 
  const { data } = await tester.graphql('{ paymentOptions(offset: 0, limit: 10) { name } }');
  expect(data.paymentOptions.length).toBe(3);
});

test('paymentOption queries fetches a specific payment option by name', async () => {
  const { data } = await tester.graphql('{ paymentOption(name: "Credit Card") { name } }');
  expect(data.paymentOption.name).toBe('Credit Card');
});

test('createPaymentOption mutation creates a payment option', async () => {
  const { data } = await tester.graphql(`mutation {
    createPaymentOption(input: { name: "Apples", price: 15 }) {
      name
      price
    }
  }`);
  expect(data.createPaymentOption.name).toBe('Apples');
  expect(data.createPaymentOption.price).toBe(15);
});

test('updatePaymentOption mutation updates a payment option', async () => {
  const { data } = await tester.graphql(`mutation {
    updatePaymentOption(input: { name: "Apples", price: 5 }) {
      name
      price
    }
  }`);
  expect(data.updatePaymentOption.price).toBe(5);
});

test('deletePaymentOption mutation deletes a payment option', async () => {
  const { data } = await tester.graphql(`mutation {
    deletePaymentOption(name: "Apples")
  }`);
  expect(data.deletePaymentOption).toBe(true);
});

