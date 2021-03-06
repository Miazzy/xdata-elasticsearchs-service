// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportKafkaservice = require('../../../app/service/kafkaservice');
import ExportSofaservice = require('../../../app/service/sofaservice');
import ExportSyncservice = require('../../../app/service/syncservice');

declare module 'egg' {
  interface IService {
    kafkaservice: AutoInstanceType<typeof ExportKafkaservice>;
    sofaservice: AutoInstanceType<typeof ExportSofaservice>;
    syncservice: AutoInstanceType<typeof ExportSyncservice>;
  }
}
