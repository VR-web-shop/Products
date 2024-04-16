import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/PaymentOption/mutation.js';
import query from '../../src/schemas/PaymentOption/query.js';
import typeDef from '../../src/schemas/PaymentOption/typeDef.js';
import db from '../../db/models/index.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';
import paymentoptiondescription from '../../db/models/paymentoptiondescription.cjs';
import paymentoptionremoved from '../../db/models/paymentoptionremoved.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  const Model = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { client_side_uuid: 'aaa-bbb-ccc' },
    { client_side_uuid: 'ddd-eee-fff' },
    { client_side_uuid: 'ggg-hhh-iii' }
  ]);

  const PaymentOptionDescriptionModel = paymentoptiondescription(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionDescriptionModel.sync({ force: true });
  await PaymentOptionDescriptionModel.bulkCreate([
    { id: 1, payment_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Credit Card', price: 10, createdAt: twoDaysAgo },
    { id: 2, payment_option_client_side_uuid: 'aaa-bbb-ccc', name: 'PayPal', price: 20, createdAt: yesterday },
    { id: 3, payment_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Cash', price: 0, createdAt: today }
  ]);

  const PaymentOptionRemovedModel = paymentoptionremoved(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionRemovedModel.sync({ force: true });
  await PaymentOptionRemovedModel.bulkCreate([
    { id: 1, payment_option_client_side_uuid: 'ddd-eee-fff', deletedAt: new Date() },
    { id: 2, payment_option_client_side_uuid: 'ggg-hhh-iii', deletedAt: new Date() }
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

test('paymentOptions queries fetches all payment options', async () => {
  const { data } = await tester.graphql(`{ paymentOptions(page: 1, limit: 10) { 
    __typename
    ... on PaymentOptions {
      rows {
        clientSideUUID
        name
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
  expect(data.paymentOptions.rows.length).toBe(1);
  expect(data.paymentOptions.rows[0].clientSideUUID).toBe('aaa-bbb-ccc');
  expect(data.paymentOptions.rows[0].name).toBe('Cash');
  expect(data.paymentOptions.rows[0].price).toBe(0);
  expect(data.paymentOptions.pages).toBe(1);
  expect(data.paymentOptions.count).toBe(1);
});

test('paymentOption queries fetches a specific payment option by name', async () => {
  const { data } = await tester.graphql(`{ paymentOption(clientSideUUID: "aaa-bbb-ccc") { 
    __typename
    ... on PaymentOption {
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
  expect(data.paymentOption.clientSideUUID).toBe('aaa-bbb-ccc');
  expect(data.paymentOption.name).toBe('Cash');
  expect(data.paymentOption.price).toBe(0);
  expect(data.paymentOption.created_at).not.toBe(null);
  expect(data.paymentOption.updated_at).not.toBe(null);
});

test('paymentOption queries fetches fails if a specific payment option by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ paymentOption(clientSideUUID: "hello-world") { 
    __typename
    ... on PaymentOption {
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
  expect(data.paymentOption.code).toBe("404");
  expect(data.paymentOption.message).toBe('No Entity found');
});

test('putPaymentOption mutation creates a payment option', async () => {
  const { data } = await tester.graphql(`mutation {
    putPaymentOption(input: { clientSideUUID: "ccc-ccc-ccc", name: "Beans", price: 10000 }) {
      __typename
      ... on PaymentOption {
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
  expect(data.putPaymentOption.clientSideUUID).toBe('ccc-ccc-ccc');
  expect(data.putPaymentOption.name).toBe('Beans');
  expect(data.putPaymentOption.price).toBe(10000);
  expect(data.putPaymentOption.created_at).not.toBe(null);
  expect(data.putPaymentOption.updated_at).not.toBe(null);
});

test('putPaymentOption mutation updates a payment option', async () => {
  const { data } = await tester.graphql(`mutation {
    putPaymentOption(input: { clientSideUUID: "ccc-ccc-ccc", name: "Apples", price: 3 }) {
      __typename
      ... on PaymentOption {
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
  expect(data.putPaymentOption.clientSideUUID).toBe('ccc-ccc-ccc');
  expect(data.putPaymentOption.name).toBe('Apples');
  expect(data.putPaymentOption.price).toBe(3);
  expect(data.putPaymentOption.created_at).not.toBe(null);
  expect(data.putPaymentOption.updated_at).not.toBe(null);
});

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ paymentOptions(page: 1, limit: 10) { 
    __typename
    ... on PaymentOptions {
      rows {
        clientSideUUID
        name
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
  expect(data.paymentOptions.rows.length).toBe(2);
});

test('deletePaymentOption mutation deletes a payment option', async () => {
  const { data } = await tester.graphql(`mutation {
    deletePaymentOption(clientSideUUID: "ccc-ccc-ccc") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`); 
  expect(data.deletePaymentOption.result).toBe(true);
});

