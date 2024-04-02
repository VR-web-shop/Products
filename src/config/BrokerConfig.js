import pkg from 'amqplib';
import ProductEntity from '../../src/models/ProductEntity.js';
import ProductOrder from '../models/ProductOrder.js';
import ProductOrderEntity from '../models/ProductOrderEntity.js';

const url = process.env.MESSAGE_BROKER_URL;
const queues = [];
let ch, conn;

export const addListener = (queueName, callback) => {
    if (queues.includes(queueName)) {
        throw new Error(`Queue ${queueName} is already being listened to.`);
    }

    queues.push(queueName);
    ch.assertQueue(queueName, { durable: false });
    ch.consume(queueName, (msg) => {
        const text = msg.content.toString();
        const json = JSON.parse(text);
        callback(json);
    }, { noAck: true });
};

export const removeListener = (queueName) => {
    ch.cancel(queueName);
};

export const sendMessage = (queueName, msg) => {
    const text = JSON.stringify(msg);

    ch.assertQueue(queueName, { durable: false });
    ch.sendToQueue(queueName, Buffer.from(text));
};

export const connect = async () => {
    conn = await pkg.connect(url);
    ch = await conn.createChannel();

    /**
     * When a customer reserves, releases, or do anything else to a product entity,
     * the product's application receives a message to update the product entity's state.
     */
    addListener('products_update_product_entity', async (msg) => {
        const uuid = msg.uuid;
        const entity = await ProductEntity.findOne({ where: { uuid } });
        await entity.update({
            product_entity_state_name: msg.product_entity_state_name
        });
    })

    /**
     * When a customer creates a new product order,
     * the product's application receives a message to create a new product order.
     */
    addListener('products_new_product_order', async (msg) => {
        const { productOrder, productOrderEntities } = msg;
        
        await ProductOrder.create(productOrder);
        for (const entity of productOrderEntities) {
            await ProductOrderEntity.create(entity);
        }
    })

    /**
     * When a customer updates a product order,
     * the product's application receives a message to update the product order.
     */
    addListener('products_update_product_order', async (msg) => {
        const { productOrder, productOrderEntities } = msg;
        // Delete all product order entities
        await ProductOrderEntity.destroy({ where: { product_order_uuid: productOrder.uuid } });
        // Update the product order
        await ProductOrder.update(productOrder, { where: { uuid: productOrder.uuid } });
        // Create new product order entities
        for (const entity of productOrderEntities) {
            await ProductOrderEntity.create(entity);
        }
    })
}
