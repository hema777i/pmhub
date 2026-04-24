using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using A = DocumentFormat.OpenXml.Drawing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;

namespace Docx;

public class Program
{
    // Dark Tech Theme — matches PM Master website
    private static class Colors
    {
        public const string Indigo = "6366f1";      // Primary accent
        public const string Emerald = "10b981";     // Success accent
        public const string Dark = "09090b";        // Background
        public const string Card = "18181b";        // Card bg
        public const string Text = "fafafa";        // Primary text
        public const string Muted = "a1a1aa";       // Secondary text
        public const string Mid = "71717a";         // Tertiary
        public const string Border = "27272a";      // Borders
        public const string Amber = "f59e0b";       // Warning accent
    }

    private const int A4W = 11906;
    private const int A4H = 16838;
    private const long A4WE = 7560000L;
    private const long A4HE = 10692000L;

    public static void Main(string[] args)
    {
        string outputPath = args.Length > 0 ? args[0] : "/mnt/agents/output/PM_Master_用户使用手册.docx";
        string bgDir = "/mnt/agents/output/manual_bg";
        Generate(outputPath, bgDir);
    }

    public static void Generate(string outputPath, string bgDir)
    {
        using var doc = WordprocessingDocument.Create(outputPath, WordprocessingDocumentType.Document);
        var mainPart = doc.AddMainDocumentPart();
        mainPart.Document = new Document(new Body());
        var body = mainPart.Document.Body!;

        AddStyles(mainPart);
        AddNumbering(mainPart);

        var coverBgId = AddImage(mainPart, Path.Combine(bgDir, "cover_bg.png"));
        var backBgId = AddImage(mainPart, Path.Combine(bgDir, "backcover_bg.png"));

        uint prId = 1;
        AddCoverSection(body, coverBgId, ref prId);
        AddTocSection(body);
        AddContentSection(doc, body, mainPart, ref prId);
        AddBackcoverSection(body, backBgId, ref prId);

        SetUpdateFieldsOnOpen(mainPart);
        doc.Save();
    }

    private static void AddStyles(MainDocumentPart mainPart)
    {
        var sp = mainPart.AddNewPart<StyleDefinitionsPart>();
        sp.Styles = new Styles();

        sp.Styles.Append(new Style(
            new StyleName { Val = "Normal" },
            new StyleParagraphProperties(
                new SpacingBetweenLines { After = "160", Line = "360", LineRule = LineSpacingRuleValues.Auto },
                new Indentation { FirstLine = "480" }
            ),
            new StyleRunProperties(
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                new FontSize { Val = "22" },
                new Color { Val = Colors.Text }
            )
        ) { Type = StyleValues.Paragraph, StyleId = "Normal", Default = true });

        sp.Styles.Append(CreateHeadingStyle("Heading1", "heading 1", 0, "36", Colors.Indigo, "600", "240"));
        sp.Styles.Append(CreateHeadingStyle("Heading2", "heading 2", 1, "28", Colors.Text, "400", "160"));
        sp.Styles.Append(CreateHeadingStyle("Heading3", "heading 3", 2, "24", Colors.Muted, "280", "120"));

        sp.Styles.Append(new Style(
            new StyleName { Val = "Caption" }, new BasedOn { Val = "Normal" },
            new StyleParagraphProperties(
                new Justification { Val = JustificationValues.Center },
                new Indentation { FirstLine = "0" },
                new SpacingBetweenLines { Before = "60", After = "320" }),
            new StyleRunProperties(new Color { Val = Colors.Mid }, new FontSize { Val = "20" },
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" })
        ) { Type = StyleValues.Paragraph, StyleId = "Caption" });

        sp.Styles.Append(CreateTocStyle("TOC1", "toc 1", true, "0", "200"));
        sp.Styles.Append(CreateTocStyle("TOC2", "toc 2", false, "360", "60"));
    }

    private static Style CreateHeadingStyle(string id, string name, int lvl, string sz, string color, string before, string after)
    {
        return new Style(
            new StyleName { Val = name }, new BasedOn { Val = "Normal" },
            new StyleParagraphProperties(
                new KeepNext(), new KeepLines(),
                new SpacingBetweenLines { Before = before, After = after },
                new Indentation { FirstLine = "0" },
                new OutlineLevel { Val = lvl }),
            new StyleRunProperties(new Bold(), new FontSize { Val = sz },
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                new Color { Val = color })
        ) { Type = StyleValues.Paragraph, StyleId = id };
    }

    private static Style CreateTocStyle(string id, string name, bool bold, string indent, string before)
    {
        var rpr = new StyleRunProperties(
            new Color { Val = bold ? Colors.Text : Colors.Muted },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" });
        if (bold) rpr.Append(new Bold());
        return new Style(
            new StyleName { Val = name }, new BasedOn { Val = "Normal" },
            new StyleParagraphProperties(
                new Tabs(new TabStop { Val = TabStopValues.Right, Leader = TabStopLeaderCharValues.Dot, Position = 9350 }),
                new SpacingBetweenLines { Before = before, After = "60" },
                new Indentation { Left = indent, FirstLine = "0" }),
            rpr
        ) { Type = StyleValues.Paragraph, StyleId = id };
    }

    private static void AddNumbering(MainDocumentPart mp)
    {
        var np = mp.AddNewPart<NumberingDefinitionsPart>();
        np.Numbering = new Numbering(
            new AbstractNum(new Level(
                new NumberingFormat { Val = NumberFormatValues.Decimal },
                new LevelText { Val = "%1." },
                new LevelJustification { Val = LevelJustificationValues.Left },
                new ParagraphProperties(new Indentation { Left = "720", Hanging = "360" })
            ) { LevelIndex = 0 }) { AbstractNumberId = 1 },
            new NumberingInstance(new AbstractNumId { Val = 1 }) { NumberID = 1 });
    }

    // ==================== COVER ====================
    private static void AddCoverSection(Body body, string coverBgId, ref uint prId)
    {
        body.Append(new Paragraph(new Run(CreateFloatingBackground(coverBgId, prId++, "CoverBg"))));
        body.Append(new Paragraph(new ParagraphProperties(new SpacingBetweenLines { Before = "5000" }), new Run()));

        // Main title
        body.Append(new Paragraph(
            new ParagraphProperties(
                new Indentation { Left = "1200", Right = "1200" },
                new SpacingBetweenLines { After = "200" }),
            new Run(new RunProperties(
                    new FontSize { Val = "72" }, new Bold(),
                    new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                    new Color { Val = Colors.Text },
                    new Spacing { Val = 40 }),
                new Text("PM Master"))));

        // Subtitle
        body.Append(new Paragraph(
            new ParagraphProperties(
                new Indentation { Left = "1200", Right = "1200" },
                new SpacingBetweenLines { After = "400" }),
            new Run(new RunProperties(
                    new FontSize { Val = "32" },
                    new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                    new Color { Val = Colors.Indigo },
                    new Spacing { Val = 20 }),
                new Text("用户使用手册"))));

        // Version & date
        body.Append(new Paragraph(
            new ParagraphProperties(new Indentation { Left = "1200" },
                new SpacingBetweenLines { After = "3000" }),
            new Run(new RunProperties(new FontSize { Val = "20" },
                    new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                    new Color { Val = Colors.Muted }),
                new Text("V1.0 | 2025年4月"))));

        // Description
        body.Append(new Paragraph(
            new ParagraphProperties(new Indentation { Left = "1200", Right = "1200" }),
            new Run(new RunProperties(new FontSize { Val = "20" },
                    new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                    new Color { Val = Colors.Muted }),
                new Text("项目管理知识学习平台 — 十大知识领域、五大过程组、交互式工具集"))));

        body.Append(new Paragraph(new ParagraphProperties(new SectionProperties(
            new TitlePage(),
            new SectionType { Val = SectionMarkValues.NextPage },
            new PageSize { Width = (UInt32Value)(uint)A4W, Height = (UInt32Value)(uint)A4H },
            new PageMargin { Top = 0, Right = 0, Bottom = 0, Left = 0, Header = 0, Footer = 0 }))));
    }

    // ==================== TOC ====================
    private static void AddTocSection(Body body)
    {
        body.Append(CreateHeading1("目录", "_Toc000"));

        body.Append(new Paragraph(
            new ParagraphProperties(new SpacingBetweenLines { After = "300" }),
            new Run(new RunProperties(new Color { Val = Colors.Mid }, new FontSize { Val = "18" },
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
                new Text("右键目录，选择\"更新域\"刷新页码"))));

        body.Append(new Paragraph(
            new Run(new FieldChar { FieldCharType = FieldCharValues.Begin }),
            new Run(new FieldCode(" TOC \\o \"1-3\" \\h \\z \\u ") { Space = SpaceProcessingModeValues.Preserve }),
            new Run(new FieldChar { FieldCharType = FieldCharValues.Separate })));

        string[,] toc = {
            { "一、系统概览", "1", "3" }, { "二、快速入门", "1", "5" },
            { "2.1 界面导览", "2", "5" }, { "2.2 首次使用流程", "2", "6" },
            { "三、知识库", "1", "7" }, { "3.1 十大知识领域", "2", "7" },
            { "3.2 五大过程组", "2", "8" }, { "3.3 搜索与筛选", "2", "9" },
            { "四、交互工具集", "1", "10" }, { "4.1 甘特图", "2", "10" },
            { "4.2 燃尽图", "2", "11" }, { "4.3 风险矩阵", "2", "12" },
            { "4.4 Kanban看板", "2", "13" }, { "4.5 WBS分解", "2", "14" },
            { "五、知识图谱", "1", "15" }, { "六、个人中心", "1", "16" },
            { "七、常见问题", "1", "17" },
        };
        for (int i = 0; i < toc.GetLength(0); i++)
            body.Append(new Paragraph(
                new ParagraphProperties(new ParagraphStyleId { Val = $"TOC{toc[i, 1]}" }),
                new Run(new Text(toc[i, 0])), new Run(new TabChar()), new Run(new Text(toc[i, 2]))));

        body.Append(new Paragraph(new Run(new FieldChar { FieldCharType = FieldCharValues.End })));

        body.Append(new Paragraph(new ParagraphProperties(new SectionProperties(
            new SectionType { Val = SectionMarkValues.NextPage },
            new PageSize { Width = (UInt32Value)(uint)A4W, Height = (UInt32Value)(uint)A4H },
            new PageMargin { Top = 1800, Right = 1440, Bottom = 1440, Left = 1440, Header = 720, Footer = 720 }))));
    }

    // ==================== CONTENT ====================
    private static void AddContentSection(WordprocessingDocument doc, Body body, MainDocumentPart mainPart, ref uint prId)
    {
        // Header
        var headerPart = mainPart.AddNewPart<HeaderPart>();
        var headerId = mainPart.GetIdOfPart(headerPart);
        headerPart.Header = new Header(new Paragraph(
            new ParagraphProperties(new Justification { Val = JustificationValues.Right }),
            new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
                new Text("PM Master 用户使用手册"))));

        // Footer
        var footerPart = mainPart.AddNewPart<FooterPart>();
        var footerId = mainPart.GetIdOfPart(footerPart);
        var fp = new Paragraph(new ParagraphProperties(new Justification { Val = JustificationValues.Center }));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new Text("- ") { Space = SpaceProcessingModeValues.Preserve }));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new FieldChar { FieldCharType = FieldCharValues.Begin }));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new FieldCode(" PAGE ") { Space = SpaceProcessingModeValues.Preserve }));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new FieldChar { FieldCharType = FieldCharValues.Separate }));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new Text("1")));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new FieldChar { FieldCharType = FieldCharValues.End }));
        fp.Append(new Run(new RunProperties(new FontSize { Val = "18" }, new Color { Val = Colors.Mid },
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" }),
            new Text(" -") { Space = SpaceProcessingModeValues.Preserve }));
        footerPart.Footer = new Footer(fp);

        // ===== Chapter 1 =====
        body.Append(CreateHeading1("一、系统概览", "_Toc001"));
        body.Append(CreateParagraph("PM Master 是一款专为项目管理知识学习打造的沉浸式在线平台。它基于 PMBOK（项目管理知识体系指南）构建，涵盖十大知识领域与五大过程组的完整理论框架，并配备了五款专业级交互工具，帮助学习者在实践中深化理解。"));
        body.Append(CreateParagraph("无论你是正在备考 PMP 认证的项目经理，还是希望系统学习项目管理方法论的技术团队负责人，PM Master 都能为你提供结构化的学习路径与直观的可视化工具。"));

        body.Append(CreateHeading2("1.1 核心功能模块"));
        body.Append(CreateFeatureTable());

        body.Append(CreateHeading2("1.2 技术架构"));
        body.Append(CreateParagraph("PM Master 采用现代化的前端技术栈构建：React 18 + TypeScript 提供类型安全的组件化架构，Vite 实现极速构建与热更新，Tailwind CSS 与 shadcn/ui 保证设计的一致性与响应式适配，Framer Motion 驱动流畅的页面过渡与交互动效，Recharts 负责数据可视化渲染。整个应用为单页应用（SPA），所有路由切换均在客户端完成，无需等待服务器响应。"));

        // ===== Chapter 2 =====
        body.Append(CreateHeading1("二、快速入门", "_Toc002"));
        body.Append(CreateHeading2("2.1 界面导览"));
        body.Append(CreateParagraph("登录系统后，你将看到以下核心界面元素："));
        body.Append(CreateBulletItem("顶部导航栏", "固定在页面顶部，高度 56px，包含面包屑导航（显示当前页面位置）、全局搜索框、系统状态指示灯（绿色脉冲表示正常运行）以及用户头像入口。导航栏采用玻璃拟态（Glassmorphism）效果，随页面滚动自动增强背景模糊度。"));
        body.Append(CreateBulletItem("左侧边栏", "宽度 240px（可折叠至 64px），包含六个一级导航入口：仪表盘、知识库、过程组、知识图谱、交互工具、个人中心。当前所在页面以靛蓝色高亮显示，带有左侧竖线指示器。底部显示系统运行状态。"));
        body.Append(CreateBulletItem("主内容区", "占据剩余视口空间，最大宽度 1600px 并水平居中。所有页面内容在此区域渲染，采用统一的卡片式布局与间距规范。"));

        body.Append(CreateHeading2("2.2 首次使用流程"));
        body.Append(CreateNumberedItem("访问首页", "在浏览器中打开系统地址，进入仪表盘首页。首页展示你的学习进度统计、知识领域快捷入口以及最近使用的工具。"));
        body.Append(CreateNumberedItem("浏览知识库", "点击左侧边栏\"知识库\"，查看十大知识领域的概览卡片。每个卡片显示领域名称、所属过程组标签、进度条以及前三个子任务状态。"));
        body.Append(CreateNumberedItem("深入单个领域", "点击任意知识领域卡片，进入详情页。详情页展示领域描述、关键概念标签、完整的过程任务列表（可点击标记完成）、输入输出分析以及工具与技术清单。"));
        body.Append(CreateNumberedItem("体验交互工具", "进入\"交互工具\"页面，选择任意工具进行实战演练。所有工具均内置示例数据，无需手动配置即可立即体验。"));
        body.Append(CreateNumberedItem("查看个人进度", "进入\"个人中心\"，查看雷达图形式的知识掌握度分析、学习模块进度以及已解锁的成就徽章。"));

        // ===== Chapter 3 =====
        body.Append(CreateHeading1("三、知识库", "_Toc003"));
        body.Append(CreateParagraph("知识库是 PM Master 的理论核心，完整覆盖 PMBOK 第七版定义的十大知识领域与五大过程组。每个知识领域包含完整的子过程定义、ITTO（输入-工具与技术-输出）分析以及关键概念解释。"));

        body.Append(CreateHeading2("3.1 十大知识领域"));
        body.Append(CreateParagraph("十大知识领域涵盖项目管理所需的全部专业知识："));
        body.Append(CreateBulletItem("项目整合管理", "识别、定义、组合、统一和协调各项目管理过程组的过程与活动，确保项目要素协调一致。"));
        body.Append(CreateBulletItem("项目范围管理", "确保项目做且只做所需的全部工作，包括范围规划、收集需求、定义范围、创建 WBS、确认范围和控制范围。"));
        body.Append(CreateBulletItem("项目进度管理", "管理项目按时完成所需的过程，包括活动定义、排序、资源估算、持续时间估算、进度制定和控制。"));
        body.Append(CreateBulletItem("项目成本管理", "对成本进行规划、估算、预算、融资、筹资、管理和控制，使项目在批准的预算内完成。"));
        body.Append(CreateBulletItem("项目质量管理", "把组织的质量政策应用于规划、管理、控制项目和产品质量要求，包括质量规划、保证和控制。"));
        body.Append(CreateBulletItem("项目资源管理", "识别、获取和管理所需资源以成功完成项目，包括人力资源与实物资源。"));
        body.Append(CreateBulletItem("项目沟通管理", "确保项目信息及时且恰当地规划、收集、生成、发布、存储、检索、管理、控制和监督。"));
        body.Append(CreateBulletItem("项目风险管理", "规划风险管理、识别风险、开展风险分析、规划风险应对、实施风险应对和监督风险。"));
        body.Append(CreateBulletItem("项目采购管理", "从项目团队外部采购或获取所需的产品、服务或成果，包括合同管理和变更控制。"));
        body.Append(CreateBulletItem("项目干系人管理", "识别影响或受项目影响的人员、团体或组织，分析期望并制定管理策略。"));

        body.Append(CreateHeading2("3.2 五大过程组"));
        body.Append(CreateParagraph("五大过程组定义了项目从启动到收尾的完整生命周期："));
        body.Append(CreateProcessGroupTable());

        body.Append(CreateHeading2("3.3 搜索与筛选"));
        body.Append(CreateParagraph("知识库页面顶部提供搜索框，支持按知识领域名称和关键概念进行模糊搜索。搜索框下方有一排过程组筛选按钮（全部/启动/规划/执行/监控/收尾），点击可快速过滤显示特定过程组下的知识领域。两个条件可同时叠加使用。点击\"清除搜索条件\"按钮可一键重置所有过滤条件。"));

        // ===== Chapter 4 =====
        body.Append(CreateHeading1("四、交互工具集", "_Toc004"));
        body.Append(CreateParagraph("交互工具集是 PM Master 的实战核心，包含五款专业级项目管理工具。每款工具均内置真实示例数据，支持实时交互操作，帮助你在实践中理解项目管理的核心概念。"));

        body.Append(CreateHeading2("4.1 甘特图"));
        body.Append(CreateParagraph("甘特图是项目进度管理的核心可视化工具。PM Master 的甘特图工具支持以下功能："));
        body.Append(CreateBulletItem("可视化时间线", "水平轴为项目天数，垂直轴为任务列表，每个任务以彩色条形表示持续时间和起止位置。"));
        body.Append(CreateBulletItem("进度追踪", "每个任务条内嵌进度百分比，已完成部分以实心填充显示。点击任务条可切换完成状态。"));
        body.Append(CreateBulletItem("依赖关系", "任务之间的前置依赖以虚线连接显示，直观呈现关键路径。"));
        body.Append(CreateBulletItem("悬停详情", "鼠标悬停在任意任务上，底部信息栏显示任务名称、负责人、当前进度和工期。"));
        body.Append(CreateBulletItem("工具栏", "顶部工具栏显示项目总周期、任务数量和依赖关系数量。支持重置为默认数据和导出功能。"));

        body.Append(CreateHeading2("4.2 燃尽图"));
        body.Append(CreateParagraph("燃尽图是敏捷项目管理的核心追踪工具，用于监控 Sprint 中剩余工作量随时间的变化趋势。"));
        body.Append(CreateBulletItem("双曲线对比", "虚线表示理想剩余工时（线性递减），实线表示实际剩余工时。两者之间的偏差直观反映项目健康状况。"));
        body.Append(CreateBulletItem("统计面板", "顶部四个统计卡片分别展示 Sprint 天数、总工作量、已完成工时和偏差值（超前或落后计划）。"));
        body.Append(CreateBulletItem("每日明细表", "底部表格列出每天的理想剩余、实际剩余、偏差和状态判定（正常/落后/待进行）。点击可交互高亮。"));
        body.Append(CreateBulletItem("交互操作", "支持显示/隐藏理想线，点击图表中的数据点可查看当天详情。"));

        body.Append(CreateHeading2("4.3 风险矩阵"));
        body.Append(CreateParagraph("风险矩阵通过概率与影响两个维度评估和可视化项目风险，帮助团队优先处理高风险项。"));
        body.Append(CreateBulletItem("5x5 矩阵视图", "矩阵横轴为影响程度（极低至极高），纵轴为概率（极低至极高）。每个单元格显示落入该区域的风险数量。"));
        body.Append(CreateBulletItem("颜色编码", "低风险区域为绿色，中风险为黄色，高风险为橙色，极高风险为红色。点击矩阵单元格可筛选风险清单。"));
        body.Append(CreateBulletItem("风险清单", "右侧列出所有风险的详细信息：名称、类别、概率、影响、风险得分、应对措施。悬停显示删除按钮。"));
        body.Append(CreateBulletItem("添加风险", "点击右上角\"添加风险\"按钮，在弹窗中填写风险名称、类别、概率和影响评分（1-5 滑块），即可新增风险条目。"));
        body.Append(CreateBulletItem("统计卡片", "顶部显示总风险数、高风险数、中风险数和低风险数的实时统计。"));

        body.Append(CreateHeading2("4.4 Kanban看板"));
        body.Append(CreateParagraph("Kanban 看板是一种可视化工作管理方法，通过拖拽操作实现任务在不同状态列之间的流转。"));
        body.Append(CreateBulletItem("四列状态", "默认包含\"待办\"、\"进行中\"、\"审核中\"、\"已完成\"四个状态列，每列顶部显示任务数量。"));
        body.Append(CreateBulletItem("拖拽操作", "按住任意任务卡片，拖动到目标列即可改变任务状态。拖拽过程中卡片半透明，目标列高亮提示。"));
        body.Append(CreateBulletItem("任务卡片", "每张卡片显示任务标题、优先级标签（高/中/低）、分类标签、截止日期和负责人头像。"));
        body.Append(CreateBulletItem("添加任务", "点击每列底部的\"添加任务\"按钮，输入任务标题后按 Enter 即可快速创建新任务。"));
        body.Append(CreateBulletItem("任务详情", "点击任意任务卡片弹出详情弹窗，显示完整信息并提供删除操作。"));

        body.Append(CreateHeading2("4.5 WBS分解"));
        body.Append(CreateParagraph("WBS（工作分解结构）是将项目可交付成果逐层分解为可管理的工作包的工具。"));
        body.Append(CreateBulletItem("树形视图", "默认以层级树结构展示 WBS，支持点击展开/折叠节点。每个节点显示 WBS 编码、名称、层级标识和类型标签。"));
        body.Append(CreateBulletItem("大纲视图", "切换至大纲视图，以表格形式展示所有节点，包含 WBS 编码、名称、层级和类型（可交付成果/工作包）列。"));
        body.Append(CreateBulletItem("统计面板", "顶部三个统计卡片显示总节点数、工作包数和层级深度。"));
        body.Append(CreateBulletItem("连接器线", "树形视图中，父子节点之间以灰色连接线展示层级关系。"));

        // ===== Chapter 5 =====
        body.Append(CreateHeading1("五、知识图谱", "_Toc005"));
        body.Append(CreateParagraph("知识图谱是一个基于力导向图算法的交互式可视化工具，展示了知识领域、过程组与核心概念之间的关联网络。"));
        body.Append(CreateBulletItem("三种节点类型", "大尺寸彩色节点代表知识领域，中等尺寸节点代表过程组，小尺寸灰色节点代表核心概念。"));
        body.Append(CreateBulletItem("力导向布局", "节点之间通过物理模拟自动排列——连线产生引力拉近相关节点，节点之间产生斥力避免重叠，最终形成稳定的网络结构。"));
        body.Append(CreateBulletItem("解锁机制", "部分节点初始处于锁定状态（显示锁图标），随着学习进度推进自动解锁。已解锁节点带有微光晕效果。"));
        body.Append(CreateBulletItem("交互操作", "支持鼠标拖拽平移视图、点击节点查看详情、右上角缩放控制（放大/缩小/重置）。"));
        body.Append(CreateBulletItem("节点详情", "点击任意节点，底部信息栏显示节点名称、类型和解锁状态。知识领域节点可直接跳转至对应详情页。"));
        body.Append(CreateBulletItem("进度条", "顶部显示整体解锁进度百分比。"));

        // ===== Chapter 6 =====
        body.Append(CreateHeading1("六、个人中心", "_Toc006"));
        body.Append(CreateParagraph("个人中心是你的学习仪表盘，汇总展示所有学习数据与成就。"));
        body.Append(CreateBulletItem("雷达图", "以八维雷达图展示各知识领域的掌握度百分比，直观呈现强项与弱项。"));
        body.Append(CreateBulletItem("统计卡片", "显示学习进度百分比、累计学习时长、连续学习天数和成就解锁数量。"));
        body.Append(CreateBulletItem("学习模块", "列出所有学习模块的进度条，显示已完成课时/总课时和上次学习时间。"));
        body.Append(CreateBulletItem("成就系统", "八个成就徽章，涵盖初学者、知识探索者、工具大师、进度追踪者、风险管理者、敏捷实践者、WBS 专家和 PMP 预备等奖项。已解锁成就彩色显示，未解锁的灰色显示并带锁图标。"));
        body.Append(CreateBulletItem("快速入口", "右侧边栏提供知识库、交互工具和知识图谱的快速跳转链接。"));

        // ===== Chapter 7 =====
        body.Append(CreateHeading1("七、常见问题", "_Toc007"));
        body.Append(CreateFaqItem("Q: 系统支持哪些浏览器？", "A: PM Master 支持所有现代浏览器，包括 Chrome（推荐）、Edge、Firefox 和 Safari。为确保最佳体验，请使用最新版本。"));
        body.Append(CreateFaqItem("Q: 我的学习进度会保存吗？", "A: 当前版本为演示环境，学习进度保存在浏览器本地存储中。清除浏览器数据将导致进度丢失。后续版本将支持云端同步。"));
        body.Append(CreateFaqItem("Q: 交互工具中的数据可以自定义吗？", "A: 甘特图和燃尽图当前基于预设示例数据运行。风险矩阵和 Kanban 看板支持完全自定义——你可以添加、删除自己的条目。"));
        body.Append(CreateFaqItem("Q: 知识领域的内容覆盖 PMBOK 第几版？", "A: 当前内容基于 PMBOK 第七版知识体系。后续将迭代更新以覆盖第六版的核心 ITTO 内容。"));
        body.Append(CreateFaqItem("Q: 如何在移动设备上使用？", "A: 系统设计为响应式布局，在平板和手机上均可正常访问。复杂工具（如 Kanban 看板拖拽）在触屏设备上可能需要适配。"));
        body.Append(CreateFaqItem("Q: 系统出现白屏或加载失败怎么办？", "A: 请尝试以下步骤：1）强制刷新页面（Ctrl+F5）；2）检查网络连接；3）清除浏览器缓存后重试；4）更换浏览器。如问题持续，请联系技术支持。"));

        // Content section break
        body.Append(new Paragraph(new ParagraphProperties(new SectionProperties(
            new HeaderReference { Type = HeaderFooterValues.Default, Id = headerId },
            new FooterReference { Type = HeaderFooterValues.Default, Id = footerId },
            new PageSize { Width = (UInt32Value)(uint)A4W, Height = (UInt32Value)(uint)A4H },
            new PageMargin { Top = 1800, Right = 1440, Bottom = 1440, Left = 1440, Header = 720, Footer = 720 }))));
    }

    // ==================== BACKCOVER ====================
    private static void AddBackcoverSection(Body body, string backBgId, ref uint prId)
    {
        body.Append(new Paragraph(new Run(CreateFloatingBackground(backBgId, prId++, "BackBg"))));

        body.Append(new Paragraph(
            new ParagraphProperties(new SpacingBetweenLines { Before = "7000" },
                new Justification { Val = JustificationValues.Center }),
            new Run(new RunProperties(new FontSize { Val = "48" }, new Bold(),
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                new Color { Val = Colors.Indigo }),
                new Text("PM Master"))));

        body.Append(new Paragraph(
            new ParagraphProperties(new SpacingBetweenLines { Before = "300" },
                new Justification { Val = JustificationValues.Center }),
            new Run(new RunProperties(new FontSize { Val = "22" },
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                new Color { Val = Colors.Muted }),
                new Text("项目管理知识学习平台"))));

        body.Append(new Paragraph(
            new ParagraphProperties(new SpacingBetweenLines { Before = "600" },
                new Justification { Val = JustificationValues.Center }),
            new Run(new RunProperties(new FontSize { Val = "18" },
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                new Color { Val = Colors.Mid }),
                new Text("版本 V1.0 | 2025年4月"))));

        body.Append(new SectionProperties(
            new PageSize { Width = (UInt32Value)(uint)A4W, Height = (UInt32Value)(uint)A4H },
            new PageMargin { Top = 0, Right = 0, Bottom = 0, Left = 0, Header = 0, Footer = 0 }));
    }

    // ==================== HELPERS ====================
    private static int _bookmarkId = 0;

    private static Paragraph CreateHeading1(string text, string bookmarkName)
    {
        int id = ++_bookmarkId;
        return new Paragraph(
            new ParagraphProperties(new ParagraphStyleId { Val = "Heading1" }),
            new BookmarkStart { Id = id.ToString(), Name = bookmarkName },
            new Run(new Text(text)),
            new BookmarkEnd { Id = id.ToString() });
    }

    private static Paragraph CreateHeading2(string text)
    {
        return new Paragraph(
            new ParagraphProperties(new ParagraphStyleId { Val = "Heading2" }),
            new Run(new Text(text)));
    }

    private static Paragraph CreateParagraph(string text)
    {
        return new Paragraph(new Run(new Text(text)));
    }

    private static Paragraph CreateBulletItem(string title, string description)
    {
        return new Paragraph(
            new ParagraphProperties(new Indentation { Left = "360", FirstLine = "0" }),
            new Run(new RunProperties(new Bold(), new Color { Val = Colors.Indigo }), new Text("\u2022 " + title + "：")),
            new Run(new Text(description)));
    }

    private static Paragraph CreateNumberedItem(string title, string description)
    {
        return new Paragraph(
            new ParagraphProperties(
                new NumberingProperties(new NumberingLevelReference { Val = 0 }, new NumberingId { Val = 1 }),
                new Indentation { FirstLine = "0" }),
            new Run(new RunProperties(new Bold(), new Color { Val = Colors.Emerald }), new Text(title + " —— ")),
            new Run(new Text(description)));
    }

    private static Paragraph CreateFaqItem(string question, string answer)
    {
        return new Paragraph(
            new ParagraphProperties(new SpacingBetweenLines { Before = "240", After = "120" }, new Indentation { FirstLine = "0" }),
            new Run(new RunProperties(new Bold(), new Color { Val = Colors.Indigo }), new Text(question)),
            new Run(new Break()),
            new Run(new Text(answer)));
    }

    // ==================== TABLES ====================
    private static Table CreateFeatureTable()
    {
        var tbl = new Table(new TableProperties(
            new TableWidth { Width = "5000", Type = TableWidthUnitValues.Pct },
            new TableBorders(
                new TopBorder { Val = BorderValues.Single, Size = 12, Color = Colors.Indigo },
                new BottomBorder { Val = BorderValues.Single, Size = 12, Color = Colors.Indigo },
                new LeftBorder { Val = BorderValues.Nil }, new RightBorder { Val = BorderValues.Nil },
                new InsideHorizontalBorder { Val = BorderValues.Single, Size = 4, Color = Colors.Border },
                new InsideVerticalBorder { Val = BorderValues.Nil })),
            new TableGrid(new GridColumn { Width = "2500" }, new GridColumn { Width = "4500" }, new GridColumn { Width = "2000" })));
        tbl.Append(CreateTableRow(true, "模块", "描述", "页面数"));
        tbl.Append(CreateTableRow(false, "仪表盘", "学习概览、进度统计、快捷入口", "1"));
        tbl.Append(CreateTableRow(false, "知识库", "十大知识领域详情与五大过程组", "2"));
        tbl.Append(CreateTableRow(false, "知识图谱", "力导向图可视化关联网络", "1"));
        tbl.Append(CreateTableRow(false, "交互工具", "甘特图/燃尽图/风险矩阵/Kanban/WBS", "5"));
        tbl.Append(CreateTableRow(false, "个人中心", "学习进度、成就系统、雷达图", "1"));
        return tbl;
    }

    private static Table CreateProcessGroupTable()
    {
        var tbl = new Table(new TableProperties(
            new TableWidth { Width = "5000", Type = TableWidthUnitValues.Pct },
            new TableBorders(
                new TopBorder { Val = BorderValues.Single, Size = 12, Color = Colors.Indigo },
                new BottomBorder { Val = BorderValues.Single, Size = 12, Color = Colors.Indigo },
                new LeftBorder { Val = BorderValues.Nil }, new RightBorder { Val = BorderValues.Nil },
                new InsideHorizontalBorder { Val = BorderValues.Single, Size = 4, Color = Colors.Border },
                new InsideVerticalBorder { Val = BorderValues.Nil })),
            new TableGrid(new GridColumn { Width = "2000" }, new GridColumn { Width = "5000" }, new GridColumn { Width = "2000" })));
        tbl.Append(CreateTableRow(true, "过程组", "核心目标", "知识领域数"));
        tbl.Append(CreateTableRow(false, "启动过程组", "定义新项目或新阶段，授权开始", "2"));
        tbl.Append(CreateTableRow(false, "规划过程组", "明确范围、优化目标、制定行动方案", "10"));
        tbl.Append(CreateTableRow(false, "执行过程组", "协调人员和资源，实施项目活动", "7"));
        tbl.Append(CreateTableRow(false, "监控过程组", "跟踪、审查和调整项目进展", "10"));
        tbl.Append(CreateTableRow(false, "收尾过程组", "完结所有活动，正式结束项目", "1"));
        return tbl;
    }

    private static TableRow CreateTableRow(bool hdr, params string[] cells)
    {
        var row = new TableRow();
        if (hdr) row.Append(new TableRowProperties(new TableHeader()));
        foreach (var t in cells)
        {
            var tcp = new TableCellProperties(new TableCellWidth { Width = "0", Type = TableWidthUnitValues.Auto });
            if (hdr) tcp.Append(new Shading { Val = ShadingPatternValues.Clear, Fill = Colors.Card });
            var rpr = new RunProperties(
                new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", EastAsia = "Microsoft YaHei" },
                new FontSize { Val = "20" }, new Color { Val = hdr ? Colors.Text : Colors.Muted });
            if (hdr) rpr.Append(new Bold());
            row.Append(new TableCell(tcp, new Paragraph(
                new ParagraphProperties(new Justification { Val = JustificationValues.Center },
                    new Indentation { FirstLine = "0" }, new SpacingBetweenLines { Before = "40", After = "40" }),
                new Run(rpr, new Text(t)))));
        }
        return row;
    }

    // ==================== IMAGE HELPERS ====================
    private static string AddImage(MainDocumentPart mp, string path)
    {
        var ip = mp.AddImagePart(ImagePartType.Png);
        using var fs = new FileStream(path, FileMode.Open);
        ip.FeedData(fs); return mp.GetIdOfPart(ip);
    }

    private static Drawing CreateFloatingBackground(string imgId, uint prId, string name)
    {
        return new Drawing(new DW.Anchor(
            new DW.SimplePosition { X = 0, Y = 0 },
            new DW.HorizontalPosition(new DW.PositionOffset("0")) { RelativeFrom = DW.HorizontalRelativePositionValues.Page },
            new DW.VerticalPosition(new DW.PositionOffset("0")) { RelativeFrom = DW.VerticalRelativePositionValues.Page },
            new DW.Extent { Cx = A4WE, Cy = A4HE },
            new DW.EffectExtent { LeftEdge = 0, TopEdge = 0, RightEdge = 0, BottomEdge = 0 },
            new DW.WrapNone(),
            new DW.DocProperties { Id = prId, Name = name },
            new DW.NonVisualGraphicFrameDrawingProperties(new A.GraphicFrameLocks { NoChangeAspect = true }),
            new A.Graphic(new A.GraphicData(
                new PIC.Picture(
                    new PIC.NonVisualPictureProperties(
                        new PIC.NonVisualDrawingProperties { Id = 0, Name = $"{name}.png" },
                        new PIC.NonVisualPictureDrawingProperties()),
                    new PIC.BlipFill(new A.Blip { Embed = imgId }, new A.Stretch(new A.FillRectangle())),
                    new PIC.ShapeProperties(
                        new A.Transform2D(new A.Offset { X = 0, Y = 0 }, new A.Extents { Cx = A4WE, Cy = A4HE }),
                        new A.PresetGeometry { Preset = A.ShapeTypeValues.Rectangle })))
            { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" }))
        { DistanceFromTop = 0, DistanceFromBottom = 0, DistanceFromLeft = 0, DistanceFromRight = 0,
          SimplePos = false, RelativeHeight = 251658240, BehindDoc = true,
          Locked = false, LayoutInCell = true, AllowOverlap = true });
    }

    private static void SetUpdateFieldsOnOpen(MainDocumentPart mp)
    {
        var sp = mp.DocumentSettingsPart ?? mp.AddNewPart<DocumentSettingsPart>();
        sp.Settings = new Settings(new UpdateFieldsOnOpen { Val = true }, new DisplayBackgroundShape());
    }
}
