# 开图：预构建产物部署

本目录提供 Docker Compose 部署模板，不含服务器密码或 API 密钥。现有线上部署应保留其实际 Compose 项目名和数据卷，不能直接用本模板替换。

1. 使用 Node.js 22.13+，执行 `npm ci`。
2. 子路径构建：`KAITU_BASE_PATH=/kaitu/ npm run build`；站点根目录构建：`npm run build`。
3. 在服务器私有环境文件配置 `RELEASE_ID`、`RELEASE_DIR`、`KAITU_PORT`、`KAITU_API_TOKEN`。`RELEASE_DIR` 指向含 dist、server、src/venues.js 的项目目录。
4. 端口分配、台账登记和启动遵循服务器规则，并持有 `/srv/apps/.deployment.lock`。
5. 执行 `docker compose --env-file /path/to/private.env -f deploy/aliyun/compose.yaml up -d --build`。
6. Nginx 将 `/kaitu/` 转发到已分配的回环端口并剥离前缀；保留其他项目路由。

默认密钥至少 32 字符。仅在明确授权的演示部署中可设置 `KAITU_ALLOW_SHORT_TOKEN=true` 允许至少 4 字符的密钥；不要在仓库中填写真实值。

查看日志：同一 compose 和 env-file 参数下执行 `logs --tail 100 app`。更新前保留镜像、Compose、私有配置并对数据做一致性备份；回滚时恢复相应镜像和配置，不删除数据卷。

界面默认 07:00 开始自动演示（尊重减少动态效果偏好），左侧折叠面板支持 1/2/4 倍速；仙林自动演示在 19:30–20:30 播放水幕预演。影像工作台包含豆环跳转入口。
