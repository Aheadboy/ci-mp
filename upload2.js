// upload.js
const ci = require('miniprogram-ci');

console.log('🚀 GitHub Actions 虚拟机已通电，开始拉起微信 CI...');

// 1. 显式创建 project 实例（微信最新版规范，防止报错 lack of parameter: "project"）
const project = new ci.Project({
  appid: process.env.WX_MINI_APPID || 'wxc7004936e49228d0',
  type: 'miniProgram',
  projectPath: './',           // ⚠️ 确保这就是含有 app.json 的物理目录
  privateKeyPath: './private.key',
  ignores: ['node_modules/**/*', 'README.md'],
});

// 2. 执行上传
ci.upload({
  project, // 强行传入实例
  version: process.env.WX_MINI_VERSION || '1.0.2',
  desc: process.env.WX_MINI_DESC || 'Git自动化部署',
  setting: { es6: true, minify: true },
  onProgressUpdate: console.log,
}).then(res => {
  console.log('🎉 恭喜！云端全闭环上传成功：', res);
}).catch(err => {
  console.error('❌【关键排查日志开始】❌');
  console.error('错误名称:', err.name);
  console.error('错误消息:', err.message);
  console.error('完整的错误对象 JSON:', JSON.stringify(err, null, 2));
  console.error('错误堆栈:', err.stack);
  console.error('❌【关键排查日志结束】❌');
  process.exit(1); // 强行拉黑工作流
});