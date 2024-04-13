import { expect, test, beforeEach, vi } from 'vitest'
import BrokerServiceProducer from "../../src/services/BrokerServiceProducer.js";

let QUEUES, CONSUMERS, result, service;
beforeEach(() => {
    QUEUES = BrokerServiceProducer.QUEUES;
    CONSUMERS = BrokerServiceProducer.CONSUMERS;

    result = []
    service = new BrokerServiceProducer({
        // Mock sendMessage
        sendMessage: (queueName, product) => {
            result.push({ queueName, product })
        }
    });
});

test('newProduct sends a message to SHOPPING_CART and SCENES', async () => {
    const q = QUEUES.NEW_PRODUCT;
    const c1 = CONSUMERS.SHOPPING_CART;
    const c2 = CONSUMERS.SCENES;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.newProduct(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[1].queueName).toBe(`${c2}_${q}`);
    expect(result[0].product).toEqual(p);
    expect(result[1].product).toEqual(p);
});

test('updateProduct sends a message to SHOPPING_CART and SCENES', async () => {
    const q = QUEUES.UPDATE_PRODUCT;
    const c1 = CONSUMERS.SHOPPING_CART;
    const c2 = CONSUMERS.SCENES;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.updateProduct(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[1].queueName).toBe(`${c2}_${q}`);
    expect(result[0].product).toEqual(p);
    expect(result[1].product).toEqual(p);
});

test('deleteProduct sends a message to SHOPPING_CART and SCENES', async () => {
    const q = QUEUES.DELETE_PRODUCT;
    const c1 = CONSUMERS.SHOPPING_CART;
    const c2 = CONSUMERS.SCENES;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.deleteProduct(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[1].queueName).toBe(`${c2}_${q}`);
    expect(result[0].product).toEqual(p);
    expect(result[1].product).toEqual(p);
});

test('newProductEntity sends a message to SHOPPING_CART and SCENES', async () => {
    const q = QUEUES.NEW_PRODUCT_ENTITY;
    const c1 = CONSUMERS.SHOPPING_CART;
    const c2 = CONSUMERS.SCENES;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.newProductEntity(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[1].queueName).toBe(`${c2}_${q}`);
    expect(result[0].product).toEqual(p);
    expect(result[1].product).toEqual(p);
});

test('updateProductEntity sends a message to SHOPPING_CART and SCENES', async () => {
    const q = QUEUES.UPDATE_PRODUCT_ENTITY;
    const c1 = CONSUMERS.SHOPPING_CART;
    const c2 = CONSUMERS.SCENES;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.updateProductEntity(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[1].queueName).toBe(`${c2}_${q}`);
    expect(result[0].product).toEqual(p);
    expect(result[1].product).toEqual(p);
});

test('deleteProductEntity sends a message to SHOPPING_CART and SCENES', async () => {
    const q = QUEUES.DELETE_PRODUCT_ENTITY;
    const c1 = CONSUMERS.SHOPPING_CART;
    const c2 = CONSUMERS.SCENES;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.deleteProductEntity(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[1].queueName).toBe(`${c2}_${q}`);
    expect(result[0].product).toEqual(p);
    expect(result[1].product).toEqual(p);
});

test('updateProductOrder sends a message to SHOPPING_CART', async () => {
    const q = QUEUES.UPDATE_PRODUCT_ORDER;
    const c1 = CONSUMERS.SHOPPING_CART;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.updateProductOrder(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[0].product).toEqual(p);
});

test('deleteProductOrder sends a message to SHOPPING_CART', async () => {
    const q = QUEUES.DELETE_PRODUCT_ORDER;
    const c1 = CONSUMERS.SHOPPING_CART;
    const p = { uuid: 'aaa-aaa-aaa-aaa' }
    await service.deleteProductOrder(p);
           
    expect(result[0].queueName).toBe(`${c1}_${q}`);
    expect(result[0].product).toEqual(p);
});
