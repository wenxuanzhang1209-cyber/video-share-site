<p align="left">
  <img src="https://github.com/wenxuanzhang1209-cyber/video-share-site/actions/workflows/ci.yml/badge.svg" />
  <img src="https://img.shields.io/github/license/wenxuanzhang1209-cyber/video-share-site" />
  <img src="https://img.shields.io/github/v/release/wenxuanzhang1209-cyber/video-share-site?label=release" />
</p>

# Video Room

## 界面预览

![Video Room 界面](docs/screenshots/home.png)

一个只有视频播放器的静态分享页；二维码单独生成并在聊天中提供，不放进网页。

## 本地预览

```bash
npm install
npm run build:qr
python3 -m http.server 4173
```

然后打开 <http://127.0.0.1:4173/>。

## 阿里云部署

默认部署目标是已有阿里云 ECS 的 `/var/www/apps-plaza/video/`，访问地址为：

<https://47.103.29.78/video/>

```bash
./deploy-to-aliyun.sh
```

页面不自动播放，点击播放器后带声音播放，兼容手机和微信内置浏览器。
