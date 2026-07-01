// upload.js
const ci = require('miniprogram-ci');
const path = require('path');

console.log('🚀 GitHub Actions 虚拟沙盒已通电，正在拉起微信 CI 核心...');

// 动态获取 GitHub 传过来的敏感变量，防止硬编码
const APPID = process.env.WX_MINI_APPID || 'wxc7004936e49228d0';
const VERSION = process.env.WX_MINI_VERSION || '1.0.1';
const DESC = process.env.WX_MINI_DESC || 'GitHub Actions 自动交付';

ci.upload({
    appid: APPID,
    projectPath: './',           // 贴脸读取当前工作区目录
    privateKeyPath: './private.key', // 流水线步骤中会动态生成这个物理文件
    version: VERSION,
    desc: DESC,
    setting: {
        es6: true,
        minify: true
    },
    onProgressUpdate: console.log,
}).then(res => {
    console.log('🎉 恭喜！GitHub Actions 自动化上传大获全胜：', res);
}).catch(err => {
    console.error('❌ 微信服务器返回了真实的业务报错：', err);
    process.exit(1); // 关键：让整个 GitHub Workflow 标记为失败
});