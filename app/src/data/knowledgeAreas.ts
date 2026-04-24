export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface KnowledgeArea {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  processGroups: string[];
  keyConcepts: string[];
  inputs: string[];
  outputs: string[];
  tools: string[];
  subtasks: Subtask[];
}

export const knowledgeAreas: KnowledgeArea[] = [
  {
    id: "integration",
    title: "项目整合管理",
    shortTitle: "整合管理",
    description: "项目整合管理包括为识别、定义、组合、统一和协调各项目管理过程组的各种过程和活动而开展的过程与活动。整合管理兼具统一、合并、沟通和建立联系的性质，这些行动应该贯穿项目始终。",
    icon: "Link",
    color: "#6366f1",
    processGroups: ["启动", "规划", "执行", "监控", "收尾"],
    keyConcepts: ["项目章程", "项目管理计划", "变更控制", "配置管理", "项目收尾"],
    inputs: ["商业文件", "协议", "事业环境因素", "组织过程资产"],
    outputs: ["项目章程", "项目管理计划", "项目文件更新", "变更请求"],
    tools: ["专家判断", "数据收集", "人际关系与团队技能", "会议"],
    subtasks: [
      { id: "int-1", title: "制定项目章程", completed: true },
      { id: "int-2", title: "制定项目管理计划", completed: true },
      { id: "int-3", title: "指导与管理项目工作", completed: false },
      { id: "int-4", title: "管理项目知识", completed: false },
      { id: "int-5", title: "监控项目工作", completed: false },
      { id: "int-6", title: "实施整体变更控制", completed: false },
      { id: "int-7", title: "结束项目或阶段", completed: false },
    ],
  },
  {
    id: "scope",
    title: "项目范围管理",
    shortTitle: "范围管理",
    description: "项目范围管理包括确保项目做且只做所需的全部工作，以成功完成项目的各个过程。管理项目范围主要在于定义和控制哪些工作应该包括在项目之内，哪些不应该包括在项目之内。",
    icon: "Target",
    color: "#10b981",
    processGroups: ["规划", "监控"],
    keyConcepts: ["范围基准", "WBS", "需求跟踪矩阵", "范围蔓延", "镀金"],
    inputs: ["项目章程", "项目管理计划", "需求文件", "组织过程资产"],
    outputs: ["范围基准", "项目范围说明书", "WBS", "WBS词典"],
    tools: ["专家判断", "数据收集", "数据分析", "决策"],
    subtasks: [
      { id: "scope-1", title: "规划范围管理", completed: true },
      { id: "scope-2", title: "收集需求", completed: true },
      { id: "scope-3", title: "定义范围", completed: false },
      { id: "scope-4", title: "创建WBS", completed: false },
      { id: "scope-5", title: "确认范围", completed: false },
      { id: "scope-6", title: "控制范围", completed: false },
    ],
  },
  {
    id: "schedule",
    title: "项目进度管理",
    shortTitle: "进度管理",
    description: "项目进度管理包括管理项目按时完成所需的各个过程。进度管理确保项目团队在适当的时间完成适当的工作，以实现项目目标。",
    icon: "Clock",
    color: "#f59e0b",
    processGroups: ["规划", "执行", "监控"],
    keyConcepts: ["关键路径法", "里程碑", "进度基准", "赶工", "快速跟进"],
    inputs: ["项目管理计划", "项目文件", "事业环境因素", "组织过程资产"],
    outputs: ["进度基准", "项目进度计划", "进度数据", "项目日历"],
    tools: ["CPM", "PERT", "敏捷发布规划", "资源优化"],
    subtasks: [
      { id: "sch-1", title: "规划进度管理", completed: true },
      { id: "sch-2", title: "定义活动", completed: true },
      { id: "sch-3", title: "排列活动顺序", completed: false },
      { id: "sch-4", title: "估算活动持续时间", completed: false },
      { id: "sch-5", title: "制定进度计划", completed: false },
      { id: "sch-6", title: "控制进度", completed: false },
    ],
  },
  {
    id: "cost",
    title: "项目成本管理",
    shortTitle: "成本管理",
    description: "项目成本管理包括对成本进行规划、估算、预算、融资、筹资、管理和控制的各过程，从而使项目在批准的预算内完成。",
    icon: "DollarSign",
    color: "#ef4444",
    processGroups: ["规划", "监控"],
    keyConcepts: ["成本基准", "挣值管理", "储备分析", "成本估算", "成本控制"],
    inputs: ["项目管理计划", "项目文件", "事业环境因素", "组织过程资产"],
    outputs: ["成本估算", "成本基准", "项目资金需求", "工作绩效信息"],
    tools: ["专家判断", "类比估算", "参数估算", "三点估算", "挣值分析"],
    subtasks: [
      { id: "cost-1", title: "规划成本管理", completed: true },
      { id: "cost-2", title: "估算成本", completed: true },
      { id: "cost-3", title: "制定预算", completed: false },
      { id: "cost-4", title: "控制成本", completed: false },
    ],
  },
  {
    id: "quality",
    title: "项目质量管理",
    shortTitle: "质量管理",
    description: "项目质量管理包括把组织的质量政策应用于规划、管理、控制项目和产品质量要求，以满足干系人的期望的各过程。",
    icon: "Shield",
    color: "#8b5cf6",
    processGroups: ["规划", "执行", "监控"],
    keyConcepts: ["质量成本", "PDCA循环", "七基本质量工具", "持续改进", "质量保证"],
    inputs: ["项目管理计划", "项目文件", "批准的变更请求", "可交付成果"],
    outputs: ["质量报告", "测试与评估文件", "变更请求", "工作绩效信息"],
    tools: ["成本效益分析", "标杆对照", "流程图", "审计", "检查"],
    subtasks: [
      { id: "q-1", title: "规划质量管理", completed: true },
      { id: "q-2", title: "管理质量", completed: false },
      { id: "q-3", title: "控制质量", completed: false },
    ],
  },
  {
    id: "resource",
    title: "项目资源管理",
    shortTitle: "资源管理",
    description: "项目资源管理包括识别、获取和管理所需资源以成功完成项目的各个过程，确保项目经理和项目团队在正确的时间和地点使用正确的资源。",
    icon: "Users",
    color: "#06b6d4",
    processGroups: ["规划", "执行", "监控"],
    keyConcepts: ["RAM矩阵", "RACI", "团队建设", "资源日历", "虚拟团队"],
    inputs: ["项目章程", "项目管理计划", "项目文件", "事业环境因素"],
    outputs: ["资源分配单", "团队绩效评价", "变更请求", "项目文件更新"],
    tools: ["预分派", "谈判", "虚拟团队", "多标准决策分析"],
    subtasks: [
      { id: "res-1", title: "规划资源管理", completed: true },
      { id: "res-2", title: "估算活动资源", completed: true },
      { id: "res-3", title: "获取资源", completed: false },
      { id: "res-4", title: "建设团队", completed: false },
      { id: "res-5", title: "管理团队", completed: false },
      { id: "res-6", title: "控制资源", completed: false },
    ],
  },
  {
    id: "communications",
    title: "项目沟通管理",
    shortTitle: "沟通管理",
    description: "项目沟通管理包括为确保项目信息及时且恰当地规划、收集、生成、发布、存储、检索、管理、控制、监督和最终处置所需的各个过程。",
    icon: "MessageSquare",
    color: "#ec4899",
    processGroups: ["规划", "执行", "监控"],
    keyConcepts: ["沟通模型", "沟通渠道", "沟通方法", "沟通技术", "报告绩效"],
    inputs: ["项目管理计划", "项目文件", "工作绩效报告", "事业环境因素"],
    outputs: ["项目沟通记录", "工作绩效报告", "变更请求", "项目管理计划更新"],
    tools: ["沟通需求分析", "沟通技术", "沟通模型", "信息管理系统"],
    subtasks: [
      { id: "comm-1", title: "规划沟通管理", completed: true },
      { id: "comm-2", title: "管理沟通", completed: false },
      { id: "comm-3", title: "监督沟通", completed: false },
    ],
  },
  {
    id: "risk",
    title: "项目风险管理",
    shortTitle: "风险管理",
    description: "项目风险管理包括规划风险管理、识别风险、开展风险分析、规划风险应对、实施风险应对和监督风险的各个过程。",
    icon: "AlertTriangle",
    color: "#f97316",
    processGroups: ["规划", "执行", "监控"],
    keyConcepts: ["风险登记册", "风险概率与影响", "应急计划", "弹回计划", "风险应对策略"],
    inputs: ["项目管理计划", "项目文件", "事业环境因素", "组织过程资产"],
    outputs: ["风险登记册", "风险报告", "变更请求", "项目文件更新"],
    tools: ["头脑风暴", "SWOT分析", "决策树", "蒙特卡洛模拟", "敏感性分析"],
    subtasks: [
      { id: "risk-1", title: "规划风险管理", completed: true },
      { id: "risk-2", title: "识别风险", completed: true },
      { id: "risk-3", title: "实施定性风险分析", completed: false },
      { id: "risk-4", title: "实施定量风险分析", completed: false },
      { id: "risk-5", title: "规划风险应对", completed: false },
      { id: "risk-6", title: "实施风险应对", completed: false },
      { id: "risk-7", title: "监督风险", completed: false },
    ],
  },
  {
    id: "procurement",
    title: "项目采购管理",
    shortTitle: "采购管理",
    description: "项目采购管理包括从项目团队外部采购或获取所需的产品、服务或成果的各个过程。包括合同管理和变更控制过程。",
    icon: "ShoppingCart",
    color: "#14b8a6",
    processGroups: ["规划", "执行", "监控"],
    keyConcepts: ["合同类型", "自制或外购", "采购文件", "投标人会议", "索赔管理"],
    inputs: ["项目管理计划", "项目文件", "事业环境因素", "组织过程资产"],
    outputs: ["选定的卖方", "协议", "变更请求", "项目文件更新"],
    tools: ["专家判断", "广告", "投标人会议", "数据分析"],
    subtasks: [
      { id: "proc-1", title: "规划采购管理", completed: true },
      { id: "proc-2", title: "实施采购", completed: false },
      { id: "proc-3", title: "控制采购", completed: false },
    ],
  },
  {
    id: "stakeholder",
    title: "项目干系人管理",
    shortTitle: "干系人管理",
    description: "项目干系人管理包括用于开展下列工作的各个过程：识别影响或受项目影响的人员、团体或组织，分析干系人期望及其影响，制定合适的管理策略来有效调动干系人参与项目决策和执行。",
    icon: "Heart",
    color: "#d946ef",
    processGroups: ["启动", "规划", "执行", "监控"],
    keyConcepts: ["干系人登记册", "权力/利益方格", "干系人参与度", "沟通策略", "管理策略"],
    inputs: ["项目章程", "采购文件", "事业环境因素", "组织过程资产"],
    outputs: ["干系人登记册", "变更请求", "项目管理计划更新", "项目文件更新"],
    tools: ["数据收集", "数据表现", "决策", "沟通技能", "人际关系技能"],
    subtasks: [
      { id: "stk-1", title: "识别干系人", completed: true },
      { id: "stk-2", title: "规划干系人参与", completed: true },
      { id: "stk-3", title: "管理干系人参与", completed: false },
      { id: "stk-4", title: "监督干系人参与", completed: false },
    ],
  },
];

export interface ProcessGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  keyActivities: string[];
  deliverables: string[];
  knowledgeAreas: string[];
}

export const processGroups: ProcessGroup[] = [
  {
    id: "initiating",
    title: "启动过程组",
    description: "定义一个新项目或现有项目的一个新阶段，授权开始该项目或阶段的一组过程。启动过程组的主要目的是保证干系人期望与项目目的的一致性，让干系人明了项目范围和目标，同时让干系人明白他们在项目和阶段中的参与，以实现他们的期望。",
    icon: "Rocket",
    color: "#6366f1",
    keyActivities: ["制定项目章程", "识别干系人"],
    deliverables: ["项目章程", "干系人登记册"],
    knowledgeAreas: ["整合管理", "干系人管理"],
  },
  {
    id: "planning",
    title: "规划过程组",
    description: "明确项目范围，优化目标，为实现目标制定行动方案的一组过程。规划过程组的主要作用是，为成功完成项目或阶段确定战略、战术及行动方案或路线。",
    icon: "Map",
    color: "#10b981",
    keyActivities: ["制定项目管理计划", "收集需求", "定义范围", "创建WBS", "制定进度计划", "制定预算", "规划质量", "规划资源", "规划沟通", "规划风险", "规划采购", "规划干系人参与"],
    deliverables: ["项目管理计划", "项目基准", "子管理计划"],
    knowledgeAreas: ["整合管理", "范围管理", "进度管理", "成本管理", "质量管理", "资源管理", "沟通管理", "风险管理", "采购管理", "干系人管理"],
  },
  {
    id: "executing",
    title: "执行过程组",
    description: "完成项目管理计划中确定的工作，以满足项目规范要求的一组过程。执行过程组不但要协调人员和资源，还要按照项目管理计划整合并实施项目活动。",
    icon: "Zap",
    color: "#f59e0b",
    keyActivities: ["指导与管理项目工作", "管理质量", "获取资源", "建设团队", "管理团队", "管理沟通", "实施风险应对", "实施采购", "管理干系人参与"],
    deliverables: ["可交付成果", "工作绩效数据", "变更请求"],
    knowledgeAreas: ["整合管理", "质量管理", "资源管理", "沟通管理", "风险管理", "采购管理", "干系人管理"],
  },
  {
    id: "monitoring",
    title: "监控过程组",
    description: "跟踪、审查和调整项目进展与绩效，识别必要的计划变更并启动相应变更的一组过程。监控过程组的主要作用是，定期对项目绩效进行测量和分析，从而识别与项目管理计划的偏差。",
    icon: "Activity",
    color: "#ef4444",
    keyActivities: ["监控项目工作", "实施整体变更控制", "确认范围", "控制范围", "控制进度", "控制成本", "控制质量", "控制资源", "监督沟通", "监督风险", "控制采购", "监督干系人参与"],
    deliverables: ["工作绩效报告", "变更请求", "项目文件更新"],
    knowledgeAreas: ["整合管理", "范围管理", "进度管理", "成本管理", "质量管理", "资源管理", "沟通管理", "风险管理", "采购管理", "干系人管理"],
  },
  {
    id: "closing",
    title: "收尾过程组",
    description: "完结所有项目管理过程组的所有活动，正式结束项目或阶段或合同责任的一组过程。在收尾过程组中，需要对整个项目或阶段进行正式收尾，获得客户或发起人的验收。",
    icon: "CheckCircle",
    color: "#8b5cf6",
    keyActivities: ["结束项目或阶段"],
    deliverables: ["最终产品", "服务或成果", "项目文件归档"],
    knowledgeAreas: ["整合管理"],
  },
];
