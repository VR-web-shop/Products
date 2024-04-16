
export default `
    type RequestError {
        code: String!
        message: String!
    }

    type BooleanResult {
        result: Boolean
    }

    union BoolResult = BooleanResult | RequestError
`;
