/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';
// const sql2es = require('sql2es');
const superagent = require('superagent');

/**
 * @function 将SQL转化为DSL语句
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