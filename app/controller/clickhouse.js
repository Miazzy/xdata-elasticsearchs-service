/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const convert = require('elasql').convert;
const estools = require('../utils/estools');
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
        const type = ctx.query.type || ctx.params.type || ctx.query.table || ctx.params.table || 'type';
        //获取通用查询条件，Page，Size，排序条件等
        const where = ctx.query.where || ctx.params.where || ctx.query._where || '';
        const order = ctx.query.order || ctx.query._order || ctx.query.orderby || ctx.query._orderby || ctx.params.order || ctx.query._sort;
        const fields = ctx.query.fields || ctx.query._fields || '*';
        const page = ctx.query.page || ctx.query._page || ctx.query._p || 0;
        const size = ctx.query.size || ctx.query._size || ctx.query._s || 100;
        const offset = page * size;
        const next = size;
        const url = app.config.elasticsearch.es.host;
        const limits = ` limit ${next}`;

        let wheresql = '';
        let orderby = '';

        //将查询条件，Page，Size，排序条件等转化为SQL
        wheresql = whereHelp.getWhereSQL(where, ' where ');
        orderby = order ? (order.startsWith('-') ? ` order by ${order.slice(1)} desc ` : ` order by ${order} asc `) : '';

        //根据查收条件拼接查询SQL
        const sql = `select ${fields} from ${schema}_${type} ${wheresql} ${orderby} ${limits} `;
        console.log(`sql: `, sql);

        //执行DSL查询，返回查询结果
        try {

        } catch (error) {
            ctx.body = { err: -90, code: -1090, success: false, pindex: -1, message: error }
        }
    }

    /**
     * @function 数据库添加数据
     */
    async searchByOffset() {

        // http://127.0.0.1:8001/api/es/search/xdata/bs_seal_regist?_where=(status,eq,已用印)~and(seal_group_ids,like,~zhaozy1028~)&_fields=id,filename,count,create_by,contract_id,serial_id&_sort=-id&_p=0&_size=10000
        const { ctx, app } = this;

        // 获取Database名称或Index名称
        const schema = ctx.query.schema || ctx.params.schema || 'schema';
        // 获取表名称或Type名称
        const type = ctx.query.type || ctx.params.type || ctx.query.table || ctx.params.table || 'type';
        //获取通用查询条件，Page，Size，排序条件等
        const where = ctx.query.where || ctx.params.where || ctx.query._where || '';
        const order = ctx.query.order || ctx.query._order || ctx.query.orderby || ctx.query._orderby || ctx.params.order || ctx.query._sort;
        const fields = ctx.query.fields || ctx.query._fields || '*';
        const page = ctx.query.page || ctx.query._page || ctx.query._p || 0;
        const size = ctx.query.size || ctx.query._size || ctx.query._s || 100;
        const offset = page * size;
        const next = size;
        const url = app.config.elasticsearch.es.host;

        let wheresql = '';
        let orderby = '';

        //将查询条件，Page，Size，排序条件等转化为SQL
        wheresql = whereHelp.getWhereSQL(where, ' where ');
        orderby = order ? (order.startsWith('-') ? ` order by ${order.slice(1)} desc ` : ` order by ${order} asc `) : '';
        const limits = ` limit ${next}`;

        //根据查收条件拼接查询SQL
        const sql = `select ${fields} from ${schema}_${type} ${wheresql} ${orderby} ${limits} `;
        console.log(`sql: `, sql);

        //将SQL转化为ElasticSearch DSL
        let params = await estools.convert(url, sql); //elasticsearch-plugin install https://hub.fastgit.org/NLPchina/elasticsearch-sql/releases/download/7.8.0.0/elasticsearch-sql-7.8.0.0.zip elasticsearch-plugin install https://hub.fastgit.org/NLPchina/elasticsearch-sql/releases/download/7.8.1.0/elasticsearch-sql-7.8.1.0.zip
        params.from = offset;
        params.size = next;
        console.log(`convert:`, convert, ' params:', JSON.stringify(params));

        //执行DSL查询，返回查询结果
        try {

        } catch (error) {
            ctx.body = { err: -90, code: -1090, success: false, pindex: -1, message: error }
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

        } catch (error) {
            ctx.body = { err: 'not find', code: 0 };
            console.log(error);
        }
    }
}


module.exports = ClickHouseController;