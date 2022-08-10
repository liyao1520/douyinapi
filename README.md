# 获取抖音弹幕

## 使用

### 开启服务

1.  下载源码

2.  执行 yarn / npm install

3.  执行 yarn start / npm run start

4.  按照提示输入直播间号

5.  打开 http://localhost:8888/ 查看 demo

### 使用 api

开启服务后,使用`websocket`连接

默认 `8888` 端口

使用 ` const io = new WebSocket("ws://localhost:8888");`
