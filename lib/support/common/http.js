export default {
  status: {
    /* ⬇ Successful responses ⬇ */
    OK: { code: 200, text: 'OK' },
    Created: { code: 201, text: 'Created' },
    Accepted: { code: 202, text: 'Accepted' },
    NoContent: { code: 204, text: 'No Content' },
    /* ⬇ Redirection messages ⬇ */
    MovedPermanently: { code: 301, text: 'Moved Permanently' },
    /* ⬇ Client error responses ⬇ */
    BadRequest: { code: 400, text: 'Bad Request' },
    Unauthorized: { code: 401, text: 'Unauthorized' },
    PaymentRequired: { code: 402, text: 'Payment Required' },
    Forbidden: { code: 403, text: 'Forbidden' },
    NotFound: { code: 404, text: 'Not Found' },
    MethodNotAllowed: { code: 405, text: 'Method Not Allowed' },
    NotAcceptable: { code: 406, text: 'Not Acceptable' },
    Conflict: { code: 409, text: 'Conflict' },
    PayloadTooLarge: { code: 413, text: 'Payload Too Large' },
    URITooLong: { code: 414, text: 'URI Too Long' },
    UnprocessableContent: { code: 422, text: 'Unprocessable Content' },
  },
}
