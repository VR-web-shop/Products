import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/DeliverOption/mutation.js';
import query from '../../src/schemas/DeliverOption/query.js';
import db from '../../db/models/index.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import deliveroptiondescription from '../../db/models/deliveroptiondescription.cjs';
import deliveroptionremoved from '../../db/models/deliveroptionremoved.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
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
    { id: 1, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Standard Delivery', price: 10 },
    { id: 2, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Express Delivery', price: 20 },
    { id: 3, deliver_option_client_side_uuid: 'aaa-bbb-ccc', name: 'Pickup', price: 0 }
  ]);

  const DeliverOptionRemovedModel = deliveroptionremoved(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionRemovedModel.sync({ force: true });
  await DeliverOptionRemovedModel.bulkCreate([
    { id: 1, deliver_option_client_side_uuid: 'ddd-eee-fff', deletedAt: new Date() },
    { id: 2, deliver_option_client_side_uuid: 'ggg-hhh-iii', deletedAt: new Date() }
  ]);
  const removed = await DeliverOptionRemovedModel.findAll();
  console.log('removed', removed);

  const typeDefs = `
    ${query.typeDef}
    ${mutation.typeDef}
    ${requestErrorTypeDef}
  `;

  tester = new EasyGraphQLTester(typeDefs, {
    ...query.resolvers,
    ...mutation.resolvers,
  });
  return tester;
});

test('deliverOptions queries fetches all deliver options', async () => {
  const { data } = await tester.graphql(`{ deliverOptions(offset: 0, limit: 10) { 
    __typename
    ... on DeliverOptions {
      items {
        clientSideUUID
        name
        price
      }
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.deliverOptions.items.length).toBe(1);
  expect(data.deliverOptions.items[0].clientSideUUID).toBe('aaa-bbb-ccc');
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
  expect(data.deliverOption.name).toBe('Standard Delivery');
  expect(data.deliverOption.price).toBe(10);
  expect(data.deliverOption.created_at).not.toBe(null);
  expect(data.deliverOption.updated_at).not.toBe(null);
});

test('deliverOption queries fetches fails if a specific deliver option by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ deliverOption(clientSideUUID: "ddd-eee-fff") { 
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
  expect(data.putDeliverOption.created_at).not.toBe(null);
  expect(data.putDeliverOption.updated_at).not.toBe(null);
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
  expect(data.putDeliverOption.created_at).not.toBe(null);
  expect(data.putDeliverOption.updated_at).not.toBe(null);
});

test('There should only be two entities because put is idempotence', async () => {
  const { data } = await tester.graphql(`{ deliverOptions(offset: 0, limit: 10) { 
    __typename
    ... on DeliverOptions {
      items {
        clientSideUUID
        name
        price
      }
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.deliverOptions.items.length).toBe(2);
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

