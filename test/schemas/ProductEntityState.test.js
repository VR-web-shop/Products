import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductEntityState/mutation.js';
import query from '../../src/schemas/ProductEntityState/query.js';
import db from '../../db/models/index.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';

let tester;
beforeAll(async () => {
  const Model = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { name: 'Available' },
    { name: 'Unavailable' }
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

test('productEntityStates queries fetches all product entities', async () => { 
  const { data } = await tester.graphql('{ productEntityStates { name } }');
  expect(data.productEntityStates.length).toBe(2);
});

test('productEntityState queries fetches a specific product entity by name', async () => {
  const { data } = await tester.graphql('{ productEntityState(name: "Available") { name } }');
  expect(data.productEntityState.name).toBe('Available');
});

test('createProductEntityState mutation creates a product entity state', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductEntityState(input: { name: "Reserved" }) {
      name
    }
  }`);
  expect(data.createProductEntityState.name).toBe('Reserved');
});

test('deleteProductEntityState mutation deletes a product entity state', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductEntityState(name: "Reserved")
  }`);
  expect(data.deleteProductEntityState).toBe(true);
});

