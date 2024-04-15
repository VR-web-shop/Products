import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductEntity/mutation.js';
import query from '../../src/schemas/ProductEntity/query.js';
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import productentity from '../../db/models/productentity.cjs';

let tester;
beforeAll(async () => {
  const ProductModel = product(db.sequelize, db.Sequelize.DataTypes);
  await ProductModel.sync({ force: true });
  await ProductModel.bulkCreate([
    { uuid: 'aaa-aaa-aaa-aaa', name: 'Apple', description: 'A fruit', thumbnail_source: 'apple.jpg', price: 1 },
    { uuid: 'bbb-bbb-bbb-bbb', name: 'Banana', description: 'A fruit', thumbnail_source: 'banana.jpg', price: 2 },
    { uuid: 'ccc-ccc-ccc-ccc', name: 'Orange', description: 'A fruit', thumbnail_source: 'orange.jpg', price: 3 }
  ]);

  const ProductEntityStateModel = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityStateModel.sync({ force: true });
  await ProductEntityStateModel.bulkCreate([
    { name: 'Available' },
    { name: 'Unavailable' }
  ]);

  const Model = productentity(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'ddd-ddd-ddd-ddd',
        product_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_state_name: 'Available',
    },
    { 
        uuid: 'eee-eee-eee-eee',
        product_uuid: 'bbb-bbb-bbb-bbb',
        product_entity_state_name: 'Available',
    },
    { 
        uuid: 'fff-fff-fff-fff',
        product_uuid: 'ccc-ccc-ccc-ccc',
        product_entity_state_name: 'Available',
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

test('productEntities queries fetches all product entities', async () => { 
  const { data } = await tester.graphql('{ productEntities(offset: 0, limit: 10) { uuid } }');
  expect(data.productEntities.length).toBe(3);
});

test('productEntity queries fetches a specific product entity by uuid', async () => {
  const { data } = await tester.graphql('{ productEntity(uuid: "ddd-ddd-ddd-ddd") { uuid } }');
  expect(data.productEntity.uuid).toBe('ddd-ddd-ddd-ddd');
});

test('createProductEntity mutation creates a product entity', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductEntity(input: { product_uuid: "aaa-aaa-aaa-aaa", product_entity_state_name: "Available" }) {
        product_uuid
        product_entity_state_name
    }
  }`);

  expect(data.createProductEntity.product_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(data.createProductEntity.product_entity_state_name).toBe('Available');
});

test('updateProductEntity mutation updates a product entity', async () => {
  const { data } = await tester.graphql(`mutation {
    updateProductEntity(input: { uuid: "ddd-ddd-ddd-ddd", product_uuid: "aaa-aaa-aaa-aaa", product_entity_state_name: "Unavailable" }) {
        product_uuid
        product_entity_state_name
    }
  }`);

  expect(data.updateProductEntity.product_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(data.updateProductEntity.product_entity_state_name).toBe('Unavailable');
});

test('deleteProductEntity mutation deletes a product entity', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductEntity(uuid: "ddd-ddd-ddd-ddd")
  }`);
  expect(data.deleteProductEntity).toBe(true);
});

