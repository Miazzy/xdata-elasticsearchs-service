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

};