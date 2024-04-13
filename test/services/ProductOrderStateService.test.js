import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import ProductOrderStateService from '../../src/services/ProductOrderStateService.js';

let Model;
beforeAll(async () => {
  Model = productorderstate(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        name: 'Pending'
    },
    { 
        name: 'Delivered'
    }
  ]);
});

test('findAll fetches all product order states', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ProductOrderStateService.findAll(limit, offset);
  expect(rows.length).toBe(2);
});

test('find fetches a specific product order state by name', async () => {
  const entity = await ProductOrderStateService.find('Pending');
  expect(entity.name).toBe('Pending');
});

test('create, creates a product order state', async () => {
  const entity = await ProductOrderStateService.create('Reserved');
  expect(entity.name).toBe('Reserved');
});

test('remove, deletes a product order state', async () => {
  await ProductOrderStateService.remove('Reserved');
  const entity = await Model.findOne({ where: { name: 'Reserved' }, paranoid: false });
  expect(entity.name).toBe('Reserved');
  expect(entity.deleted_at).not.toBe(null);
});
