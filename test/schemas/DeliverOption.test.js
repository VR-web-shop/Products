import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/DeliverOption/mutation.js';
import query from '../../src/schemas/DeliverOption/query.js';
import db from '../../db/models/index.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';

let tester;
beforeAll(async () => {
  const Model = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { name: 'Standard Delivery', price: 10 },
    { name: 'Express Delivery', price: 20 },
    { name: 'Pickup', price: 0 }
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

test('deliverOptions queries fetches all deliver options', async () => { 
  const { data } = await tester.graphql('{ deliverOptions { name } }');
  expect(data.deliverOptions.length).toBe(3);
});

test('deliverOption queries fetches a specific deliver option by name', async () => {
  const { data } = await tester.graphql('{ deliverOption(name: "Pickup") { name } }');
  expect(data.deliverOption.name).toBe('Pickup');
});

test('createDeliverOption mutation creates a deliver option', async () => {
  const { data } = await tester.graphql(`mutation {
    createDeliverOption(input: { name: "Home Delivery", price: 15 }) {
      name
      price
    }
  }`);
  expect(data.createDeliverOption.name).toBe('Home Delivery');
  expect(data.createDeliverOption.price).toBe(15);
});

test('updateDeliverOption mutation updates a deliver option', async () => {
  const { data } = await tester.graphql(`mutation {
    updateDeliverOption(input: { name: "Pickup", price: 5 }) {
      name
      price
    }
  }`);
  expect(data.updateDeliverOption.price).toBe(5);
});

test('deleteDeliverOption mutation deletes a deliver option', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteDeliverOption(name: "Express Delivery")
  }`);
  expect(data.deleteDeliverOption).toBe(true);
});

