import pkg from 'amqplib';

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

(async () => {
    conn = await pkg.connect(url);
    ch = await conn.createChannel();
    /*
    TODO: BELOW
    addListener('successful_checkout', ProductEntityService.create.bind(ProductEntityService))
    addListener('reserve_product_entity_to_cart', ProductEntityService.update.bind(ProductEntityService))
    addListener('release_product_entity_from_cart', ProductEntityService.update.bind(ProductEntityService))

    sendMessage('new_product', {product_entity})
    sendMessage('discard_product', {product_entity})
    sendMessage('new_product_entity', {product_entity})
    sendMessage('discard_product_entity', {product_entity})
    */
})()
