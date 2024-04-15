
class RequestError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'RequestError';
        this.code = code;
    }

    toResponse() {
        return {
            __typename: 'RequestError',
            code: this.code,
            message: this.message
        };
    }
}

export default RequestError;
