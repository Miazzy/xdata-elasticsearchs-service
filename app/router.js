/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';


/**
 * @function init 执行初始化
 * @description Set up btoa/atob function with NodeJS
 */
const init = () => {

};

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

    const { router, controller } = app;

    // 执行初始化
    init();

    // elasticsearch 新增
    router.get('/api/es/elasticsearch/index', controller.elasticsearch.index);

    // elasticsearch 新增
    router.post('/api/es/elasticsearch/index', controller.elasticsearch.index);

    // elasticsearch 查询
    router.get('/api/es/elasticsearch/search', controller.elasticsearch.search);

    // elasticsearch 查询
    router.post('/api/es/elasticsearch/search', controller.elasticsearch.search);

    // elasticsearch 删除
    router.delete('/api/es/elasticsearch/delete', controller.elasticsearch.delete);

    // elasticsearch 同步
    router.get('/api/es/elasticsearch/sync', controller.essync.index);

};