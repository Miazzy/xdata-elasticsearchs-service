/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';
// const sql2es = require('sql2es');
const superagent = require('superagent');

/**
 * @function 将SQL转化为DSL语句
 * @description 使用ElasticSearch的SQL功能，需要安装elasticsearch-sql插件 https://hub.fastgit.org/NLPchina/elasticsearch-sql/releases/download/7.8.0.0/elasticsearch-sql-7.8.0.0.zip
 * @param {*} obj 
 * @param {*} arr 
 */
exports.convert = async(url, sql) => {
    const httpURL = 'http://' + url + '/_sql/translate';
    const raw = { "query": sql };
    const response = await superagent.post(httpURL).send(raw).set('Content-Type', 'application/json;charset=UTF-8');
    return response.body;
}

/**
 * @function 使用SQL查询
 * @description 使用ElasticSearch的SQL功能，需要安装elasticsearch-sql插件 https://hub.fastgit.org/NLPchina/elasticsearch-sql/releases/download/7.8.0.0/elasticsearch-sql-7.8.0.0.zip
 * @param {*} obj 
 * @param {*} arr 
 */
exports.search = async(url, sql) => {
    const httpURL = 'http://' + url + '/_sql?format=json';
    const raw = { "query": sql };
    const response = await superagent.post(httpURL).send(raw).set('Content-Type', 'application/json;charset=UTF-8');
    delete response.body.columns;
    return response.body;
}