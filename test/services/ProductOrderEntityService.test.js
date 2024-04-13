import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';
import product from '../../db/models/product.cjs';
import productentity from '../../db/models/productentity.cjs';
import productentitystate from '../../db/models/productentitystate.cjs';
import productorder from '../../db/models/productorder.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import productorderentity from '../../db/models/productorderentity.cjs';
import ProductOrderEntityService from '../../src/services/ProductOrderEntityService.js';

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

  const ProductEntityModel = productentity(db.sequelize, db.Sequelize.DataTypes);
  await ProductEntityModel.sync({ force: true });
  await ProductEntityModel.bulkCreate([
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

  const DeliverOptionModel = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionModel.sync({ force: true });
  await DeliverOptionModel.bulkCreate([
    {
        name: 'Standard',
        price: 0
    }
  ]);

  const PaymentOptionModel = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionModel.sync({ force: true });
  await PaymentOptionModel.bulkCreate([
    {
        name: 'Credit Card',
        price: 10
    }
  ]);

  const ProductOrderStateModel = productorderstate(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderStateModel.sync({ force: true });
  await ProductOrderStateModel.bulkCreate([
    {
        name: 'Pending'
    },
    {
        name: 'Delivered'
    }
  ]);

  const ProductOrderModel = productorder(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderModel.sync({ force: true });
  await ProductOrderModel.bulkCreate([
    {
        uuid: 'aaa-aaa-aaa-aaa',
        name: 'John Doe',
        email: 'test@example.com',
        address: '123 Main St',
        city: 'Springfield',
        country: 'USA',
        postal_code: '12345',
        deliver_option_name: 'Standard',
        payment_option_name: 'Credit Card',
        product_order_state_name: 'Pending'
    }
  ]);

  Model = productorderentity(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
    { 
        uuid: 'aaa-aaa-aaa-aaa',
        product_order_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_uuid: 'aaa-aaa-aaa-aaa',
    },
    { 
        uuid: 'bbb-bbb-bbb-bbb',
        product_order_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_uuid: 'bbb-bbb-bbb-bbb',
    },
    { 
        uuid: 'ccc-ccc-ccc-ccc',
        product_order_uuid: 'aaa-aaa-aaa-aaa',
        product_entity_uuid: 'ccc-ccc-ccc-ccc',
    }
  ]);
});

test('findAll fetches all product order entities', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ProductOrderEntityService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('findAllWhere fetches all product order entities with a specific name', async () => {
    const where = { product_order_uuid: 'aaa-aaa-aaa-aaa' };
    const rows = await ProductOrderEntityService.findAllWhere(where);
    expect(rows.length).toBe(3);
});

test('find fetches a specific product order entity by uuid', async () => {
  const entity = await ProductOrderEntityService.find('aaa-aaa-aaa-aaa');
  expect(entity.uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_order_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_entity_uuid).toBe('aaa-aaa-aaa-aaa');
});

test('create, creates a product order entity', async () => {
  const entity = await ProductOrderEntityService.create('aaa-aaa-aaa-aaa', 'aaa-aaa-aaa-aaa');
  expect(entity.product_order_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_entity_uuid).toBe('aaa-aaa-aaa-aaa');
});

test('update, updates a product order entity', async () => {
  const entity = await ProductOrderEntityService.update('ccc-ccc-ccc-ccc', 'aaa-aaa-aaa-aaa', 'ccc-ccc-ccc-ccc');
  expect(entity.product_order_uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_entity_uuid).toBe('ccc-ccc-ccc-ccc');
});

test('remove, deletes a product order entity', async () => {
  await ProductOrderEntityService.remove('ccc-ccc-ccc-ccc');
  const entity = await Model.findOne({ where: { uuid: 'ccc-ccc-ccc-ccc' }, paranoid: false });
  expect(entity.uuid).toBe('ccc-ccc-ccc-ccc');
  expect(entity.deleted_at).not.toBe(null);
});
