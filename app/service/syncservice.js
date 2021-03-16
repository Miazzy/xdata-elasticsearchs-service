const Service = require('egg').Service;
const dayjs = require('dayjs');

class SyncService extends Service {

    /**
     * @description 同步ES数据
     * @param {*} taskName 
     * @returns 
     */
    async doEsTask(taskName = 'job1') {

        const { ctx, app } = this;

        try {
            const config = app.config.elasticsearch[taskName];
            //console.log(`elasticsearch config:`, JSON.stringify(config));
            const sql = config.sql.replace(/\${index}/g, config.database).replace(/\${type}/g, config.type).replace(/\${params}/g, config.params);

            //查询数据库中的pindex
            const queryIndexSQL = `SELECT pindex FROM ${config.database}.bs_sync_rec t WHERE t.dest_db_type = 'ES' and t.database = :database and t.index = :index and t.type = :type and t.params = :params `;
            const responseIndex = await app.esMySQL.query(queryIndexSQL, { pindex: config.pindex, index: config.index, type: config.type, params: config.params, database: config.database });

            if (responseIndex && responseIndex.length > 0) {
                //console.log('response index : ', JSON.stringify(responseIndex[0]));
                config.pindex = responseIndex[0].pindex;
            } else {
                const insertSQL = `INSERT INTO ${config.database}.bs_sync_rec (\`database\`, \`index\`, type, params, pindex) VALUES (:database, :index, :type, :params, :pindex)`;
                //console.log('insert sql:', insertSQL);
                await app.esMySQL.query(insertSQL, { pindex: config.pindex, index: config.index, type: config.type, params: config.params, database: config.database });
            }

            //console.log(`sql:`, JSON.stringify(sql), " pindex:", config.pindex);
            const response = await app.esMySQL.query(sql, { pindex: config.pindex });

            if (response && response.length > 0) {
                //console.log(`response:`, JSON.stringify(response[response.length - 1][config.params]));
                //记录最后处理的pindex，下次同步查询从此pindex开始
                app.config.elasticsearch[taskName].pindex = response[response.length - 1][config.params];

                //console.log(`last pindex:`, app.config.elasticsearch[taskName].pindex);
                for (const element of response) {
                    //console.log(`id:`, element.id, ` type:`, config.type, ` index:`, `${config.index}_${config.type}`, ' content: ', JSON.stringify(element));
                    app.esSearch.index({
                        index: `${config.index}_${config.type}`,
                        type: config.type,
                        id: element.id,
                        body: element,
                    });
                }
                const updateSQL = `UPDATE ${config.database}.bs_sync_rec t SET t.pindex = :pindex WHERE t.index = :index and t.type = :type and t.params = :params `;
                //console.log(`updateSQL:`, updateSQL);
                //讲pindex写入数据库
                app.esMySQL.query(updateSQL, { pindex: config.pindex, index: config.index, type: config.type, params: config.params });
            }
            return { err: 0, code: 0, success: true, pindex: config.pindex };
        } catch (error) {
            return { err: -99, code: -99, success: false, pindex: -1, message: error };
        }
    }

    /**
     * @description 同步ClickHouse数据
     * @param {*} taskName 
     * @returns 
     */
    async doCkTask(taskName = 'all') {

        const { ctx, app } = this;
        const config = app.config.clickhouse;
        const synconfig = app.config.clickhousesync;
        // console.log(`config: ${JSON.stringify(config)} , synconfig: ${JSON.stringify(synconfig)}`);

        /**
         -- 第一步，如果没有表，则DROP表并新建表并导入数据 -- DROP TABLE IF EXISTS  xdata.bs_seal_regist; CREATE TABLE xdata.bs_seal_regist ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.95:39090', 'xdata', 'bs_seal_regist', 'zhaoziyun','ziyequma') ;
         -- 第二步，查询clickhouse表中，最大ID值，最大XID值，并且将ID和XID减去10分钟的数值 -- select max(id) id, max(xid) xid  from xdata.bs_seal_regist; xid是进行变更的时间戳
         -- 第三步，查询id大于当前clickhouse表中最大值ID的所有数据，，并Insert表单中
         -- 第四步，查询xid大于当前clickhouse表中最大值xid得所有数据，删除clickhouse表中这些数据中存在这些ID值得记录,并Insert这些数据到clickhouse表单中 -- ALTER TABLE xdata.bs_seal_regist DELETE WHERE id in ('','',''); -- 循环 循环进行第二步至第四步的操作
         -- 定时 每天0:00，执行第一步，然后循环第二步至第四步;注意定时执行第一步可以根据具体情况取消。
         */
        for (const task of synconfig.tasks) {
            const tconfig = {};
            const { table, index, resetFlag, fieldName, pindex, syncTableName } = task;
            const clickhouse = app.ck.clickhouse;
            // console.log(`table:${table}, resetFlag:${resetFlag}, fieldName:${fieldName}, pindex:${pindex}, syncTableName:${syncTableName} `);

            //只执行taskName的任务
            if (table == taskName || taskName == 'all') {
                try {

                    //第一步，如果没有表，则DROP表并新建表并导入数据 -- DROP TABLE IF EXISTS  xdata.bs_seal_regist; CREATE TABLE xdata.bs_seal_regist ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.95:39090', 'xdata', 'bs_seal_regist', 'zhaoziyun','ziyequma') ;
                    const queryIndexSQL = `SELECT pindex,reset FROM ${index}.bs_sync_rec t WHERE t.dest_db_type = 'CK' and t.database = :database and t.index = :index and t.type = :type and t.params = :params `;
                    const responseIndex = await app.ck.mysql.query(queryIndexSQL, { index: index, type: table, params: fieldName, database: index });
                    console.log(`response:`, JSON.stringify(responseIndex));

                    //查询数据库中的pindex,reset标识
                    if (responseIndex && responseIndex.length > 0) {
                        tconfig.pindex = responseIndex[0].pindex;
                        tconfig.reset = responseIndex[0].reset;
                        console.log(`task config: ${JSON.stringify(tconfig)}`);
                    }

                    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);

                    //如果数据库配置重新加载，则执行重新加载操作 ; 定时每天0:00，执行第一步，然后循环第二步至第四步; 注意定时执行第一步可以根据具体情况取消。
                    if (tconfig.reset == 'true' || dayjs().format('HH:mm:ss') == '00:00:00') {
                        const dropSQL = synconfig.droplang.replace(/:table/g, table);
                        console.log(`drop sql:`, dropSQL);
                        tconfig.dropResponse = await clickhouse.query(dropSQL).toPromise();
                        console.log(`drop response:`, JSON.stringify(tconfig.dropResponse), 'drop sql:', dropSQL);

                        const syncSQL = synconfig.synclang.replace(/:table/g, table);
                        console.log(`sync sql:`, syncSQL);
                        tconfig.syncResponse = await clickhouse.query(syncSQL).toPromise();
                        console.log(`sync response:`, JSON.stringify(tconfig.syncResponse), 'sync sql:', syncSQL);

                        const updateSQL = `UPDATE ${index}.bs_sync_rec t SET reset = 'false' WHERE t.index = :index and t.type = :type and t.params = :params `;
                        console.log('update sql:', updateSQL);
                        app.ck.mysql.query(updateSQL, { index: index, type: table, params: fieldName });
                    }

                    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);

                    //第二步，查询clickhouse表中，最大ID值，最大XID值，并且将ID和XID减去10分钟的数值 -- select max(id) id, max(xid) xid  from xdata.bs_seal_regist;
                    tconfig.queryResponse = await clickhouse.query(synconfig.sctlang.replace(':table', table)).toPromise();
                    console.log(`query response:`, JSON.stringify(tconfig.queryResponse));

                    //查询到返回值，则进行后续步骤
                    if (tconfig.queryResponse && tconfig.queryResponse.length > 0) {
                        let { id, xid } = tconfig.queryResponse[0];
                        xid = (xid == '0' && xid == 0) ? '10000000000000000000000000000001' : xid;
                        console.log(`id:`, id, ` xid:`, xid);

                        //第三步，查询id大于当前clickhouse表中最大值ID的所有数据，并Insert表单中
                        const insertSQL = synconfig.inclang.replace(/:table/g, table).replace(/:dest_fields/g, ' ').replace(/:src_fields/g, '*').replace(/:param_id/g, 'id').replace(/:pindex/g, id);
                        console.log(`insert sql:`, insertSQL);
                        tconfig.insertResponse = await clickhouse.query(insertSQL).toPromise();
                        console.log(`insert response:`, JSON.stringify(tconfig.insertResponse), '\n\r insert sql:', insertSQL);
                        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);

                        //查询mysql表存在，但是click表不存在的数据，insert到clickhouse表中
                        const istlangSQL = synconfig.istlang.replace(/:table/g, table).replace(/:param_id/g, 'id').replace(/:pindex/g, id);
                        console.log(`istlang sql:`, istlangSQL);
                        tconfig.istlangResponse = await clickhouse.query(istlangSQL).toPromise();
                        console.log(`istlang response:`, JSON.stringify(tconfig.istlangResponse), '\n\r istlang sql:', istlangSQL);
                        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);

                        //第四步，查询xid大于当前clickhouse表中最大值xid得所有数据，删除clickhouse表中这些数据中存在这些ID值得记录,并Insert这些数据到clickhouse表单中 -- ALTER TABLE xdata.bs_seal_regist DELETE WHERE id in ('','','');
                        const deleteSQL = synconfig.dltlang.replace(/:table/g, table).replace(/:dest_fields/g, ' ').replace(/:src_fields/g, '*').replace(/:param_id/g, 'xid').replace(/:pindex/g, xid);
                        console.log(`delete sql:`, deleteSQL);
                        tconfig.deleteResponse = await clickhouse.query(deleteSQL).toPromise();
                        console.log(`delete response:`, JSON.stringify(tconfig.deleteResponse), '\n\r delete sql:', deleteSQL);
                        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);

                        const patchSQL = synconfig.inclang.replace(/:table/g, table).replace(/:dest_fields/g, ' ').replace(/:src_fields/g, '*').replace(/:param_id/g, 'xid').replace(/:pindex/g, xid);
                        console.log(`patch sql:`, patchSQL);
                        tconfig.patchResponse = await clickhouse.query(patchSQL).toPromise();
                        console.log(`patch response:`, JSON.stringify(tconfig.patchResponse), '\n\r patch sql:', patchSQL);
                        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);

                    }

                    /**
                     *  -- 第一步，如果没有表，则DROP表并新建表并导入数据
                     *  -- DROP TABLE IF EXISTS  xdata.bs_seal_regist; CREATE TABLE xdata.bs_seal_regist ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.95:39090', 'xdata', 'bs_seal_regist', 'zhaoziyun','ziyequma') ;
                     *  -- 第二步，查询clickhouse表中，最大ID值，最大XID值，并且将ID和XID减去10分钟的数值，减去10分钟是防止漏了，可能存在用户在手机上线获取了一个ID，然后提交的时候网络卡了，等了3分钟，网络好了，如果那个提交页面没有关闭并且用户数据提交上去了，这时这个id可能出现插入到前面数据的可能性
                     *  -- select max(id) id, max(xid) xid  from xdata.bs_seal_regist;
                     *  -- 第三步，查询id大于当前clickhouse表中最大值ID的所有数据，，并Insert表单中
                     *  -- 第四步，查询xid大于当前clickhouse表中最大值xid得所有数据，删除clickhouse表中这些数据中存在这些ID值得记录,并Insert这些数据到clickhouse表单中
                     *  -- ALTER TABLE xdata.bs_seal_regist DELETE WHERE id in ('','','');
                     *  -- 循环 循环进行第二步至第四步的操作
                     *  -- 定时 每天0:00，执行第一步，然后循环第二步至第四步;注意定时执行第一步可以根据具体情况取消。
                     */

                    //TODO 最大ID值，最大XID值，并且将ID和XID减去10分钟的数值，减去10分钟是防止漏了，可能存在用户在手机上线获取了一个ID，然后提交的时候网络卡了，等了3分钟，网络好了，如果那个提交页面没有关闭并且用户数据提交上去了，这时这个id可能出现插入到前面数据的可能性
                    //TODO xdata-xmysql-service的服务，获取xid，patch操作，需要更新到数据库中

                } catch (error) {
                    console.log(error);
                }

            }
        }

    }

}
module.exports = SyncService;