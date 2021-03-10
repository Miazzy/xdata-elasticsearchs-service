// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportElasticsearch = require('../../../app/controller/elasticsearch');
import ExportEssync = require('../../../app/controller/essync');

declare module 'egg' {
  interface IController {
    elasticsearch: ExportElasticsearch;
    essync: ExportEssync;
  }
}
