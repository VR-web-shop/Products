import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/DeliverOption/mutation.js';
import query from '../../src/schemas/DeliverOption/query.js';
import typeDef from '../../src/schemas/DeliverOption/typeDef.js';
import db from '../../db/models/index.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import deliveroptiondescription from '../../db/models/deliveroptiondescription.cjs';
import deliveroptionremoved from '../../db/models/deliveroptionremoved.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);
  
  const Model = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { client_side_uuid: 'aaa-bbb-ccc' },
    { client_side_uuid: 'ddd-eee-fff' },
    { client_side_uuid: 'ggg-hhh-iii' }
  ]);

  const DeliverOptionDescriptionModel = deliveroptiondescription(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionDescriptionModel.sync({ force: true });
  await DeliverOptionDescriptionModel.bulkCreate([
    { id: 1, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Standard Delivery', price: 10, createdAt: twoDaysAgo },
    { id: 2, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Express Delivery', price: 20, createdAt: yesterday },
    { id: 3, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Pickup', price: 0, createdAt: today }
  ]);

  const DeliverOptionRemovedModel = deliveroptionremoved(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionRemovedModel.sync({ force: true });
  await DeliverOptionRemovedModel.bulkCreate([
    { id: 1, deliver_option_client_side_uuid: 'ddd-eee-fff', deletedAt: new Date() },
    { id: 2, deliver_option_client_side_uuid: 'ggg-hhh-iii', deletedAt: new Date() }
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

test('deliverOptions queries fetches all deliver options', async () => {
  const { data } = await tester.graphql(`{ deliverOptions(page: 1, limit: 10) { 
    __typename
    ... on DeliverOptions {
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
  expect(data.deliverOptions.rows.length).toBe(1);
  expect(data.deliverOptions.rows[0].clientSideUUID).toBe('aaa-bbb-ccc');
  expect(data.deliverOptions.rows[0].name).toBe('Pickup');
  expect(data.deliverOptions.rows[0].price).toBe(0);
  expect(data.deliverOptions.pages).toBe(1);
  expect(data.deliverOptions.count).toBe(1);
});

test('deliverOption queries fetches a specific deliver option by clientSideUUID', async () => {
  const { data } = await tester.graphql(`{ deliverOption(clientSideUUID: "aaa-bbb-ccc") { 
    __typename
    ... on DeliverOption {
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
  expect(data.deliverOption.clientSideUUID).toBe('aaa-bbb-ccc');
  expect(data.deliverOption.name).toBe('Pickup');
  expect(data.deliverOption.price).toBe(0);
});

test('deliverOption queries fetches fails if a specific deliver option by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ deliverOption(clientSideUUID: "hello-world") { 
    __typename
    ... on DeliverOption {
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
  expect(data.deliverOption.code).toBe("404");
  expect(data.deliverOption.message).toBe('No Entity found');
});

test('putDeliverOption mutation creates a deliver option', async () => {
  const { data } = await tester.graphql(`mutation {
    putDeliverOption(input: { clientSideUUID: "ccc-ccc-ccc", name: "Home Delivery", price: 15 }) {
      __typename
      ... on DeliverOption {
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
  expect(data.putDeliverOption.clientSideUUID).toBe('ccc-ccc-ccc');
  expect(data.putDeliverOption.name).toBe('Home Delivery');
  expect(data.putDeliverOption.price).toBe(15);
});

test('putDeliverOption mutation updates a deliver option', async () => {
  const { data } = await tester.graphql(`mutation {
    putDeliverOption(input: { clientSideUUID: "ccc-ccc-ccc", name: "Home Delivery", price: 5 }) {
      __typename
      ... on DeliverOption {
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
  expect(data.putDeliverOption.clientSideUUID).toBe('ccc-ccc-ccc');
  expect(data.putDeliverOption.name).toBe('Home Delivery');
  expect(data.putDeliverOption.price).toBe(5);
}); 

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ deliverOptions(page: 1, limit: 10) { 
    __typename
    ... on DeliverOptions {
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
  expect(data.deliverOptions.rows.length).toBe(2);
});

test('deleteDeliverOption mutation deletes a deliver option', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteDeliverOption(clientSideUUID: "ccc-ccc-ccc") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`);
  expect(data.deleteDeliverOption.result).toBe(true);
});

