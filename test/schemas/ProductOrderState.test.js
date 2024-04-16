import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductOrderState/mutation.js';
import query from '../../src/schemas/ProductOrderState/query.js';
import typeDef from '../../src/schemas/ProductOrderState/typeDef.js';
import db from '../../db/models/index.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const Model = productorderstate(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { name: 'Pending' },
    { name: 'Delivered' }
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

test('productOrderStates queries fetches all product order state', async () => { 
  const { data } = await tester.graphql(`{ productOrderStates(page: 1, limit: 10) { 
    __typename
    ... on ProductOrderStates {
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
  expect(data.productOrderStates.rows.length).toBe(2);
  expect(data.productOrderStates.pages).toBe(1);
  expect(data.productOrderStates.count).toBe(2);
});

test('productOrderState queries fetches a specific product order state by name', async () => {
  const { data } = await tester.graphql(`{ productOrderState(name: "Pending") { 
    __typename
    ... on ProductOrderState {
      name
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productOrderState.name).toBe('Pending');
});

test('productOrderState queries fetches fails if a specific product order state by name does not exist', async () => {
  const { data } = await tester.graphql(`{ productOrderState(name: "hello-world") { 
    __typename
    ... on ProductOrderState {
      name
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productOrderState.code).toBe("404");
  expect(data.productOrderState.message).toBe('No Entity found');
});

test('createProductOrderState mutation creates a product order state', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductOrderState(input: { name: "Reserved" }) {
      __typename
      ... on ProductOrderState {
        name
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.createProductOrderState.name).toBe('Reserved');
});
