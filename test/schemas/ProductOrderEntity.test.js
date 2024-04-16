import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductOrderEntity/mutation.js';
import query from '../../src/schemas/ProductOrderEntity/query.js';
import typeDef from '../../src/schemas/ProductOrderEntity/typeDef.js';
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import productdescription from '../../db/models/productdescription.cjs';
import productentity from '../../db/models/productentity.cjs';
import productentitydescription from '../../db/models/productentitydescription.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import productorder from '../../db/models/productorder.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import productorderdescription from '../../db/models/productorderdescription.cjs';
import productorderentity from '../../db/models/productorderentity.cjs';
import productorderentitydescription from '../../db/models/productorderentitydescription.cjs';
import productorderentityremoved from '../../db/models/productorderentityremoved.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import deliveroptiondescription from '../../db/models/deliveroptiondescription.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';
import paymentoptiondescription from '../../db/models/paymentoptiondescription.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  const ProductModel = product(db.sequelize, db.Sequelize.DataTypes);
  await ProductModel.sync({ force: true });
  await ProductModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb' },
  ]);

  const ProductDescriptionModel = productdescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductDescriptionModel.sync({ force: true });
  await ProductDescriptionModel.bulkCreate([
    { id: 1, product_client_side_uuid: 'aaa-aaa-aaa', name: 'Apple', description: 'A fruit', thumbnail_source: 'apple.jpg', price: 1 },
    { id: 2, product_client_side_uuid: 'bbb-bbb-bbb', name: 'Banana', description: 'A fruit', thumbnail_source: 'banana.jpg', price: 2 },
  ]);

  const ProductEntityStateModel = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityStateModel.sync({ force: true });
  await ProductEntityStateModel.bulkCreate([
    { name: 'Available' },
    { name: 'Reserved' }
  ]);

  const ProductEntityModel = productentity(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityModel.sync({ force: true });
  await ProductEntityModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb-bbb' },
  ]);

  const ProductEntityDescriptionModel = productentitydescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityDescriptionModel.sync({ force: true });
  await ProductEntityDescriptionModel.bulkCreate([
    { id: 1, product_entity_client_side_uuid: 'aaa-aaa-aaa-aaa', product_client_side_uuid: 'aaa-aaa-aaa-aaa', product_entity_state_name: 'Available' },
    { id: 2, product_entity_client_side_uuid: 'bbb-bbb-bbb-bbb', product_client_side_uuid: 'bbb-bbb-bbb-bbb', product_entity_state_name: 'Available' },
  ]);

  const DeliverOptionModel = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionModel.sync({ force: true });
  await DeliverOptionModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb-bbb' },
  ]);

  const DeliverOptionDescriptionModel = deliveroptiondescription(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionDescriptionModel.sync({ force: true });
  await DeliverOptionDescriptionModel.bulkCreate([
    { id: 1, deliver_option_client_side_uuid: 'aaa-aaa-aaa-aaa', name: 'Home Delivery', price: 10 },
    { id: 2, deliver_option_client_side_uuid: 'bbb-bbb-bbb-bbb', name: 'Pickup', price: 0 },
  ]);

  const PaymentOptionModel = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionModel.sync({ force: true });
  await PaymentOptionModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa-aaa' },
    { client_side_uuid: 'bbb-bbb-bbb-bbb' },
  ]);

  const PaymentOptionDescriptionModel = paymentoptiondescription(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionDescriptionModel.sync({ force: true });
  await PaymentOptionDescriptionModel.bulkCreate([
    { id: 1, payment_option_client_side_uuid: 'aaa-aaa-aaa-aaa', name: 'Credit Card', price: 10 },
    { id: 2, payment_option_client_side_uuid: 'bbb-bbb-bbb-bbb', name: 'PayPal', price: 20 },
  ]);

  const ProductOrderStateModel = productorderstate(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderStateModel.sync({ force: true });
  await ProductOrderStateModel.bulkCreate([
    { name: 'Pending' },
    { name: 'Delivered' }
  ]);

  const ProductOrderModel = productorder(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderModel.sync({ force: true });
  await ProductOrderModel.bulkCreate([
    { client_side_uuid: 'ddd-ddd-ddd-ddd' },
    { client_side_uuid: 'eee-eee-eee-eee' },
  ]);

  const ProductOrderDescriptionModel = productorderdescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderDescriptionModel.sync({ force: true });
  await ProductOrderDescriptionModel.bulkCreate([
    {
      id: 1,
      product_order_client_side_uuid: 'ddd-ddd-ddd-ddd',
      name: 'John Doe',
      email: 'test@example',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postal_code: '12345',
      deliver_option_client_side_uuid: 'aaa-aaa-aaa-aaa',
      payment_option_client_side_uuid: 'bbb-bbb-bbb-bbb',
      product_order_state_name: 'Pending'
    },
    {
      id: 2,
      product_order_client_side_uuid: 'eee-eee-eee-eee',
      name: 'Jane Doe',
      email: 'test@example',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postal_code: '12345',
      deliver_option_client_side_uuid: 'aaa-aaa-aaa-aaa',
      payment_option_client_side_uuid: 'bbb-bbb-bbb-bbb',
      product_order_state_name: 'Pending'
    },
  ]);

  const Model = productorderentity(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { client_side_uuid: 'ddd-ddd-ddd-ddd' },
    { client_side_uuid: 'eee-eee-eee-eee' },
    { client_side_uuid: 'fff-fff-fff-fff' }
  ]);

  const ProductOrderEntityDescriptionModel = productorderentitydescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderEntityDescriptionModel.sync({ force: true });
  await ProductOrderEntityDescriptionModel.bulkCreate([
    {
      id: 1,
      product_order_entity_client_side_uuid: 'ddd-ddd-ddd-ddd',
      product_order_client_side_uuid: 'ddd-ddd-ddd-ddd',
      product_entity_client_side_uuid: 'aaa-aaa-aaa-aaa',
      createdAt: twoDaysAgo
    },
    {
      id: 2,
      product_order_entity_client_side_uuid: 'ddd-ddd-ddd-ddd',
      product_order_client_side_uuid: 'eee-eee-eee-eee',
      product_entity_client_side_uuid: 'bbb-bbb-bbb-bbb',
      createdAt: yesterday
    },
  ]);

  const ProductOrderEntityRemovedModel = productorderentityremoved(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderEntityRemovedModel.sync({ force: true });
  await ProductOrderEntityRemovedModel.bulkCreate([
    { id: 1, product_order_entity_client_side_uuid: 'fff-fff-fff-fff', deletedAt: new Date() },
    { id: 2, product_order_entity_client_side_uuid: 'eee-eee-eee-eee', deletedAt: new Date() },
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

test('productOrderEntities queries fetches all product order entities', async () => {
  const { data } = await tester.graphql(`{ productOrderEntities(page: 1, limit: 10) { 
    __typename
    ... on ProductOrderEntities {
      rows {
        clientSideUUID
        product_order_client_side_uuid
        product_entity_client_side_uuid
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
  expect(data.productOrderEntities.rows.length).toBe(1);
  expect(data.productOrderEntities.rows[0].clientSideUUID).toBe('ddd-ddd-ddd-ddd');
  expect(data.productOrderEntities.rows[0].product_order_client_side_uuid).toBe('eee-eee-eee-eee');
  expect(data.productOrderEntities.rows[0].product_entity_client_side_uuid).toBe('bbb-bbb-bbb-bbb');
  expect(data.productOrderEntities.rows[0].created_at).not.toBe(null);
  expect(data.productOrderEntities.rows[0].updated_at).not.toBe(null);
  expect(data.productOrderEntities.pages).toBe(1);
  expect(data.productOrderEntities.count).toBe(1);
});

test('productOrderEntity queries fetches a specific product order entity by clientSideUUID', async () => {
  const { data } = await tester.graphql(`{ productOrderEntity(clientSideUUID: "ddd-ddd-ddd-ddd") { 
    __typename
    ... on ProductOrderEntity {
      clientSideUUID
      product_order_client_side_uuid
      product_entity_client_side_uuid
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productOrderEntity.clientSideUUID).toBe('ddd-ddd-ddd-ddd');
  expect(data.productOrderEntity.product_order_client_side_uuid).toBe('eee-eee-eee-eee');
  expect(data.productOrderEntity.product_entity_client_side_uuid).toBe('bbb-bbb-bbb-bbb');
  expect(data.productOrderEntity.created_at).not.toBe(null);
  expect(data.productOrderEntity.updated_at).not.toBe(null);
});

test('productOrderEntity queries fetches fails if a specific product order entity by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ productOrderEntity(clientSideUUID: "hello-world") { 
    __typename
    ... on ProductOrderEntity {
      clientSideUUID
      product_order_client_side_uuid
      product_entity_client_side_uuid
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productOrderEntity.code).toBe("404");
  expect(data.productOrderEntity.message).toBe('No Entity found');
});

test('putProductOrderEntity mutation creates a product order entity', async () => {
  const { data } = await tester.graphql(`mutation {
    putProductOrderEntity(input: { clientSideUUID: "ggg-ggg-ggg", product_order_client_side_uuid: "aaa-aaa-aaa-aaa", product_entity_client_side_uuid: "bbb-bbb-bbb-bbb" }) {
      __typename
      ... on ProductOrderEntity {
        clientSideUUID
        product_order_client_side_uuid
        product_entity_client_side_uuid
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProductOrderEntity.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putProductOrderEntity.product_order_client_side_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(data.putProductOrderEntity.product_entity_client_side_uuid).toBe('bbb-bbb-bbb-bbb');
  expect(data.putProductOrderEntity.created_at).not.toBe(null);
  expect(data.putProductOrderEntity.updated_at).not.toBe(null);
});

test('putProductOrderEntity mutation updates a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    putProductOrderEntity(input: { clientSideUUID: "ggg-ggg-ggg", product_order_client_side_uuid: "eee-eee-eee-eee", product_entity_client_side_uuid: "aaa-aaa-aaa-aaa" }) {
      __typename
      ... on ProductOrderEntity {
        clientSideUUID
        product_order_client_side_uuid
        product_entity_client_side_uuid
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProductOrderEntity.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putProductOrderEntity.product_order_client_side_uuid).toBe('eee-eee-eee-eee');
  expect(data.putProductOrderEntity.product_entity_client_side_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(data.putProductOrderEntity.created_at).not.toBe(null);
  expect(data.putProductOrderEntity.updated_at).not.toBe(null);
});

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ productOrderEntities(page: 1, limit: 10) { 
    __typename
    ... on ProductOrderEntities {
      rows {
        clientSideUUID
        product_order_client_side_uuid
        product_entity_client_side_uuid
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
  expect(data.productOrderEntities.rows.length).toBe(2);
});

test('deleteProductOrderEntity mutation deletes a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductOrderEntity(clientSideUUID: "ggg-ggg-ggg") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`); 
  expect(data.deleteProductOrderEntity.result).toBe(true);
});

