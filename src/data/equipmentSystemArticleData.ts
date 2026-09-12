export const projectUrl = "https://github.com/yishuo299/equipment-system";

export const modules = [
  ["登录与角色入口", "统一登录后按 ADMIN、WORKER、USER 三类角色进入不同页面。"],
  ["装备台账", "记录装备名称、数字身份、生产商、采购日期、报废日期、状态和当前使用人。"],
  ["申请审批", "普通用户提交领用或报废申请，管理员统一审批并改变装备状态。"],
  ["维修工单", "维修人员查看工单、更新进度，完工后恢复装备状态。"],
  ["生命周期监控", "根据剩余寿命和维护次数展示装备健康度，帮助管理者判断设备状态。"],
];

export const techStack = [
  ["Spring Boot", "负责后端 REST API、业务服务装配和项目启动。"],
  ["MyBatis", "通过注解 Mapper 完成 users、equipment、request、maintenance_record 等表的读写。"],
  ["MySQL", "保存用户、装备、审批申请和维修记录，是业务闭环的持久化基础。"],
  ["Vue 3", "负责登录页、管理员后台、维修人员工作站和普通用户中心。"],
  ["TypeScript", "让前端变量、接口数据和页面状态更清晰，降低维护成本。"],
  ["Element Plus", "提供表单、表格、标签、进度条、滑块、消息提示等后台管理组件。"],
  ["Axios", "封装前端 HTTP 请求，统一访问后端接口。"],
  ["Vue Router", "根据登录结果跳转到不同角色页面。"],
];

export const dataTables = [
  ["users", "保存账号、密码、姓名和角色，角色决定用户进入哪个工作界面。"],
  ["equipment", "保存装备主数据，包括数字身份编码、生命周期日期、状态和当前使用人。"],
  ["request", "保存领用申请和报废申请，管理员审批后驱动装备状态变化。"],
  ["maintenance_record", "保存维修人员、维修描述、进度、开始时间、结束时间和维修状态。"],
];

export const runSteps = [
  ["准备数据库", "安装 MySQL，确保本机可以连接。项目默认使用 equipment_ems 数据库，启动时可自动建表并写入演示数据。"],
  ["配置后端连接", "在 backend/src/main/resources/application.properties 中使用 DB_URL、DB_USERNAME、DB_PASSWORD 覆盖默认连接。"],
  ["启动后端", "进入 backend 目录执行 mvn spring-boot:run，服务默认运行在 8088 端口。"],
  ["配置前端接口", "复制 frontend/.env.example 为 .env，确认 VITE_API_BASE_URL 指向 http://localhost:8088/api。"],
  ["启动前端", "进入 frontend 目录执行 npm install 和 npm run dev，然后访问 Vite 输出的本地地址。"],
  ["验证流程", "使用 admin、worker1、user1 三类演示账号分别进入后台，跑通入库、申请、审批和维修进度更新。"],
];

export const codeSections = [
  {
    title: "后端启动入口",
    method: "使用 Spring Boot 的 @SpringBootApplication 作为自动配置入口。",
    purpose: "启动后会加载 Controller、Service、Mapper 等组件，并对外提供 REST 接口。",
    code: `@SpringBootApplication
public class EmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmsApplication.class, args);
    }
}`,
  },
  {
    title: "数据库连接环境化",
    method: "使用 Spring 属性占位符读取环境变量，并提供本地默认值。",
    purpose: "公开仓库不保存真实数据库密码，部署到不同电脑时也能通过环境变量切换数据库。",
    code: `spring.datasource.url=\${DB_URL:jdbc:mysql://localhost:3306/equipment_ems?...}
spring.datasource.username=\${DB_USERNAME:root}
spring.datasource.password=\${DB_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver`,
  },
  {
    title: "登录接口",
    method: "Controller 接收 JSON 请求体，再通过 UserMapper 查询账号并校验密码。",
    purpose: "完成系统入口认证，前端根据返回用户的 role 字段进入管理员、维修人员或普通用户页面。",
    code: `@PostMapping("/login")
public User login(@RequestBody User loginUser) {
    User user = userMapper.findByUsername(loginUser.getUsername());
    if (user != null && user.getPassword().equals(loginUser.getPassword())) {
        return user;
    }
    throw new RuntimeException("Invalid credentials");
}`,
  },
  {
    title: "角色路由跳转",
    method: "前端登录成功后把用户信息存入 localStorage，并根据 role 调用 router.push。",
    purpose: "让同一个登录页服务三类用户，减少重复入口，同时保持页面职责清晰。",
    code: `const user = res.data;
localStorage.setItem('user', JSON.stringify(user));

if (user.role === 'ADMIN') {
  router.push('/admin');
} else if (user.role === 'WORKER') {
  router.push('/worker');
} else {
  router.push('/user');
}`,
  },
  {
    title: "装备入库与数字身份生成",
    method: "在 Service 层组合生产商、当前日期和六位随机数，生成 digitalId。",
    purpose: "新增装备时自动得到唯一可追踪身份，同时设置采购日期、报废日期和初始库存状态。",
    code: `@Transactional
public void addEquipment(Equipment equipment) {
    String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    String randomStr = String.format("%06d", new Random().nextInt(1000000));
    String digitalId = equipment.getManufacturer() + dateStr + randomStr;

    equipment.setDigitalId(digitalId);
    equipment.setPurchaseDate(LocalDate.now());
    equipment.setScrapDate(LocalDate.now().plusYears(20));
    equipment.setStatus("STOCK");

    equipmentMapper.insert(equipment);
}`,
  },
  {
    title: "装备派生字段计算",
    method: "查询装备列表后，在 Service 层补充 remainingDays 和 maintenanceCount。",
    purpose: "前端无需再次计算剩余寿命和维修次数，生命周期监控页面可以直接展示健康度。",
    code: `public List<Equipment> findAll() {
    List<Equipment> list = equipmentMapper.findAll();
    for (Equipment e : list) {
        e.setRemainingDays(ChronoUnit.DAYS.between(LocalDate.now(), e.getScrapDate()));
        e.setMaintenanceCount(maintenanceRecordMapper.countByEquipmentId(e.getId()));
    }
    return list;
}`,
  },
  {
    title: "装备数据访问 Mapper",
    method: "使用 MyBatis 注解直接声明 SQL，避免额外 XML 配置。",
    purpose: "完成装备插入、查询、状态更新、库存统计和可领用类型查询。",
    code: `@Select("SELECT * FROM equipment WHERE status = 'STOCK'")
List<Equipment> findAvailable();

@Update("UPDATE equipment SET status = #{status}, current_user_id = #{currentUserId} WHERE id = #{id}")
void updateStatus(Equipment equipment);

@Select("SELECT COUNT(*) FROM equipment WHERE status = 'STOCK' AND name = #{name}")
int countAvailableByName(String name);`,
  },
  {
    title: "创建领用申请",
    method: "用户提交装备名称，后端创建 BORROW 类型申请并标记为 PENDING。",
    purpose: "把普通用户的领用行为变成可审批记录，避免直接修改装备状态。",
    code: `public void createBorrowRequest(Long userId, String equipmentName) {
    Request req = new Request();
    req.setUserId(userId);
    req.setEquipmentName(equipmentName);
    req.setType("BORROW");
    req.setStatus("PENDING");
    req.setRequestTime(LocalDateTime.now());
    requestMapper.insert(req);
}`,
  },
  {
    title: "审批领用申请",
    method: "使用 @Transactional 保证申请状态与装备状态同步更新。",
    purpose: "管理员批准后，系统从库存中找到对应名称的装备，绑定申请人并改为服役中。",
    code: `@Transactional
public void approveRequest(Long requestId) {
    Request req = requestMapper.findById(requestId);
    if (req == null || !"PENDING".equals(req.getStatus())) return;

    if ("BORROW".equals(req.getType())) {
        Equipment target = equipmentMapper.findAvailable().stream()
            .filter(e -> e.getName().equalsIgnoreCase(req.getEquipmentName()))
            .findFirst()
            .orElse(null);

        if (target != null) {
            target.setStatus("IN_USE");
            target.setCurrentUserId(req.getUserId());
            equipmentMapper.updateStatus(target);
            requestMapper.updateStatus(requestId, "APPROVED");
        }
    }
}`,
  },
  {
    title: "审批报废申请",
    method: "根据申请中的 equipmentId 查询装备，并把状态改为 SCRAPPED。",
    purpose: "使不可继续使用的装备退出服役状态，避免继续出现在可领用库存中。",
    code: `else if ("SCRAP".equals(req.getType())) {
    Equipment target = equipmentMapper.findById(req.getEquipmentId());
    if (target != null) {
        target.setStatus("SCRAPPED");
        target.setCurrentUserId(null);
        equipmentMapper.updateStatus(target);
        requestMapper.updateStatus(requestId, "APPROVED");
    }
}`,
  },
  {
    title: "创建维修工单",
    method: "维修记录创建时设置开始时间、初始状态和进度，并同步修改装备状态。",
    purpose: "让维修行为不仅停留在记录表中，也能实时影响装备台账里的当前状态。",
    code: `@Transactional
public void createMaintenanceRecord(MaintenanceRecord record) {
    record.setStartTime(LocalDateTime.now());
    record.setStatus("PENDING");
    record.setProgress(0);
    maintenanceRecordMapper.insert(record);

    Equipment equipment = equipmentMapper.findById(record.getEquipmentId());
    if (equipment != null) {
        equipment.setStatus("MAINTENANCE");
        equipmentMapper.updateStatus(equipment);
    }
}`,
  },
  {
    title: "维修进度更新",
    method: "前端传入 progress 和 status，后端在完工时写入 endTime。",
    purpose: "维修人员拖动进度条即可更新工单；完工后装备恢复到 IN_USE 状态。",
    code: `@Transactional
public void updateProgress(Long id, int progress, String status) {
    MaintenanceRecord record = maintenanceRecordMapper.findById(id);
    if (record == null) return;

    record.setProgress(progress);
    record.setStatus(status);
    if (progress == 100 || "COMPLETED".equals(status)) {
        record.setEndTime(LocalDateTime.now());
        record.setStatus("COMPLETED");

        Equipment equipment = equipmentMapper.findById(record.getEquipmentId());
        if (equipment != null) {
            equipment.setStatus("IN_USE");
            equipmentMapper.updateStatus(equipment);
        }
    }
    maintenanceRecordMapper.updateProgress(record);
}`,
  },
  {
    title: "前端 Axios 配置",
    method: "使用 Vite 环境变量配置接口基础地址。",
    purpose: "开发、部署或更换后端地址时，只需要修改 .env，不需要改源码。",
    code: `const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api',
    timeout: 5000
});`,
  },
  {
    title: "库存查询与申请领用",
    method: "普通用户选择装备类型后调用库存接口，再提交 BORROW 申请。",
    purpose: "把“先查库存、再申请、等审批”的业务动作完整串起来。",
    code: `const checkStock = async () => {
  if (!selectedType.value) return;
  const res = await api.get(\`/equipment/stock/\${selectedType.value}\`);
  stock.value = res.data;
};

const applyBorrow = async () => {
  await api.post('/requests/borrow', {
    userId: user.id,
    equipmentName: selectedType.value
  });
};`,
  },
  {
    title: "前端健康度计算",
    method: "按剩余天数除以 20 年总天数得到百分比。",
    purpose: "管理员和用户可以通过进度条直观看到装备距离报废还有多远。",
    code: `const calculateHealth = (row: any) => {
  return Math.max(0, Math.min(100, Math.floor((row.remainingDays / (20 * 365)) * 100)));
};`,
  },
];

export const resultItems = [
  ["管理员后台", "可以完成装备入库、待审批申请处理、装备生命周期监控和用户档案查看。"],
  ["普通用户中心", "可以查询可用装备类型、查看库存、提交领用申请、查看个人申请状态和持有装备。"],
  ["维修人员工作站", "可以查看待办维修任务，使用滑块更新进度，一键完工后同步更新装备状态。"],
  ["数据库结果", "users、equipment、request、maintenance_record 四张表能覆盖账号、装备、申请和维修记录。"],
];
