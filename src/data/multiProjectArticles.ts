export const multiProjectArticles = [
  {
    slug: "campus-marketplace-reproduction",
    projectUrl: "https://github.com/yishuo299/campus-marketplace",
    eyebrow: "工程复现版 · Spring Boot",
    title: "校园二手交易平台复现说明",
    intro: "校园二手交易平台面向高校闲置物品交易场景，使用 Spring Boot 与 Vue 3 实现商品发布、浏览筛选、收藏、下单、钱包支付、订单状态流转、评价和后台管理。复现这个项目时，应先理解“商品—订单—钱包—评价”的业务闭环，再按数据库、接口、前端页面的顺序运行。",
    modules: [
      ["商品中心", "商品发布、图片、分类、搜索、筛选、详情和浏览量统计。"],
      ["订单中心", "创建订单、取消、付款、发货、收货、完成和退款状态流转。"],
      ["钱包流水", "充值、支付、收款、退款、手续费和交易流水记录。"],
      ["评价信用", "订单完成后评价商品与卖家，并动态计算卖家信用分。"],
      ["后台管理", "管理员维护用户、商品、订单、分类和统计看板。"],
    ],
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "JWT", "Vue 3", "Pinia", "Element Plus", "ECharts"],
    structure: `campus-marketplace/
├─ backend/src/main/java/com/grad/market/
│  ├─ controller/
│  ├─ service/
│  ├─ mapper/
│  ├─ entity/
│  └─ common/
├─ frontend/src/
├─ db/init.sql
└─ README.md`,
    run: [
      "使用 MySQL 导入 db/init.sql。",
      "按需通过 DB_URL、DB_USERNAME、DB_PASSWORD、JWT_SECRET 配置后端。",
      "进入 frontend 执行 npm install 与 npm run build。",
      "进入 backend 执行 mvn spring-boot:run。",
      "访问 http://localhost:8083/，用初始化账号验证购买、支付、发货和评价流程。",
    ],
    snippets: [
      ["JWT 配置", "使用 Spring 属性注入读取密钥和过期时间。", "为登录后的接口访问提供令牌签发与校验基础。", `@Value("\${market.jwt.secret}")\nprivate String secret;\n\n@Value("\${market.jwt.expire-hours}")\nprivate Long expireHours;`],
      ["登录拦截器", "通过 HandlerInterceptor 解析 Authorization 请求头。", "拦截未登录请求，并把当前用户写入 UserContext。", `String token = request.getHeader("Authorization");\nDecodedJWT jwt = jwtUtil.verify(token);\nUserContext.setUserId(jwt.getClaim("userId").asLong());`],
      ["统一返回结构", "使用 Result.success / Result.fail 包装接口响应。", "前端能够统一读取 code、message 和 data。", `public static <T> Result<T> success(T data) {\n    return new Result<>(200, "success", data);\n}`],
      ["商品分页查询", "使用 MyBatis-Plus Page 与条件 Wrapper。", "支撑首页分类、关键词、价格区间和排序筛选。", `Page<Product> page = productMapper.selectPage(new Page<>(current, size), wrapper);`],
      ["创建订单前校验", "在 Service 层校验商品、卖家和库存。", "避免用户购买自己的商品或购买无库存商品。", `if (product.getSellerId().equals(userId)) {\n    throw new BusinessException("不能购买自己发布的商品");\n}`],
      ["库存防超卖", "使用条件 UPDATE 扣减库存，并检查影响行数。", "并发下只有库存充足的请求能成功创建订单。", `int rows = productMapper.decreaseStock(productId, quantity);\nif (rows == 0) throw new BusinessException("库存不足");`],
      ["订单状态机", "定义允许的状态跳转并拒绝非法跳转。", "保证订单只能按待付款、待发货、待收货、已完成等规则流转。", `if (!allowedTransitions.get(oldStatus).contains(newStatus)) {\n    throw new BusinessException("非法的状态跳转");\n}`],
      ["钱包事务", "使用 @Transactional 包裹扣款、收款、手续费和订单更新。", "任一步失败都会回滚，避免余额和订单状态不一致。", `@Transactional\npublic void pay(Long orderId, Long buyerId) {\n    walletMapper.decrease(buyerId, amount);\n    walletMapper.increase(sellerId, income);\n    orderMapper.updateStatus(orderId, PAID);\n}`],
      ["收藏切换", "先查询收藏记录，再决定新增或取消。", "让商品详情页的收藏按钮保持幂等体验。", `Favorite favorite = favoriteMapper.find(userId, productId);\nif (favorite == null) favoriteMapper.insert(entity);\nelse favoriteMapper.deleteById(favorite.getId());`],
      ["信用分计算", "根据卖家评分平均值换算百分制信用分。", "评价完成后卖家信用动态变化。", `BigDecimal avg = evaluationMapper.avgSellerScore(sellerId);\nuserMapper.updateCreditScore(sellerId, avg.multiply(new BigDecimal("20")));`],
      ["前端请求封装", "Axios 拦截器自动携带 token。", "页面调用接口时无需重复写鉴权头。", `request.interceptors.request.use(config => {\n  config.headers.Authorization = userStore.token\n  return config\n})`],
      ["后台图表", "用 ECharts 渲染统计看板。", "管理员可以直观看到交易、订单和用户数据。", `chart.setOption({ xAxis: { data: labels }, series: [{ type: 'bar', data: values }] })`],
    ],
    result: "运行后可以完成从商品发布、买家下单、钱包付款、卖家发货、买家确认收货到评价的完整交易流程，管理员后台可以查看用户、商品、订单和统计数据。",
  },
  {
    slug: "clinic-appointment-reproduction",
    projectUrl: "https://github.com/yishuo299/clinic-appointment",
    eyebrow: "工程复现版 · Spring Boot",
    title: "门诊预约挂号系统复现说明",
    intro: "门诊预约挂号系统模拟医院线上挂号流程，覆盖科室、医生、排班、预约、叫号、病历、处方、缴费和统计看板。项目的关键不是单个 CRUD，而是号源扣减、预约队列和就诊状态之间的数据联动。",
    modules: [
      ["科室医生", "维护科室、医生、职称、擅长领域和挂号费。"],
      ["排班号源", "按日期和时段维护排班、总号源、剩余号源与停诊状态。"],
      ["预约叫号", "患者预约后生成排队号，医生端推进就诊状态。"],
      ["病历处方", "医生填写病历并开具处方，系统自动计算处方费用。"],
      ["统计看板", "展示预约趋势、科室就诊量和医生工作量排行。"],
    ],
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "JWT", "Vue 3", "Element Plus", "ECharts"],
    structure: `clinic-appointment/
├─ backend/src/main/java/com/grad/clinic/
│  ├─ controller/
│  ├─ service/
│  ├─ mapper/
│  └─ entity/
├─ frontend/src/
└─ db/init.sql`,
    run: ["导入 db/init.sql。", "配置 DB_URL、DB_USERNAME、DB_PASSWORD、JWT_SECRET。", "构建前端。", "运行后端并访问 8082。", "使用患者账号预约，再用医生账号叫号和填写病历。"],
    snippets: [
      ["JWT 拦截", "从请求头解析 token。", "保护医生、患者和管理员接口。", `String token = request.getHeader("Authorization");\nLong userId = jwtUtil.getUserId(token);\nUserContext.set(userId);`],
      ["角色校验", "后端根据用户角色判断接口权限。", "防止前端菜单绕过后直接访问管理接口。", `if (!"ADMIN".equals(user.getRole())) {\n    throw new BusinessException("无权限访问");\n}`],
      ["排班实体", "Schedule 保存日期、时段、医生、号源数。", "预约业务以排班为核心资源。", `private LocalDate scheduleDate;\nprivate String period;\nprivate Integer total;\nprivate Integer remain;`],
      ["批量排班", "接收日期范围与医生列表批量插入。", "减少管理员逐条创建排班的工作量。", `for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {\n    scheduleMapper.insert(buildSchedule(d, dto));\n}`],
      ["号源原子扣减", "使用 remain > 0 的条件更新。", "并发预约时从数据库层面避免超卖。", `int rows = scheduleMapper.decreaseRemain(scheduleId);\nif (rows == 0) throw new BusinessException("号源已满");`],
      ["重复预约校验", "查询患者同一排班是否已有有效预约。", "避免同一个患者重复占用同一时段。", `if (appointmentMapper.exists(patientId, scheduleId)) {\n    throw new BusinessException("不能重复预约");\n}`],
      ["自动排队号", "读取当前排班最大排队号后加一。", "医生端叫号队列可以按序推进。", `Integer queueNo = appointmentMapper.maxQueueNo(scheduleId) + 1;`],
      ["取消预约释放号源", "取消预约与号源回补放在事务中。", "保证预约状态和排班剩余号源一致。", `appointmentMapper.cancel(id);\nscheduleMapper.increaseRemain(scheduleId);`],
      ["病历关联预约", "MedicalRecord 保存 appointmentId。", "病历能够追溯到具体患者和就诊记录。", `record.setAppointmentId(appointmentId);\nmedicalRecordMapper.insert(record);`],
      ["处方金额计算", "遍历处方明细数量和单价求和。", "收费页面可以直接读取应缴金额。", `BigDecimal total = items.stream()\n  .map(i -> i.getPrice().multiply(new BigDecimal(i.getQuantity())))\n  .reduce(BigDecimal.ZERO, BigDecimal::add);`],
      ["统计接口", "按科室、日期或医生聚合预约记录。", "ECharts 图表直接消费后端统计结果。", `List<Map<String,Object>> rows = statsMapper.departmentVisits();`],
      ["前端分步预约", "用步骤条保存科室、医生、排班选择。", "患者按向导式流程完成挂号。", `activeStep.value++\nform.scheduleId = selectedSchedule.id`],
    ],
    result: "运行后患者可以完成分步预约，医生可以叫号、填写病历和处方，管理员可以维护基础数据并查看统计图表。",
  },
  {
    slug: "library-management-reproduction",
    projectUrl: "https://github.com/yishuo299/library-management",
    eyebrow: "工程复现版 · Spring Boot",
    title: "图书馆管理系统复现说明",
    intro: "图书馆管理系统围绕图书、读者、借阅、预约、罚款、公告和系统配置构建信息管理流程。复现时重点关注库存与借阅记录的联动，以及逾期、续借、预约等规则如何落到数据库状态上。",
    modules: [["图书管理", "维护图书、分类、库存、封面和状态。"], ["读者管理", "维护读者信息、借阅状态和账号资料。"], ["借阅归还", "处理借书、还书、续借和逾期。"], ["预约罚款", "处理图书预约和逾期罚款。"], ["系统配置", "维护借阅天数、续借次数和罚款规则。"]],
    stack: ["Spring Boot", "MyBatis-Plus", "MySQL", "Vue 3", "Pinia", "Element Plus"],
    structure: `library-management/
├─ backend/src/main/java/com/grad/library/
├─ frontend/src/
└─ db/init.sql`,
    run: ["导入 db/init.sql。", "配置 DB_URL、DB_USERNAME、DB_PASSWORD。", "构建前端并启动后端。", "访问 8081 并验证图书借阅、归还和罚款流程。"],
    snippets: [
      ["数据源配置", "application.yml 使用环境变量覆盖数据库连接。", "公开仓库不保存本地密码。", `url: \${DB_URL:jdbc:mysql://localhost:3306/lib_management?...}\nusername: \${DB_USERNAME:root}\npassword: \${DB_PASSWORD:}`],
      ["图书分页", "按分类、关键词和状态构造查询条件。", "支撑图书列表的筛选和分页。", `Page<Book> page = bookMapper.selectPage(new Page<>(current, size), wrapper);`],
      ["库存校验", "借书前检查可借数量。", "避免库存不足时生成借阅记录。", `if (book.getAvailableCount() <= 0) throw new BusinessException("库存不足");`],
      ["借阅记录", "创建 Borrow 记录并写入应还日期。", "系统通过记录表追踪读者借阅历史。", `borrow.setDueDate(LocalDate.now().plusDays(config.getBorrowDays()));`],
      ["扣减库存", "借书成功后减少可借数量。", "保证图书台账和借阅记录一致。", `bookMapper.decreaseAvailable(bookId);`],
      ["归还图书", "归还时更新 returnTime 与状态。", "借阅记录从借出变为已归还。", `borrow.setReturnTime(LocalDateTime.now());\nborrow.setStatus("RETURNED");`],
      ["逾期罚款", "根据逾期天数和每日罚款配置计算金额。", "自动生成罚款或展示应缴金额。", `long days = ChronoUnit.DAYS.between(dueDate, LocalDate.now());\nBigDecimal fine = rate.multiply(new BigDecimal(days));`],
      ["续借规则", "检查续借次数和当前状态。", "避免无限续借或已逾期记录继续续借。", `if (borrow.getRenewCount() >= config.getMaxRenew()) throw new BusinessException("超过续借次数");`],
      ["预约记录", "库存不足时读者可以预约图书。", "有书归还后可按预约顺序处理。", `reservationMapper.insert(new Reservation(readerId, bookId));`],
      ["公告管理", "后台维护通知标题、内容和状态。", "首页或公告页可以展示图书馆通知。", `noticeMapper.insert(notice);`],
      ["前端请求封装", "Axios 统一处理响应和错误提示。", "页面代码只关注业务数据。", `const { data } = await request.get('/book/page', { params })`],
    ],
    result: "运行后可以完成图书维护、读者维护、借书、还书、续借、预约、罚款和公告管理等图书馆常见流程。",
  },
  {
    slug: "movie-recommend-reproduction",
    projectUrl: "https://github.com/yishuo299/movie-recommend",
    eyebrow: "工程复现版 · Django",
    title: "智能电影推荐系统复现说明",
    intro: "智能电影推荐系统用 Django 管理电影、用户、评分、评论和收藏数据，再根据用户行为进行协同过滤推荐。项目适合展示 Python Web 与数据分析算法如何结合。",
    modules: [["电影资料", "维护电影、类型、演员、导演、海报和基础评分。"], ["用户互动", "评分、评论、收藏形成用户偏好数据。"], ["推荐算法", "根据评分矩阵计算相似度并返回推荐电影。"], ["后台管理", "维护电影、类型、人物、评论和用户。"], ["统计看板", "展示评分、类型和用户行为数据。"]],
    stack: ["Python", "Django", "MySQL", "PyMySQL", "JWT", "Vue 3", "Element Plus", "ECharts"],
    structure: `movie-recommend/
├─ backend/apps/
│  ├─ account/
│  ├─ movie/
│  ├─ interact/
│  ├─ recommend/
│  └─ stats/
├─ frontend/src/
└─ db/init.sql`,
    run: ["导入 db/init.sql。", "配置 Django、MySQL 和 JWT 环境变量。", "安装 backend/requirements.txt。", "运行 python manage.py runserver 0.0.0.0:8002。", "访问系统并进行评分、收藏和推荐验证。"],
    snippets: [
      ["Django 环境配置", "从环境变量读取 SECRET_KEY、DEBUG 和 ALLOWED_HOSTS。", "公开仓库不保存真实密钥。", `SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'local-dev')\nDEBUG = os.environ.get('DJANGO_DEBUG', 'True').lower() == 'true'`],
      ["MySQL 配置", "使用 PyMySQL 作为 MySQLdb 兼容层。", "Django ORM 可以连接 MySQL。", `import pymysql\npymysql.install_as_MySQLdb()`],
      ["JWT 配置", "推荐系统单独配置 JWT_SECRET 和过期时间。", "前端登录后携带 token 访问接口。", `JWT_SECRET = os.environ.get('JWT_SECRET', 'movie-recommend-local-dev-jwt-secret')`],
      ["统一响应", "封装 success/error 响应结构。", "前端可以统一处理 code、message 和 data。", `return JsonResponse({'code': 200, 'message': 'success', 'data': data})`],
      ["登录接口", "查询用户并校验密码。", "登录成功后返回 token 和用户信息。", `user = User.objects.filter(username=username).first()\nif not user or user.password != md5(password):\n    return error('用户名或密码错误')`],
      ["电影列表", "按关键词、类型和分页条件查询电影。", "支撑首页搜索和后台管理。", `movies = Movie.objects.filter(title__icontains=keyword)[offset:offset + size]`],
      ["评分记录", "用户评分写入评分表。", "推荐算法以评分矩阵为重要输入。", `Rating.objects.update_or_create(user_id=uid, movie_id=mid, defaults={'score': score})`],
      ["收藏切换", "检查收藏是否存在后新增或删除。", "构建用户偏好信号。", `Favorite.objects.get_or_create(user_id=uid, movie_id=mid)`],
      ["相似度计算", "根据共同评分电影计算余弦相似度。", "找到与当前用户口味接近的其他用户。", `sim = dot(vec_a, vec_b) / (norm(vec_a) * norm(vec_b))`],
      ["推荐结果排序", "按预测分或加权分排序。", "优先推荐当前用户未看过且相似用户喜欢的电影。", `candidates.sort(key=lambda x: x['score'], reverse=True)`],
      ["推荐理由", "根据相似用户或相同类型生成文字理由。", "让推荐结果更容易理解。", `reason = f"因为你喜欢《{base_movie.title}》，所以推荐《{movie.title}》"`],
      ["CSV 导出", "前端 Blob 生成 CSV。", "无需后端文件流接口即可导出表格。", `const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })`],
    ],
    result: "运行后用户可以浏览电影、评分、评论、收藏并获得推荐，管理员可以维护电影资料和查看数据统计。",
  },
  {
    slug: "face-attendance-reproduction",
    projectUrl: "https://github.com/yishuo299/face-attendance",
    eyebrow: "工程复现版 · OpenCV",
    title: "人脸识别考勤系统复现说明",
    intro: "人脸识别考勤系统用 Flask 提供接口，OpenCV 完成人脸检测和 LBPH 识别，Vue 3 提供管理页面。系统从学生信息、人脸录入、模型训练、识别签到、请假审批到统计报表形成完整课堂考勤流程。",
    modules: [["人员课程", "学生、教师、班级、课程和考勤场次管理。"], ["人脸录入", "上传图片、检测人脸、裁剪样本并训练模型。"], ["识别签到", "上传图片或拍照识别，并结合时间窗判断状态。"], ["请假审批", "学生提交请假，教师审批后同步考勤记录。"], ["统计报表", "出勤率趋势、班级对比和迟到缺勤排行。"]],
    stack: ["Python", "Flask", "OpenCV", "LBPH", "MySQL", "PyMySQL", "Vue 3", "Element Plus"],
    structure: `face-attendance/
├─ backend/
│  ├─ app.py
│  ├─ auth.py
│  ├─ config.py
│  ├─ database.py
│  └─ face_engine.py
├─ frontend/src/
├─ db/init.sql
└─ test/`,
    run: ["导入 db/init.sql。", "配置 MySQL 和 JWT 环境变量。", "创建 venv 并安装 backend/requirements.txt。", "构建前端。", "运行 backend/app.py 并访问 5001。", "先录入人脸样本，再进行识别签到。"],
    snippets: [
      ["数据库配置", "从环境变量读取 MySQL 连接信息。", "公开仓库不保存本地密码。", `DB_CONFIG = {\n    'host': os.environ.get('MYSQL_HOST', 'localhost'),\n    'password': os.environ.get('MYSQL_PASSWORD', ''),\n}`],
      ["JWT 签名", "使用 HMAC-SHA256 生成 token 签名。", "登录后接口可以校验用户身份和角色。", `sig = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()`],
      ["统一响应", "ok/err 封装 JSON 返回。", "前端统一读取 code、msg、data。", `def ok(data=None):\n    return jsonify({'code': 200, 'msg': 'success', 'data': data})`],
      ["数据库查询封装", "每次查询创建连接并返回字典游标结果。", "业务接口可以直接按字段名读取数据。", `with conn.cursor() as cur:\n    cur.execute(sql, args)\n    return cur.fetchall()`],
      ["人脸解码", "把上传图片或 base64 解码成 OpenCV 图像。", "图片上传和摄像头拍照可以复用识别流程。", `img = face_engine.decode_image(data)\nif img is None: return err('无法解析图片')`],
      ["Haar 检测", "灰度化、均衡化后调用 detectMultiScale。", "定位图片中最大的人脸区域。", `faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)`],
      ["人脸归一化", "裁剪人脸并 resize 到统一尺寸。", "训练和预测使用一致输入规格。", `face = cv2.resize(face, FACE_SIZE)\nface = cv2.equalizeHist(face)`],
      ["LBPH 训练", "使用 cv2.face.LBPHFaceRecognizer_create 训练样本。", "生成学生标签到人脸特征的映射模型。", `recognizer = cv2.face.LBPHFaceRecognizer_create()\nrecognizer.train(images, np.array(labels))`],
      ["置信度判断", "LBPH confidence 越小越相似。", "超过阈值时返回陌生人或识别失败。", `label, confidence = recognizer.predict(face)\nif confidence > CONFIDENCE_THRESHOLD:\n    return {'recognized': False}`],
      ["签到时间窗", "根据当前时间和场次开始/结束时间判断状态。", "自动区分正常、迟到和缺勤。", `if now <= start + timedelta(minutes=late_minutes):\n    status = '正常'\nelse:\n    status = '迟到'`],
      ["唯一签到", "数据库约束和查询避免同一学生同一场次重复签到。", "重复签到返回友好提示。", `existing = query_one(\"SELECT id FROM attendance_record WHERE session_id=%s AND student_id=%s\", args)`],
      ["请假同步", "审批通过后写入或更新考勤记录为已请假。", "请假不计入缺勤。", `execute(\"UPDATE attendance_record SET status='已请假', method='请假' WHERE id=%s\", (rid,))`],
    ],
    result: "运行后管理员可维护基础数据，教师可管理场次和审批请假，学生可进行人脸签到；统计页可以展示出勤率趋势、班级对比和个人考勤详情。",
  },
];

export const getMultiProjectArticle = (slug: string) => multiProjectArticles.find((item) => item.slug === slug);
