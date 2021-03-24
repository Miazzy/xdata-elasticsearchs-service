/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

/** @type Egg.EggPlugin */
module.exports = {

    cors: {
        enable: true,
        package: 'egg-cors',
    },

    mailer: {
        enable: false,
        package: 'egg-mailer',
    },

    oss: {
        enable: false,
        package: 'egg-oss',
    },

    cache: {
        enable: true,
        package: 'egg-cache',
    },

    mysql: {
        enable: true,
        package: 'egg-mysql',
    },

    oracle: {
        enable: false,
        package: 'egg-oracle',
    },

    mssql: {
        enable: false,
        package: 'egg-mssql',
    },

    redlock: {
        enable: true,
        package: 'egg-redlock',
    },

    httpProxy: {
        enable: false,
        package: 'egg-gateway-proxy',
    },

    redis: {
        enable: true,
        package: 'egg-redis',
    },

    nacos: {
        enable: false,
        package: 'egg-nacos',
    },

    kafkaNode: {
        enable: true,
        package: 'egg-kafka-node',
    },

    ratelimiter: {
        enable: true,
        package: 'egg-rate-limiters',
    },

    eggEtcd: {
        enable: false,
        package: 'egg-etcd',
    },

};