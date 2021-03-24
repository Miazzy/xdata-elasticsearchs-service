# xdata-elasticsearch-service

elasticsearch 同步服务，从MySQL上游同步至ES服务器

在config.default配置上游MySQL访问地址信息等，下游ES连接地址、执行通过Task配置

```js
es: {
    host: 'elasticsearch.yunwisdom.club:30080',
    port: 30080,
    apiVersion: '7.x',
},
mysql: {
    host: '172.18.254.96',
    port: '4000',
    user: 'zhaoziyun',
    password: 'ziyequma',
    database: 'xdata',
},
job1: {
    database: 'xdata',
    index: 'xdata',
    type: 'bs_seal_regist',
    params: 'serialid',
    sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
    dbtable: 'bs_sync_rec', //持久化记录表  
    pindex: 0,
},
```

注意：
 - 请修改es配置中的es连接配置，默认本地是没有用户密码的。
 - 请修改MySQL配置中的MySQL连接配置，设置好数据库，用户密码等。

配置完成后，请在本地浏览器上输入`http://127.0.0.1:8001/api/es/elasticsearch/sync`执行同步操作，每请求一次，从上次记录的pindex开始，同步200条数据，每次同步条数可以修改，但建议200条，貌似elasticsearch里面有个接收请求的队列打大小默认设置200，如果每次通过过多，elasticsearch可能会拒绝请求。

```js
register: true,
logger: console,
serverList: ['172.18.1.50:8848', '172.18.1.50:8849', '172.18.1.50:8850'], // replace to real nacos serverList
namespace: 'public',
serviceName: 'xdata-elasticsearch-service',
```

这个是Nacos的注册地址，如果不用请将配置app.config.elasticsearch.register设置为false,默认是启用，提供elasticsearch服务的微服务集群。如果要用请自行搭建好nacos集群，将地址改写到serverList中。

### Development

```bash
$ npm i       // 安装依赖
$ npm run dev // 启动项目(调试)
```

### Deploy

```bash
$ npm start  // 启动项目
$ npm stop   // 停止项目
```


### ElasticSearch启动脚本

```
version: '3.7'
services:
  elasticsearch1:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.8.0
    container_name: elasticsearch1
    environment:
      - node.name=elasticsearch1
      - network.publish_host=elasticsearch1
      - cluster.name=docker-cluster
      - cluster.initial_master_nodes=elasticsearch1,elasticsearch2,elasticsearch3
      - "discovery.seed_hosts=elasticsearch1,elasticsearch2,elasticsearch3"
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms256M -Xmx256M"
      - http.cors.enabled=true
      - http.cors.allow-origin=*
      - network.host=0.0.0.0
    ulimits:
      nproc: 65535
      memlock:
        soft: -1
        hard: -1
    volumes: #restart: always
      - type: volume
        source: logs
        target: /var/log
      - type: volume
        source: esearchdata1
        target: /usr/share/elasticsearch/data
    networks:
      - elastic
    ports:
      - 9200:9200
      - 9300:9300

  elasticsearch2:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.8.0
    container_name: elasticsearch2
    environment:
      - node.name=elasticsearch2
      - network.publish_host=elasticsearch2
      - cluster.name=docker-cluster
      - cluster.initial_master_nodes=elasticsearch1,elasticsearch2,elasticsearch3
      - "discovery.seed_hosts=elasticsearch1,elasticsearch2,elasticsearch3"
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms256M -Xmx256M"  #- "discovery.zen.ping.unicast.hosts=elasticsearch1"
      - http.cors.enabled=true
      - http.cors.allow-origin=*
      - network.host=0.0.0.0
    ulimits:
      nproc: 65535
      memlock:
        soft: -1
        hard: -1
    cap_add:
      - ALL
    volumes: #restart: always
      - type: volume
        source: logs
        target: /var/log
      - type: volume
        source: esearchdata2
        target: /usr/share/elasticsearch/data
    networks:
      - elastic
    ports:
      - 9201:9200
      - 9301:9300

  elasticsearch3:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.8.0
    container_name: elasticsearch3
    environment:
      - node.name=elasticsearch3
      - network.publish_host=elasticsearch3
      - cluster.name=docker-cluster
      - cluster.initial_master_nodes=elasticsearch1,elasticsearch2,elasticsearch3
      - "discovery.seed_hosts=elasticsearch1,elasticsearch2,elasticsearch3"
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms256M -Xmx256M" #- "discovery.zen.ping.unicast.hosts=elasticsearch1"
      - http.cors.enabled=true
      - http.cors.allow-origin=*
      - network.host=0.0.0.0
    ulimits:
      nproc: 65535
      memlock:
        soft: -1
        hard: -1
    cap_add:
      - ALL
    volumes: #restart: always
      - type: volume
        source: logs
        target: /var/log
      - type: volume
        source: esearchdata3
        target: /usr/share/elasticsearch/data
    networks:
      - elastic
    ports:
      - 9202:9200
      - 9302:9300

volumes:
  esearchdata1:
  esearchdata2:
  esearchdata3:
  logs:

networks:
  elastic:
```
将上述脚本保存为docker-compose.yml,最好在一个新的目录中，然后执行`docker-compose -f docker-compose.yml up -d`即可，第一次要拉取docker镜像等待时间较长。如果未安装docker及docker-compose请及时安装后执行上述操作。

### Kafka 提供分布式日志 和 异步消息功能

### 通过Sofa-RPC-Node 提供NodeJS服务间RPC调用