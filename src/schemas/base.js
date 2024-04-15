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

import ProductEntityMutation from "./ProductEntity/mutation.js";
import ProductEntityQuery from "./ProductEntity/query.js";

import ProductEntityStateMutation from "./ProductEntityState/mutation.js";
import ProductEntityStateQuery from "./ProductEntityState/query.js";

import ProductOrderMutation from "./ProductOrder/mutation.js";
import ProductOrderQuery from "./ProductOrder/query.js";

import ProductOrderEntityMutation from "./ProductOrderEntity/mutation.js";
import ProductOrderEntityQuery from "./ProductOrderEntity/query.js";

import ProductOrderStateMutation from "./ProductOrderState/mutation.js";
import ProductOrderStateQuery from "./ProductOrderState/query.js";

import ValutaSettingMutation from "./ValutaSetting/mutation.js";
import ValutaSettingQuery from "./ValutaSetting/query.js";

const typeDefs = mergeTypeDefs([
    DeliverOptionTypeDef,
    PaymentOptionTypeDef,
    ProductQuery.typeDef,
    ProductMutation.typeDef,
    ProductEntityQuery.typeDef,
    ProductEntityMutation.typeDef,
    ProductEntityStateQuery.typeDef,
    ProductEntityStateMutation.typeDef,
    ProductOrderQuery.typeDef,
    ProductOrderMutation.typeDef,
    ProductOrderEntityQuery.typeDef,
    ProductOrderEntityMutation.typeDef,
    ProductOrderStateQuery.typeDef,
    ProductOrderStateMutation.typeDef,
    ValutaSettingQuery.typeDef,
    ValutaSettingMutation.typeDef,
    RequestErrorTypeDef,
]);

const resolvers = mergeResolvers([
    DeliverOptionQuery,
    DeliverOptionMutation,
    PaymentOptionQuery,
    PaymentOptionMutation,
    ProductQuery.resolvers,
    ProductMutation.resolvers,
    ProductEntityQuery.resolvers,
    ProductEntityMutation.resolvers,
    ProductEntityStateQuery.resolvers,
    ProductEntityStateMutation.resolvers,
    ProductOrderQuery.resolvers,
    ProductOrderMutation.resolvers,
    ProductOrderEntityQuery.resolvers,
    ProductOrderEntityMutation.resolvers,
    ProductOrderStateQuery.resolvers,
    ProductOrderStateMutation.resolvers,
    ValutaSettingQuery.resolvers,
    ValutaSettingMutation.resolvers,
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
