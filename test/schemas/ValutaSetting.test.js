import { expect, test, beforeAll } from 'vitest'
import EasyGraphQLTester from 'easygraphql-tester';
import mutation from '../../src/schemas/ValutaSetting/mutation.js';
import query from '../../src/schemas/ValutaSetting/query.js';
import db from '../../db/models/index.cjs';
import valutasetting from '../../db/models/valutasetting.cjs';

let tester;
beforeAll(async () => {
  const Model = valutasetting(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        name: 'USD',
        symbol: '$',
        short: 'US Dollar',
        active: true
    },
    {
        name: 'EUR',
        symbol: '€',
        short: 'Euro',
        active: false
    },
    {
        name: 'GBP',
        symbol: '£',
        short: 'British Pound',
        active: false
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

test('valutaSettings queries fetches all valuta settings', async () => { 
  const { data } = await tester.graphql('{ valutaSettings { name } }');
  expect(data.valutaSettings.length).toBe(3);
});

test('valutaSetting queries fetches a specific valuta setting by name', async () => {
  const { data } = await tester.graphql('{ valutaSetting(name: "USD") { name } }');
  expect(data.valutaSetting.name).toBe('USD');
});

test('createValutaSetting mutation creates a valuta setting', async () => {
  const { data } = await tester.graphql(`mutation {
    createValutaSetting(input: { name: "JPY", short: "Japanese Yen", symbol: "¥", active: false }) {
      name
      short
      symbol
      active
    }
  }`);
  expect(data.createValutaSetting.name).toBe('JPY');
  expect(data.createValutaSetting.symbol).toBe('¥');
  expect(data.createValutaSetting.short).toBe('Japanese Yen');
  expect(data.createValutaSetting.active).toBe(false);
});

test('updateValutaSetting mutation updates a valuta setting', async () => {
  const { data } = await tester.graphql(`mutation {
    updateValutaSetting(input: { name: "JPY", short: "Japanese Yen2", symbol: "¥2", active: true }) {
      name
      short
      symbol
      active
    }
  }`);
  expect(data.updateValutaSetting.name).toBe('JPY');
  expect(data.updateValutaSetting.symbol).toBe('¥2');
  expect(data.updateValutaSetting.short).toBe('Japanese Yen2');
  expect(data.updateValutaSetting.active).toBe(true);
});

test('deleteValutaSetting mutation deletes a valuta setting', async () => {
  const { data } = await tester.graphql(`mutation {
    deleteValutaSetting(name: "USD")
  }`);
  expect(data.deleteValutaSetting).toBe(true);
});

