import { expect, test, beforeAll } from 'vitest'
import db from '../../db/models/index.cjs';
import deliveroption from '../../db/models/deliveroption.cjs';
import paymentoption from '../../db/models/paymentoption.cjs';
import productorder from '../../db/models/productorder.cjs';
import productorderstate from '../../db/models/productorderstate.cjs';
import ProductOrderService from '../../src/services/ProductOrderService.js';

let Model;
beforeAll(async () => {
  const DeliverOptionModel = deliveroption(db.sequelize, db.Sequelize.DataTypes);
  await DeliverOptionModel.sync({ force: true });
  await DeliverOptionModel.bulkCreate([
    {
        name: 'Standard',
        price: 0
    },
    {
        name: 'Express',
        price: 10
    }
  ]);

  const PaymentOptionModel = paymentoption(db.sequelize, db.Sequelize.DataTypes);
  await PaymentOptionModel.sync({ force: true });
  await PaymentOptionModel.bulkCreate([
    {
        name: 'Credit Card',
        price: 10
    },
    {
        name: 'PayPal',
        price: 20
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

  Model = productorder(db.sequelize, db.Sequelize.DataTypes);
  await Model.sync({ force: true });
  await Model.bulkCreate([
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
    },
    {
        uuid: 'bbb-bbb-bbb-bbb',
        name: 'Jane Doe',
        email: 'test@test.dk',
        address: '456 Main St',
        city: 'Springfield',
        country: 'USA',
        postal_code: '12345',
        deliver_option_name: 'Express',
        payment_option_name: 'PayPal',
        product_order_state_name: 'Delivered'
    },
    {
        uuid: 'ccc-ccc-ccc-ccc',
        name: 'John Doe',
        email: 'test@test.dk',
        address: '123 Main St',
        city: 'Springfield',
        country: 'USA',
        postal_code: '12345',
        deliver_option_name: 'Standard',
        payment_option_name: 'Credit Card',
        product_order_state_name: 'Pending'
    }
  ]);

});

test('findAll fetches all product orders', async () => {
  const limit = 10;
  const offset = 0; 
  const rows = await ProductOrderService.findAll(limit, offset);
  expect(rows.length).toBe(3);
});

test('find fetches a specific product order by uuid', async () => {
  const entity = await ProductOrderService.find('aaa-aaa-aaa-aaa');
  expect(entity.uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.name).toBe('John Doe');
  expect(entity.email).toBe('test@example.com');
  expect(entity.address).toBe('123 Main St');
  expect(entity.city).toBe('Springfield');
  expect(entity.country).toBe('USA');
  expect(entity.postal_code).toBe('12345');
  expect(entity.deliver_option_name).toBe('Standard');
  expect(entity.payment_option_name).toBe('Credit Card');
  expect(entity.product_order_state_name).toBe('Pending');
});

test('create, creates a product order', async () => {
  const entity = await ProductOrderService.create('John Doe', 'test@example.com', '123 Main St', 'Springfield', 'USA', '12345', 'Standard', 'Credit Card', 'Pending');
  expect(entity.name).toBe('John Doe');
  expect(entity.email).toBe('test@example.com');
  expect(entity.address).toBe('123 Main St');
  expect(entity.city).toBe('Springfield');
  expect(entity.country).toBe('USA');
  expect(entity.postal_code).toBe('12345');
  expect(entity.deliver_option_name).toBe('Standard');
  expect(entity.payment_option_name).toBe('Credit Card');
  expect(entity.product_order_state_name).toBe('Pending');
});

test('update, updates a product order', async () => {
  const entity = await ProductOrderService.update('aaa-aaa-aaa-aaa', 'Jane Doe', 'test2@example.com', '456 Main St', 'Springfield', 'USA', '12345', 'Express', 'PayPal', 'Delivered');
  expect(entity.name).toBe('Jane Doe');
  expect(entity.email).toBe('test2@example.com');
  expect(entity.address).toBe('456 Main St');
  expect(entity.city).toBe('Springfield');
  expect(entity.country).toBe('USA');
  expect(entity.postal_code).toBe('12345');
  expect(entity.deliver_option_name).toBe('Express');
  expect(entity.payment_option_name).toBe('PayPal');
  expect(entity.product_order_state_name).toBe('Delivered');
});

test('remove, deletes a product order', async () => {
  await ProductOrderService.remove('ccc-ccc-ccc-ccc');
  const entity = await Model.findOne({ where: { uuid: 'ccc-ccc-ccc-ccc' }, paranoid: false });
  expect(entity.uuid).toBe('ccc-ccc-ccc-ccc');
  expect(entity.deleted_at).not.toBe(null);
});
