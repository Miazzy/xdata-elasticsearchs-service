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
    return await superagent.post('http://' + url + '/_sql/translate').send({ "query": sql }).set('accept', 'json');
}

/**
 * @function 使用SQL查询
 * @param {*} obj 
 * @param {*} arr 
 */
exports.search = async(url, sql) => {
    return await superagent.post('http://' + url + '/_sql?format=json').send({ "query": sql }).set('accept', 'json');
}