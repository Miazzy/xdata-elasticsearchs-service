/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const whereHelp = require('../utils/where.helper');

/**
 * @description
 * ClickHouse增删改查服务控制器
 */
class ClickHouseController extends Controller {

    /**
     * @function 数据库添加数据
     */
    async index() {

        const { ctx, app } = this;

        // 限流组件 sentinel NodeJS版 ，限流规则flowrule
        app.sentinel.doLimitTask('flowrule', { ctx, app }, ({ ctx, app }) => { console.log('flowrule'); });

        console.log('pass flowrule!');

        // 获取Database名称或Index名称
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取表名称或Type名称
        const type = ctx.query.type || ctx.params.type || 'type';
        // 获取编号
        const id = ctx.query.id || ctx.params.id || 0;
        // 获取内容
        let content = ctx.query.data || ctx.params.data || ctx.query.content || ctx.params.content || '{}';

        // 如果是JSON格式，需将JSON格式还原
        try {
            content = JSON.parse(content);
        } catch (error) {
            console.log(error);
        }

        // 将数据存入elasticsearch服务器中，如果不存在则新增，如果存在则修改
        try {

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
        const schema = ctx.query.schema || ctx.params.schema || 'schema';
        // 获取表名称或Type名称
        const table = ctx.query.type || ctx.params.type || ctx.query.table || ctx.params.table || 'type';
        //获取通用查询条件，Page，Size，排序条件等
        const where = ctx.query.where || ctx.params.where || ctx.query._where || '';
        const order = ctx.query.order || ctx.query._order || ctx.query.orderby || ctx.query._orderby || ctx.params.order || ctx.query._sort;
        const fields = ctx.query.fields || ctx.query._fields || '*';
        const page = ctx.query.page || ctx.query._page || ctx.query._p || 0;
        const size = ctx.query.size || ctx.query._size || ctx.query._s || 100;
        const offset = page * size;
        const next = size;
        const limits = ` limit ${offset} , ${next}`;

        let wheresql = '';
        let orderby = '';

        //将查询条件，Page，Size，排序条件等转化为SQL
        wheresql = whereHelp.getWhereSQL(where, ' where ');
        orderby = order ? (order.startsWith('-') ? ` order by ${order.slice(1)} desc ` : ` order by ${order} asc `) : '';

        //根据查收条件拼接查询SQL
        const sql = `select ${fields} from ${schema}.${table} ${wheresql} ${orderby} ${limits} `;
        console.log(`sql: `, sql);

        //执行DSL查询，返回查询结果
        try {
            const response = await clickhouse.query(sql).toPromise();
            ctx.body = response;
        } catch (error) {
            ctx.body = { err: -90, code: -1090, success: false, pindex: -1, message: error }
        }
    }

    /**
     * @function 数据库添加数据
     */
    async delete() {

        const { ctx, app } = this;

        // 获取数据库名称
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取表单名称
        const table = ctx.query.type || ctx.params.type || ctx.query.table || ctx.params.table || 'type';
        // 获取ID编号
        const id = ctx.query.id || ctx.params.id || 0;

        try {

        } catch (error) {
            ctx.body = { err: 'not find', code: 0, message: error };
        }
    }
}


module.exports = ClickHouseController;