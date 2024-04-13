import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import ProductService from '../../src/services/ProductService.js';

let Model;
beforeAll(async () => {
  Model = product(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'aaa-aaa-aaa-aaa',
        name: 'Apple',
        description: 'A fruit',
        thumbnail_source: 'apple.jpg',
        price: 1
    },
    { 
        uuid: 'bbb-bbb-bbb-bbb',
        name: 'Banana',
        description: 'A fruit',
        thumbnail_source: 'banana.jpg',
        price: 2
    },
    { 
        uuid: 'ccc-ccc-ccc-ccc',
        name: 'Orange',
        description: 'A fruit',
        thumbnail_source: 'orange.jpg',
        price: 3
    }
  ]);
});

test('findAll fetches all products', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ProductService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('findAllWhere fetches all product order states with a specific name', async () => {
    const where = { name: 'Orange' };
    const rows = await ProductService.findAllWhere(where);
    expect(rows.length).toBe(1);
});

test('find fetches a specific product by uuid', async () => {
  const entity = await ProductService.find('aaa-aaa-aaa-aaa');
  expect(entity.uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.name).toBe('Apple');
  expect(entity.description).toBe('A fruit');
  expect(entity.thumbnail_source).toBe('apple.jpg');
  expect(entity.price).toBe(1);
});

test('create, creates a product', async () => {
  const entity = await ProductService.create('Strawberries', 'A fruit', 'strawberries.jpg', 15);
  expect(entity.name).toBe('Strawberries');
  expect(entity.description).toBe('A fruit');
  expect(entity.thumbnail_source).toBe('strawberries.jpg');
  expect(entity.price).toBe(15);
});

test('update, updates a product', async () => {
  const entity = await ProductService.update('ccc-ccc-ccc-ccc', 'Orange', 'A fruit', 'orange.jpg', 5);
  expect(entity.name).toBe('Orange');
  expect(entity.description).toBe('A fruit');
  expect(entity.thumbnail_source).toBe('orange.jpg');
  expect(entity.price).toBe(5);
});

test('remove, deletes a product', async () => {
  await ProductService.remove('ccc-ccc-ccc-ccc');
  const entity = await Model.findOne({ where: { uuid: 'ccc-ccc-ccc-ccc' }, paranoid: false });
  expect(entity.uuid).toBe('ccc-ccc-ccc-ccc');
  expect(entity.deleted_at).not.toBe(null);
});
