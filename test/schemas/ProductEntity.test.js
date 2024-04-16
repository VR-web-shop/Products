import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductEntity/mutation.js';
import query from '../../src/schemas/ProductEntity/query.js';
import typeDef from '../../src/schemas/ProductEntity/typeDef.js';
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import productdescription from '../../db/models/productdescription.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import productentity from '../../db/models/productentity.cjs';
import productentitydescription from '../../db/models/productentitydescription.cjs';
import productentityremoved from '../../db/models/productentityremoved.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';
 
let tester;
beforeAll(async () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  const ProductModel = product(db.sequelize, db.Sequelize.DataTypes);
  await ProductModel.sync({ force: true });
  await ProductModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb-bbb' },
    { client_side_uuid: 'ccc-ccc-ccc-ccc' }
  ]);

  const ProductDescriptionModel = productdescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductDescriptionModel.sync({ force: true });
  await ProductDescriptionModel.bulkCreate([
    { id: 1, product_client_side_uuid: 'aaa-aaa-aaa-aaa', name: 'Apple', description: 'A fruit', thumbnail_source: 'apple.jpg', price: 1 },
    { id: 2, product_client_side_uuid: 'bbb-bbb-bbb-bbb', name: 'Banana', description: 'A fruit', thumbnail_source: 'banana.jpg', price: 2 },
    { id: 3, product_client_side_uuid: 'ccc-ccc-ccc-ccc', name: 'Orange', description: 'A fruit', thumbnail_source: 'orange.jpg', price: 3 }
  ]);

  const ProductEntityStateModel = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityStateModel.sync({ force: true });
  await ProductEntityStateModel.bulkCreate([
    { name: 'Available' },
    { name: 'Unavailable' }
  ]);

  const ProductEntity = productentity(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntity.sync({ force: true });
  await ProductEntity.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb-bbb' },
    { client_side_uuid: 'ccc-ccc-ccc-ccc' }
  ]);

  const ProductEntityDescriptionModel = productentitydescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityDescriptionModel.sync({ force: true });
  await ProductEntityDescriptionModel.bulkCreate([
    { id: 1, product_entity_client_side_uuid: 'aaa-aaa-aaa-aaa', product_client_side_uuid: 'aaa-aaa-aaa-aaa', product_entity_state_name: 'Available', createdAt: twoDaysAgo },
    { id: 2, product_entity_client_side_uuid: 'aaa-aaa-aaa-aaa', product_client_side_uuid: 'bbb-bbb-bbb-bbb', product_entity_state_name: 'Available', createdAt: yesterday },
    { id: 3, product_entity_client_side_uuid: 'aaa-aaa-aaa-aaa', product_client_side_uuid: 'ccc-ccc-ccc-ccc', product_entity_state_name: 'Unavailable', createdAt: today }
  ]); 

  const ProductEntityRemovedModel = productentityremoved(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityRemovedModel.sync({ force: true });
  await ProductEntityRemovedModel.bulkCreate([
    { id: 1, product_entity_client_side_uuid: 'bbb-bbb-bbb-bbb', deletedAt: new Date() },
    { id: 2, product_entity_client_side_uuid: 'ccc-ccc-ccc-ccc', deletedAt: new Date() }
  ]);
 
  const typeDefs = `
    ${typeDef}
    ${requestErrorTypeDef}
  `;

  tester = new EasyGraphQLTester(typeDefs, {
    ...query,
    ...mutation,
  });
});

test('productEntities queries fetches all product entities', async () => { 
  const { data } = await tester.graphql(`{ productEntities(page: 1, limit: 10) { 
    __typename
    ... on ProductEntities {
      rows {
        clientSideUUID
        product_client_side_uuid
        product_entity_state_name
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
  expect(data.productEntities.rows.length).toBe(1);
  expect(data.productEntities.rows[0].clientSideUUID).toBe('aaa-aaa-aaa-aaa');
  expect(data.productEntities.rows[0].product_client_side_uuid).toBe('ccc-ccc-ccc-ccc');
  expect(data.productEntities.rows[0].product_entity_state_name).toBe('Unavailable');
  expect(data.productEntities.pages).toBe(1);
  expect(data.productEntities.count).toBe(1);
});

test('productEntity queries fetches a specific product entity by uuid', async () => {
  const { data } = await tester.graphql(`{ productEntity(clientSideUUID: "aaa-aaa-aaa-aaa") { 
    __typename
    ... on ProductEntity {
      clientSideUUID
      product_client_side_uuid
      product_entity_state_name
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productEntity.clientSideUUID).toBe('aaa-aaa-aaa-aaa');
  expect(data.productEntity.product_client_side_uuid).toBe('ccc-ccc-ccc-ccc');
  expect(data.productEntity.product_entity_state_name).toBe('Unavailable');
  expect(data.productEntity.created_at).not.toBe(null);
  expect(data.productEntity.updated_at).not.toBe(null);
});

test('productEntity queries fetches fails if a specific product entity by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ productEntity(clientSideUUID: "hello-world") { 
    __typename
    ... on ProductEntity {
      clientSideUUID
      product_client_side_uuid
      product_entity_state_name
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productEntity.code).toBe("404");
  expect(data.productEntity.message).toBe('No Entity found');
});

test('putProductEntity mutation creates a product entity', async () => {
  const { data } = await tester.graphql(`mutation {
    putProductEntity(input: { clientSideUUID: "ggg-ggg-ggg", product_client_side_uuid: "aaa-aaa-aaa-aaa", product_entity_state_name: "Available" }) {
      __typename
      ... on ProductEntity {
        clientSideUUID
        product_client_side_uuid
        product_entity_state_name
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProductEntity.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putProductEntity.product_client_side_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(data.putProductEntity.product_entity_state_name).toBe('Available');
  expect(data.putProductEntity.created_at).not.toBe(null);
  expect(data.putProductEntity.updated_at).not.toBe(null);
});

test('putProductEntity mutation updates a product entity', async () => {
  const { data } = await tester.graphql(`mutation {
    putProductEntity(input: { clientSideUUID: "ggg-ggg-ggg", product_client_side_uuid: "bbb-bbb-bbb-bbb", product_entity_state_name: "Unavailable" }) {
      __typename
      ... on ProductEntity {
        clientSideUUID
        product_client_side_uuid
        product_entity_state_name
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProductEntity.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putProductEntity.product_client_side_uuid).toBe('bbb-bbb-bbb-bbb');
  expect(data.putProductEntity.product_entity_state_name).toBe('Unavailable');
  expect(data.putProductEntity.created_at).not.toBe(null);
  expect(data.putProductEntity.updated_at).not.toBe(null);
});

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ productEntities(page: 1, limit: 10) { 
    __typename
    ... on ProductEntities {
      rows {
        clientSideUUID
        product_client_side_uuid
        product_entity_state_name
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
  expect(data.productEntities.rows.length).toBe(2);
});

test('deleteProductEntity mutation deletes a product entity', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductEntity(clientSideUUID: "ggg-ggg-ggg") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`); 
  expect(data.deleteProductEntity.result).toBe(true);
});

