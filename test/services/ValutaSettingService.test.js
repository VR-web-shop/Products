import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import valutasetting from '../../db/models/valutasetting.cjs';
import ValutaSettingService from '../../src/services/ValutaSettingService.js';

let Model;
beforeAll(async () => {
  Model = valutasetting(db.sequelize, db.Sequelize.DataTypes);
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
});

test('findAll fetches all valuta settings', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ValutaSettingService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('find fetches a specific valuta setting by name', async () => {
  const entity = await ValutaSettingService.find('USD');
  expect(entity.name).toBe('USD');
  expect(entity.symbol).toBe('$');
  expect(entity.short).toBe('US Dollar');
  expect(entity.active).toBe(true);
});

test('create, creates a valuta setting', async () => {
  const entity = await ValutaSettingService.create('JPY', 'Japanese Yen', '¥', false);
  expect(entity.name).toBe('JPY');
  expect(entity.symbol).toBe('¥');
  expect(entity.short).toBe('Japanese Yen');
  expect(entity.active).toBe(false);
});

test('update, updates a valuta setting', async () => {
  const entity = await ValutaSettingService.update('EUR', 'Euro2', '€2', true);
  expect(entity.name).toBe('EUR');
  expect(entity.symbol).toBe('€2');
  expect(entity.short).toBe('Euro2');
  expect(entity.active).toBe(true);
});

test('remove, deletes a valuta setting', async () => {
  await ValutaSettingService.remove('GBP');
  const entity = await Model.findOne({ where: { name: 'GBP' }, paranoid: false });
  expect(entity.name).toBe('GBP');
  expect(entity.deleted_at).not.toBe(null);
});
