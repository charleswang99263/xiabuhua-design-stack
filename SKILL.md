---
name: xiabuhua-design-stack-installer
description: Install or upgrade the complete local Xiabuhua design stack package, replacing confirmed older suite files and validating all six skills and assets.
---

# 安装虾不滑设计栈

收到用户“安装此设计栈”请求后，先读根目录 INSTALL.md 与 COMPATIBILITY.md。识别当前宿主实际技能发现目录，使用 install.py 安装全部六个成员，不要只复制本入口。

用户明确要求清理升级时，完整替换已确认属于本设计栈的旧目录，核对同一宿主重复来源及旧路由文件；使用安装器的显式选项迁移已确认规则。不得删除其他Skill、其他项目共用依赖或整个混合插件缓存。宿主要求的权限确认仍适用。

安装后 verify，并打开本地说明页与一个真实交互。分别报告文件完整性、宿主发现、浏览器运行和依赖缺口；不能将复制成功当作全部可用。
