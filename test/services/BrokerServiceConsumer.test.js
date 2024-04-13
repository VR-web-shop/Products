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
import BrokerServiceConsumer from '../../src/services/BrokerServiceConsumer.js';

let ProductEntityModel, ProductOrderModel, ProductOrderEntityModel;
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

  ProductEntityModel = productentity(db.sequelize, db.Sequelize.DataTypes);
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

  ProductOrderModel = productorder(db.sequelize, db.Sequelize.DataTypes);
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

  ProductOrderEntityModel = productorderentity(db.sequelize, db.Sequelize.DataTypes);
  await ProductOrderEntityModel.sync({ force: true });
  await ProductOrderEntityModel.bulkCreate([
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

test('onUpdateProductEntity updates a product entity', async () => {
  await BrokerServiceConsumer.onUpdateProductEntity({
    uuid: 'aaa-aaa-aaa-aaa',
    product_entity_state_name: 'Unavailable',
    product_uuid: 'aaa-aaa-aaa-aaa'
  });
  const entity = await ProductEntityModel.findOne({ where: { 
    uuid: 'aaa-aaa-aaa-aaa' 
  }});
  expect(entity.uuid).toBe('aaa-aaa-aaa-aaa');
  expect(entity.product_entity_state_name).toBe('Unavailable');
  expect(entity.product_uuid).toBe('aaa-aaa-aaa-aaa');
});

test('onNewProductOrder creates a new product order', async () => {
    await BrokerServiceConsumer.onNewProductOrder({
        productOrder: {
            uuid: 'bbb-bbb-bbb-bbb',
            name: 'Jane Doe',
            email: 'test@test.dk',
            address: '123 Main St',
            city: 'Springfield',
            country: 'USA',
            postal_code: '12345',
            deliver_option_name: 'Standard',
            payment_option_name: 'Credit Card',
            product_order_state_name: 'Pending',
        },
        productOrderEntities: [
            {
                product_order_uuid: 'bbb-bbb-bbb-bbb',
                product_entity_uuid: 'aaa-aaa-aaa-aaa',
                uuid: 'ddd-ddd-ddd-ddd'
            }
        ]
    });
    const productOrder = await ProductOrderModel.findOne({ where: { 
        uuid: 'bbb-bbb-bbb-bbb' 
    }});
    const productOrderEntities = await ProductOrderEntityModel.findAll({ where: {
        product_order_uuid: 'bbb-bbb-bbb-bbb'
    }});
    expect(productOrder.uuid).toBe('bbb-bbb-bbb-bbb');
    expect(productOrder.name).toBe('Jane Doe');
    expect(productOrder.email).toBe('test@test.dk');
    expect(productOrder.address).toBe('123 Main St');
    expect(productOrder.city).toBe('Springfield');
    expect(productOrder.country).toBe('USA');
    expect(productOrder.postal_code).toBe('12345');
    expect(productOrder.deliver_option_name).toBe('Standard');
    expect(productOrder.payment_option_name).toBe('Credit Card');
    expect(productOrder.product_order_state_name).toBe('Pending');
    expect(productOrderEntities.length).toBe(1);
    expect(productOrderEntities[0].uuid).toBe('ddd-ddd-ddd-ddd');
    expect(productOrderEntities[0].product_entity_uuid).toBe('aaa-aaa-aaa-aaa');
});

test('onUpdateProductOrder updates a product order', async () => {
    await BrokerServiceConsumer.onUpdateProductOrder({
        productOrder: {
            uuid: 'aaa-aaa-aaa-aaa',
            name: 'John Doe',
            email: 'test2@example.com',
            address: '123 Main St',
            city: 'Springfield',
            country: 'USA',
            postal_code: '12345',
            deliver_option_name: 'Standard',
            payment_option_name: 'Credit Card',
            product_order_state_name: 'Delivered',
        },
        productOrderEntities: [
            {
                product_order_uuid: 'aaa-aaa-aaa-aaa',
                product_entity_uuid: 'aaa-aaa-aaa-aaa',
                uuid: 'eee-eee-eee-eee'
            }
        ]
    });
    const productOrder = await ProductOrderModel.findOne({ where: { 
        uuid: 'aaa-aaa-aaa-aaa' 
    }});
    const productOrderEntities = await ProductOrderEntityModel.findAll({ where: {
        product_order_uuid: 'aaa-aaa-aaa-aaa'
    }});
    expect(productOrder.uuid).toBe('aaa-aaa-aaa-aaa');
    expect(productOrder.name).toBe('John Doe');
    expect(productOrder.email).toBe('test2@example.com');
    expect(productOrder.address).toBe('123 Main St');
    expect(productOrder.city).toBe('Springfield');
    expect(productOrder.country).toBe('USA');
    expect(productOrder.postal_code).toBe('12345');
    expect(productOrder.deliver_option_name).toBe('Standard');
    expect(productOrder.payment_option_name).toBe('Credit Card');
    expect(productOrder.product_order_state_name).toBe('Delivered');
    expect(productOrderEntities.length).toBe(1);
    expect(productOrderEntities[0].uuid).toBe('eee-eee-eee-eee');
    expect(productOrderEntities[0].product_entity_uuid).toBe('aaa-aaa-aaa-aaa');
});
