export const projectUrl = "https://github.com/yishuo299/parking-management";

export const modules = [
  ["角色权限", "管理员、收费员、车主三类角色，前端控制菜单，后端按 URL 前缀拦截校验。"],
  ["车位管理", "维护停车区域、车位编号、车位类型和空闲/占用/预约/维修状态。"],
  ["进出场业务", "支持车辆入场登记、防重复在场、出场预结算和收费确认。"],
  ["计费规则", "按车位类型配置免费时长、首小时、后续小时、封顶价与夜间折扣。"],
  ["卡片业务", "支持月卡抵扣、储值卡扣费、充值续费和车主自助查看。"],
  ["统计报表", "统计收入趋势、分时车流、车位类型、周转率和支付方式分布。"],
];

export const dataTables = [
  ["sys_user", "用户与角色，包含 ADMIN、OPERATOR、OWNER。"],
  ["parking_area", "停车区域，如地上区、地下区、新能源区。"],
  ["parking_space", "车位表，记录车位编号、类型、状态和当前车牌。"],
  ["parking_record", "车辆进出场记录，是入场、计费、结算的核心表。"],
  ["billing_rule", "按车位类型维护阶梯计费规则。"],
  ["month_card / stored_value_card", "月卡和储值卡，用于出场结算优惠与扣费。"],
  ["payment_record", "缴费流水，记录实际收款方式、金额和操作员。"],
  ["notice / sys_config", "公告与系统参数配置。"],
];

export const techStack = [
  ["Spring Boot 2.7.18", "负责 REST 接口、鉴权拦截、业务服务和静态前端托管。"],
  ["MyBatis-Plus", "负责实体映射、分页查询、逻辑删除和基础 CRUD。"],
  ["MySQL 8/9", "保存用户、车位、车辆、进出场记录、卡片和缴费流水。"],
  ["JWT", "登录后签发 Token，请求时由拦截器解析并写入用户上下文。"],
  ["Vue 3 + Vite", "构建单页应用，生产环境打包到后端 static 目录。"],
  ["Element Plus + ECharts", "实现后台表格、表单、弹窗、统计图表和运营仪表盘。"],
];

export const runSteps = [
  ["准备环境", "安装 JDK 1.8、Maven 3.6+、Node.js 18+ 和 MySQL 8/9。"],
  ["初始化数据库", "进入 db 目录执行 init.sql，创建 parking_management 数据库和演示数据。"],
  ["配置连接", "在 application.yml 或环境变量中设置数据库账号、密码和 JWT 密钥。"],
  ["构建前端", "进入 frontend 执行 npm install 与 npm run build，产物会写入后端 static。"],
  ["启动后端", "进入 backend 执行 mvn spring-boot:run，访问 http://localhost:8084/。"],
  ["验证流程", "依次使用管理员、收费员、车主账号验证车位地图、入场、结算、卡片和报表。"],
];

export const codeSections = [
  {
    title: "1. 公开仓库安全配置",
    method: "数据库账号、密码和 JWT 密钥使用环境变量覆盖。",
    purpose: "避免把本地密码或固定密钥写进 GitHub 仓库。",
    code: `spring:
  datasource:
    url: jdbc:mysql://localhost:3306/parking_management?serverTimezone=Asia/Shanghai
    username: \${PARKING_DB_USERNAME:root}
    password: \${PARKING_DB_PASSWORD:your_password}

parking:
  jwt:
    secret: \${PARKING_JWT_SECRET:please-change-this-secret}`,
  },
  {
    title: "2. JWT 登录令牌生成",
    method: "登录成功后把 userId、username、role 写入 Token。",
    purpose: "后续接口不再依赖 Session，前后端分离部署也能保持登录状态。",
    code: `public String createToken(Long userId, String username, String role) {
  return JWT.create()
    .withClaim("userId", userId)
    .withClaim("username", username)
    .withClaim("role", role)
    .withExpiresAt(DateUtil.offsetHour(new Date(), expireHours))
    .sign(Algorithm.HMAC256(secret));
}`,
  },
  {
    title: "3. 后端角色拦截",
    method: "拦截器读取 Authorization，按接口前缀判断角色是否允许访问。",
    purpose: "防止只靠前端隐藏菜单导致越权访问。",
    code: `if (uri.startsWith("/api/admin/") && !"ADMIN".equals(role)) {
  response.setStatus(403);
  return false;
}
if (uri.startsWith("/api/operator/")
    && !("ADMIN".equals(role) || "OPERATOR".equals(role))) {
  response.setStatus(403);
  return false;
}`,
  },
  {
    title: "4. Vue 路由权限守卫",
    method: "路由 meta.roles 声明允许角色，跳转前从 localStorage 读取登录信息。",
    purpose: "让不同角色进入系统后看到对应页面，减少误操作入口。",
    code: `router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const info = JSON.parse(localStorage.getItem('userInfo') || 'null')
  const role = info ? info.role : ''
  if (!token) return next('/login')
  if (to.meta.roles && to.meta.roles.indexOf(role) === -1) return next('/')
  next()
})`,
  },
  {
    title: "5. 车牌规范化",
    method: "去掉分隔符、空格并统一大写，展示时再补回 ·。",
    purpose: "保证月卡、储值卡、进出场记录按同一个车牌键匹配。",
    code: `public static String normalize(String plateNo) {
  if (plateNo == null) return "";
  return plateNo.replace("·", "")
    .replace("-", "")
    .replace(" ", "")
    .trim()
    .toUpperCase();
}`,
  },
  {
    title: "6. 车牌查询 SQL 规范形",
    method: "数据库列和查询入参同时规范化后比较。",
    purpose: "兼容历史数据中带 · 或空格的车牌，避免查不到卡片和记录。",
    code: `public static String normColumn(String column) {
  return "REPLACE(REPLACE(REPLACE(UPPER(" + column + "), '·', ''), '-', ''), ' ', '')";
}`,
  },
  {
    title: "7. 入场登记校验",
    method: "登记前检查车牌格式、是否已经在场、车位是否空闲。",
    purpose: "避免同一车辆重复入场，避免多个车辆占用同一车位。",
    code: `String plateNo = PlateUtil.normalize(dto.getPlateNo());
if (!PlateUtil.valid(plateNo)) throw new BizException("车牌号格式不正确");
Long exists = recordMapper.selectCount(new LambdaQueryWrapper<ParkingRecord>()
  .eq(ParkingRecord::getPlateNo, plateNo)
  .eq(ParkingRecord::getStatus, "PARKING"));
if (exists > 0) throw new BizException("该车辆已在场");`,
  },
  {
    title: "8. 阶梯计费核心",
    method: "先扣除免费分钟，再按向上取整小时计费，最后应用封顶价。",
    purpose: "停车计费要对真实停放时长精确到分钟，同时满足常见停车场规则。",
    code: `long billableMinutes = Math.max(0, durationMinutes - rule.getFreeMinutes());
long hours = (long) Math.ceil(billableMinutes / 60.0);
BigDecimal amount = hours <= 0 ? BigDecimal.ZERO : rule.getFirstHourPrice()
  .add(rule.getNextHourPrice().multiply(BigDecimal.valueOf(Math.max(0, hours - 1))));
if (rule.getDailyCap() != null) amount = amount.min(rule.getDailyCap());`,
  },
  {
    title: "9. 夜间时段判断",
    method: "普通时段用 start <= t < end，跨零点用 t >= start || t < end。",
    purpose: "夜间折扣常常跨过 00:00，必须单独处理，否则凌晨费用会算错。",
    code: `private boolean isNight(LocalTime t, LocalTime start, LocalTime end) {
  if (start.equals(end)) return false;
  if (start.isBefore(end)) {
    return !t.isBefore(start) && t.isBefore(end);
  }
  return !t.isBefore(start) || t.isBefore(end);
}`,
  },
  {
    title: "10. 出场结算优先级",
    method: "先查有效月卡，再查储值卡余额，最后使用现金或扫码。",
    purpose: "把停车费、优惠金额、实付金额和支付方式落到同一条流水。",
    code: `if (validMonthCard != null) {
  payType = "MONTH_CARD";
  actualAmount = BigDecimal.ZERO;
} else if (storedCard != null && storedCard.getBalance().compareTo(amount) >= 0) {
  payType = "BALANCE";
  storedCard.setBalance(storedCard.getBalance().subtract(amount));
} else {
  payType = dto.getPayType(); // CASH / SCAN
}`,
  },
  {
    title: "11. 出场后释放车位",
    method: "结算完成后更新 parking_record，同时把 space 状态改回 FREE。",
    purpose: "保证车位地图和后续入场登记能立即反映真实占用状态。",
    code: `record.setExitTime(LocalDateTime.now());
record.setStatus("PAID");
recordMapper.updateById(record);

space.setStatus("FREE");
space.setCurrentPlateNo(null);
spaceMapper.updateById(space);`,
  },
  {
    title: "12. 前端请求拦截",
    method: "Axios 请求前自动添加 Bearer Token，响应异常时统一提示。",
    purpose: "所有页面复用同一套接口调用规则，减少重复代码。",
    code: `request.interceptors.request.use(config => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = 'Bearer ' + t
  return config
})`,
  },
];

export const resultItems = [
  ["登录与权限", "管理员可以进入系统参数、用户权限和区域车位；收费员可以进行入场与结算；车主只能查看自己的车辆、卡包和停车记录。"],
  ["车位地图", "页面按区域展示车位，空闲、占用、预约、维修状态颜色不同，点击车位可查看车牌与车位类型。"],
  ["入场登记", "输入车牌并选择空闲车位后，会生成在场记录，同时车位状态变为 OCCUPIED。"],
  ["出场结算", "选择在场车辆后可预览停车时长、应付金额、优惠金额和支付方式，确认后生成缴费流水。"],
  ["卡片业务", "月卡在有效期内可直接抵扣停车费，储值卡余额充足时自动扣费，余额不足会降级为现金或扫码。"],
  ["统计报表", "运营端可以查看收入趋势、车流高峰、车位类型占比、区域周转率和支付方式分布。"],
];
