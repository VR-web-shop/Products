import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createHandler } from 'graphql-http/lib/use/express';

import RequestErrorTypeDef from "./RequestError/typeDef.js";

import DeliverOptionMutation from "./DeliverOption/mutation.js";
import DeliverOptionQuery from "./DeliverOption/query.js";
import DeliverOptionTypeDef from "./DeliverOption/typeDef.js";

import PaymentOptionMutation from "./PaymentOption/mutation.js";
import PaymentOptionQuery from "./PaymentOption/query.js";
import PaymentOptionTypeDef from "./PaymentOption/typeDef.js";

import ProductMutation from "./Product/mutation.js";
import ProductQuery from "./Product/query.js";
import ProductTypeDef from "./Product/typeDef.js";

import ProductEntityMutation from "./ProductEntity/mutation.js";
import ProductEntityQuery from "./ProductEntity/query.js";
import ProductEntityTypeDef from "./ProductEntity/typeDef.js";

import ProductEntityStateMutation from "./ProductEntityState/mutation.js";
import ProductEntityStateQuery from "./ProductEntityState/query.js";
import ProductEntityStateTypeDef from "./ProductEntityState/typeDef.js";

import ProductOrderMutation from "./ProductOrder/mutation.js";
import ProductOrderQuery from "./ProductOrder/query.js";
import ProductOrderTypeDef from "./ProductOrder/typeDef.js";

import ProductOrderEntityMutation from "./ProductOrderEntity/mutation.js";
import ProductOrderEntityQuery from "./ProductOrderEntity/query.js";
import ProductOrderEntityTypeDef from "./ProductOrderEntity/typeDef.js";

import ProductOrderStateMutation from "./ProductOrderState/mutation.js";
import ProductOrderStateQuery from "./ProductOrderState/query.js";
import ProductOrderStateTypeDef from "./ProductOrderState/typeDef.js";

import ValutaSettingMutation from "./ValutaSetting/mutation.js";
import ValutaSettingQuery from "./ValutaSetting/query.js";
import ValutaSettingTypeDef from "./ValutaSetting/typeDef.js";

import HealthQuery from "./Health/query.js";
import HealthTypeDef from "./Health/typeDef.js";

const typeDefs = mergeTypeDefs([
    ProductTypeDef,
    DeliverOptionTypeDef,
    PaymentOptionTypeDef,
    ProductEntityTypeDef,
    ProductEntityStateTypeDef,
    ProductOrderTypeDef,
    ProductOrderEntityTypeDef,
    ProductOrderStateTypeDef,
    ValutaSettingTypeDef,
    RequestErrorTypeDef,
    HealthTypeDef,
]);

const resolvers = mergeResolvers([
    DeliverOptionQuery,
    DeliverOptionMutation,
    PaymentOptionQuery,
    PaymentOptionMutation,
    ProductQuery,
    ProductMutation,
    ProductEntityQuery,
    ProductEntityMutation,
    ProductEntityStateQuery,
    ProductEntityStateMutation,
    ProductOrderQuery,
    ProductOrderMutation,
    ProductOrderEntityQuery,
    ProductOrderEntityMutation,
    ProductOrderStateQuery,
    ProductOrderStateMutation,
    ValutaSettingQuery,
    ValutaSettingMutation,
    HealthQuery,
]);

const schema = makeExecutableSchema({ 
    typeDefs, 
    resolvers,
});

const context = async (req, res, next ) => {
    return { req, res, next };
};

export default createHandler({
    schema,
    context
});
