import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import DeliverOptionService from '../../src/services/DeliverOptionService.js';

let Model;
beforeAll(async () => {
  Model = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        name: 'Standard Delivery',
        price: 10
    },
    {
        name: 'Express Delivery',
        price: 20
    },
    {
        name: 'Pickup',
        price: 0
    }
  ]);
});

test('findAll fetches all deliver options', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await DeliverOptionService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('find fetches a specific deliver option by name', async () => {
  const entity = await DeliverOptionService.find('Standard Delivery');
  expect(entity.name).toBe('Standard Delivery');
  expect(entity.price).toBe(10);
});

test('create, creates a deliver option', async () => {
  const entity = await DeliverOptionService.create('Home Delivery', 5);
  expect(entity.name).toBe('Home Delivery');
  expect(entity.price).toBe(5);
});

test('update, updates a deliver option', async () => {
  const entity = await DeliverOptionService.update('Home Delivery', 15);
  expect(entity.name).toBe('Home Delivery');
  expect(entity.price).toBe(15);
});

test('remove, deletes a deliver option', async () => {
  await DeliverOptionService.remove('Home Delivery');
  const entity = await Model.findOne({ where: { name: 'Home Delivery' }, paranoid: false });
  expect(entity.name).toBe('Home Delivery');
  expect(entity.deleted_at).not.toBe(null);
});
