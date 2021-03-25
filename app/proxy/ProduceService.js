'use strict';

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {

    app.beforeStart(async() => {});

    app.ready(async() => {});

    class ProduceService extends app.Proxy {

        constructor(ctx) {
            super(ctx);
            setTimeout(async() => {
                if (!app.rpc.server.publishstatus) {
                    const that = this;
                    console.log(`produce service start`, this);
                    // 3. 添加服务，添加服务请不要在此次添加，直接在service里面调用app.rpc.server添加
                    app.rpc.server.addService(app.config.rpc.server, {
                        async doTask(taskName) {
                            return await that.ctx.service.kafkaservice.doTask(taskName);
                        },
                    });
                    // 4. 启动 Server 
                    await app.rpc.server.start();
                    // 5. 发布 Server服务
                    await app.rpc.server.publish();
                    app.rpc.server.publishstatus = true;
                    console.log(`produce service end`);
                }
            }, 0);
        }

        async execute() {
            return null;
        }
    }

    return ProduceService;

};
/* eslint-enable */