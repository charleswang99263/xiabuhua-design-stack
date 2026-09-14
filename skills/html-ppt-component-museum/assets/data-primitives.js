/* Project-owned, dependency-free data and chart primitives for the v5 lab. */
(function (root) {
  'use strict';

  const DATA_FIXTURES = {
    comparison: {
      id: 'comparison', shape: 'comparison', title: '不同入口的任务完成量', unit: '件 / 周',
      source: '本地演示 fixture · 固定快照 2026-09-11', rows: [
        { id: 'direct', label: '直接完成', value: 128 },
        { id: 'assist', label: '需要人工复核的超长中文标签', value: 74 },
        { id: 'cancel', label: '中途取消', value: -18 },
        { id: 'unknown', label: '未采集渠道（未知）', value: null },
        { id: 'zero', label: '零结果但已观测', value: 0 }
      ]
    },
    trend: {
      id: 'trend', shape: 'trend', title: '一周内每日有效会话', unit: '会话 / 日',
      source: '本地演示 fixture · 2026-09-05 至 2026-09-11', rows: [
        { id: 'd1', label: '09-05', date: '2026-09-05', value: 42 },
        { id: 'd2', label: '09-06', date: '2026-09-06', value: 55 },
        { id: 'd3', label: '09-07', date: '2026-09-07', value: null },
        { id: 'd4', label: '09-08', date: '2026-09-08', value: 61 },
        { id: 'd5', label: '09-09', date: '2026-09-09', value: 49 },
        { id: 'd6', label: '09-10', date: '2026-09-10', value: 73 },
        { id: 'd7', label: '09-11', date: '2026-09-11', value: 68 }
      ]
    },
    distribution: {
      id: 'distribution', shape: 'distribution', title: '首答延迟的样本分布', unit: '秒',
      source: '本地演示 fixture · 12 条已脱敏样本；不代表线上总体',
      values: [1.2, 1.7, 2.1, 2.4, 2.8, 3.2, 3.4, 3.8, 4.1, 4.8, 7.6, 12.4]
    },
    relationship: {
      id: 'relationship', shape: 'relationship', title: '上下文长度与首答延迟', unit: 'tokens / 秒',
      source: '本地演示 fixture · 仅展示共同变化，不构成因果证据', rows: [
        { id: 'r1', label: '短请求', x: 240, y: 1.3 },
        { id: 'r2', label: '普通请求', x: 510, y: 2.2 },
        { id: 'r3', label: '含长中文标签的请求', x: 820, y: 3.1 },
        { id: 'r4', label: '多轮请求', x: 1080, y: 4.4 },
        { id: 'r5', label: '无法测量', x: null, y: null }
      ]
    },
    flow: {
      id: 'flow', shape: 'flow', title: '会话从入口到结果的去向', unit: '会话',
      source: '本地演示 fixture · 汇总流量，损耗单独列出', nodes: [
        { id: 'in', label: '进入会话' }, { id: 'answer', label: '直接回答' },
        { id: 'review', label: '人工复核' }, { id: 'drop', label: '中途退出' }
      ], links: [
        { id: 'f1', source: 'in', target: 'answer', value: 128 },
        { id: 'f2', source: 'in', target: 'review', value: 74 },
        { id: 'f3', source: 'in', target: 'drop', value: 18 }
      ], total: 220
    },
    technical: {
      id: 'technical', shape: 'technical', title: '评测任务的可恢复流程', unit: '状态 / 转换',
      source: '本地演示 fixture · 概念流程，不代表具体服务实现',
      nodes: [
        { id: 'start', label: '收到任务', type: 'start' },
        { id: 'prepare', label: '准备数据', type: 'process' },
        { id: 'check', label: '数据完整？', type: 'decision' },
        { id: 'run', label: '运行评测', type: 'process' },
        { id: 'retry', label: '补齐并重试', type: 'process' },
        { id: 'done', label: '输出结果', type: 'end' },
        { id: 'error', label: '保留错误并退出', type: 'error' }
      ], edges: [
        { id: 't1', source: 'start', target: 'prepare', label: '触发' },
        { id: 't2', source: 'prepare', target: 'check', label: '数据' },
        { id: 't3', source: 'check', target: 'run', label: '是' },
        { id: 't4', source: 'check', target: 'retry', label: '否' },
        { id: 't5', source: 'retry', target: 'prepare', label: '补齐后回流' },
        { id: 't6', source: 'run', target: 'done', label: '成功' },
        { id: 't7', source: 'run', target: 'error', label: '失败' }
      ]
    }
  };

  function finite(value) { return typeof value === 'number' && Number.isFinite(value); }
  function isMissing(value) { return value === null || value === undefined || value === 'unknown'; }
  function uniqueIds(items, label, errors) {
    const seen = new Set();
    (items || []).forEach((item, i) => {
      if (!item || !item.id) errors.push(`${label}[${i}] 缺少 id`);
      else if (seen.has(item.id)) errors.push(`${label} 存在重复 id: ${item.id}`);
      else seen.add(item.id);
    });
    return seen;
  }

  function validateFixture(fixture) {
    const errors = [];
    if (!fixture || typeof fixture !== 'object') return { ok: false, errors: ['fixture 必须是对象'] };
    if (!fixture.shape) errors.push('缺少 shape');
    if (!fixture.title) errors.push('缺少 title');
    if (!fixture.unit) errors.push('缺少 unit');
    if (fixture.shape === 'comparison' || fixture.shape === 'trend') {
      if (!Array.isArray(fixture.rows) || !fixture.rows.length) errors.push('rows 不能为空');
      uniqueIds(fixture.rows, 'rows', errors);
      (fixture.rows || []).forEach((row, i) => {
        if (!row.label) errors.push(`rows[${i}] 缺少 label`);
        if (!isMissing(row.value) && !finite(row.value)) errors.push(`rows[${i}].value 必须是数字或 null`);
        if (fixture.shape === 'trend' && !row.date) errors.push(`rows[${i}] 缺少 date`);
      });
    }
    if (fixture.shape === 'distribution') {
      if (!Array.isArray(fixture.values) || fixture.values.length < 2) errors.push('distribution 至少需要 2 个原始样本');
      (fixture.values || []).forEach((v, i) => { if (!finite(v)) errors.push(`values[${i}] 不是有限数字`); });
    }
    if (fixture.shape === 'relationship') {
      if (!Array.isArray(fixture.rows) || fixture.rows.length < 2) errors.push('relationship 至少需要 2 个样本');
      uniqueIds(fixture.rows, 'rows', errors);
      (fixture.rows || []).forEach((row, i) => {
        if (!row.label) errors.push(`rows[${i}] 缺少 label`);
        if (isMissing(row.x) !== isMissing(row.y)) errors.push(`rows[${i}] x/y 必须同时缺失或同时存在`);
        if (!isMissing(row.x) && (!finite(row.x) || !finite(row.y))) errors.push(`rows[${i}] x/y 必须是有限数字`);
      });
    }
    if (fixture.shape === 'flow') {
      const ids = uniqueIds(fixture.nodes, 'nodes', errors);
      if (!Array.isArray(fixture.links) || !fixture.links.length) errors.push('links 不能为空');
      uniqueIds(fixture.links, 'links', errors);
      let outgoing = 0;
      (fixture.links || []).forEach((link, i) => {
        if (!ids.has(link.source) || !ids.has(link.target)) errors.push(`links[${i}] 端点不存在`);
        if (!finite(link.value) || link.value < 0) errors.push(`links[${i}].value 必须是非负数字`);
        if (link.source === 'in') outgoing += link.value || 0;
      });
      if (!finite(fixture.total) || fixture.total < outgoing) errors.push('total 必须覆盖入口流量，不能小于 outgoing sum');
      if (Math.abs(outgoing - fixture.total) > 0.0001) errors.push(`入口流量未守恒：links=${outgoing}, total=${fixture.total}；差额必须作为损耗/新增显式列出`);
    }
    if (fixture.shape === 'technical') {
      const ids = uniqueIds(fixture.nodes, 'nodes', errors);
      const incoming = new Set(), outgoing = new Set();
      (fixture.edges || []).forEach((edge, i) => {
        if (!edge.id) errors.push(`edges[${i}] 缺少 id`);
        if (!ids.has(edge.source) || !ids.has(edge.target)) errors.push(`edges[${i}] 端点不存在`);
        if (!edge.label) errors.push(`edges[${i}] 缺少条件或关系标签`);
        outgoing.add(edge.source); incoming.add(edge.target);
      });
      (fixture.nodes || []).forEach((node) => {
        if (node.type === 'decision') {
          const branches = (fixture.edges || []).filter((e) => e.source === node.id);
          if (branches.length < 2 || branches.some((e) => !e.label)) errors.push(`decision ${node.id} 必须有带标签的分支`);
        }
      });
      const terminals = (fixture.nodes || []).filter((n) => n.type === 'end' || n.type === 'error');
      if (!terminals.length || terminals.some((n) => !incoming.has(n.id))) errors.push('必须有可到达的成功和/或错误出口');
      const starts = (fixture.nodes || []).filter((n) => n.type === 'start');
      if (!starts.length || starts.some((n) => !outgoing.has(n.id))) errors.push('必须有带出口的 start 节点');
    }
    return { ok: errors.length === 0, errors };
  }

  const ROUTES = {
    comparison: { chart: 'comparison', label: '比较', rationale: '分类值需要排序、零基线和正负方向。', rejected: ['饼图：难以比较负值和小差异。'] },
    trend: { chart: 'trend', label: '趋势', rationale: '时间顺序和采样断点是主要阅读任务。', rejected: ['面积图：会放大连续性，掩盖缺失日。'] },
    distribution: { chart: 'distribution', label: '分布', rationale: '保留原始样本，直接显示中位数与长尾。', rejected: ['单一平均数：会隐藏长尾和样本量。'] },
    relationship: { chart: 'relationship', label: '关系', rationale: '两个测量变量用位置编码，缺失点不伪造。', rejected: ['折线：样本不是时间序列。'] },
    flow: { chart: 'flow', label: '流向', rationale: '带宽对应汇总量，并单列损耗。', rejected: ['流程图：不能表达带宽守恒。'] },
    technical: { chart: 'technical', label: '技术图', rationale: '节点和边表达流程、条件与异常出口。', rejected: ['散点图：无法承载责任边界与状态语义。'] }
  };
  function selectChart(shape, reader) {
    const route = ROUTES[shape] || ROUTES.comparison;
    return Object.assign({ reader: reader || 'precise' }, route);
  }
  function extent(values) {
    const nums = values.filter(finite); if (!nums.length) return [0, 1];
    const lo = Math.min.apply(Math, nums), hi = Math.max.apply(Math, nums);
    return lo === hi ? [lo - 1, hi + 1] : [lo, hi];
  }
  function formatValue(value, unit) { return isMissing(value) ? '未知 / 未采集' : `${value} ${unit || ''}`.trim(); }
  function escapeHtml(text) { return String(text).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

  const API = { DATA_FIXTURES, ROUTES, finite, isMissing, validateFixture, selectChart, extent, formatValue, escapeHtml };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.DataDesignPrimitives = API;
})(typeof window !== 'undefined' ? window : globalThis);
