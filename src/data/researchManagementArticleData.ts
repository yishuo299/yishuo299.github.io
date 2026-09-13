export const projectUrl = "https://github.com/yishuo299/University_Research_Management_System";

export const modules = [
  ["用户与权限入口", "自定义用户模型、登录页面、会话保持、退出登录、修改密码和个人资料维护。"],
  ["科研人员台账", "维护科研人员的工号、部门、职位、职称、联系方式、研究领域和在职状态。"],
  ["科研项目管理", "维护项目编号、项目性质、范围、周期、经费、负责人和参与人员。"],
  ["成果管理", "分别管理期刊论文、科研获奖和科研著作，并支持与科研项目、科研人员关联。"],
  ["查询与导出", "各模块提供搜索筛选、排序、分页和 JSON 数据导出，方便查看与二次处理。"],
];

export const techStack = [
  ["Python", "作为后端开发语言，负责 Django 项目、业务视图、表单校验和管理命令。"],
  ["Django", "负责 MVC/MTV 架构、路由、模型、表单、认证、模板渲染和后台管理。"],
  ["MySQL", "保存用户、人员、项目、论文、获奖、著作和多对多关联数据。"],
  ["Django Template", "负责服务端页面渲染，通过模板继承复用公共布局。"],
  ["Bootstrap", "负责后台页面布局、表格、表单、按钮和响应式视觉效果。"],
  ["Font Awesome", "为导航、卡片、按钮和提示信息提供图标。"],
];

export const dataModels = [
  ["CustomUser", "继承 AbstractUser，扩展部门、职位、电话、初始密码和密码修改状态。"],
  ["ResearchPersonnel", "保存科研人员基础信息、工作信息、学术信息和在职状态。"],
  ["ResearchProject", "保存科研项目编号、性质、范围、周期、经费、负责人和参与人员。"],
  ["JournalPaper", "保存论文标题、期刊、检索源、影响因子、分区、作者和关联项目。"],
  ["ResearchAward", "保存获奖名称、级别、等级、类型、颁奖单位、获奖人员和关联项目。"],
  ["ResearchMonograph", "保存著作标题、ISBN、出版社、出版状态、作者、价格、页数和关联项目。"],
];

export const runSteps = [
  ["创建虚拟环境", "使用 python -m venv .venv 创建隔离环境，避免依赖污染系统 Python。"],
  ["安装依赖", "执行 pip install -r requirements.txt，安装 Django、mysqlclient 和 openpyxl。"],
  ["准备数据库", "在 MySQL 中创建 research_management 数据库，并使用 utf8mb4 字符集。"],
  ["配置环境变量", "复制 .env.example 为 .env，配置 DJANGO_SECRET_KEY、MySQL 账号和 ALLOWED_HOSTS。"],
  ["执行迁移", "运行 python manage.py makemigrations 和 python manage.py migrate 创建表结构。"],
  ["创建管理员", "运行 python manage.py createsuperuser，进入 /admin/ 或前台页面验证登录。"],
  ["启动服务", "执行 python manage.py runserver，访问 http://127.0.0.1:8000/。"],
];

export const codeSections = [
  {
    title: "环境变量化的 Django 配置",
    method: "使用 os.environ.get 读取 SECRET_KEY、DEBUG、ALLOWED_HOSTS 和 MySQL 连接参数。",
    purpose: "公开仓库不保存真实密钥，也方便不同电脑按本地数据库配置启动项目。",
    code: `SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-change-this-key-for-local-development-only'
)

DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    if host.strip()
]`,
  },
  {
    title: "MySQL 数据库连接",
    method: "在 settings.py 的 DATABASES 中配置 django.db.backends.mysql。",
    purpose: "让科研人员、项目、论文、获奖、著作和用户数据统一持久化到 MySQL。",
    code: `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('MYSQL_DATABASE', 'research_management'),
        'USER': os.environ.get('MYSQL_USER', 'root'),
        'PASSWORD': os.environ.get('MYSQL_PASSWORD', ''),
        'HOST': os.environ.get('MYSQL_HOST', 'localhost'),
        'PORT': os.environ.get('MYSQL_PORT', '3306'),
        'OPTIONS': {'charset': 'utf8mb4'}
    }
}`,
  },
  {
    title: "自定义用户模型",
    method: "继承 Django 的 AbstractUser，并增加业务字段。",
    purpose: "在保留 Django 登录认证能力的同时，记录高校管理场景需要的部门、职位、电话和密码状态。",
    code: `class CustomUser(AbstractUser):
    department = models.CharField(_('部门'), max_length=100, blank=True)
    position = models.CharField(_('职位'), max_length=100, blank=True)
    phone = models.CharField(_('联系电话'), max_length=20, blank=True)

    password_changed = models.BooleanField(_('密码已修改'), default=False)
    password_changed_date = models.DateTimeField(_('密码修改时间'), null=True, blank=True)
    initial_password = models.CharField(_('初始密码'), max_length=128, blank=True)`,
  },
  {
    title: "登录视图与会话保持",
    method: "继承 LoginView，使用自定义 AuthenticationForm，并根据 remember_me 设置 session 过期时间。",
    purpose: "完成前台登录入口，支持浏览器关闭后失效或两周内保持登录两种模式。",
    code: `class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'users/login.html'

    def form_valid(self, form):
        remember_me = self.request.POST.get('remember_me')
        if not remember_me:
            self.request.session.set_expiry(0)
        else:
            self.request.session.set_expiry(1209600)
        return super().form_valid(form)`,
  },
  {
    title: "登录保护",
    method: "使用 @login_required 装饰器保护业务页面。",
    purpose: "未登录用户不能直接访问科研人员、项目、论文、获奖和著作管理页面。",
    code: `@login_required
def project_list(request):
    project_list = ResearchProject.objects.all()
    search_form = ProjectSearchForm(request.GET)
    return render(request, 'research/project_list.html', context)`,
  },
  {
    title: "科研人员模型",
    method: "使用 Django Model 定义字段、数据库表名、排序规则和显示名称。",
    purpose: "构建科研人员台账，为项目负责人、论文作者、获奖人员和著作作者提供基础关联数据。",
    code: `class ResearchPersonnel(models.Model):
    name = models.CharField(_('姓名'), max_length=50)
    employee_id = models.CharField(_('工号'), max_length=20, unique=True)
    department = models.CharField(_('部门'), max_length=100)
    position = models.CharField(_('职位'), max_length=100)
    research_field = models.CharField(_('研究领域'), max_length=200)
    is_active = models.BooleanField(_('是否在职'), default=True)

    class Meta:
        db_table = 'research_researchpersonnel'
        ordering = ['department', 'name']`,
  },
  {
    title: "项目模型中的多对多关系",
    method: "ResearchProject 使用 ForeignKey 表示负责人，使用 ManyToManyField 表示参与人员。",
    purpose: "一个项目可以有一个负责人和多个参与人员，符合科研项目管理的真实关系。",
    code: `principal_investigator = models.ForeignKey(
    ResearchPersonnel,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='led_projects'
)

participants = models.ManyToManyField(
    ResearchPersonnel,
    related_name='participated_projects',
    blank=True
)`,
  },
  {
    title: "项目经费派生属性",
    method: "在模型中使用 @property 封装计算字段。",
    purpose: "详情页可以直接读取项目周期和剩余经费，不需要在模板里写复杂计算。",
    code: `@property
def duration(self):
    if self.start_date and self.end_date:
        return (self.end_date - self.start_date).days
    return None

@property
def remaining_funding(self):
    return self.total_funding - self.received_funding`,
  },
  {
    title: "人员列表搜索",
    method: "使用 Q 对象组合姓名、工号、部门、职位、研究领域等模糊查询条件。",
    purpose: "用户可以在一个关键词输入框里快速定位科研人员记录。",
    code: `if keyword:
    personnel_list = personnel_list.filter(
        Q(name__icontains=keyword) |
        Q(employee_id__icontains=keyword) |
        Q(department__icontains=keyword) |
        Q(position__icontains=keyword) |
        Q(research_field__icontains=keyword)
    )`,
  },
  {
    title: "分页处理",
    method: "使用 Django Paginator，并处理页码非法和页码超出范围两种异常。",
    purpose: "列表页面每页展示固定数量记录，数据量增加后仍能保持页面可读。",
    code: `page = request.GET.get('page', 1)
paginator = Paginator(project_list, 10)

try:
    projects = paginator.page(page)
except PageNotAnInteger:
    projects = paginator.page(1)
except EmptyPage:
    projects = paginator.page(paginator.num_pages)`,
  },
  {
    title: "项目表单业务校验",
    method: "在 ModelForm 的 clean 方法中统一校验日期和经费关系。",
    purpose: "避免结束日期早于开始日期，也避免已到账经费超过总经费。",
    code: `def clean(self):
    cleaned_data = super().clean()
    start_date = cleaned_data.get('start_date')
    end_date = cleaned_data.get('end_date')

    if start_date and end_date and end_date < start_date:
        raise ValidationError('结束日期不能早于开始日期')

    total_funding = cleaned_data.get('total_funding')
    received_funding = cleaned_data.get('received_funding')
    if total_funding is not None and received_funding is not None:
        if received_funding > total_funding:
            raise ValidationError('已到账经费不能大于总经费')
    return cleaned_data`,
  },
  {
    title: "创建科研项目",
    method: "表单校验通过后先 form.save(commit=False)，补充 created_by 后再保存。",
    purpose: "把当前登录用户记录为项目创建人，并保存负责人、参与人员等关系。",
    code: `if request.method == 'POST':
    form = ResearchProjectForm(request.POST)
    if form.is_valid():
        project = form.save(commit=False)
        project.created_by = request.user
        project.save()
        form.save_m2m()
        messages.success(request, f'项目 \"{project.project_name}\" 创建成功！')
        return redirect('research:project_detail', pk=project.pk)`,
  },
  {
    title: "论文统计聚合",
    method: "使用 aggregate、Count、Sum、Avg、Max 计算列表页统计指标。",
    purpose: "论文列表不仅能展示数据，还能给出 SCI/SSCI、EI、已发表、引用次数和影响因子概览。",
    code: `stats = paper_list.aggregate(
    total_count=Count('id'),
    sci_count=Count('id', filter=Q(paper_source='SCI') | Q(paper_source='SSCI')),
    ei_count=Count('id', filter=Q(paper_source='EI')),
    published_count=Count('id', filter=Q(status='已发表')),
    total_citations=Sum('citation_count'),
    avg_impact_factor=Avg('impact_factor'),
    max_impact_factor=Max('impact_factor')
)`,
  },
  {
    title: "JSON 数据导出",
    method: "把 QuerySet 转成字典列表，通过 JsonResponse 返回中文字段。",
    purpose: "科研人员、项目、论文、获奖、著作模块都可以导出数据，方便后续转 Excel 或对接接口。",
    code: `def project_export(request):
    project_list = ResearchProject.objects.all()
    data = []
    for project in project_list:
        data.append({
            '项目编号': project.project_code,
            '项目名称': project.project_name,
            '项目状态': project.status,
            '总经费（万元）': float(project.total_funding),
        })
    return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii': False})`,
  },
  {
    title: "统一业务路由",
    method: "在 research/urls.py 中按模块组织列表、创建、详情、编辑、删除、导出路由。",
    purpose: "每个业务模块都遵循相同 URL 结构，后续扩展新模块时更容易保持一致。",
    code: `urlpatterns = [
    path('personnel/', login_required(views.personnel_list), name='personnel_list'),
    path('projects/', login_required(views.project_list), name='project_list'),
    path('papers/', login_required(views.paper_list), name='paper_list'),
    path('awards/', login_required(views.award_list), name='award_list'),
    path('monographs/', login_required(views.monograph_list), name='monograph_list'),
]`,
  },
];

export const resultItems = [
  ["登录后进入首页", "访问根路径会跳转到系统首页，未登录时进入登录页，登录后可看到导航和欢迎信息。"],
  ["科研人员管理", "可以新增人员、编辑信息、按关键词筛选、查看详情、删除记录和导出 JSON。"],
  ["科研项目管理", "可以维护项目经费、周期、负责人、参与人员，并查看项目详情和统计信息。"],
  ["成果管理", "论文、获奖、著作分别有独立列表、表单、详情、删除和导出页面。"],
  ["后台管理", "Django Admin 可管理用户和系统数据，适合补充权限和运维功能。"],
];
