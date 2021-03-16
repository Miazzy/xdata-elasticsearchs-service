const nacos = require('nacos');
const assert = require('assert');
const os = require('os');
const FlowRuleManager = require('xdata-sentinel/lib/core/flow/rule_manager');
const Sentinel = require('xdata-sentinel/lib');
const rds = require('ali-rds');
const elasticsearch = require('elasticsearch');
const base64Config = require('./config/base64.config');
const { ClickHouse } = require('clickhouse');

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

module.exports = app => {

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

            debugger

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
            console.log(`clickhouse config:`, app.config.clickhouse.clickhouse);
            app.ck.clickhouse = new ClickHouse(app.config.clickhouse.clickhouse);
            app.ck.mysql = createMySQLClient(app.config.clickhouse.mysql, app);

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