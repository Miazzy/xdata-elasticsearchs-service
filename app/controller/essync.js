/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

/**
 * @description 
 * ElasticSearch同步服务控制器
 */
class EsSyncController extends Controller {

    /**
     * @function 数据库添加数据
     */
    async index() {
        const { ctx, app } = this;
        //限流组件，限流规则flowrule
        app.sentinel.doLimitTask('flowrule', { ctx, app }, ({ ctx, app }) => { console.log('flowrule'); });
        //限流验证通过，限流规则flowrule
        console.log('flowrule: pass flowrule!');
        // 获取任务编码
        const taskName = ctx.query.taskName || ctx.params.taskName || 'job1';
        try {
            ctx.body = await ctx.service.syncservice.doTask(taskName);
        } catch (error) {
            ctx.body = { err: -99, code: -99, success: false, pindex: -1, message: error };
        }
    }

}


module.exports = EsSyncController;