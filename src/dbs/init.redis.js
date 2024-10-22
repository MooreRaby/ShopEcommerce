'use strict';

const redis = require('redis');
const { RedisErrorResponse } = require('../core/error.response')

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
    WARNING: 'warning',
    READY: 'ready'
}, connectionTimeout


const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'redis ngao roi anh ae oi',
        en: 'redis connect error'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            status: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = (connectionRedis) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis - connection status: connected');
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis - connection status: disconnected');
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionRedis - connection status: reconnecting');
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - connection status: error ${err}`);
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.READY, () => {
        console.log('connectionRedis - connection status: ready');
        clearTimeout(connectionTimeout);
    });
};

const initRedis = async () => {
    const instanceRedis = redis.createClient();
    // Store the client instance for later user
    client.instanceConnect = instanceRedis;
    handleEventConnection(instanceRedis);

    try {
        await instanceRedis.connect();
    } catch (err) {
        console.error(`Failed to connect to Redis: ${err.message}`);
        handleTimeoutError();
    }
};


const getRedis = () => client

const closeRedis = async () => {
    if (client) {
        try {
            await client.quit();
            console.log(`Redis connection closed`);
        } catch (err) {
            console.error(`Failed to close Redis connection: ${err.message}`);
        } finally {
            client = null; // Clear the client reference
        }
    }
};

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
   
}