
'use strict';

const Status = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatus = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

const myloggerLog = require('../loggers/mylogger.log');
const {
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode')


class ErrorResponse extends Error {
    constructor (message, status= StatusCodes.UNAUTHORIZED) {
        super(message);
        this.status = status;
        // log the error use winston
        myloggerLog.error(this.message,['/api/v1/login', 'vv2379', {error: 'Bad request error'}])
    }

    send(res, headers = {}) {
        return res.status(this.status).json({
            message: this.message,
            status: this.status,
        });
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor (message = ReasonStatus.CONFLICT, status = Status.FORBIDDEN) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor (message = ReasonStatus.FORBIDDEN, status = Status.FORBIDDEN, additionalInfo = null) {
        const errorMessage = typeof message === 'string' ? message : JSON.stringify(message);
        super(errorMessage, status);
        this.additionalInfo = additionalInfo;
    }
}

class AuthFailureError extends ErrorResponse {

    constructor (message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {

    constructor (message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status)
    }
}

class ForbiddenError extends ErrorResponse {

    constructor (message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status)
    }
}

class RedisErrorResponse extends ErrorResponse {

    constructor (message = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status)
    }
}

module.exports = {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    RedisErrorResponse
}