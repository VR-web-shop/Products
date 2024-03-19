import fetchAPI from './fetchAPI.js'

/**
 * @function find
 * @description Finds an entity.
 * @param {REQUEST_TYPE} findRequest The find request.
 * @returns {Promise<RESPONSE_TYPE>} The entity.
 * @throws {Error} If adminFindRequest is not provided.
 * @throws {Error} If adminFindRequest is not an instance of REQUEST_TYPE.AdminFindRequest.
 * @throws {Error} If FOREIGN_KEY is not provided.
 * @throws {Error} If RESPONSE_TYPE is not provided.
 * @throws {Error} If REQUEST_TYPE is not provided.
 * @throws {Error} If PATH is not provided.
 */
async function find(findRequest, FOREIGN_KEY='', REQUEST_TYPE, RESPONSE_TYPE, PATH) {
    if (!(findRequest instanceof REQUEST_TYPE)) {
        throw new Error(`findRequest must be an instance of ${REQUEST_TYPE.constructor.name}`);
    }

    if (!FOREIGN_KEY) {
        throw new Error('FOREIGN_KEY must be provided');
    }

    if (!RESPONSE_TYPE) {
        throw new Error('RESPONSE_TYPE must be provided');
    }

    if (!REQUEST_TYPE) {
        throw new Error('REQUEST_TYPE must be provided');
    }

    if (!PATH) {
        throw new Error('PATH must be provided');
    }

    const key = findRequest[FOREIGN_KEY];
    const response = await fetchAPI.request(`${PATH}/${key}`, { method: 'GET' }, true);
    const data = await response.json();
    return new RESPONSE_TYPE(data);
}

/**
 * @function findAll
 * @description Finds all entities.
 * @param {REQUEST_TYPE} findAllRequest The find all request.
 * @returns {Promise<RESPONSE_TYPE[]>} The entities.
 * @throws {Error} If adminFindAllRequest is not provided.
 * @throws {Error} If adminFindAllRequest is not an instance of REQUEST_TYPE.AdminFindAllRequest.
 * @throws {Error} If ENTITIES_KEY is not provided.
 * @throws {Error} If RESPONSE_TYPE is not provided.
 * @throws {Error} If REQUEST_TYPE is not provided.
 * @throws {Error} If PATH is not provided.
 */
async function findAll(findAllRequest, ENTITIES_KEY='', REQUEST_TYPE, RESPONSE_TYPE, PATH) {
    if (!(findAllRequest instanceof REQUEST_TYPE)) {
        throw new Error(`findAllRequest must be an instance of ${REQUEST_TYPE.constructor.name}`);
    }

    if (!ENTITIES_KEY) {
        throw new Error('ENTITIES_KEY must be provided');
    }

    if (!RESPONSE_TYPE) {
        throw new Error('RESPONSE_TYPE must be provided');
    }

    if (!REQUEST_TYPE) {
        throw new Error('REQUEST_TYPE must be provided');
    }

    if (!PATH) {
        throw new Error('PATH must be provided');
    }

    const { page, limit } = findAllRequest;
    let endpoint = `${PATH}?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    const data = await response.json();
    const entities = data[ENTITIES_KEY].map(entity => new RESPONSE_TYPE(entity));
    const paginationData = {pages: data.pages};
    paginationData[ENTITIES_KEY] = entities;
    return paginationData;
}

/**
 * @function create
 * @description Creates an entity.
 * @param {REQUEST_TYPE} createRequest The create request.
 * @returns {Promise<RESPONSE_TYPE>} The entity.
 * @throws {Error} If createRequest is not provided.
 * @throws {Error} If createRequest is not an instance of REQUEST_TYPE.AdminCreateRequest.
 * @throws {Error} If RESPONSE_TYPE is not provided.
 * @throws {Error} If REQUEST_TYPE is not provided.
 * @throws {Error} If PATH is not provided.
 */
async function create(createRequest, REQUEST_TYPE, RESPONSE_TYPE, PATH) {
    if (!(createRequest instanceof REQUEST_TYPE)) {
        throw new Error(`createRequest must be an instance of ${REQUEST_TYPE.constructor.name}`);
    }

    if (!RESPONSE_TYPE) {
        throw new Error('RESPONSE_TYPE must be provided');
    }

    if (!REQUEST_TYPE) {
        throw new Error('REQUEST_TYPE must be provided');
    }

    if (!PATH) {
        throw new Error('PATH must be provided');
    }

    const response = await fetchAPI.request(PATH, {
        method: 'POST',
        body: createRequest
    }, true);

    const data = await response.json();
    return new RESPONSE_TYPE(data);
}

/**
 * @function update
 * @description Updates an entity.
 * @param {REQUEST_TYPE} updateRequest The update request.
 * @returns {Promise<RESPONSE_TYPE>} The entity.
 * @throws {Error} If updateRequest is not provided.
 * @throws {Error} If updateRequest is not an instance of REQUEST_TYPE.AdminUpdateRequest.
 * @throws {Error} If RESPONSE_TYPE is not provided.
 * @throws {Error} If REQUEST_TYPE is not provided.
 * @throws {Error} If PATH is not provided.
 */
async function update(updateRequest, REQUEST_TYPE, RESPONSE_TYPE, PATH) {
    if (!(updateRequest instanceof REQUEST_TYPE)) {
        throw new Error(`updateRequest must be an instance of ${REQUEST_TYPE.constructor.name}`);
    }

    if (!RESPONSE_TYPE) {
        throw new Error('RESPONSE_TYPE must be provided');
    }

    if (!REQUEST_TYPE) {
        throw new Error('REQUEST_TYPE must be provided');
    }

    if (!PATH) {
        throw new Error('PATH must be provided');
    }
    
    const response = await fetchAPI.request(PATH, {
        method: 'PUT',
        body: updateRequest
    }, true);

    const data = await response.json();
    return new RESPONSE_TYPE(data);
}

/**
 * @function destroy
 * @description Destroys an entity.
 * @param {REQUEST_TYPE} deleteRequest The destroy request.
 * @returns {Promise<boolean>} Whether the entity was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 * @throws {Error} If deleteRequest is not an instance of REQUEST_TYPE.AdminDeleteRequest.
 * @throws {Error} If REQUEST_TYPE is not provided.
 * @throws {Error} If PATH is not provided.
 */
async function destroy(deleteRequest, REQUEST_TYPE, PATH) {
    if (!(deleteRequest instanceof REQUEST_TYPE)) {
        throw new Error(`deleteRequest must be an instance of ${REQUEST_TYPE.constructor.name}`);
    }

    if (!REQUEST_TYPE) {
        throw new Error('REQUEST_TYPE must be provided');
    }

    if (!PATH) {
        throw new Error('PATH must be provided');
    }

    const response = await fetchAPI.request(PATH, {
        method: 'DELETE',
        body: deleteRequest
    }, true);

    if (response.status === 204) {
        return true;
    } else {
        return false;
    }
}

export default {
    find,
    findAll,
    create,
    update,
    destroy,
}
