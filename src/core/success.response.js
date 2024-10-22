
'use strict';


const Status = {
    OK: 200,
    CREATED: 201
}

const ReasonStatus = {
    CREATED: 'Created!',
    OK: 'Success'
}

class SuccessResponse {
    constructor ({ message, status = Status.OK, reasonStatus = ReasonStatus.OK, metadata = {} }) {
        this.message = !message ? reasonStatus : message
        this.status = status
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}


class OK extends SuccessResponse {
    constructor ({ message, metadata }) {
        super({ message, metadata })
    }
}


class CREATED extends SuccessResponse {
    constructor ({ options = {}, message, status = Status.CREATED, reasonStatus = ReasonStatus.CREATED, metadata }) {
        super({ message, status, reasonStatus, metadata })
        this.options = options
    }
}


module.exports = {
    OK, CREATED,
    SuccessResponse
}