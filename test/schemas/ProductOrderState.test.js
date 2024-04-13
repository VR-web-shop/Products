import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductOrderState/mutation.js';
import query from '../../src/schemas/ProductOrderState/query.js';
import db from '../../db/models/index.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';

let tester;
beforeAll(async () => {
  const Model = productorderstate(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { name: 'Pending' },
    { name: 'Delivered' }
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

test('productOrderStates queries fetches all product order state', async () => { 
  const { data } = await tester.graphql('{ productOrderStates { name } }');
  expect(data.productOrderStates.length).toBe(2);
});

test('productOrderState queries fetches a specific product order state by name', async () => {
  const { data } = await tester.graphql('{ productOrderState(name: "Pending") { name } }');
  expect(data.productOrderState.name).toBe('Pending');
});

test('createProductOrderState mutation creates a product order state', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductOrderState(input: { name: "Reserved" }) {
      name
    }
  }`);
  expect(data.createProductOrderState.name).toBe('Reserved');
});

test('deleteProductOrderState mutation deletes a product order state', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductOrderState(name: "Reserved")
  }`);
  expect(data.deleteProductOrderState).toBe(true);
});

