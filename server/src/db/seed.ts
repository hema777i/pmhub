import { db } from './index.js';
import * as schema from './schema.js';

const areas = [
  { id: 'integration', title: '项目整合管理', shortTitle: '整合管理', description: '项目整合管理包括为识别、定义、组合、统一和协调各项目管理过程组的各种过程和活动而开展的过程与活动。', icon: 'Link', color: '#6366f1', processGroups: ['启动','规划','执行','监控','收尾'], keyConcepts: ['项目章程','项目管理计划','变更控制','配置管理','项目收尾'], inputs: ['商业文件','协议','事业环境因素','组织过程资产'], outputs: ['项目章程','项目管理计划','项目文件更新','变更请求'], toolsTechniques: ['专家判断','数据收集','人际关系与团队技能','会议'] },
  { id: 'scope', title: '项目范围管理', shortTitle: '范围管理', description: '项目范围管理包括确保项目做且只做所需的全部工作，以成功完成项目的各个过程。', icon: 'Target', color: '#10b981', processGroups: ['规划','监控'], keyConcepts: ['范围基准','WBS','需求跟踪矩阵','范围蔓延','镀金'], inputs: ['项目章程','项目管理计划','需求文件','组织过程资产'], outputs: ['范围基准','项目范围说明书','WBS','WBS词典'], toolsTechniques: ['专家判断','数据收集','数据分析','决策'] },
  { id: 'schedule', title: '项目进度管理', shortTitle: '进度管理', description: '项目进度管理包括管理项目按时完成所需的各个过程。', icon: 'Clock', color: '#f59e0b', processGroups: ['规划','执行','监控'], keyConcepts: ['关键路径法','里程碑','进度基准','赶工','快速跟进'], inputs: ['项目管理计划','项目文件','事业环境因素','组织过程资产'], outputs: ['进度基准','项目进度计划','进度数据','项目日历'], toolsTechniques: ['CPM','PERT','敏捷发布规划','资源优化'] },
  { id: 'cost', title: '项目成本管理', shortTitle: '成本管理', description: '项目成本管理包括对成本进行规划、估算、预算、融资、筹资、管理和控制的各过程。', icon: 'DollarSign', color: '#ef4444', processGroups: ['规划','监控'], keyConcepts: ['成本基准','挣值管理','储备分析','成本估算','成本控制'], inputs: ['项目管理计划','项目文件','事业环境因素','组织过程资产'], outputs: ['成本估算','成本基准','项目资金需求','工作绩效信息'], toolsTechniques: ['专家判断','类比估算','参数估算','三点估算','挣值分析'] },
  { id: 'quality', title: '项目质量管理', shortTitle: '质量管理', description: '项目质量管理包括把组织的质量政策应用于规划、管理、控制项目和产品质量要求。', icon: 'Shield', color: '#8b5cf6', processGroups: ['规划','执行','监控'], keyConcepts: ['质量成本','PDCA循环','七基本质量工具','持续改进','质量保证'], inputs: ['项目管理计划','项目文件','批准的变更请求','可交付成果'], outputs: ['质量报告','测试与评估文件','变更请求','工作绩效信息'], toolsTechniques: ['成本效益分析','标杆对照','流程图','审计','检查'] },
  { id: 'resource', title: '项目资源管理', shortTitle: '资源管理', description: '项目资源管理包括识别、获取和管理所需资源以成功完成项目的各个过程。', icon: 'Users', color: '#06b6d4', processGroups: ['规划','执行','监控'], keyConcepts: ['RAM矩阵','RACI','团队建设','资源日历','虚拟团队'], inputs: ['项目章程','项目管理计划','项目文件','事业环境因素'], outputs: ['资源分配单','团队绩效评价','变更请求','项目文件更新'], toolsTechniques: ['预分派','谈判','虚拟团队','多标准决策分析'] },
  { id: 'communications', title: '项目沟通管理', shortTitle: '沟通管理', description: '项目沟通管理包括为确保项目信息及时且恰当地规划、收集、生成、发布、存储、检索、管理、控制、监督和最终处置所需的各个过程。', icon: 'MessageSquare', color: '#ec4899', processGroups: ['规划','执行','监控'], keyConcepts: ['沟通模型','沟通渠道','沟通方法','沟通技术','报告绩效'], inputs: ['项目管理计划','项目文件','工作绩效报告','事业环境因素'], outputs: ['项目沟通记录','工作绩效报告','变更请求','项目管理计划更新'], toolsTechniques: ['沟通需求分析','沟通技术','沟通模型','信息管理系统'] },
  { id: 'risk', title: '项目风险管理', shortTitle: '风险管理', description: '项目风险管理包括规划风险管理、识别风险、开展风险分析、规划风险应对、实施风险应对和监督风险的各个过程。', icon: 'AlertTriangle', color: '#f97316', processGroups: ['规划','执行','监控'], keyConcepts: ['风险登记册','风险概率与影响','应急计划','弹回计划','风险应对策略'], inputs: ['项目管理计划','项目文件','事业环境因素','组织过程资产'], outputs: ['风险登记册','风险报告','变更请求','项目文件更新'], toolsTechniques: ['头脑风暴','SWOT分析','决策树','蒙特卡洛模拟','敏感性分析'] },
  { id: 'procurement', title: '项目采购管理', shortTitle: '采购管理', description: '项目采购管理包括从项目团队外部采购或获取所需的产品、服务或成果的各个过程。', icon: 'ShoppingCart', color: '#14b8a6', processGroups: ['规划','执行','监控'], keyConcepts: ['合同类型','自制或外购','采购文件','投标人会议','索赔管理'], inputs: ['项目管理计划','项目文件','事业环境因素','组织过程资产'], outputs: ['选定的卖方','协议','变更请求','项目文件更新'], toolsTechniques: ['专家判断','广告','投标人会议','数据分析'] },
  { id: 'stakeholder', title: '项目干系人管理', shortTitle: '干系人管理', description: '项目干系人管理包括用于开展下列工作的各个过程：识别影响或受项目影响的人员、团体或组织，分析干系人期望及其影响，制定合适的管理策略来有效调动干系人参与项目决策和执行。', icon: 'Heart', color: '#d946ef', processGroups: ['启动','规划','执行','监控'], keyConcepts: ['干系人登记册','权力/利益方格','干系人参与度','沟通策略','管理策略'], inputs: ['项目章程','采购文件','事业环境因素','组织过程资产'], outputs: ['干系人登记册','变更请求','项目管理计划更新','项目文件更新'], toolsTechniques: ['数据收集','数据表现','决策','沟通技能','人际关系技能'] },
];
const subtasks = [
  { id: 'int-1', areaId: 'integration', title: '制定项目章程', sortOrder: 0 },
  { id: 'int-2', areaId: 'integration', title: '制定项目管理计划', sortOrder: 1 },
  { id: 'int-3', areaId: 'integration', title: '指导与管理项目工作', sortOrder: 2 },
  { id: 'int-4', areaId: 'integration', title: '管理项目知识', sortOrder: 3 },
  { id: 'int-5', areaId: 'integration', title: '监控项目工作', sortOrder: 4 },
  { id: 'int-6', areaId: 'integration', title: '实施整体变更控制', sortOrder: 5 },
  { id: 'int-7', areaId: 'integration', title: '结束项目或阶段', sortOrder: 6 },
  { id: 'scope-1', areaId: 'scope', title: '规划范围管理', sortOrder: 0 },
  { id: 'scope-2', areaId: 'scope', title: '收集需求', sortOrder: 1 },
  { id: 'scope-3', areaId: 'scope', title: '定义范围', sortOrder: 2 },
  { id: 'scope-4', areaId: 'scope', title: '创建WBS', sortOrder: 3 },
  { id: 'scope-5', areaId: 'scope', title: '确认范围', sortOrder: 4 },
  { id: 'scope-6', areaId: 'scope', title: '控制范围', sortOrder: 5 },
  { id: 'sch-1', areaId: 'schedule', title: '规划进度管理', sortOrder: 0 },
  { id: 'sch-2', areaId: 'schedule', title: '定义活动', sortOrder: 1 },
  { id: 'sch-3', areaId: 'schedule', title: '排列活动顺序', sortOrder: 2 },
  { id: 'sch-4', areaId: 'schedule', title: '估算活动持续时间', sortOrder: 3 },
  { id: 'sch-5', areaId: 'schedule', title: '制定进度计划', sortOrder: 4 },
  { id: 'sch-6', areaId: 'schedule', title: '控制进度', sortOrder: 5 },
  { id: 'cost-1', areaId: 'cost', title: '规划成本管理', sortOrder: 0 },
  { id: 'cost-2', areaId: 'cost', title: '估算成本', sortOrder: 1 },
  { id: 'cost-3', areaId: 'cost', title: '制定预算', sortOrder: 2 },
  { id: 'cost-4', areaId: 'cost', title: '控制成本', sortOrder: 3 },
  { id: 'q-1', areaId: 'quality', title: '规划质量管理', sortOrder: 0 },
  { id: 'q-2', areaId: 'quality', title: '管理质量', sortOrder: 1 },
  { id: 'q-3', areaId: 'quality', title: '控制质量', sortOrder: 2 },
  { id: 'res-1', areaId: 'resource', title: '规划资源管理', sortOrder: 0 },
  { id: 'res-2', areaId: 'resource', title: '估算活动资源', sortOrder: 1 },
  { id: 'res-3', areaId: 'resource', title: '获取资源', sortOrder: 2 },
  { id: 'res-4', areaId: 'resource', title: '建设团队', sortOrder: 3 },
  { id: 'res-5', areaId: 'resource', title: '管理团队', sortOrder: 4 },
  { id: 'res-6', areaId: 'resource', title: '控制资源', sortOrder: 5 },
  { id: 'comm-1', areaId: 'communications', title: '规划沟通管理', sortOrder: 0 },
  { id: 'comm-2', areaId: 'communications', title: '管理沟通', sortOrder: 1 },
  { id: 'comm-3', areaId: 'communications', title: '监督沟通', sortOrder: 2 },
  { id: 'risk-1', areaId: 'risk', title: '规划风险管理', sortOrder: 0 },
  { id: 'risk-2', areaId: 'risk', title: '识别风险', sortOrder: 1 },
  { id: 'risk-3', areaId: 'risk', title: '实施定性风险分析', sortOrder: 2 },
  { id: 'risk-4', areaId: 'risk', title: '实施定量风险分析', sortOrder: 3 },
  { id: 'risk-5', areaId: 'risk', title: '规划风险应对', sortOrder: 4 },
  { id: 'risk-6', areaId: 'risk', title: '实施风险应对', sortOrder: 5 },
  { id: 'risk-7', areaId: 'risk', title: '监督风险', sortOrder: 6 },
  { id: 'proc-1', areaId: 'procurement', title: '规划采购管理', sortOrder: 0 },
  { id: 'proc-2', areaId: 'procurement', title: '实施采购', sortOrder: 1 },
  { id: 'proc-3', areaId: 'procurement', title: '控制采购', sortOrder: 2 },
  { id: 'stk-1', areaId: 'stakeholder', title: '识别干系人', sortOrder: 0 },
  { id: 'stk-2', areaId: 'stakeholder', title: '规划干系人参与', sortOrder: 1 },
  { id: 'stk-3', areaId: 'stakeholder', title: '管理干系人参与', sortOrder: 2 },
  { id: 'stk-4', areaId: 'stakeholder', title: '监督干系人参与', sortOrder: 3 },
];
const processGroupsData = [
  { id: 'initiating', title: '启动过程组', description: '定义一个新项目或现有项目的一个新阶段，授权开始该项目或阶段的一组过程。', icon: 'Rocket', color: '#6366f1', keyActivities: ['制定项目章程','识别干系人'], deliverables: ['项目章程','干系人登记册'], knowledgeAreas: ['整合管理','干系人管理'] },
  { id: 'planning', title: '规划过程组', description: '明确项目范围，优化目标，为实现目标制定行动方案的一组过程。', icon: 'Map', color: '#10b981', keyActivities: ['制定项目管理计划','收集需求','定义范围','创建WBS','制定进度计划','制定预算','规划质量','规划资源','规划沟通','规划风险','规划采购','规划干系人参与'], deliverables: ['项目管理计划','项目基准','子管理计划'], knowledgeAreas: ['整合管理','范围管理','进度管理','成本管理','质量管理','资源管理','沟通管理','风险管理','采购管理','干系人管理'] },
  { id: 'executing', title: '执行过程组', description: '完成项目管理计划中确定的工作，以满足项目规范要求的一组过程。', icon: 'Zap', color: '#f59e0b', keyActivities: ['指导与管理项目工作','管理质量','获取资源','建设团队','管理团队','管理沟通','实施风险应对','实施采购','管理干系人参与'], deliverables: ['可交付成果','工作绩效数据','变更请求'], knowledgeAreas: ['整合管理','质量管理','资源管理','沟通管理','风险管理','采购管理','干系人管理'] },
  { id: 'monitoring', title: '监控过程组', description: '跟踪、审查和调整项目进展与绩效，识别必要的计划变更并启动相应变更的一组过程。', icon: 'Activity', color: '#ef4444', keyActivities: ['监控项目工作','实施整体变更控制','确认范围','控制范围','控制进度','控制成本','控制质量','控制资源','监督沟通','监督风险','控制采购','监督干系人参与'], deliverables: ['工作绩效报告','变更请求','项目文件更新'], knowledgeAreas: ['整合管理','范围管理','进度管理','成本管理','质量管理','资源管理','沟通管理','风险管理','采购管理','干系人管理'] },
  { id: 'closing', title: '收尾过程组', description: '完结所有项目管理过程组的所有活动，正式结束项目或阶段或合同责任的一组过程。', icon: 'CheckCircle', color: '#8b5cf6', keyActivities: ['结束项目或阶段'], deliverables: ['最终产品','服务或成果','项目文件归档'], knowledgeAreas: ['整合管理'] },
];

async function main() {
  console.log('Seeding knowledge areas...');
  for (const area of areas) {
    await db.insert(schema.knowledgeAreas).values(area).onConflictDoNothing();
  }

  console.log('Seeding subtasks...');
  for (const st of subtasks) {
    await db.insert(schema.knowledgeSubtasks).values(st).onConflictDoNothing();
  }

  console.log('Seeding process groups...');
  for (const pg of processGroupsData) {
    await db.insert(schema.processGroups).values(pg).onConflictDoNothing();
  }

  console.log('Seeding knowledge chunks...');
  const chunks: any[] = [];
  for (const area of areas) {
    chunks.push({ areaId: area.id, title: area.title + ' - 概述', content: area.description, chunkType: 'overview', metadata: { processGroups: area.processGroups } });
    for (const concept of area.keyConcepts) {
      chunks.push({ areaId: area.id, title: area.title + ' - 关键概念: ' + concept, content: concept + ' 是 ' + area.title + ' 中的重要概念。', chunkType: 'concept', metadata: { category: 'key_concept' } });
    }
    for (const input of area.inputs) {
      chunks.push({ areaId: area.id, title: area.title + ' - 输入: ' + input, content: input + ' 是 ' + area.title + ' 过程的输入。', chunkType: 'itto', metadata: { category: 'input' } });
    }
    for (const output of area.outputs) {
      chunks.push({ areaId: area.id, title: area.title + ' - 输出: ' + output, content: output + ' 是 ' + area.title + ' 过程的输出。', chunkType: 'itto', metadata: { category: 'output' } });
    }
    for (const tool of area.toolsTechniques) {
      chunks.push({ areaId: area.id, title: area.title + ' - 工具与技术: ' + tool, content: tool + ' 是 ' + area.title + ' 过程中使用的工具或技术。', chunkType: 'itto', metadata: { category: 'tool' } });
    }
  }
  for (const st of subtasks) {
    const area = areas.find((a: any) => a.id === st.areaId);
    if (area) {
      chunks.push({ areaId: st.areaId, title: area.title + ' - ' + st.title, content: st.title + ' 是 ' + area.title + ' 中的一个子过程。', chunkType: 'subtask', metadata: { sortOrder: st.sortOrder } });
    }
  }
  for (const pg of processGroupsData) {
    chunks.push({ areaId: areas[0].id, title: pg.title + ' - 概述', content: pg.description, chunkType: 'process_group', metadata: { keyActivities: pg.keyActivities, deliverables: pg.deliverables } });
  }

  for (const chunk of chunks) {
    await db.insert(schema.knowledgeChunks).values(chunk).onConflictDoNothing();
  }

  console.log('Creating FTS5 virtual table...');
  const sqlite = (db as any).$client;
  sqlite.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_chunks_fts USING fts5(title, content, content='knowledge_chunks', content_rowid='id');`);
  sqlite.exec(`CREATE TRIGGER IF NOT EXISTS knowledge_chunks_fts_insert AFTER INSERT ON knowledge_chunks BEGIN INSERT INTO knowledge_chunks_fts(rowid, title, content) VALUES (new.id, new.title, new.content); END;`);
  sqlite.exec(`CREATE TRIGGER IF NOT EXISTS knowledge_chunks_fts_delete AFTER DELETE ON knowledge_chunks BEGIN INSERT INTO knowledge_chunks_fts(knowledge_chunks_fts, rowid, title, content) VALUES ('delete', old.id, old.title, old.content); END;`);

  const count = sqlite.prepare("SELECT COUNT(*) as c FROM knowledge_chunks").get() as any;
  console.log('Seed completed. Total chunks: ' + count.c);
}

main().catch(console.error);
