import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/Product/mutation.js';
import query from '../../src/schemas/Product/query.js';
import typeDef from '../../src/schemas/Product/typeDef.js';
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import productdescription from '../../db/models/productdescription.cjs';
import productremoved from '../../db/models/productremoved.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  const Model = product(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb-bbb' },
    { client_side_uuid: 'ccc-ccc-ccc-ccc' }
  ]);

  const ProductDescriptionModel = productdescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductDescriptionModel.sync({ force: true });
  await ProductDescriptionModel.bulkCreate([
    { id: 1, product_client_side_uuid: 'aaa-aaa-aaa-aaa', name: 'Apple', description: 'A fruit', thumbnail_source: 'apple.jpg', price: 1, createdAt: twoDaysAgo },
    { id: 2, product_client_side_uuid: 'aaa-aaa-aaa-aaa', name: 'Banana', description: 'A fruit', thumbnail_source: 'banana.jpg', price: 2, createdAt: yesterday },
    { id: 3, product_client_side_uuid: 'aaa-aaa-aaa-aaa', name: 'Orange', description: 'A fruit', thumbnail_source: 'orange.jpg', price: 3, createdAt: today }
  ]);

  const ProductRemovedModel = productremoved(db.sequelize, db.Sequelize.DataTypes);
  await ProductRemovedModel.sync({ force: true });
  await ProductRemovedModel.bulkCreate([
    { id: 1, product_client_side_uuid: 'bbb-bbb-bbb-bbb', deletedAt: new Date() },
    { id: 2, product_client_side_uuid: 'ccc-ccc-ccc-ccc', deletedAt: new Date() }
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

test('products queries fetches all products', async () => {
  const { data } = await tester.graphql(`{ products(page: 1, limit: 10) { 
    __typename
    ... on Products {
      rows {
        clientSideUUID
        name
        description
        thumbnail_source
        price
      }
      pages
      count
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.products.rows.length).toBe(1);
  expect(data.products.rows[0].clientSideUUID).toBe('aaa-aaa-aaa-aaa');
  expect(data.products.rows[0].name).toBe('Orange');
  expect(data.products.rows[0].description).toBe('A fruit');
  expect(data.products.rows[0].thumbnail_source).toBe('orange.jpg');
  expect(data.products.rows[0].price).toBe(3);
  expect(data.products.pages).toBe(1);
  expect(data.products.count).toBe(1);
});

test('product queries fetches a specific product by uuid', async () => {
  const { data } = await tester.graphql(`{ product(clientSideUUID: "aaa-aaa-aaa-aaa") { 
    __typename
    ... on Product {
      clientSideUUID
      name
      description
      thumbnail_source
      price
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.product.clientSideUUID).toBe('aaa-aaa-aaa-aaa');
  expect(data.product.name).toBe('Orange');
  expect(data.product.description).toBe('A fruit');
  expect(data.product.thumbnail_source).toBe('orange.jpg');
  expect(data.product.price).toBe(3);
  expect(data.product.created_at).not.toBe(null);
  expect(data.product.updated_at).not.toBe(null);
});

test('product queries fetches fails if a specific product by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ product(clientSideUUID: "hello-world") { 
    __typename
    ... on Product {
      clientSideUUID
      name
      price
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.product.code).toBe("404");
  expect(data.product.message).toBe('No Entity found');
});

test('putProduct mutation creates a product', async () => {
  const { data } = await tester.graphql(`mutation {
    putProduct(input: { clientSideUUID: "ccc-ccc-ccc", name: "Strawberries", description: "A fruit", thumbnail_source: "strawberries.jpg", price: 15 }) {
      __typename
      ... on Product {
        clientSideUUID
        name
        description
        thumbnail_source
        price
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProduct.clientSideUUID).toBe('ccc-ccc-ccc');
  expect(data.putProduct.name).toBe('Strawberries');
  expect(data.putProduct.description).toBe('A fruit');
  expect(data.putProduct.thumbnail_source).toBe('strawberries.jpg');
  expect(data.putProduct.price).toBe(15);
  expect(data.putProduct.created_at).not.toBe(null);
  expect(data.putProduct.updated_at).not.toBe(null);
});

test('putProduct mutation updates a product', async () => {
  const { data } = await tester.graphql(`mutation {
    putProduct(input: { clientSideUUID: "ccc-ccc-ccc", name: "Strawberries2", description: "A fruit2", thumbnail_source: "strawberries2.jpg", price: 2 }) {
      __typename
      ... on Product {
        clientSideUUID
        name
        description
        thumbnail_source
        price
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProduct.clientSideUUID).toBe('ccc-ccc-ccc');
  expect(data.putProduct.name).toBe('Strawberries2');
  expect(data.putProduct.description).toBe('A fruit2');
  expect(data.putProduct.thumbnail_source).toBe('strawberries2.jpg');
  expect(data.putProduct.price).toBe(2);
  expect(data.putProduct.created_at).not.toBe(null);
  expect(data.putProduct.updated_at).not.toBe(null);
});

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ products(page: 1, limit: 10) { 
    __typename
    ... on Products {
      rows {
        clientSideUUID
        name
        description
        thumbnail_source
        price
        created_at
        updated_at
      }
      pages
      count
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.products.rows.length).toBe(2);
});

test('deleteProduct mutation deletes a product', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProduct(clientSideUUID: "ccc-ccc-ccc") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`); 
  expect(data.deleteProduct.result).toBe(true);
});

