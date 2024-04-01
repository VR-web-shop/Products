import pkg from 'amqplib';
import ProductEntity from '../../src/models/ProductEntity.js';

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

    addListener('products_reserve_product_entity_to_cart', async (msg) => {
        const uuid = msg.uuid;
        const entity = await ProductEntity.findOne({ where: { uuid } });
        await entity.update({
            product_entity_state_name: msg.product_entity_state_name
        });
    })
    addListener('products_release_product_entity_from_cart', async (msg) => {
        const uuid = msg.uuid;
        const entity = await ProductEntity.findOne({ where: { uuid } });
        await entity.update({
            product_entity_state_name: msg.product_entity_state_name
        });
    })
    /*
    TODO: BELOW
    addListener('discard_product_entity', ProductEntityService.create.bind(ProductEntityService))
    addListener('failed_checkout', ProductEntityService.create.bind(ProductEntityService))
    addListener('successful_checkout', ProductEntityService.update.bind(ProductEntityService))

    sendMessage('reserve_product_entity_to_cart', {product_entity})
    sendMessage('release_product_entity_from_cart', {product_entity})
    sendMessage('initiate_cart_checkout', [{product_entity}...])
    sendMessage('cancel_cart_checkout', [{product_entity}...])
    */
}
