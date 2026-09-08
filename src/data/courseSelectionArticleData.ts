export const projectUrl = "https://github.com/yishuo299/School_Course_Selection_Management_System";

export const screenshots = [
  {
    title: "登录入口",
    desc: "统一登录页负责身份识别，系统根据用户角色进入不同后台。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsYGqgB5P-NZ4Y4NCCkap6SHbpYjqrAAJjJAACnMUBVZYskB7sMyBMPQQ.jpg",
  },
  {
    title: "教师开课",
    desc: "教师与教务人员可以维护开课信息、上课时间、地点和容量。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsYWqgB9er1sK1Jj1w1f1OvNIDaYdHAAJnJAACnMUBVWabRh7lWkr-PQQ.jpg",
  },
  {
    title: "学生课表",
    desc: "学生选课成功后生成个人课表，课程安排更直观。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsYmqgB_HNLPZUsYxZBjdt57zf0rMvAAJpJAACnMUBVYTWe5FPwM9ePQQ.jpg",
  },
  {
    title: "学生成绩查询",
    desc: "成绩审核发布后，学生可以查询课程成绩和学习结果。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsY2qgCAVM2GpnHUawdGCBWhWhJT2XAAJqJAACnMUBVfAAATv_pJrKTz0E.jpg",
  },
  {
    title: "管理员权限管理",
    desc: "管理员维护角色权限，控制不同用户可以访问的功能。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsZGqgCCa2KXNPXDk5RLWkGIq3tfzwAAJrJAACnMUBVRqYb8c7WcPOPQQ.jpg",
  },
  {
    title: "管理员操作日志查询",
    desc: "系统记录关键操作，方便排查异常和追踪管理行为。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsZ2qgCQu4yDpjFiPF8uF_rG7rJi18AAJ_JAACnMUBVQOdG6kG4Mn8PQQ.jpg",
  },
  {
    title: "管理员用户管理",
    desc: "管理员可以维护用户账号、状态和角色归属。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsaGqgCRlgpxYuoA_yb8yLsMGUlkQ0AAKAJAACnMUBVYncpyXp3BnkPQQ.jpg",
  },
];

export const techStack = [
  ["Spring Boot", "负责后端接口、业务服务、统一异常处理和系统配置。"],
  ["Spring Security / JWT", "负责登录鉴权和接口访问控制，适合前后端分离项目。"],
  ["MyBatis Plus", "负责常规 CRUD 和分页查询，复杂业务查询可配合自定义 Mapper。"],
  ["MySQL", "保存用户、角色、课程、开课、选课、成绩、日志等业务数据。"],
  ["Vue 3", "负责前端页面、组件拆分、响应式状态和后台交互。"],
  ["Element Plus", "提供表格、表单、弹窗、分页、标签等后台管理组件。"],
  ["Pinia", "保存登录状态、用户角色和前端权限信息。"],
  ["Axios", "统一封装接口请求、Token 携带和错误处理。"],
];

export const codeSections = [
  {
    title: "统一返回结构",
    method: "使用泛型 Result<T> 封装接口返回。",
    purpose: "让前端始终用统一格式处理成功、失败和业务数据，减少页面里重复判断。",
    code: `public class Result<T> {
  private Integer code;
  private String message;
  private T data;

  public static <T> Result<T> success(T data) {
    return new Result<>(200, "success", data);
  }

  public static <T> Result<T> fail(String message) {
    return new Result<>(500, message, null);
  }
}`,
  },
  {
    title: "登录接口",
    method: "Controller 接收账号密码，Service 校验身份，再生成 JWT。",
    purpose: "完成系统入口。用户登录成功后，前端根据角色渲染对应菜单。",
    code: `@PostMapping("/login")
public Result<LoginVO> login(@RequestBody LoginDTO dto) {
  User user = userService.checkPassword(dto.getUsername(), dto.getPassword());
  String token = jwtService.createToken(user.getId(), user.getRoleCode());
  return Result.success(new LoginVO(token, user.getRoleCode(), user.getNickname()));
}`,
  },
  {
    title: "JWT 拦截器",
    method: "通过 HandlerInterceptor 在请求进入 Controller 前解析 Token。",
    purpose: "阻止未登录用户访问业务接口，并把当前用户信息放入上下文。",
    code: `public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
  String token = request.getHeader("Authorization");
  if (!StringUtils.hasText(token)) {
    throw new BusinessException("请先登录");
  }
  LoginUser loginUser = jwtService.parseToken(token.replace("Bearer ", ""));
  UserContext.set(loginUser);
  return true;
}`,
  },
  {
    title: "前端 Axios 封装",
    method: "创建 request 实例，并在请求拦截器中统一添加 Token。",
    purpose: "页面调用接口时不用重复写请求头，后端也能识别当前用户。",
    code: `const request = axios.create({
  baseURL: "/api",
  timeout: 10000
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});`,
  },
  {
    title: "路由权限守卫",
    method: "使用 Vue Router 的 beforeEach 判断登录状态和角色。",
    purpose: "让学生、教师、管理员进入各自页面，避免前端路由被随意访问。",
    code: `router.beforeEach((to) => {
  const userStore = useUserStore();
  if (!userStore.token && to.path !== "/login") return "/login";
  if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    return "/403";
  }
});`,
  },
  {
    title: "课程分页查询",
    method: "使用 LambdaQueryWrapper 根据学期、关键词等条件拼接查询。",
    purpose: "支撑学生选课页和教务课程管理页的搜索、筛选、分页展示。",
    code: `public Page<CourseVO> pageCourse(CourseQuery query) {
  LambdaQueryWrapper<CourseOffering> wrapper = new LambdaQueryWrapper<>();
  wrapper.eq(query.getTermId() != null, CourseOffering::getTermId, query.getTermId());
  wrapper.like(StringUtils.hasText(query.getKeyword()), CourseOffering::getCourseName, query.getKeyword());
  return courseMapper.selectCoursePage(query.toPage(), wrapper);
}`,
  },
  {
    title: "选课容量校验",
    method: "提交选课前读取开课容量和已选人数。",
    purpose: "防止课程人数超过上限，保证课程资源不会被超额占用。",
    code: `if (offering.getSelectedCount() >= offering.getCapacity()) {
  throw new BusinessException("课程容量已满，无法继续选课");
}`,
  },
  {
    title: "重复选课校验",
    method: "查询学生是否已经存在同一开课记录的有效选课。",
    purpose: "避免同一个学生重复选择同一门课，保持选课记录干净。",
    code: `boolean exists = selectionMapper.exists(
  new LambdaQueryWrapper<CourseSelection>()
    .eq(CourseSelection::getStudentId, studentId)
    .eq(CourseSelection::getOfferingId, offeringId)
    .eq(CourseSelection::getStatus, "SELECTED")
);
if (exists) throw new BusinessException("不能重复选择同一门课程");`,
  },
  {
    title: "时间冲突校验",
    method: "比较学生已选课程与当前课程的星期、开始节次、结束节次。",
    purpose: "避免学生在同一时间段选择两门课，保证课表可用。",
    code: `boolean conflict = selectionMapper.hasTimeConflict(
  studentId,
  offering.getWeekDay(),
  offering.getStartSection(),
  offering.getEndSection()
);
if (conflict) throw new BusinessException("课程时间冲突");`,
  },
  {
    title: "提交选课事务",
    method: "使用 @Transactional 同时保存选课记录并更新已选人数。",
    purpose: "保证选课记录和课程容量同时成功或同时失败，避免数据不一致。",
    code: `@Transactional
public void selectCourse(Long studentId, Long offeringId) {
  CourseOffering offering = checkSelectable(offeringId);
  checkStudentSelection(studentId, offering);
  selectionMapper.insert(new CourseSelection(studentId, offeringId, "SELECTED"));
  offeringMapper.increaseSelectedCount(offeringId);
}`,
  },
  {
    title: "成绩计算",
    method: "按平时、期中、期末比例计算总评成绩并换算绩点。",
    purpose: "减少教师手动计算错误，让学生查询到统一规则下的成绩。",
    code: `BigDecimal total = usual.multiply(new BigDecimal("0.30"))
  .add(midterm.multiply(new BigDecimal("0.20")))
  .add(finalExam.multiply(new BigDecimal("0.50")));

grade.setTotalScore(total);
grade.setGpa(GpaConverter.convert(total));`,
  },
  {
    title: "成绩审核发布",
    method: "教务审核通过后才允许把成绩状态改为已发布。",
    purpose: "避免未确认成绩直接展示给学生，保证成绩发布流程严谨。",
    code: `public void publishGrade(Long gradeId) {
  Grade grade = gradeMapper.selectById(gradeId);
  if (!"APPROVED".equals(grade.getAuditStatus())) {
    throw new BusinessException("成绩未审核，不能发布");
  }
  grade.setPublishStatus("PUBLISHED");
  gradeMapper.updateById(grade);
}`,
  },
  {
    title: "AOP 操作日志",
    method: "使用环绕通知记录接口执行结果、耗时和异常信息。",
    purpose: "管理员可以追踪系统关键操作，排查误操作和接口异常。",
    code: `@Around("@annotation(operationLog)")
public Object recordLog(ProceedingJoinPoint joinPoint, OperationLog operationLog) throws Throwable {
  long start = System.currentTimeMillis();
  try {
    Object result = joinPoint.proceed();
    logService.saveSuccess(operationLog.value(), System.currentTimeMillis() - start);
    return result;
  } catch (Throwable error) {
    logService.saveFailure(operationLog.value(), error.getMessage());
    throw error;
  }
}`,
  },
];

export const modules = [
  ["身份与权限模块", "登录、Token 校验、角色菜单、接口权限控制。"],
  ["课程与开课模块", "课程基础信息、教师安排、教室安排、上课时间、课程容量。"],
  ["学生选课模块", "课程筛选、选课提交、退课、课表生成、选课限制校验。"],
  ["成绩管理模块", "教师录入、总评计算、绩点换算、教务审核、学生查询。"],
  ["系统管理模块", "用户管理、角色权限、操作日志、基础数据维护。"],
];
