// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCksync = require('../../../app/controller/cksync');
import ExportClickhouse = require('../../../app/controller/clickhouse');
import ExportElasticsearch = require('../../../app/controller/elasticsearch');
import ExportEssync = require('../../../app/controller/essync');
import ExportKafka = require('../../../app/controller/kafka');

declare module 'egg' {
  interface IController {
    cksync: ExportCksync;
    clickhouse: ExportClickhouse;
    elasticsearch: ExportElasticsearch;
    essync: ExportEssync;
    kafka: ExportKafka;
  }
}
