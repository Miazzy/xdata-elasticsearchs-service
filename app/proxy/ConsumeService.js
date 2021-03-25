'use strict';


/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {

    let consumer = null;

    app.beforeStart(async() => {});

    app.ready(async() => {});

    class ConsumeService extends app.Proxy {

        constructor(ctx) {
            setTimeout(async() => {
                // 创建服务的 consumer
                consumer = app.rpc.client.createConsumer(app.config.rpc.client);
                // 等待 consumer ready（从注册中心订阅服务列表...）
                await consumer.ready();
            }, 100);
            super(ctx, consumer);
        }

        async doTask(...params) {
            const result = await consumer.invoke('doTask', params, app.config.rpc.client);
            console.log('egg proxy consumer service ready', `these number ${params} add eq `, result); // 打印执行结果
            return result;
        }
    }

    return ConsumeService;

};
/* eslint-enable */