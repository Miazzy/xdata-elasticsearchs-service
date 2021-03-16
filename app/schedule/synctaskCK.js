const Subscription = require('egg').Subscription;
const dayjs = require('dayjs');

class SyncTaskCK extends Subscription {

    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            //cron: '* * * * * *',
            interval: '1s', // 1 分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe(response, taskName = 'bs_seal_regist', tasklist = [1, 2, 3, 4]) {
        response = await this.ctx.service.syncservice.doCkTask(taskName);
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }

}

module.exports = SyncTaskCK;