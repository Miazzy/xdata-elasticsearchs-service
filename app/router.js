/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

    const { router, controller } = app;

    // elasticsearch 新增
    router.get('/api/es/index', controller.elasticsearch.index);

    // elasticsearch 新增
    router.post('/api/es/index', controller.elasticsearch.index);

    // elasticsearch 查询
    router.get('/api/es/search/:schema/:type', controller.elasticsearch.search);

    // elasticsearch 查询
    router.post('/api/es/search/:schema/:type', controller.elasticsearch.search);

    // elasticsearch 查询
    router.get('/api/es/search_offset/:schema/:type', controller.elasticsearch.searchByOffset);

    // elasticsearch 查询
    router.post('/api/es/search_offset/:schema/:type', controller.elasticsearch.searchByOffset);

    // elasticsearch 删除
    router.delete('/api/es/delete', controller.elasticsearch.delete);

    // elasticsearch 同步
    router.get('/api/es/sync', controller.essync.index);


    // clickhouse 新增
    router.post('/api/ck/index', controller.clickhouse.index);

    // clickhouse 查询
    router.get('/api/ck/search/:schema/:type', controller.clickhouse.search);

    // clickhouse 修改
    router.patch('/api/ck/patch', controller.clickhouse.index);

    // clickhouse 删除
    router.delete('/api/ck/delete', controller.clickhouse.delete);

    // clickhouse 同步
    router.get('/api/ck/sync', controller.cksync.index);

    // clickhouse 同步
    router.post('/api/kafka/:topic/:key/:content', controller.kafka.index);

};