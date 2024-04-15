import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductOrder/mutation.js';
import query from '../../src/schemas/ProductOrder/query.js';
import db from '../../db/models/index.cjs';
import productorder from '../../db/models/productorder.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';

let tester;
beforeAll(async () => {
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

  const Model = productorder(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'ddd-ddd-ddd-ddd',
        name: 'John Doe',
        email: 'example@test.com',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postal_code: '12345',
        deliver_option_name: 'Home Delivery',
        payment_option_name: 'Credit Card',
        product_order_state_name: 'Pending'
    },
    { 
        uuid: 'eee-eee-eee-eee',
        name: 'Jane Doe',
        email: 'example@test.com',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postal_code: '12345',
        deliver_option_name: 'Home Delivery',
        payment_option_name: 'Credit Card',
        product_order_state_name: 'Pending'
    },
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

test('productOrders queries fetches all product orders', async () => { 
  const { data } = await tester.graphql('{ productOrders(offset: 0, limit: 10) { uuid } }');
  expect(data.productOrders.length).toBe(2);
});

test('productOrder queries fetches a specific product order by uuid', async () => {
  const { data } = await tester.graphql('{ productOrder(uuid: "ddd-ddd-ddd-ddd") { uuid } }');
  expect(data.productOrder.uuid).toBe('ddd-ddd-ddd-ddd');
});

test('createProductOrder mutation creates a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    createProductOrder(input: { name: "John Doe", email: "test@example.com", address: "123 Main St", city: "New York", country: "USA", postal_code: "12345", deliver_option_name: "Home Delivery", payment_option_name: "Credit Card", product_order_state_name: "Pending" }) {
        name
        email
        address
        city
        country
        postal_code
        deliver_option_name
        payment_option_name
        product_order_state_name
    }
  }`);
  expect(data.createProductOrder.name).toBe('John Doe');
  expect(data.createProductOrder.email).toBe('test@example.com');
  expect(data.createProductOrder.address).toBe('123 Main St');
  expect(data.createProductOrder.city).toBe('New York');
  expect(data.createProductOrder.country).toBe('USA');
  expect(data.createProductOrder.postal_code).toBe('12345');
  expect(data.createProductOrder.deliver_option_name).toBe('Home Delivery');
  expect(data.createProductOrder.payment_option_name).toBe('Credit Card');
  expect(data.createProductOrder.product_order_state_name).toBe('Pending');
});

test('updateProductOrder mutation updates a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    updateProductOrder(input: { uuid: "eee-eee-eee-eee", name: "Jane Doe", email: "test@example.com2", address: "123 Main St2", city: "New York2", country: "USA2", postal_code: "123452", deliver_option_name: "Home Delivery", payment_option_name: "Credit Card", product_order_state_name: "Delivered" }) {
        name
        email
        address
        city
        country
        postal_code
        deliver_option_name
        payment_option_name
        product_order_state_name
    }
  }`);
  expect(data.updateProductOrder.name).toBe('Jane Doe');
  expect(data.updateProductOrder.email).toBe('test@example.com2');
  expect(data.updateProductOrder.address).toBe('123 Main St2');
  expect(data.updateProductOrder.city).toBe('New York2');
  expect(data.updateProductOrder.country).toBe('USA2');
  expect(data.updateProductOrder.postal_code).toBe('123452');
  expect(data.updateProductOrder.deliver_option_name).toBe('Home Delivery');
  expect(data.updateProductOrder.payment_option_name).toBe('Credit Card');
  expect(data.updateProductOrder.product_order_state_name).toBe('Delivered');
});

test('deleteProductOrder mutation deletes a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductOrder(uuid: "ddd-ddd-ddd-ddd")
  }`);
  expect(data.deleteProductOrder).toBe(true);
});

