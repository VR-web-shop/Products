import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import ProductEntityStateService from '../../src/services/ProductEntityStateService.js';

let Model;
beforeAll(async () => {
  Model = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        name: 'Available'
    },
    { 
        name: 'Unavailable'
    }
  ]);
});

test('findAll fetches all product entity states', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ProductEntityStateService.findAll(limit, offset);
  expect(rows.length).toBe(2);
});

test('findAllWhere fetches all product entity states with a specific name', async () => {
    const where = { name: 'Available' };
    const rows = await ProductEntityStateService.findAllWhere(where);
    expect(rows.length).toBe(1);
});

test('find fetches a specific product entity state by name', async () => {
  const entity = await ProductEntityStateService.find('Available');
  expect(entity.name).toBe('Available');
});

test('create, creates a product entity state', async () => {
  const entity = await ProductEntityStateService.create('Reserved');
  expect(entity.name).toBe('Reserved');
});

test('remove, deletes a product entity state', async () => {
  await ProductEntityStateService.remove('Reserved');
  const entity = await Model.findOne({ where: { name: 'Reserved' }, paranoid: false });
  expect(entity.name).toBe('Reserved');
  expect(entity.deleted_at).not.toBe(null);
});
