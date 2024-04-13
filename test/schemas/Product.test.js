import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/Product/mutation.js';
import query from '../../src/schemas/Product/query.js';
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';

let tester;
beforeAll(async () => {
  const Model = product(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'aaa-aaa-aaa-aaa',
        name: 'Apple', description: 'A fruit', thumbnail_source: 'apple.jpg', price: 1 
    },
    { 
        uuid: 'bbb-bbb-bbb-bbb',
        name: 'Banana', description: 'A fruit', thumbnail_source: 'banana.jpg', price: 2 
    },
    { 
        uuid: 'ccc-ccc-ccc-ccc',
        name: 'Orange', description: 'A fruit', thumbnail_source: 'orange.jpg', price: 3 
    }
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

test('products queries fetches all products', async () => { 
  const { data } = await tester.graphql('{ products { uuid } }');
  expect(data.products.length).toBe(3);
});

test('product queries fetches a specific product by uuid', async () => {
  const { data } = await tester.graphql('{ product(uuid: "aaa-aaa-aaa-aaa") { uuid } }');
  expect(data.product.uuid).toBe('aaa-aaa-aaa-aaa');
});

test('createProduct mutation creates a product', async () => {
  const { data } = await tester.graphql(`mutation {
    createProduct(input: { name: "Strawberries", description: "A fruit", thumbnail_source: "strawberries.jpg", price: 15 }) {
        name
        description
        thumbnail_source
        price
    }
  }`);

  expect(data.createProduct.name).toBe('Strawberries');
  expect(data.createProduct.description).toBe('A fruit');
  expect(data.createProduct.thumbnail_source).toBe('strawberries.jpg');
  expect(data.createProduct.price).toBe(15);
});

test('updateProduct mutation updates a product', async () => {
  const { data } = await tester.graphql(`mutation {
    updateProduct(input: { uuid: "aaa-aaa-aaa-aaa", name: "Apples", description: "A fruit", thumbnail_source: "apples.jpg", price: 5 }) {
        name
        description
        thumbnail_source
        price
    }
  }`);
  expect(data.updateProduct.name).toBe('Apples');
  expect(data.updateProduct.description).toBe('A fruit');
  expect(data.updateProduct.thumbnail_source).toBe('apples.jpg');
  expect(data.updateProduct.price).toBe(5);
});

test('deleteProduct mutation deletes a product', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProduct(uuid: "aaa-aaa-aaa-aaa")
  }`);
  expect(data.deleteProduct).toBe(true);
});

