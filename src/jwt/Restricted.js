import MiddlewareJWT from "./MiddlewareJWT.js";

export default async function Restricted({ context, permission }, callback) {
    if (context) MiddlewareJWT.AuthorizeContextHandler(context, permission);
    return await callback();
}
