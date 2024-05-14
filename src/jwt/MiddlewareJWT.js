import Jwt from 'jsonwebtoken';
import RequestError from '../schemas/RequestError/RequestError.js';

/**
 * @function AuthorizeJWT
 * @description A middleware function to authenticate a JSON Web Token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const AuthorizeJWT = function (context) {
    const { req } = context;
    const header = req.headers['authorization'];
    if (!header) {
        throw new RequestError(401, 'Unauthorized');
    }

    const token = header && header.split(' ')[1];
    if (!token) {
        throw new RequestError(401, 'Unauthorized');
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
    } catch (error) {
        throw new RequestError(401, 'Unauthorized');
    }
}

/**
 * @function AuthorizePermissionJWT
 * @description A middleware function to authenticate a permission against JSON Web Token
 * @param {string} permissionName
 * @returns {void}
 */
const AuthorizePermissionJWT = function (context, permissionName) {
    const { req } = context;
    const user = req.user;
    if (!user) {
        throw new RequestError(401, 'Unauthorized');
    }

    const { permissions } = user;
    let hasPermission = false;

    for (const permission of permissions) {

        if (permission === permissionName) {
            hasPermission = true;
            break;
        }
    }

    if (!hasPermission) {
        throw new RequestError(403, 'Forbidden');
    }
}

const AuthorizeContextHandler = (context, permission) => {
    AuthorizeJWT(context)

    if (permission) {
        AuthorizePermissionJWT(context, permission)
    }
}

export default {
    AuthorizeJWT,
    AuthorizePermissionJWT,
    AuthorizeContextHandler
}
