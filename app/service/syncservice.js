const Service = require('egg').Service;

class SyncService extends Service {

    async doTask(taskName = 'job1') {

        const { ctx, app } = this;

        try {
            const config = app.config.elasticsearchsync[taskName];
            //console.log(`elasticsearchsync config:`, JSON.stringify(config));
            const sql = config.sql.replace(/\${index}/g, config.database).replace(/\${type}/g, config.type).replace(/\${params}/g, config.params);

            //查询数据库中的pindex
            const queryIndexSQL = `SELECT pindex FROM ${config.database}.bs_essync_rec t WHERE t.database = :database and t.index = :index and t.type = :type and t.params = :params `;
            const responseIndex = await app.esMySQL.query(queryIndexSQL, { pindex: config.pindex, index: config.index, type: config.type, params: config.params, database: config.database });

            if (responseIndex && responseIndex.length > 0) {
                console.log('response index : ', JSON.stringify(responseIndex[0]));
                config.pindex = responseIndex[0].pindex;
            } else {
                const insertSQL = `INSERT INTO ${config.database}.bs_essync_rec (\`database\`, \`index\`, type, params, pindex) VALUES (:database, :index, :type, :params, :pindex)`;
                console.log('insert sql:', insertSQL);
                await app.esMySQL.query(insertSQL, { pindex: config.pindex, index: config.index, type: config.type, params: config.params, database: config.database });
            }

            console.log(`sql:`, JSON.stringify(sql), " pindex:", config.pindex);
            const response = await app.esMySQL.query(sql, { pindex: config.pindex });

            if (response && response.length > 0) {
                console.log(`response:`, JSON.stringify(response[response.length - 1][config.params]));
                //记录最后处理的pindex，下次同步查询从此pindex开始
                app.config.elasticsearchsync[taskName].pindex = response[response.length - 1][config.params];

                //console.log(`last pindex:`, app.config.elasticsearchsync[taskName].pindex);
                for (const element of response) {
                    //console.log(`id:`, element.id, ` type:`, config.type, ` index:`, `${config.index}_${config.type}`, ' content: ', JSON.stringify(element));
                    app.esSearch.index({
                        index: `${config.index}_${config.type}`,
                        type: config.type,
                        id: element.id,
                        body: element,
                    });
                }
                const updateSQL = `UPDATE ${config.database}.bs_essync_rec t SET t.pindex = :pindex WHERE t.index = :index and t.type = :type and t.params = :params `;
                //打印日志
                console.log(`updateSQL:`, updateSQL);
                //讲pindex写入数据库
                app.esMySQL.query(updateSQL, { pindex: config.pindex, index: config.index, type: config.type, params: config.params });
            }
            return { err: 0, code: 0, success: true, pindex: config.pindex };
        } catch (error) {
            return { err: -99, code: -99, success: false, pindex: -1, message: error };
        }
    }

}
module.exports = SyncService;