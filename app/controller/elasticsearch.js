/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

/**
 * @description
 * ElasticSearch增删改查服务控制器
 */
class ElasticSearchController extends Controller {

    /**
     * @function 数据库添加数据
     */
    async index() {

        const { ctx, app } = this;

        //限流组件，限流规则flowrule
        app.sentinel.doLimitTask('flowrule', { ctx, app }, ({ ctx, app }) => { console.log('flowrule'); });

        console.log('pass flowrule!');

        // 获取Database名称或Index名称
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取表名称或Type名称
        const type = ctx.query.type || ctx.params.type || 'type';
        // 获取编号
        const id = ctx.query.id || ctx.params.id || 0;
        // 获取部门编号
        let content = ctx.query.data || ctx.params.data || ctx.query.content || ctx.params.content || '{}';

        // 如果是JSON格式，需将JSON格式还原
        try {
            content = JSON.parse(content);
        } catch (error) {
            console.log(error);
        }

        // 将数据存入elasticsearch服务器中，如果不存在则新增，如果存在则修改
        try {
            ctx.body = await app.elasticsearch.index({
                index: schema,
                type,
                id,
                body: content,
            });
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * @function 数据库添加数据
     */
    async search() {

        const { ctx, app } = this;

        // 获取Database名称或Index名称
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取表名称或Type名称
        const type = ctx.query.type || ctx.params.type || 'type';
        // 获取查询条件
        const content = ctx.query.data || ctx.params.data || ctx.query.content || ctx.params.content || '{}';

        //获取通用查询条件，Page，Size，排序条件等

        //将查询条件，Page，Size，排序条件等转化为SQL

        //将SQL转化为ElasticSearch DSL

        //执行DSL查询

        //返回查询结果

        try {
            ctx.body = await app.elasticsearch.search({
                index: schema,
                type,
                body: {

                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @function 数据库添加数据
     */
    async delete() {

        const { ctx, app } = this;

        // 获取部门编号
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取部门编号
        const type = ctx.query.type || ctx.params.type || 'type';
        // 获取部门编号
        const id = ctx.query.id || ctx.params.id || 0;

        try {
            ctx.body = await app.elasticsearch.delete({
                index: schema,
                type,
                id,
            });
        } catch (error) {
            ctx.body = { err: 'not find', code: 0 };
            console.log(error);
        }
    }
}


module.exports = ElasticSearchController;