import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductEntityState/mutation.js';
import query from '../../src/schemas/ProductEntityState/query.js';
import typeDef from '../../src/schemas/ProductEntityState/typeDef.js';
import db from '../../db/models/index.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const Model = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { name: 'Available' },
    { name: 'Unavailable' }
  ]);

  const typeDefs = `
    ${typeDef}
    ${requestErrorTypeDef}
  `;

  tester = new EasyGraphQLTester(typeDefs, {
    ...query,
    ...mutation,
  });
  return tester;
});

test('productEntityStates queries fetches all product entities', async () => { 
  const { data } = await tester.graphql(`{ productEntityStates(page: 1, limit: 10) { 
    __typename
    ... on ProductEntityStates {
      rows {
        name
      }
      pages 
      count
    }
    ... on RequestError {
      code
      message
    }
  }}`);  
  expect(data.productEntityStates.rows.length).toBe(2);
  expect(data.productEntityStates.pages).toBe(1);
  expect(data.productEntityStates.count).toBe(2);
});

test('productEntityState queries fetches a specific product entity state by name', async () => {
  const { data } = await tester.graphql(`{ productEntityState(name: "Available") { 
    __typename
    ... on ProductEntityState {
      name
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productEntityState.name).toBe('Available');
});

test('productEntityState queries fetches fails if a specific product entity state by name does not exist', async () => {
  const { data } = await tester.graphql(`{ productEntityState(name: "hello-world") { 
    __typename
    ... on ProductEntityState {
      name
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productEntityState.code).toBe("404");
  expect(data.productEntityState.message).toBe('No Entity found');
});

test('createProductEntityState mutation creates a product entity state', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductEntityState(input: { name: "Reserved" }) {
      __typename
      ... on ProductEntityState {
        name
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.createProductEntityState.name).toBe('Reserved');
});
