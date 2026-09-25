export type ExperienceRole = {
  key: string;
  label: string;
  name: string;
  menu: string[];
  active: string;
};

export type ProjectExperience = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  articleUrl: string;
  projectUrl: string;
  ui: "market" | "medical" | "library" | "movie" | "face" | "course" | "equipment" | "parking";
  accent: string;
  roles: ExperienceRole[];
  stack: string[];
  hero?: {
    title: string;
    subtitle: string;
    search?: string;
    categories?: string[];
  };
  cards: Array<[string, string, string?]>;
  panels: Array<{
    title: string;
    subtitle?: string;
    type: "table" | "cards" | "chart" | "form" | "scan" | "store";
  }>;
  columns: string[];
  rows: string[][];
  products?: Array<{
    title: string;
    price: string;
    origin?: string;
    tag: string;
    meta: string;
    color: string;
  }>;
};

export const projectExperiences: ProjectExperience[] = [
  {
    slug: "parking-management",
    title: "智慧停车场管理系统",
    shortTitle: "智慧停车",
    description: "复刻原项目深色工业科技风：车辆入场、出场结算、阶梯计费、月卡储值卡和车位实时地图。",
    articleUrl: "/projects/parking-management-reproduction/",
    projectUrl: "https://github.com/yishuo299/parking-management",
    ui: "parking",
    accent: "#22c55e",
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "JWT", "Vue 3", "Element Plus", "ECharts"],
    roles: [
      { key: "admin", label: "测试管理员", name: "系统管理员", active: "运营仪表盘", menu: ["运营仪表盘", "车位实时地图", "入场登记", "出场结算", "区域与车位", "计费规则", "用户与权限", "统计报表"] },
      { key: "operator", label: "测试收费员", name: "收费员李静", active: "出场结算", menu: ["运营仪表盘", "车位实时地图", "入场登记", "出场结算", "进出场记录", "缴费流水", "月卡管理", "储值卡管理"] },
      { key: "owner", label: "测试车主", name: "车主陈晓明", active: "我的车辆", menu: ["我的车辆", "我的停车记录", "我的卡包", "车位实时地图", "公告"] },
    ],
    cards: [["总车位", "40"], ["在场车辆", "16"], ["空闲车位", "20"], ["今日收入", "¥1,286"]],
    panels: [
      { title: "车位实时地图", subtitle: "模拟区域、车位编号、车位类型和占用状态", type: "cards" },
      { title: "进出场结算", subtitle: "支持入场登记、出场预结算、月卡/储值卡优先扣费", type: "table" },
    ],
    columns: ["车牌", "车位", "入场时间", "状态"],
    rows: [["京A·12345", "A-001", "08:20", "在场"], ["京H·23456", "B-012", "10:05", "待结算"], ["京C·45000", "C-006", "昨日 21:30", "已缴费"], ["京N·88112", "D-009", "12:18", "在场"]],
  },
  {
    slug: "campus-marketplace",
    title: "校园二手交易平台",
    shortTitle: "校园集市",
    description: "复刻原项目橙色校园闲置集市：首页搜索、分类筛选、商品瀑布流、卖家中心和后台管理。",
    articleUrl: "/projects/campus-marketplace-reproduction/",
    projectUrl: "https://github.com/yishuo299/campus-marketplace",
    ui: "market",
    accent: "#f97316",
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "Vue 3", "Pinia", "Element Plus"],
    roles: [
      { key: "buyer", label: "测试买家", name: "林同学", active: "首页", menu: ["首页", "发布闲置", "我的订单", "收藏", "钱包", "消息"] },
      { key: "seller", label: "测试卖家", name: "周同学", active: "卖家中心", menu: ["首页", "发布闲置", "卖家中心", "我的订单", "钱包", "地址"] },
      { key: "admin", label: "测试管理员", name: "平台管理员", active: "后台首页", menu: ["后台首页", "用户管理", "商品审核", "订单管理", "分类管理"] },
    ],
    hero: {
      title: "校园闲置集市",
      subtitle: "买卖闲置，认识同学，让好物在校园里流动起来",
      search: "搜索你想要的宝贝，如 iPad、考研、山地车...",
      categories: ["全部", "数码", "书籍", "生活", "运动", "美妆", "票券"],
    },
    cards: [["今日上新", "32"], ["在售商品", "128"], ["待付款订单", "6"], ["钱包余额", "¥268.50"]],
    panels: [
      { title: "瀑布流商品墙", subtitle: "复刻原项目首页卡片、价格、成色与校区信息", type: "store" },
      { title: "交易状态", subtitle: "下单、付款、发货、收货与评价流程", type: "table" },
    ],
    columns: ["商品", "买家/卖家", "金额", "状态"],
    rows: [["机械键盘 K87", "林同学 / 周同学", "¥169.00", "待付款"], ["高数辅导资料", "陈同学 / 王同学", "¥28.00", "交易完成"], ["宿舍小冰箱", "李同学 / 张同学", "¥240.00", "待发货"], ["蓝牙耳机", "赵同学 / 孙同学", "¥88.00", "待评价"]],
    products: [
      { title: "机械键盘 K87，成色很新，送键帽", price: "169.00", origin: "259.00", tag: "几乎全新", meta: "东校区 · 信用 96", color: "#fed7aa" },
      { title: "考研数学复习全套资料", price: "28.00", tag: "轻微使用痕迹", meta: "西校区 · 浏览 186", color: "#fde68a" },
      { title: "宿舍小冰箱，毕业转让", price: "240.00", origin: "399.00", tag: "明显使用痕迹", meta: "南湖校区 · 浏览 92", color: "#bfdbfe" },
      { title: "蓝牙耳机，续航正常", price: "88.00", tag: "几乎全新", meta: "北苑校区 · 浏览 71", color: "#ddd6fe" },
    ],
  },
  {
    slug: "clinic-appointment",
    title: "门诊预约挂号系统",
    shortTitle: "门诊预约",
    description: "复刻原项目白底青绿色医疗系统：横向导航、角色菜单、数据工作台、预约和排班表。",
    articleUrl: "/projects/clinic-appointment-reproduction/",
    projectUrl: "https://github.com/yishuo299/clinic-appointment",
    ui: "medical",
    accent: "#0d9488",
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "JWT", "Vue 3", "ECharts"],
    roles: [
      { key: "patient", label: "测试患者", name: "患者王明", active: "预约挂号", menu: ["预约挂号", "我的挂号", "我的病历"] },
      { key: "doctor", label: "测试医生", name: "李医生", active: "工作台", menu: ["工作台", "我的排班", "今日患者", "写病历", "开处方"] },
      { key: "admin", label: "测试管理员", name: "医务管理员", active: "工作台", menu: ["工作台", "科室管理", "医生管理", "排班管理", "挂号管理", "病历管理", "药品管理"] },
    ],
    cards: [["科室数量", "12", "#0d9488"], ["医生人数", "48", "#0ea5e9"], ["患者人数", "1,286", "#8b5cf6"], ["今日挂号", "214", "#f59e0b"]],
    panels: [{ title: "各科室就诊量对比", type: "chart" }, { title: "今日排班与号源", subtitle: "模拟排班剩余号源、预约状态与叫号队列", type: "table" }],
    columns: ["科室", "医生", "时段", "剩余号源"],
    rows: [["内科", "李医生", "08:00-10:00", "12"], ["儿科", "周医生", "10:00-12:00", "8"], ["口腔科", "陈医生", "14:00-16:00", "15"], ["外科", "王医生", "16:00-18:00", "6"]],
  },
  {
    slug: "library-management",
    title: "图书馆管理系统",
    shortTitle: "图书馆",
    description: "复刻原项目深蓝金色图书馆后台：左侧菜单、顶部标题、统计卡片、借阅趋势和管理表格。",
    articleUrl: "/projects/library-management-reproduction/",
    projectUrl: "https://github.com/yishuo299/library-management",
    ui: "library",
    accent: "#c9a227",
    stack: ["Spring Boot", "MySQL", "Vue 3", "Pinia", "Element Plus"],
    roles: [
      { key: "reader", label: "测试读者", name: "读者赵晴", active: "图书管理", menu: ["数据概览", "图书管理", "借阅管理", "预约管理", "罚金管理", "公告通知"] },
      { key: "librarian", label: "测试馆员", name: "馆员刘老师", active: "借阅管理", menu: ["数据概览", "图书管理", "借阅管理", "预约管理", "罚金管理", "分类管理", "读者管理"] },
      { key: "admin", label: "测试管理员", name: "系统管理员", active: "系统配置", menu: ["数据概览", "图书管理", "借阅管理", "预约管理", "分类管理", "读者管理", "系统配置"] },
    ],
    cards: [["馆藏图书(种)", "4,826"], ["馆藏副本(册)", "12,480"], ["注册读者", "1,936"], ["当前在借", "326"], ["逾期未还", "11"], ["未缴罚金(元)", "168"]],
    panels: [{ title: "近 12 个月借阅量趋势", type: "chart" }, { title: "热门图书借阅排行 Top 10", type: "table" }],
    columns: ["图书", "读者", "应还日期", "状态"],
    rows: [["数据库系统概论", "张同学", "09-28", "借阅中"], ["Java 编程思想", "李同学", "09-26", "即将到期"], ["Python 数据分析", "陈同学", "09-18", "已逾期"], ["软件工程", "王同学", "10-02", "已预约"]],
  },
  {
    slug: "movie-recommend",
    title: "智能电影推荐系统",
    shortTitle: "霓虹影院",
    description: "复刻原项目紫粉暗色影院界面：首页、为你推荐、收藏、数据大屏和管理后台。",
    articleUrl: "/projects/movie-recommend-reproduction/",
    projectUrl: "https://github.com/yishuo299/movie-recommend",
    ui: "movie",
    accent: "#a855f7",
    stack: ["Python", "Django", "MySQL", "协同过滤", "Vue 3", "Element Plus"],
    roles: [
      { key: "user", label: "测试用户", name: "影迷小许", active: "首页", menu: ["首页", "为你推荐", "我的收藏", "数据大屏"] },
      { key: "admin", label: "测试管理员", name: "影院管理员", active: "管理后台", menu: ["首页", "为你推荐", "我的收藏", "数据大屏", "电影管理", "类型管理", "影评审核"] },
    ],
    cards: [["电影条目", "2,436"], ["用户评分", "18,902"], ["推荐命中", "87%"], ["收藏行为", "6,218"]],
    panels: [{ title: "为你推荐", subtitle: "根据评分矩阵和相似用户生成推荐理由", type: "cards" }, { title: "推荐结果", type: "table" }],
    columns: ["电影", "类型", "预测分", "推荐理由"],
    rows: [["星际穿越", "科幻", "9.6", "相似用户喜欢"], ["盗梦空间", "悬疑", "9.4", "同类型偏好"], ["寻梦环游记", "动画", "9.2", "高分收藏"], ["楚门的世界", "剧情", "9.1", "评分相近"]],
  },
  {
    slug: "face-attendance",
    title: "人脸识别考勤系统",
    shortTitle: "人脸考勤",
    description: "复刻原项目黑蓝霓虹科技后台：人脸签到、录入、签到记录、请假审批和统计报表。",
    articleUrl: "/projects/face-attendance-reproduction/",
    projectUrl: "https://github.com/yishuo299/face-attendance",
    ui: "face",
    accent: "#00e5b0",
    stack: ["Python", "Flask", "OpenCV", "LBPH", "MySQL", "Vue 3"],
    roles: [
      { key: "student", label: "测试学生", name: "学生陈一", active: "人脸签到", menu: ["数据看板", "人脸签到", "签到记录", "请假审批"] },
      { key: "teacher", label: "测试教师", name: "教师周宁", active: "签到场次", menu: ["数据看板", "签到记录", "请假审批", "学生管理", "课程管理", "签到场次", "统计报表"] },
      { key: "admin", label: "测试管理员", name: "系统管理员", active: "系统日志", menu: ["数据看板", "人脸录入", "学生管理", "教师管理", "班级管理", "课程管理", "签到场次", "统计报表", "系统日志"] },
    ],
    cards: [["已录样本", "1,286"], ["今日签到", "342"], ["识别通过率", "96%"], ["请假待审", "7"]],
    panels: [{ title: "人脸签到扫描区", subtitle: "纯前端模拟扫描线与识别结果，不调用摄像头", type: "scan" }, { title: "考勤结果", type: "table" }],
    columns: ["学生", "课程", "时间", "状态"],
    rows: [["张同学", "软件工程", "08:03", "正常"], ["李同学", "数据库", "08:16", "迟到"], ["王同学", "计算机视觉", "未签到", "缺勤"], ["陈同学", "Python", "请假", "已请假"]],
  },
  {
    slug: "research-management",
    title: "高校科研管理系统",
    shortTitle: "科研管理",
    description: "复刻 Django 管理系统的服务端渲染风格：顶部导航、简洁表格、成果台账和导出入口。",
    articleUrl: "/projects/research-management-template-3/",
    projectUrl: "https://github.com/yishuo299/University_Research_Management_System",
    ui: "library",
    accent: "#2563eb",
    stack: ["Python", "Django", "MySQL", "Django Template", "Bootstrap"],
    roles: [
      { key: "secretary", label: "测试科研秘书", name: "科研秘书", active: "科研项目", menu: ["首页", "科研人员", "科研项目", "论文成果", "科研获奖", "科研著作"] },
      { key: "teacher", label: "测试教师", name: "教师用户", active: "论文成果", menu: ["首页", "个人资料", "科研项目", "论文成果", "获奖成果", "著作成果"] },
      { key: "admin", label: "测试管理员", name: "管理员", active: "用户管理", menu: ["首页", "用户管理", "科研人员", "科研项目", "成果管理", "数据导出"] },
    ],
    cards: [["科研人员", "184"], ["在研项目", "46"], ["论文成果", "312"], ["获奖著作", "79"], ["待审核", "12"], ["导出任务", "5"]],
    panels: [{ title: "科研成果台账", subtitle: "复刻管理系统表格、查询与导出结构", type: "table" }, { title: "成果分布统计", type: "chart" }],
    columns: ["成果名称", "负责人", "类别", "状态"],
    rows: [["智慧校园数据治理研究", "刘老师", "项目", "在研"], ["教学评价模型论文", "赵老师", "论文", "已发表"], ["高校科研平台设计", "钱老师", "著作", "归档中"], ["省级科研奖励", "孙老师", "获奖", "已审核"]],
  },
  {
    slug: "equipment-system",
    title: "装备全生命周期管理系统",
    shortTitle: "装备管理",
    description: "复刻原项目玻璃拟态装备后台：管理员、普通用户和维修人员三套工作台可切换。",
    articleUrl: "/projects/equipment-system-template-3/",
    projectUrl: "https://github.com/yishuo299/equipment-system",
    ui: "equipment",
    accent: "#4f46e5",
    stack: ["Spring Boot", "MyBatis", "MySQL", "Vue 3", "Element Plus"],
    roles: [
      { key: "admin", label: "测试管理员", name: "系统管理员", active: "流程审批", menu: ["装备入库", "流程审批", "生命周期监控", "人员档案"] },
      { key: "user", label: "测试普通用户", name: "普通用户", active: "我的申请", menu: ["装备库存查询", "我的申请进度", "持有的装备"] },
      { key: "worker", label: "测试维修人员", name: "维保工程师", active: "待办维修任务", menu: ["待办维修任务", "历史与报废"] },
    ],
    cards: [["装备总数", "623"], ["在用装备", "418"], ["维修中", "21"], ["待审批", "13"]],
    panels: [{ title: "流程审批", subtitle: "领用、维修、报废申请模拟审批", type: "table" }, { title: "装备健康度", type: "chart" }],
    columns: ["装备", "数字身份证", "状态", "健康度"],
    rows: [["光谱检测仪", "EQ-1024-2026", "库存", "96%"], ["便携终端", "EQ-2018-2026", "服役中", "82%"], ["温控设备", "EQ-3309-2026", "检修中", "64%"], ["老旧传感器", "EQ-0788-2026", "待报废", "18%"]],
  },
  {
    slug: "course-selection",
    title: "选课与成绩管理系统",
    shortTitle: "学苑通",
    description: "复刻原项目现代教学服务后台：深色侧边栏、顶部搜索、角色菜单、卡片和课表表格。",
    articleUrl: "/projects/course-selection-template-3/",
    projectUrl: "https://github.com/yishuo299/School_Course_Selection_Management_System",
    ui: "course",
    accent: "#6366f1",
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "Vue 3", "Element Plus"],
    roles: [
      { key: "student", label: "测试学生", name: "学生张一", active: "在线选课", menu: ["首页", "在线选课", "我的课表", "教学资料", "成绩查询", "教学评价", "个人信息"] },
      { key: "teacher", label: "测试教师", name: "教师李明", active: "成绩录入", menu: ["首页", "我的课程", "成绩录入", "教学资料", "个人信息"] },
      { key: "academic", label: "测试教务管理员", name: "教务管理员", active: "开课管理", menu: ["首页", "课程管理", "开课管理", "成绩审核", "成绩异议", "学籍管理", "年级专业", "选课控制"] },
      { key: "admin", label: "测试系统管理员", name: "系统管理员", active: "用户管理", menu: ["首页", "用户管理", "角色管理", "系统日志", "系统监控"] },
    ],
    cards: [["课程数量", "86"], ["选课记录", "1,248"], ["成绩录入", "72%"], ["权限角色", "4"]],
    panels: [{ title: "在线选课", subtitle: "复刻课程卡片、容量、时间冲突与选课状态", type: "cards" }, { title: "课程安排", type: "table" }],
    columns: ["课程", "教师", "容量", "状态"],
    rows: [["Java Web 开发", "王老师", "45/60", "可选"], ["数据库原理", "李老师", "60/60", "已满"], ["软件工程", "周老师", "38/50", "可选"], ["Python 程序设计", "陈老师", "52/55", "待开课"]],
  },
];

export const getProjectExperience = (slug: string) => projectExperiences.find((item) => item.slug === slug);
