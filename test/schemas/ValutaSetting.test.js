import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ValutaSetting/mutation.js';
import query from '../../src/schemas/ValutaSetting/query.js';
import typeDef from '../../src/schemas/ValutaSetting/typeDef.js';
import db from '../../db/models/index.cjs';
import valutasetting from '../../db/models/valutasetting.cjs';
import valutasettingdescription from '../../db/models/valutasettingdescription.cjs';
import valutasettingremoved from '../../db/models/valutasettingremoved.cjs';
import requestErrorTypeDef from '../../src/schemas/RequestError/typeDef.js';

let tester;
beforeAll(async () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  const Model = valutasetting(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { client_side_uuid: 'aaa-bbb-ccc' },
    { client_side_uuid: 'ddd-eee-fff' },
    { client_side_uuid: 'ggg-hhh-iii' }
  ]);

  const ValutaSettingDescriptionModel = valutasettingdescription(db.sequelize, db.Sequelize.DataTypes);
  await ValutaSettingDescriptionModel.sync({ force: true });
  await ValutaSettingDescriptionModel.bulkCreate([
    { id: 1, valuta_setting_client_side_uuid: 'aaa-bbb-ccc', name: 'USD', symbol: '$', short: 'US Dollar', active: false, createdAt: twoDaysAgo },
    { id: 2, valuta_setting_client_side_uuid: 'aaa-bbb-ccc', name: 'EUR', symbol: '€', short: 'Euro', active: false, createdAt: yesterday },
    { id: 3, valuta_setting_client_side_uuid: 'aaa-bbb-ccc', name: 'GBP', symbol: '£', short: 'British Pound', active: true, createdAt: today }
  ]);

  const ValutaSettingRemovedModel = valutasettingremoved(db.sequelize, db.Sequelize.DataTypes);
  await ValutaSettingRemovedModel.sync({ force: true });
  await ValutaSettingRemovedModel.bulkCreate([
    { id: 1, valuta_setting_client_side_uuid: 'ddd-eee-fff', deletedAt: new Date() },
    { id: 2, valuta_setting_client_side_uuid: 'ggg-hhh-iii', deletedAt: new Date() }
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

test('valutaSettings queries fetches all valuta settings', async () => { 
  const { data } = await tester.graphql(`{ valutaSettings(page: 1, limit: 10) { 
    __typename
    ... on ValutaSettings {
      rows {
        clientSideUUID
        name
        short
        symbol
        active
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
  expect(data.valutaSettings.rows.length).toBe(1);
  expect(data.valutaSettings.rows[0].clientSideUUID).toBe('aaa-bbb-ccc');
  expect(data.valutaSettings.rows[0].name).toBe('GBP');
  expect(data.valutaSettings.rows[0].short).toBe('British Pound');
  expect(data.valutaSettings.rows[0].symbol).toBe('£');
  expect(data.valutaSettings.rows[0].active).toBe(true);
  expect(data.valutaSettings.rows[0].created_at).not.toBe(null);
  expect(data.valutaSettings.rows[0].updated_at).not.toBe(null);
  expect(data.valutaSettings.pages).toBe(1);
  expect(data.valutaSettings.count).toBe(1);
});

test('valutaSetting queries fetches a specific valuta setting by clientSideUUID', async () => {
  const { data } = await tester.graphql(`{ valutaSetting(clientSideUUID: "aaa-bbb-ccc") { 
    __typename
    ... on ValutaSetting {
      clientSideUUID
      name
      short
      symbol
      active
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.valutaSetting.clientSideUUID).toBe('aaa-bbb-ccc');
  expect(data.valutaSetting.name).toBe('GBP');
  expect(data.valutaSetting.short).toBe('British Pound');
  expect(data.valutaSetting.symbol).toBe('£');
  expect(data.valutaSetting.active).toBe(true);
  expect(data.valutaSetting.created_at).not.toBe(null);
  expect(data.valutaSetting.updated_at).not.toBe(null);
});

test('valutaSetting queries fetches fails if a specific valuta setting by clientSideUUID does not exist', async () => {
  const { data } = await tester.graphql(`{ valutaSetting(clientSideUUID: "hello-world") { 
    __typename
    ... on ValutaSetting {
      clientSideUUID
      name
      short
      symbol
      active
      created_at
      updated_at
    }
    ... on RequestError {
      code
      message
    }
  }}`);
  expect(data.valutaSetting.code).toBe("404");
  expect(data.valutaSetting.message).toBe('No Entity found');
});

test('putValutaSetting mutation creates a valuta setting', async () => {
  const { data } = await tester.graphql(`mutation {
    putValutaSetting(input: { clientSideUUID: "ggg-ggg-ggg", name: "JPY", short: "Japanese Yen", symbol: "¥", active: false }) {
      __typename
      ... on ValutaSetting {
        clientSideUUID
        name
        short
        symbol
        active
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putValutaSetting.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putValutaSetting.name).toBe('JPY');
  expect(data.putValutaSetting.symbol).toBe('¥');
  expect(data.putValutaSetting.short).toBe('Japanese Yen');
  expect(data.putValutaSetting.active).toBe(false);
  expect(data.putValutaSetting.created_at).not.toBe(null);
  expect(data.putValutaSetting.updated_at).not.toBe(null);
});

test('putValutaSetting mutation updates a valuta setting', async () => {
  const { data } = await tester.graphql(`mutation {
    putValutaSetting(input: { clientSideUUID: "ggg-ggg-ggg", name: "JPY2", short: "Japanese Yen2", symbol: "¥2", active: true }) {
      __typename
      ... on ValutaSetting {
        clientSideUUID
        name
        short
        symbol
        active
        created_at
        updated_at
      }
      ... on RequestError {
        code
        message
      }
    }}`);
  expect(data.putValutaSetting.clientSideUUID).toBe('ggg-ggg-ggg');
  expect(data.putValutaSetting.name).toBe('JPY2');
  expect(data.putValutaSetting.symbol).toBe('¥2');
  expect(data.putValutaSetting.short).toBe('Japanese Yen2');
  expect(data.putValutaSetting.active).toBe(true);
  expect(data.putValutaSetting.created_at).not.toBe(null);
  expect(data.putValutaSetting.updated_at).not.toBe(null);
});

test('deleteValutaSetting mutation deletes a valuta setting', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteValutaSetting(clientSideUUID: "ggg-ggg-ggg") {
      __typename
      ... on BooleanResult {
        result
      }
      ... on RequestError {
        code
        message
      }
  }}`); 
  expect(data.deleteValutaSetting.result).toBe(true);
});

