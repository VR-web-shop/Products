import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';
import PaymentOptionService from '../../src/services/PaymentOptionService.js';
test('findAll fetches all deliver options', async () => {
});
/*
let Model;
beforeAll(async () => {
  Model = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        name: 'Credit Card',
        price: 10
    },
    {
        name: 'PayPal',
        price: 20
    },
    {
        name: 'Cash',
        price: 0
    }
  ]);
});

test('findAll fetches all payment options', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await PaymentOptionService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('findAllWhere fetches all payment options with a specific name', async () => {
    const where = { name: 'Credit Card' };
    const rows = await PaymentOptionService.findAllWhere(where);
    expect(rows.length).toBe(1);
});

test('find fetches a specific payment option by name', async () => {
  const entity = await PaymentOptionService.find('Credit Card');
  expect(entity.name).toBe('Credit Card');
  expect(entity.price).toBe(10);
});

test('create, creates a payment option', async () => {
  const entity = await PaymentOptionService.create('Apples', 5);
  expect(entity.name).toBe('Apples');
  expect(entity.price).toBe(5);
});

test('update, updates a payment option', async () => {
  const entity = await PaymentOptionService.update('Apples', 15);
  expect(entity.name).toBe('Apples');
  expect(entity.price).toBe(15);
});

test('remove, deletes a payment option', async () => {
  await PaymentOptionService.remove('Apples');
  const entity = await Model.findOne({ where: { name: 'Apples' }, paranoid: false });
  expect(entity.name).toBe('Apples');
  expect(entity.deleted_at).not.toBe(null);
});
*/