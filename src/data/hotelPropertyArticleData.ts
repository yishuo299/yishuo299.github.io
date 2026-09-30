export const hotelBookingArticle = {
  slug: "hotel-booking-reproduction",
  projectUrl: "https://github.com/yishuo299/hotel-booking",
  eyebrow: "工程复现版 · Spring Boot",
  title: "酒店客房预订管理系统复现指南",
  intro: "这是一个面向酒店前台、管理员与住客的客房运营系统。项目不是简单的房间信息表，而是把房型定价、预订占房、办理入住、在店消费、退房结算、客房清洁和经营统计串成完整业务闭环。本文按数据模型、核心规则、关键实现和运行验证展开，读者可结合源码复现主要流程。",
  modules: [
    ["房型与客房", "维护床型、面积、设施、基础价格以及空闲、预订、入住、清洁、维护五种房态。"],
    ["预订中心", "支持创建、改期、取消、库存检查和半开日期区间冲突检测。"],
    ["入住与换房", "从有效预订办理入住，分配具体房间并保存换房轨迹和押金。"],
    ["消费与结算", "汇总逐日房费、餐饮/迷你吧/洗衣消费与押金，支持补收和部分退款。"],
    ["运营可视化", "用房态日历和五类 ECharts 报表呈现入住率、房型销量、营收、客源和消费构成。"]
  ],
  stack: ["JDK 8", "Spring Boot 2.7", "MyBatis-Plus", "MySQL", "JWT", "Apache POI", "Vue 3", "Pinia", "Element Plus", "ECharts", "Vite"],
  structure: `hotel-booking/
├─ backend/src/main/java/com/grad/hotel/
│  ├─ common/        # 统一响应、JWT、异常和 Excel
│  ├─ config/        # 拦截器与 Web 配置
│  ├─ entity/ mapper/
│  ├─ service/       # 预订、入住、计价和结算
│  └─ controller/
├─ backend/src/main/resources/application.yml
├─ frontend/src/     # Vue 页面、路由、状态与接口
├─ db/init.sql       # 11 张业务表和演示数据
└─ README.md`,
  run: [
    "准备 JDK 8+、Maven、Node.js 与 MySQL 8，执行 mysql -uroot -p < db/init.sql 初始化数据库。",
    "按 .env.example 在本机设置 HOTEL_DB_PASSWORD 和 HOTEL_JWT_SECRET；生产环境必须替换默认密钥。",
    "进入 frontend 执行 npm install 与 npm run build，产物会写入后端 static 目录。",
    "进入 backend 执行 mvn spring-boot:run，浏览器访问 http://localhost:8086/。",
    "依次验证新增预订、冲突拦截、办理入住、添加消费、账单预览、退房结算和完成清洁。"
  ],
  snippets: [
    ["JWT 请求拦截", "实现 HandlerInterceptor，从 Bearer 请求头验证令牌并写入线程上下文。", "后端据此识别当前角色，避免只靠前端菜单隐藏权限。", `String auth = request.getHeader("Authorization");
if (auth == null || !auth.startsWith("Bearer ")) return reject(response, "未登录");
DecodedJWT jwt = JwtUtil.verify(auth.substring(7));
UserContext.set(jwt.getClaim("userId").asLong(), jwt.getClaim("username").asString(),
        jwt.getClaim("role").asString(), jwt.getClaim("realName").asString(),
        jwt.getClaim("guestId").asLong());`],
    ["密钥外置", "使用 Spring 属性注入读取环境变量中的 JWT 密钥。", "公开仓库不再携带真实签名密钥，不同部署环境可独立配置。", `@Value("\${hotel.jwt-secret}")
public void setSecret(String value) {
    secret = value;
}`],
    ["半开区间冲突检测", "用 MyBatis-Plus 构造 a₁ < b₂ 且 a₂ < b₁ 的重叠条件。", "允许上一位住客退房当天被下一笔预订入住，同时阻止真正重叠的订单。", `new LambdaQueryWrapper<Booking>()
    .eq(Booking::getRoomId, roomId)
    .in(Booking::getStatus, ACTIVE_STATUS)
    .lt(Booking::getCheckInDate, checkOut)
    .gt(Booking::getCheckOutDate, checkIn);`],
    ["可用房库存", "查询房型下全部非维护房间，并逐间排除时间冲突。", "未指定房间时可自动找到可售库存，房型售罄会明确提示。", `for (Room room : rooms) {
    if (!hasConflict(room.getId(), checkIn, checkOut, excludeBookingId)) {
        available.add(room);
    }
}`],
    ["预订单号生成", "以日期前缀和当日序号生成可读业务编号。", "让前台能够按单号查询、核对和导出预订。", `String prefix = "BK" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
long count = bookingMapper.selectCount(new LambdaQueryWrapper<Booking>()
        .likeRight(Booking::getBookingNo, prefix));
return prefix + String.format("%04d", count + 1);`],
    ["办理入住事务", "在 @Transactional 方法中校验预订、创建入住记录并更新房间和预订状态。", "任一操作失败都会回滚，避免出现订单已入住但房态仍空闲。", `@Transactional
public CheckinRecord checkIn(CheckinDTO dto) {
    validateBooking(dto.getBookingId());
    CheckinRecord record = createRecord(dto);
    updateBookingStatus(dto.getBookingId(), "CHECKED_IN");
    roomService.updateStatus(dto.getRoomId(), "OCCUPIED");
    return record;
}`],
    ["换房留痕", "校验新房空闲后更新入住记录，并同步旧房和新房房态。", "支持前台处理噪声、设备故障等换房场景且保留审计信息。", `oldRoom.setStatus("CLEANING");
newRoom.setStatus("OCCUPIED");
record.setRoomId(dto.getNewRoomId());
record.setChangeRoomRemark(dto.getReason());`],
    ["动态日价优先", "先查价格日历，缺失时回退房型基础价。", "既能支持节假日和周末调价，也不会因单日价格未生成而无法结算。", `PriceCalendar p = findPrice(roomTypeId, date);
if (p != null) return p.getPrice();
RoomType roomType = roomTypeMapper.selectById(roomTypeId);
return roomType.getBasePrice();`],
    ["逐日累加房费", "遍历 [入住日, 退房日) 每个自然日累加价格。", "账单可展示每日明细，跨周末或节假日仍能正确计算。", `while (date.isBefore(checkOut)) {
    total = total.add(priceOf(roomTypeId, date));
    date = date.plusDays(1);
}`],
    ["周末与节日定价", "根据日期返回 1.25 或 1.50 的价格系数。", "批量生成价格日历时自动体现周末和国庆旺季策略。", `if (isHoliday(date)) return new BigDecimal("1.50");
int day = date.getDayOfWeek().getValue();
return (day == 6 || day == 7) ? new BigDecimal("1.25") : BigDecimal.ONE;`],
    ["结算公式", "用房费与附加消费相加，再扣除已收押金。", "正数表示补收、负数表示退款，前端预览后再确认结算。", `BigDecimal receivable = roomFee
        .add(consumptionAmount)
        .subtract(checkin.getDeposit());`],
    ["退房后的清洁任务", "结算成功后把房间置为待清洁并创建清洁记录。", "房间不会直接回到空闲，保洁完成后才重新可售。", `roomService.updateStatus(record.getRoomId(), "CLEANING");
cleaningService.createPending(record.getRoomId(), bill.getId());`],
    ["房态日历批量查询", "一次取出日期范围内的有效预订并按 roomId 分组。", "避免为每个单元格访问数据库，保证日历矩阵加载效率。", `List<Booking> bookings = bookingMapper.selectList(wrapper);
Map<Long, List<Booking>> byRoom = new HashMap<>();
for (Booking b : bookings) {
    byRoom.computeIfAbsent(b.getRoomId(), k -> new ArrayList<>()).add(b);
}`],
    ["Axios 统一鉴权", "请求拦截器自动写入酒店令牌，响应拦截器统一处理业务错误。", "页面只关注业务数据，登录过期时会清理状态并返回登录页。", `request.interceptors.request.use(config => {
  const token = localStorage.getItem('hotel_token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})`]
  ],
  result: "启动成功后，管理员和前台可以看到轻奢风经营工作台、房态日历、预订与在店客人数据；客人角色只能浏览房型、查看自己的预订和账单。建议以同一房间创建重叠预订验证冲突保护，再完成“预订—入住—添加迷你吧消费—账单预览—补收/退款—退房—清洁完成”全流程，并核对房态、账单、支付流水与报表同步变化。"
};

export const propertyManagementArticle = {
  slug: "property-management-reproduction",
  projectUrl: "https://github.com/yishuo299/property-management",
  eyebrow: "工程复现版 · Django",
  title: "社区物业管理与报修系统复现指南",
  intro: "本项目面向社区物业的日常运营，服务管理员、物业员工和业主三类用户。系统将楼栋—单元—房屋—业主的基础档案作为主数据，再连接报修、物业费、停车位、公告和访客业务。本文重点说明权限边界、报修状态机、账单计算与可验证的复现步骤。",
  modules: [
    ["房产与业主", "维护楼栋、单元、房屋和业主档案，支持一房多业主、绑定、解绑和过户历史。"],
    ["报修闭环", "业主提交工单，管理员派单，员工处理并完成，最终由业主评价。"],
    ["物业收费", "按房屋面积、单价和月份批量生成账单，支持去重、滞纳金与分次缴费。"],
    ["车位与访客", "车位绑定/释放与访客预约、进入、离开、取消均有明确状态约束。"],
    ["公告与统计", "发布公告、记录已读状态，并以八类图表呈现社区运营情况。"]
  ],
  stack: ["Python 3.11", "Django 5.2", "PyMySQL", "PyJWT", "openpyxl", "MySQL", "Vue 3", "Vue Router", "Pinia", "Element Plus", "ECharts", "Vite"],
  structure: `property-management/
├─ backend/
│  ├─ config/             # Django 设置与路由
│  ├─ apps/core/
│  │  ├─ models.py       # 15 张表模型
│  │  ├─ views_*.py      # 各业务接口
│  │  └─ utils.py        # JWT、分页、状态机、计费
│  └─ manage.py
├─ frontend/src/          # 三角色页面、接口、路由与状态
├─ db/init.sql
├─ .env.example
└─ README.md`,
  run: [
    "安装 Python 3.11、MySQL 8 和 Node.js，执行 mysql -uroot -p < db/init.sql。",
    "设置 PROPERTY_DB_PASSWORD、PROPERTY_DJANGO_SECRET_KEY 和 PROPERTY_JWT_SECRET；其余变量可参考 .env.example。",
    "后端安装 requirements.txt 后执行 python manage.py runserver 0.0.0.0:8004。",
    "前端执行 npm install 与 npm run dev，或使用 backend/static 中的构建产物。",
    "分别以管理员、物业员工和业主验证派单、处理、缴费、车位和访客状态流转。"
  ],
  snippets: [
    ["JWT 鉴权装饰器", "装饰器读取 Bearer token，解码后写入 request 上下文。", "所有需要登录的视图共享同一认证入口。", `def login_required(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        payload = decode_token(get_token(request))
        request.user_id = payload.get('user_id')
        request.role = payload.get('role')
        return view(request, *args, **kwargs)
    return wrapper`],
    ["角色授权", "在登录装饰器之上检查允许的角色列表。", "管理员、员工和业主即使知道接口地址也不能越权操作。", `def role_required(roles):
    def decorator(view):
        @wraps(view)
        @login_required
        def wrapper(request, *args, **kwargs):
            if request.role not in roles:
                return error('无权限访问该接口', 403)
            return view(request, *args, **kwargs)
        return wrapper
    return decorator`],
    ["报修状态机", "用字典声明每个状态允许到达的下一状态。", "阻止跳过派单、重复完成或修改终态工单。", `TRANSITIONS = {
    '待受理': {'已派单': '派单', '已驳回': '驳回', '已取消': '取消'},
    '已派单': {'处理中': '开始处理', '已取消': '取消'},
    '处理中': {'已完成': '完成维修'},
    '已完成': {'已评价': '业主评价'}
}`],
    ["统一工单流转", "_transition 先验角色和状态，再执行业务补充、保存状态并写操作记录。", "派单、处理、完成等动作共用一致的校验与时间线。", `allowed, msg = can_transition(order.status, target)
if not allowed:
    return error(msg)
if extra_save:
    extra_save(order)
order.status = target
order.save()
_add_record(order.id, request.user_id, operator_name, action_name, content)`],
    ["24 小时超时标记", "用数据库批量 UPDATE 标记超过期限仍待受理的工单。", "看板可直接筛选超时工单，无需逐条在 Python 中计算。", `deadline = now() - timedelta(hours=24)
RepairOrder.objects.filter(status='待受理', deleted=0,
    submit_time__lt=deadline, timeout_flag=0).update(timeout_flag=1)`],
    ["业主房屋权限", "提交报修前检查 OwnerRoom 的有效绑定。", "业主只能为本人名下房屋报修。", `if not OwnerRoom.objects.filter(owner_id=owner.id, room_id=room_id,
        deleted=0, status='有效').exists():
    return error('只能对本人名下房屋提交报修', 403)`],
    ["派单并记录受理", "管理员选择有效物业员工，同时写入受理和派单两条时间线记录。", "详情页能够还原工单从提交到处理人的完整过程。", `staff = SysUser.objects.filter(id=handler_id, role='STAFF', status=1).first()
order.handler_id = handler_id
order.accept_time = now()
order.assign_time = now()
_add_record(order.id, request.user_id, operator.real_name, '受理工单', '物业已受理')`],
    ["滞纳金计算", "按欠费金额、逾期天数和万分之五日费率计算。", "部分缴费后只对剩余欠款继续计算滞纳金。", `unpaid = Decimal(str(bill.amount)) - Decimal(str(bill.paid_amount))
return money(unpaid * Decimal('0.0005') * days_overdue(bill))`],
    ["账期截止日", "根据 YYYY-MM 计算当月最后一天。", "批量生成账单时自动得到统一的缴费截止日期。", `def period_due_date(period):
    y, m = int(period[:4]), int(period[5:7])
    nxt = date(y + 1, 1, 1) if m == 12 else date(y, m + 1, 1)
    return nxt - timedelta(days=1)`],
    ["车位绑定", "绑定前检查车位和业主，再写入租期与关联房屋。", "同一车位必须先释放才能重新分配。", `if obj.status == '已租':
    return error('该车位已绑定业主，请先释放')
obj.owner_id = owner_id
obj.room_id = room_id or None
obj.status = '已租'
obj.save()`],
    ["访客状态约束", "访客只能从待到访进入已到访，再登记离开。", "防止重复进场、未入场先离开等不合理操作。", `if obj.status != '待到访':
    return error('只有待到访的访客可以登记进入')
obj.status = '已到访'
obj.save()`],
    ["隐私字段脱敏", "手机号保留前三后四，身份证保留前六后四。", "面向不同角色返回业主资料时减少敏感信息暴露。", `def mask_phone(value):
    s = str(value).strip()
    return s[:3] + '****' + s[-4:] if len(s) == 11 else s

def mask_id_card(value):
    s = str(value).strip()
    return s[:6] + '*' * (len(s) - 10) + s[-4:]`],
    ["前端路由守卫", "从 localStorage 读取登录角色并检查路由 roles。", "角色切换后只显示和访问对应业务页面。", `router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')
  if (!localStorage.getItem('token')) return next('/login')
  if (to.meta.roles && !to.meta.roles.includes(userInfo?.role)) return next('/home')
  next()
})`],
    ["分页统一返回", "统一处理 current、size、total 和 records，并允许传入序列化函数。", "所有管理列表保持相同分页协议。", `def page_result(request, queryset, serializer=None):
    data = paginate(request, queryset)
    if serializer:
        data['records'] = [serializer(o) for o in data['records']]
    return ok(data)`]
  ],
  result: "复现完成后，管理员可维护社区基础档案并查看全局统计，物业员工可处理分配给自己的工单，业主可报修、查账缴费、查看车位、阅读公告和预约访客。建议先绑定业主与房屋，再按“提交报修—派单—开始处理—完成—评价”验证状态机；随后生成账单并分两次缴费，确认余额和状态同步；最后完成车位绑定/释放与访客进入/离开测试。"
};
