import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import product from '../../db/models/product.cjs';
import productentity from '../../db/models/productentity.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import ProductEntityService from '../../src/services/ProductEntityService.js';

let Model;
beforeAll(async () => {
  const ProductModel = product(db.sequelize, db.Sequelize.DataTypes);
  await ProductModel.sync({ force: true });
  await ProductModel.bulkCreate([
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
  ]);

  const ProductEntityStateModel = productentitystate(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityStateModel.sync({ force: true });
  await ProductEntityStateModel.bulkCreate([
    { 
        name: 'Available'
    },
    { 
        name: 'Unavailable'
    }
  ]);

  Model = productentity(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'aaa-aaa-aaa-aaa',
        product_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_state_name: 'Available',
    },
    { 
        uuid: 'bbb-bbb-bbb-bbb',
        product_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_state_name: 'Available',
    },
    { 
        uuid: 'ccc-ccc-ccc-ccc',
        product_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_state_name: 'Available',
    }
  ]);
});

test('findAll fetches all product entities', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ProductEntityService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('find fetches a specific product entity by uuid', async () => {
  const entity = await ProductEntityService.find('aaa-aaa-aaa-aaa');
  expect(entity.uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_entity_state_name).toBe('Available');
});

test('create, creates a product entity', async () => {
  const entity = await ProductEntityService.create('Available', 'aaa-aaa-aaa-aaa');
  expect(entity.product_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_entity_state_name).toBe('Available');
});

test('update, updates a product entity', async () => {
  const entity = await ProductEntityService.update('ccc-ccc-ccc-ccc', 'Unavailable', 'bbb-bbb-bbb-bbb');
  expect(entity.product_uuid).toBe('bbb-bbb-bbb-bbb');
  expect(entity.product_entity_state_name).toBe('Unavailable');
});

test('remove, deletes a product entity', async () => {
  await ProductEntityService.remove('ccc-ccc-ccc-ccc');
  const entity = await Model.findOne({ where: { uuid: 'ccc-ccc-ccc-ccc' }, paranoid: false });
  expect(entity.uuid).toBe('ccc-ccc-ccc-ccc');
  expect(entity.deleted_at).not.toBe(null);
});
