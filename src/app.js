
require('dotenv').config()
const compression = require('compression'),
    express = require('express'),
    { default: helmet } = require('helmet'),
    cors = require('cors'),
    morgan = require('morgan'),
    app = express(),
    { v4: uuid } = require('uuid'),
    passport = require('passport'),
    passportConfig = require('./configs/passport.config')

//cors

const corsOptions = {
    origin: 'http://localhost:3000/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

//middleware
app.use(morgan("combined"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use((req, res, next) => {
    const requestId = req.headers[ 'x-request-id' ]
    req.requestId = requestId ? requestId : uuid()
    myloggerLog.log(`input params :: ${req.method}::`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.query
    ])

    next()
})


//test pub.sub redis
// require('./test/inventory.test')
// const productTest = require('./test/product.test')
// productTest.purchaseProduct('product:001',10)

//init db
require('./dbs/init.mongodb')
const initRedis = require('./dbs/init.redis')
const myloggerLog = require('./loggers/mylogger.log')
initRedis.initRedis()
// const { checkOverload} = require('./helpers/check.connect')
// checkOverload()

// passport
app.use(passport.initialize())
// passport config
passportConfig(passport)

//init routes
app.use('/', require('./routes'))

// handle errors

app.use((err, req, res, next) => {
    if (!err.status) {
        // Nếu không có status, tức là đây là lỗi không được xử lý trước đó, ta gán 404.
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    } else {
        next(err);
    }
})


// logger 
app.use((error, req, res, next) => {
    
    const status = error.status || 500
    const resMessage = `${error.status} - ${Date.now()}ms - response: ${JSON.stringify(error)}`
    myloggerLog.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        {
            message: error.message
        }
    ])

    return res.status(status).json({
    
        status: status,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})


module.exports = app