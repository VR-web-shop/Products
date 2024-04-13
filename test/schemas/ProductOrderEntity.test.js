import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductOrderEntity/mutation.js';
import query from '../../src/schemas/ProductOrderEntity/query.js';
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import productentity from '../../db/models/productentity.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import productorder from '../../db/models/productorder.cjs';
import productorderentity from '../../db/models/productorderentity.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';

let tester;
beforeAll(async () => {
  const ProductModel = product(db.sequelize, db.Sequelize.DataTypes);
  await ProductModel.sync({ force: true });
  await ProductModel.bulkCreate([
    { name: 'Apple', description: 'A fruit', thumbnail_source: 'apple.jpg', price: 1 },
    { name: 'Banana', description: 'A fruit', thumbnail_source: 'banana.jpg', price: 2 },
    { name: 'Orange', description: 'A fruit', thumbnail_source: 'orange.jpg', price: 3 }
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
    { uuid: 'aaa-aaa-aaa-aaa', product_uuid: 'aaa-aaa-aaa-aaa', product_entity_state_name: 'Available' },
    { uuid: 'bbb-bbb-bbb-bbb', product_uuid: 'bbb-bbb-bbb-bbb', product_entity_state_name: 'Available' },
    { uuid: 'ccc-ccc-ccc-ccc', product_uuid: 'ccc-ccc-ccc-ccc', product_entity_state_name: 'Available' }
  ]);

  const DeliverOptionModel = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionModel.sync({ force: true });
  await DeliverOptionModel.bulkCreate([
    { name: 'Home Delivery', price: 10 },
  ]);

  const PaymentOptionModel = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionModel.sync({ force: true });
  await PaymentOptionModel.bulkCreate([
    { name: 'Credit Card', price: 10 },
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
    {
        uuid: 'ddd-ddd-ddd-ddd',
        name: 'John Doe',
        email: 'test@example',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postal_code: '12345',
        deliver_option_name: 'Home Delivery',
        payment_option_name: 'Credit Card',
        product_order_state_name: 'Pending'
    },
  ]);

  const Model = productorderentity(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'ddd-ddd-ddd-ddd',
        product_order_uuid: 'ddd-ddd-ddd-ddd',
        product_entity_uuid: 'aaa-aaa-aaa-aaa',
    },
    { 
        uuid: 'eee-eee-eee-eee',
        product_order_uuid: 'ddd-ddd-ddd-ddd',
        product_entity_uuid: 'bbb-bbb-bbb-bbb',
    },
    {
        uuid: 'fff-fff-fff-fff',
        product_order_uuid: 'ddd-ddd-ddd-ddd',
        product_entity_uuid: 'ccc-ccc-ccc-ccc',
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

test('productOrderEntities queries fetches all product order entities', async () => { 
  const { data } = await tester.graphql('{ productOrderEntities { uuid } }');
  expect(data.productOrderEntities.length).toBe(3);
});

test('productOrderEntity queries fetches a specific product order entity by uuid', async () => {
  const { data } = await tester.graphql('{ productOrderEntity(uuid: "fff-fff-fff-fff") { uuid } }');
  expect(data.productOrderEntity.uuid).toBe('fff-fff-fff-fff');
});

test('createProductOrderEntity mutation creates a product order entity', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductOrderEntity(input: { product_order_uuid: "ddd-ddd-ddd-ddd", product_entity_uuid: "ccc-ccc-ccc-ccc" }) {
        product_order_uuid
        product_entity_uuid
    }
  }`);

  expect(data.createProductOrderEntity.product_order_uuid).toBe('ddd-ddd-ddd-ddd');
  expect(data.createProductOrderEntity.product_entity_uuid).toBe('ccc-ccc-ccc-ccc');
});

test('updateProductOrderEntity mutation updates a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    updateProductOrderEntity(input: { uuid: "fff-fff-fff-fff", product_order_uuid: "ddd-ddd-ddd-ddd", product_entity_uuid: "bbb-bbb-bbb-bbb" }) {
        uuid
        product_order_uuid
        product_entity_uuid
    }
  }`);
  expect(data.updateProductOrderEntity.product_order_uuid).toBe('ddd-ddd-ddd-ddd');
  expect(data.updateProductOrderEntity.product_entity_uuid).toBe('bbb-bbb-bbb-bbb');
});

test('deleteProductOrderEntity mutation deletes a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductOrderEntity(uuid: "ddd-ddd-ddd-ddd")
  }`);
  expect(data.deleteProductOrderEntity).toBe(true);
});

