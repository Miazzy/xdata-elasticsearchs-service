/* eslint valid-jsdoc: "off" */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const redisStore = require('cache-manager-ioredis');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_0000_0000';

    // add your middleware config here
    config.middleware = [];

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true,
        },
        domainWhiteList: ['*'],
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    };

    config.dbconfig = {
        user: 'meeting',
        password: 'meeting',
        server: '172.18.1.11',
        database: 'newecology',
        port: 1433,
        options: {
            encrypt: false,
            enableArithAbort: false,
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000,
        },
    };

    config.mailer = {
        host: 'smtp.exmail.qq.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'zhaoziyu@yunwisdom.club', // generated ethereal user
            pass: 'Miazzy@163.com', // generated ethereal password
        },
    };

    config.oss = {
        client: {
            accessKeyId: 'your access key',
            accessKeySecret: 'your access secret',
            bucket: 'your bucket name',
            endpoint: 'oss-cn-hongkong.aliyuncs.com',
            timeout: '60s',
        },
    };

    // 缓存配置
    config.cache = {
        default: 'memory',
        stores: {
            memory: {
                driver: 'memory',
                max: 100,
                ttl: 0,
            },
            redis: {
                driver: redisStore,
                host: '172.18.254.95',
                port: 6381,
                password: '',
                db: 0,
                ttl: 600,
                valid: _ => _ !== null,
            },
        },
    };

    // oracle数据库连接配置
    config.oracle = {
        client: {
            user: 'user',
            password: 'password',
            connectString: 'localhost/orcl',
        },
    };

    /** 类似sentinel的限流工具qps限流 */
    config.ratelimiter = {
        router: [{
                path: '/apis/**', //请注意匹配优先级，放在前面优先级越高，越先匹配
                max: 100000,
                time: '5s', //时间单位 s m h d y ...
                message: 'Custom request overrun error message path:/apis ' //自定义请求超限错误信息
            },
            {
                path: '/api/**',
                max: 100000,
                time: '5s', //时间单位 s m h d y ...
                message: 'Custom request overrun error message path:/api ' //自定义请求超限错误信息
            }
        ]
    }

    // mysql数据库连接配置
    config.mysql = { // database configuration
        client: {
            host: '172.18.254.96',
            port: '4000',
            user: 'zhaoziyun',
            password: 'ziyequma',
            database: 'xdata',
        },
        procedure: false,
        app: true,
        agent: false,
    };

    // mssql数据库连接配置
    config.mssql = {
        // Multi Databases
        clients: {
            db1: {
                server: '172.18.1.11',
                port: '1433',
                user: 'meeting',
                password: 'meeting',
                database: 'newecology',
            },
            db2: {
                server: '172.18.1.60',
                port: '1433',
                user: 'sa',
                password: 'Leading888',
                database: 'ecology',
            },
        },
    };

    // 网关代理配置
    config.httpProxy = {
        '@nacos': {
            logger: console,
            serverList: ['172.18.1.50:8848', '172.18.1.50:8849', '172.18.1.50:8850'], // replace to real nacos serverList
            namespace: 'public',
        },
        '/apis': {
            target: ['http://172.18.254.95:3000', 'http://172.18.254.96:3000'],
            serviceName: 'xdata-xmysql-service',
            pathRewrite: { '^/apis': '/api' },
        },
    };

    config.multipart = {
        // 设置支持的上传文件类型
        whitelist: ['.apk', '.pptx', '.docx', '.xlsx', '.csv', '.doc', '.ppt', '.xls', '.pdf', '.pages', '.wav', '.mov', '.txt', '.png', '.jpeg', '.jpg', '.gif', '.tar.gz', '.tar', '.zip', '.mp3', '.mp4', '.avi'],
        // 设置最大可以上传300M
        fileSize: '1024mb',
    };

    config.redis = {
        client: { // single
            port: 6381, // Redis port
            host: '172.18.254.95', // Redis host
            password: '',
            db: 0,
        },
    };

    config.nacos = {
        register: false,
        logger: console,
        serverList: ['172.18.1.50:8848', '172.18.1.50:8849', '172.18.1.50:8850'], // replace to real nacos serverList
        namespace: 'public',
        serviceName: 'xdata-rest-service',
    };

    config.elasticsearch = {
        status: true,
        register: true,
        logger: console,
        serverList: ['172.18.1.50:8848', '172.18.1.50:8849', '172.18.1.50:8850'], // replace to real nacos serverList
        namespace: 'public',
        serviceName: 'xdata-elasticsearch-service',
        host: 'elasticsearch.yunwisdom.club:30080',
        apiVersion: '7.x',
        es: {
            host: 'elasticsearch.yunwisdom.club:30080',
            port: 30080,
            apiVersion: '7.x',
        },
        mysql: {
            host: '172.18.254.95',
            port: '39090',
            user: 'zhaoziyun',
            password: 'ziyequma',
            database: 'xdata',
        },
        job1: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_seal_regist',
            params: 'serialid',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        },
        job2: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_admin_group',
            params: 'serialid',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        },
        job3: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_admin_address',
            params: 'id',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        },
        job4: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_company_flow_base',
            params: 'id',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        }
    }

    config.clickhouse = {
        status: true,
        register: true,
        logger: console,
        serverList: ['172.18.1.50:8848', '172.18.1.50:8849', '172.18.1.50:8850'], // replace to real nacos serverList
        namespace: 'public',
        serviceName: 'xdata-clickhouse-service',
        //上游MySQL服务
        mysql: {
            host: 'api.yunwisdom.club',
            port: '39090',
            user: 'zhaoziyun',
            password: 'ziyequma',
            database: 'xdata',
        },
        //下游ClickHouse服务
        clickhouse: {
            url: 'http://172.18.254.95',
            host: '172.18.254.95',
            port: '8123',
            user: 'admin',
            password: '123',
            debug: false,
            basicAuth: {
                username: 'admin',
                password: '123',
            },
            isUseGzip: false,
            format: "json", // "json" || "csv" || "tsv"
            config: {
                session_id: '',
                session_timeout: 600,
                output_format_json_quote_64bit_integers: 0,
                enable_http_compression: 0,
                database: 'xdata',
            },
        },
    }

    config.clickhousesync = {
        //drop字段
        dropcolumn: `ALTER TABLE ${config.clickhouse.mysql.database}.:table drop column xid; `,
        //新增字段
        addcolumn: `ALTER TABLE ${config.clickhouse.mysql.database}.:table add xid varchar(36) default 0 null; `,
        //DROP表
        droplang: `DROP TABLE IF EXISTS ${config.clickhouse.mysql.database}.:table ; `,
        //全量同步语句
        synclang: `CREATE TABLE ${config.clickhouse.mysql.database}.:table ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('${config.clickhouse.mysql.host}:${config.clickhouse.mysql.port}', '${config.clickhouse.mysql.database}', ':table', '${config.clickhouse.mysql.user}','${config.clickhouse.mysql.password}') ; `,
        //查询增量ID/XID
        sctlang: `SELECT max(id) id, max(xid) xid FROM ${config.clickhouse.mysql.database}.:table ; `,
        //查询大于XID的所有数据集(大于本地最大XID，表示上游有更新，需要将上游更新)
        sidlang: `SELECT :src_fields FROM mysql('${config.clickhouse.mysql.host}:${config.clickhouse.mysql.port}', '${config.clickhouse.mysql.database}', ':table',  '${config.clickhouse.mysql.user}', '${config.clickhouse.mysql.password}') WHERE :param_id >= ':pindex' ; `,
        //查询上游存在但是下游不存在的数据，并导入下游中
        istlang: `INSERT INTO ${config.clickhouse.mysql.database}.:table SELECT * FROM mysql('${config.clickhouse.mysql.host}:${config.clickhouse.mysql.port}', '${config.clickhouse.mysql.database}', ':table',  '${config.clickhouse.mysql.user}', '${config.clickhouse.mysql.password}') A WHERE A.:param_id not in (select :param_id from ${config.clickhouse.mysql.database}.:table ); `,
        //根据查询到的ID，删除数据
        dltlang: `ALTER TABLE ${config.clickhouse.mysql.database}.:table DELETE WHERE id in ( select id from mysql('${config.clickhouse.mysql.host}:${config.clickhouse.mysql.port}', '${config.clickhouse.mysql.database}', ':table',  '${config.clickhouse.mysql.user}', '${config.clickhouse.mysql.password}') WHERE :param_id > ':pindex'  ) ; `,
        //更新数据
        updlang: `ALTER TABLE ${config.clickhouse.mysql.database}.:table UPDATE :update WHERE id = ':id' ; `,
        //增量同步语句
        inclang: `INSERT INTO ${config.clickhouse.mysql.database}.:table :dest_fields select :src_fields from mysql('${config.clickhouse.mysql.host}:${config.clickhouse.mysql.port}', '${config.clickhouse.mysql.database}', ':table',  '${config.clickhouse.mysql.user}', '${config.clickhouse.mysql.password}') WHERE :param_id > ':pindex' ; `,
        //同步表
        tasks: [
            { table: 'bs_seal_regist', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_admin_address', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'number', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_admin_group', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_base', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'number', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_year_job_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_work_examine_items', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_work_examine', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_work_contact_item', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_work_contact', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_wework_user', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_wework_depart', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_week_job_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_wedepart', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_visit_appointment', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_visit_apply', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_user_info', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_travel', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_transaction', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_traffic_allowance', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_team', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_task_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_task_assign', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_sync_rec', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_sign_work', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_sign_up', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_sign_in', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_sign', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_short_link', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_shifts_apply', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_registed', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_regist_finance', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_regist_archive', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_query_rights', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_normal', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_contract', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_seal_declare', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_salary', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_reward_items', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_reward_data', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_reward_apply', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_resign', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_questions', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_questions_rs', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_reserve', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_requirement', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_report_job_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_repair_apply', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_reim_item', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_reim', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_regular_apply', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_registor', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_redhead', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_recruit', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_record_borrow', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_ability_quota', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_announce', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_alteration', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_dev_financing', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_dev_core_person', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_dev_compatible_products', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_dev_business_events', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_dev_billboard', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_dev_annual_report', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_branch', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_base', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_communication', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_comments', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_car_apply', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_bug_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_blogger', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_blog_watchtag', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_blog_tags', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_blog_attention', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_blog', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_attendance_details', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_attendance', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_ask_report', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_approve_node', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_approve_general', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_approve', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_quarter_job_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_purchase_item', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_purchase', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_project_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_product_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_plan_task_mission', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_plan_task_item', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_plan_task', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_payment', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_overtime', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_official_seal', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_notice', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_news', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_month_job_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_mireanna_item', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_mireanna', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_message', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_market_info', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_lost_property', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_lock_info', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_leave', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_job_logging', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_issue', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_hrmschedulesign', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_hrmresource', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_home_pictures', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_goods_receive', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_goods_borrow', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_goods', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_free_process_h', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_free_process', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_favor_info', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_entry_man', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_entry_job', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_egress', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_dynamic', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_document_item', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_document', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_covid_address', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_stockholder', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_senior_executive', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_manage_taxpayer', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_manage_tax_credits', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_manage_supplier', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_manage_recruit', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_manage_permission', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_manage_bid', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_stock_pledged', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_stock_freeze', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_publication', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_judicative', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_courtsession', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_announce', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_legal_accreditation', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_investments', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_inp_websiteorapp', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_inp_trademark', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_inp_patent', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_inp_copyright', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_inp_certification', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_info', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_stock', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_qualification', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_pledge', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_link', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_inc', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'bs_company_flow_data', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_template', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_rights', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log_unode_history', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log_unode', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log_mnode_history', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log_mnode', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log_informed', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log_history', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_log', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_flow', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_design', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_collection', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_businesses', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_business_status', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
            { table: 'pr_business', index: 'xdata', resetFlag: true, fieldName: 'id', fieldType: 'string', pindex: 0, syncTableName: 'bs_sync_rec' },
        ],
    }

    config.eggEtcd = {
        hosts: [
            '172.18.1.50:32777',
            '172.18.1.50:32776',
            '172.18.1.50:32779',
        ],
        auth: {
            username: 'root',
            password: 'ziyequma',
        },
    };

    config.sentinelLimit = {
        status: true,
    }

    return {
        ...config,
        ...userConfig,
    };
};