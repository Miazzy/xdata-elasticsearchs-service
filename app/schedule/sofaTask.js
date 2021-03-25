const Subscription = require('egg').Subscription;
const dayjs = require('dayjs');

class SofaTask extends Subscription {

    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            //cron: '* * * * * *',
            interval: '5s', // 1 分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe(response, taskName = 'all', tasklist = [Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 100)]) {
        try {
            await this.ctx.proxy.produceService.execute();
            await this.ctx.proxy.consumeService.doTask(taskName);
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        } catch (error) {
            console.error(`Kafka Task Error:`, error);
        }
    }

}

module.exports = SofaTask;