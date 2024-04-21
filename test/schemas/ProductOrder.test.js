import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ProductOrder/mutation.js';
import query from '../../src/schemas/ProductOrder/query.js';
import typeDef from '../../src/schemas/ProductOrder/typeDef.js';
import db from '../../db/models/index.cjs';
import productorder from '../../db/models/productorder.cjs';
import productorderdescription from '../../db/models/productorderdescription.cjs';
import productorderremoved from '../../db/models/productorderremoved.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import deliveroptiondescription from '../../db/models/deliveroptiondescription.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';
import paymentoptiondescription from '../../db/models/paymentoptiondescription.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  const DeliverOptionModel = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionModel.sync({ force: true });
  await DeliverOptionModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa' },
  ]);

  const DeliverOptionDescriptionModel = deliveroptiondescription(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionDescriptionModel.sync({ force: true });
  await DeliverOptionDescriptionModel.bulkCreate([
    { deliver_option_client_side_uuid: 'aaa-aaa-aaa', name: 'Home Delivery', price: 10 },
  ]);

  const PaymentOptionModel = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionModel.sync({ force: true });
  await PaymentOptionModel.bulkCreate([
    { client_side_uuid: 'aaa-aaa-aaa' },
  ]);

  const PaymentOptionDescriptionModel = paymentoptiondescription(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionDescriptionModel.sync({ force: true });
  await PaymentOptionDescriptionModel.bulkCreate([
    { payment_option_client_side_uuid: 'aaa-aaa-aaa', name: 'Credit Card', price: 10 },
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
    { client_side_uuid: 'ddd-ddd-ddd-ddd' },
    { client_side_uuid: 'eee-eee-eee-eee' },
  ]);

  const ProductOrderDescriptionModel = productorderdescription(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderDescriptionModel.sync({ force: true });
  await ProductOrderDescriptionModel.bulkCreate([
    {
      product_order_client_side_uuid: 'ddd-ddd-ddd-ddd',
      name: 'John Doe',
      email: 'example@test.com',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postal_code: '12345',
      deliver_option_client_side_uuid: 'aaa-aaa-aaa',
      payment_option_client_side_uuid: 'aaa-aaa-aaa',
      product_order_state_name: 'Pending',
      createdAt: twoDaysAgo
    },
    {
      product_order_client_side_uuid: 'ddd-ddd-ddd-ddd',
      name: 'Jane Doe',
      email: 'example2@test.com',
      address: '123 Main St2',
      city: 'New York2',
      country: 'USA2',
      postal_code: '123452',
      deliver_option_client_side_uuid: 'aaa-aaa-aaa',
      payment_option_client_side_uuid: 'aaa-aaa-aaa',
      product_order_state_name: 'Delivered',
      createdAt: yesterday
    }
  ]);

  const ProductOrderRemovedModel = productorderremoved(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderRemovedModel.sync({ force: true });
  await ProductOrderRemovedModel.bulkCreate([
    { product_order_client_side_uuid: 'eee-eee-eee-eee', deletedAt: new Date() },
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

test('productOrders queries fetches all product orders', async () => {
  const { data } = await tester.graphql(`{ productOrders(page: 1, limit: 10) { 
    __typename
    ... on ProductOrders {
      rows {
        clientSideUUID
        name
        email
        address
        city
        country
        postal_code
        deliver_option_client_side_uuid
        payment_option_client_side_uuid
        product_order_state_name
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
  expect(data.productOrders.rows.length).toBe(1);
  expect(data.productOrders.rows[0].clientSideUUID).toBe('ddd-ddd-ddd-ddd');
  expect(data.productOrders.rows[0].name).toBe('Jane Doe');
  expect(data.productOrders.rows[0].email).toBe('example2@test.com');
  expect(data.productOrders.rows[0].address).toBe('123 Main St2');
  expect(data.productOrders.rows[0].city).toBe('New York2');
  expect(data.productOrders.rows[0].country).toBe('USA2');
  expect(data.productOrders.rows[0].postal_code).toBe('123452');
  expect(data.productOrders.rows[0].deliver_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.productOrders.rows[0].payment_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.productOrders.rows[0].product_order_state_name).toBe('Delivered');
  expect(data.productOrders.pages).toBe(1);
  expect(data.productOrders.count).toBe(1);
});

test('productOrder queries fetches a specific product order by clientSideUUID', async () => {
  const { data } = await tester.graphql(`{ productOrder(clientSideUUID: "ddd-ddd-ddd-ddd") { 
    __typename
    ... on ProductOrder {
      clientSideUUID
      name
      email
      address
      city
      country
      postal_code
      deliver_option_client_side_uuid
      payment_option_client_side_uuid
      product_order_state_name
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productOrder.clientSideUUID).toBe('ddd-ddd-ddd-ddd');
  expect(data.productOrder.name).toBe('Jane Doe');
  expect(data.productOrder.email).toBe('example2@test.com');
  expect(data.productOrder.address).toBe('123 Main St2');
  expect(data.productOrder.city).toBe('New York2');
  expect(data.productOrder.country).toBe('USA2');
  expect(data.productOrder.postal_code).toBe('123452');
  expect(data.productOrder.deliver_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.productOrder.payment_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.productOrder.product_order_state_name).toBe('Delivered');
});

test('productOrder queries fetches fails if a specific product order by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ productOrder(clientSideUUID: "hello-world") { 
    __typename
    ... on ProductOrder {
      clientSideUUID
      name
      email
      address
      city
      country
      postal_code
      deliver_option_client_side_uuid
      payment_option_client_side_uuid
      product_order_state_name
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.productOrder.code).toBe("404");
  expect(data.productOrder.message).toBe('No Entity found');
});

test('putProductOrder mutation creates a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    putProductOrder(input: { clientSideUUID: "ggg-ggg-ggg", name: "John Doe", email: "test@example.com", address: "123 Main St", city: "New York", country: "USA", postal_code: "12345", deliver_option_client_side_uuid: "aaa-aaa-aaa", payment_option_client_side_uuid: "aaa-aaa-aaa", product_order_state_name: "Pending" }) {
      __typename
      ... on ProductOrder {
        clientSideUUID
        name
        email
        address
        city
        country
        postal_code
        deliver_option_client_side_uuid
        payment_option_client_side_uuid
        product_order_state_name
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putProductOrder.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putProductOrder.name).toBe('John Doe');
  expect(data.putProductOrder.email).toBe('test@example.com');
  expect(data.putProductOrder.address).toBe('123 Main St');
  expect(data.putProductOrder.city).toBe('New York');
  expect(data.putProductOrder.country).toBe('USA');
  expect(data.putProductOrder.postal_code).toBe('12345');
  expect(data.putProductOrder.deliver_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.putProductOrder.payment_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.putProductOrder.product_order_state_name).toBe('Pending');
});

test('putProductOrder mutation updates a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    putProductOrder(input: { clientSideUUID: "ggg-ggg-ggg", name: "test", email: "test@test.com2", address: "test", city: "test", country: "test", postal_code: "333", deliver_option_client_side_uuid: "aaa-aaa-aaa", payment_option_client_side_uuid: "aaa-aaa-aaa", product_order_state_name: "Delivered" }) {
      __typename
      ... on ProductOrder {
        clientSideUUID
        name
        email
        address
        city
        country
        postal_code
        deliver_option_client_side_uuid
        payment_option_client_side_uuid
        product_order_state_name
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
  }}`);
  expect(data.putProductOrder.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putProductOrder.name).toBe('test');
  expect(data.putProductOrder.email).toBe('test@test.com2');
  expect(data.putProductOrder.address).toBe('test');
  expect(data.putProductOrder.city).toBe('test');
  expect(data.putProductOrder.country).toBe('test');
  expect(data.putProductOrder.postal_code).toBe('333');
  expect(data.putProductOrder.deliver_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.putProductOrder.payment_option_client_side_uuid).toBe('aaa-aaa-aaa');
  expect(data.putProductOrder.product_order_state_name).toBe('Delivered');
});

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ productOrders(page: 1, limit: 10) { 
    __typename
    ... on ProductOrders {
      rows {
        clientSideUUID
        name
        email
        address
        city
        country
        postal_code
        deliver_option_client_side_uuid
        payment_option_client_side_uuid
        product_order_state_name
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
  expect(data.productOrders.rows.length).toBe(2);
});

test('deleteProductOrder mutation deletes a product order', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteProductOrder(clientSideUUID: "ggg-ggg-ggg") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`); 
  expect(data.deleteProductOrder.result).toBe(true);
});

