const nacos = require('nacos');
const assert = require('assert');
const os = require('os');
const FlowRuleManager = require('xdata-sentinel/lib/core/flow/rule_manager');
const Sentinel = require('xdata-sentinel/lib');
const rds = require('ali-rds');
const elasticsearch = require('elasticsearch');
const base64Config = require('./config/base64.config');
const { ClickHouse } = require('clickhouse');
const ClickHouses = require('@apla/clickhouse');
const { JSConsumer, JSProducer } = require("sinek");
const { Kafka } = require('kafkajs');
const { RpcServer } = require('sofa-rpc-node').server;
const { RpcClient } = require('sofa-rpc-node').client;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;

base64Config.init();

const logger = console;
logger.write = console.log;

const sentinelClient = new Sentinel({
    appName: 'sentinel-search',
    async: true,
    logger: console,
    blockLogger: console,
});

const Constants = Sentinel.Constants;

function loadFlowRules() {
    FlowRuleManager.loadRules([
        { resource: 'flowrule', count: 1000, maxQueueingTimeMs: 3000, controlBehavior: 0, durationInSec: 1, warmUpPeriodSec: 1, metricType: 1 }
    ]);
}

function doLimitTask(taskName, args, fn = () => {}) {
    let entry;
    try {
        entry = sentinelClient.entry(taskName);
        return fn(args);
    } catch (e) {
        if (args.ctx) {
            console.log('block flowrule ... ');
            args.ctx.body = { err: 'block flowrule ...', code: -1 };
        }
        throw new Error();
    } finally {
        if (entry) {
            entry.exit();
        }
    }
}

//获取本机ip
function getIpAddress() {
    /**os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口 */
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

//链接ES服务上游数据库MySQL
function createMySQLClient(config, app) {

    config = app.config.elasticsearch.mysql;

    assert(config.host && config.port && config.user && config.database,
        `[elasticsearch-mysql] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);

    app.coreLogger.info('[elasticsearch-mysql] connecting %s@%s:%s/%s',
        config.user, config.host, config.port, config.database);

    const client = rds(config);

    app.beforeStart(function*() {
        const rows = yield client.query('select now() as currentTime;');
        app.coreLogger.info(`[elasticsearch-mysql] instance status OK, rds currentTime: ${rows[0].currentTime}`);
    });

    return client;
}

module.exports = (app, ctx) => {

    // 开始前执行
    app.beforeStart(async() => {

        // 注册 sentinel limit 限流服务
        if (app.config.sentinelLimit.status) {
            console.log('egg service start & load flow rules ... ');
            loadFlowRules();
            try {
                app.sentinel = sentinelClient;
                app.sentinel.doLimitTask = doLimitTask;
            } catch (e) {
                console.error(e);
            } finally {
                console.log(Constants.ROOT.toString());
            }
        }

        // 启用 elasticsearch 查询、同步等 服务
        if (app.config.elasticsearch.status) {

            console.log('egg service start & register elasticsearch sync rules ... ');
            // NACOS中注册 elasticsearch 服务
            if (app.config.elasticsearch.register) {
                const client = new nacos.NacosNamingClient(app.config.elasticsearch);
                await client.ready();
                await client.registerInstance(app.config.elasticsearch.serviceName, {
                    ip: getIpAddress(),
                    port: app.options.port || 8001,
                });
            }

            console.log(`config:`, app.config.elasticsearch.es);

            //注册es同步相关模块
            app.esSearch = new elasticsearch.Client(app.config.elasticsearch.es);
            app.esMySQL = createMySQLClient(app.config.elasticsearch.mysql, app);

        }

        // 启用 clickhouse 查询、同步等 服务
        if (app.config.clickhouse.status) {

            console.log('egg service start & register clickhouse sync rules ... ');
            // NACOS中注册 clickhouse 服务
            if (app.config.clickhouse.register) {
                const client = new nacos.NacosNamingClient(app.config.clickhouse);
                await client.ready();
                await client.registerInstance(app.config.clickhouse.serviceName, {
                    ip: getIpAddress(),
                    port: app.options.port || 8001,
                });
            }

            app.ck = {};
            app.ck.clickhouse = new ClickHouse(app.config.clickhouse.clickhouse);
            app.ck.database = new ClickHouses(app.config.clickhouse.clickhouse);
            app.ck.mysql = createMySQLClient(app.config.clickhouse.mysql, app);
            // console.log(`clickhouse config:`, app.config.clickhouse.clickhouse);

        }

        // 启用 kafka 查询、同步等 服务
        if (app.config.kafka.status) {

            const topic = app.config.kafka.topic;

            console.log('egg service start & register kafka message rules ... ');
            // NACOS中注册 clickhouse 服务
            if (app.config.kafka.register) {
                const client = new nacos.NacosNamingClient(app.config.kafka);
                await client.ready();
                await client.registerInstance(app.config.kafka.serviceName, {
                    ip: getIpAddress(),
                    port: app.options.port || 8001,
                });
            }

            app.kafkajs = new Kafka(app.config.kafka.config);

            app.kafkajs.esproducer = app.kafkajs.producer();
            app.kafkajs.esconsumer = app.kafkajs.consumer({ groupId: 'group' });

            await app.kafkajs.esconsumer.connect();
            await app.kafkajs.esproducer.connect(); //生产者生产消息，请在controller里面编写
            await app.kafkajs.esconsumer.subscribe({ topic: topic, fromBeginning: true });
            await app.kafkajs.esconsumer.run({
                eachMessage: async({ topic, partition, message }) => {
                    console.log(`topic name: ${topic} , partition: ${partition}, offset: ${message.offset} ,message: `, message.value.toString());
                    //根据获取的消息分发至相应的处理器
                    //持久化到数据库中,便于后期查询消息，消费情况
                },
            })
            await app.kafkajs.esproducer.send({
                topic: topic,
                messages: [{ value: 'Hello KafkaJS user one!' }, ],
            });
        }

        // 启用 sofa-rpc 服务
        if (app.config.rpc.status && app.config.rpc.register) {

            app.rpc = {};

            // 1. 创建 zk 注册中心客户端
            const registry = new ZookeeperRegistry({
                logger: console,
                address: app.config.rpc.registry.address, // 需要本地启动一个 zkServer
            });

            // 2. 创建 RPC Server 实例
            const server = new RpcServer({
                logger: console,
                registry, // 传入注册中心客户端
                port: app.config.rpc.server.port,
            });

            // 3. 创建 RPC Client 实例
            const client = new RpcClient({
                logger: console,
                registry,
            });

            app.rpc.server = server;
            app.rpc.client = client;
            app.rpc.registry = registry;

        }

    });

    // 准备好执行
    app.ready(async() => {
        console.log('egg service ready');
    });

    // 关闭前执行
    app.beforeClose(async() => {
        console.log('egg service close');
    });
};