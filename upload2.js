// upload.js
const ci = require('miniprogram-ci');

// 强校验：防止 GitHub Secrets 没注入成功导致摆烂
const appid = process.env.WX_MINI_APPID;
if (!appid || appid.includes('undefined')) {
  console.error('❌ 致命错误：环境变量 WX_MINI_APPID 未正确注入！请检查 GitHub Secrets 配置。');
  process.exit(1);
}

console.log(`🚀 GitHub Actions 正在为 AppID: ${appid} 构建 Project 实例...`);

// 1. 严格按照新版规范：显式实例化 Project
const projectInstance = new ci.Project({
  appid: appid,
  type: 'miniProgram',
  projectPath: './',               // 贴脸读取当前工作目录
  privateKeyPath: './private.key', // 流水线生成的物理密钥
  ignores: ['node_modules/**/*', 'README.md'],
});

console.log('📦 Project 实例创建成功，开始通电上传微信后台...');

// 2. 将实例传入 upload 函数
ci.upload({
  project: projectInstance, // ⚡ 修复 lack of parameter: "project" 的核心
  version: process.env.WX_MINI_VERSION || '1.0.3',
  desc: process.env.WX_MINI_DESC || 'Git自动化部署',
  setting: {
    es6: true,
    minify: true,
  },
  onProgressUpdate: console.log,
})
.then(res => {
  console.log('🎉 恭喜！云端全闭环上传成功：', res);
})
.catch(err => {
  console.error('❌ 微信服务器拦截报错：', err);
  process.exit(1);
});