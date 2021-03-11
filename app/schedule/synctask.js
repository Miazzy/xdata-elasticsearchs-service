const Subscription = require('egg').Subscription;
const dayjs = require('dayjs');
// const syncservice = require('../service/syncservice');

class SyncTask extends Subscription {

    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            //cron: '* * * * * *',
            interval: '5s', // 1 分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }

    // 执行任务
    async doTask(taskName = 'job1') {
        const { ctx, app } = this;
        return await ctx.service.syncservice.doTask(taskName);
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe(response) {
        response = await this.doTask('job1');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        console.log('subscribe: ', dayjs().format('YYYY-MM-DD HH:mm:ss'), JSON.stringify(response));
        response = await this.doTask('job2');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        console.log('subscribe: ', dayjs().format('YYYY-MM-DD HH:mm:ss'), JSON.stringify(response));
        response = await this.doTask('job3');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        console.log('subscribe: ', dayjs().format('YYYY-MM-DD HH:mm:ss'), JSON.stringify(response));
        response = await this.doTask('job4');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        console.log('subscribe: ', dayjs().format('YYYY-MM-DD HH:mm:ss'), JSON.stringify(response));
    }

}

module.exports = SyncTask;