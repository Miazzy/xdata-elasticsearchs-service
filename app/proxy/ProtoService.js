'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {

    const consumer = app.sofaRpcClient.createConsumer({
        interfaceName: 'com.xdata.sofa.rpc.protobuf.ProtoService',
        targetAppName: 'sofarpc',
        version: '1.0',
        group: 'SOFA',
        proxyName: 'ProtoService',
        responseTimeout: 3000,
    });

    if (!consumer) {
        // `app.config['sofarpc.rpc.service.enable'] = false` will disable this consumer
        return;
    }

    app.beforeStart(async() => {
        await consumer.ready();
    });

    class ProtoService extends app.Proxy {
        constructor(ctx) {
            super(ctx, consumer);
        }

        async execute(req) {
            return await consumer.invoke('execute', [req], {
                ctx: this.ctx,
                codecType: 'protobuf',
            });
        }
    }

    return ProtoService;
};
/* eslint-enable */