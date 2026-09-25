(function () {
  if (window.__PROJECT_EXPERIENCE_MOCK__) return;
  window.__PROJECT_EXPERIENCE_MOCK__ = true;

  const project = (location.pathname.match(/experience-native\/([^/]+)/) || [])[1] || "";
  let idSeq = 1000;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const ok = (data = null, extra = {}) => ({ code: 200, msg: "操作成功", message: "操作成功", data, ...extra });
  const page = (records, current = 1, size = 10) => ({
    records: records.slice((current - 1) * size, current * size),
    total: records.length,
    current,
    size,
    pages: Math.max(1, Math.ceil(records.length / size)),
  });
  const paramsOf = (url) => Object.fromEntries(new URL(url, location.origin).searchParams.entries());

  const db = {
    users: [
      { id: 1, username: "admin", realName: "系统管理员", fullName: "系统管理员", role: "ADMIN", status: 1 },
      { id: 2, username: "teacher", realName: "测试教师", role: "TEACHER", status: 1 },
      { id: 3, username: "student", realName: "测试学生", role: "STUDENT", status: 1 },
      { id: 4, username: "user1", fullName: "普通用户", role: "USER", status: 1 },
      { id: 5, username: "worker1", fullName: "维保工程师", role: "WORKER", status: 1 },
    ],
    categories: [
      { id: 1, name: "数码", sort: 1, status: 1 },
      { id: 2, name: "书籍", sort: 2, status: 1 },
      { id: 3, name: "生活用品", sort: 3, status: 1 },
      { id: 4, name: "运动户外", sort: 4, status: 1 },
    ],
    products: [
      { id: 1, title: "机械键盘 K87，成色很新", name: "机械键盘 K87", price: 169, status: 1, sellerId: 2, categoryId: 1, coverUrl: "", campus: "东校区", conditionText: "几乎全新", stock: 1 },
      { id: 2, title: "考研数学复习全套资料", name: "考研数学资料", price: 28, status: 1, sellerId: 2, categoryId: 2, coverUrl: "", campus: "西校区", conditionText: "轻微使用", stock: 1 },
      { id: 3, title: "宿舍小冰箱，毕业转让", name: "宿舍小冰箱", price: 240, status: 1, sellerId: 2, categoryId: 3, coverUrl: "", campus: "南湖校区", conditionText: "正常使用", stock: 1 },
    ],
    orders: [
      { id: 1, orderNo: "MOCK20260922001", productTitle: "机械键盘 K87", productName: "机械键盘 K87", amount: 169, totalAmount: 169, status: 0, buyerName: "测试买家", sellerName: "测试卖家" },
      { id: 2, orderNo: "MOCK20260922002", productTitle: "考研数学资料", productName: "考研数学资料", amount: 28, totalAmount: 28, status: 3, buyerName: "测试买家", sellerName: "测试卖家" },
    ],
    messages: [{ id: 1, fromUserId: 2, content: "这件商品还在吗？", productId: 1, createTime: "2026-09-22 10:20", readFlag: 0 }],
    addresses: [{ id: 1, name: "测试用户", phone: "13800000000", detail: "东校区一号楼", isDefault: 1 }],
    departments: [{ id: 1, name: "内科" }, { id: 2, name: "外科" }, { id: 3, name: "儿科" }, { id: 4, name: "口腔科" }],
    doctors: [{ id: 1, name: "李医生", departmentId: 1, title: "主任医师", fee: 25 }, { id: 2, name: "周医生", departmentId: 3, title: "副主任医师", fee: 20 }],
    schedules: [{ id: 1, doctorId: 1, doctorName: "李医生", departmentName: "内科", workDate: "2026-09-22", period: "上午", total: 30, leftNum: 12, status: 1 }],
    appointments: [{ id: 1, patientName: "测试患者", doctorName: "李医生", departmentName: "内科", appointmentDate: "2026-09-22", status: 1, fee: 25 }],
    records: [{ id: 1, patientName: "测试患者", doctorName: "李医生", diagnosis: "上呼吸道感染", advice: "多饮水，按时服药", createTime: "2026-09-22 09:30" }],
    prescriptions: [{ id: 1, patientName: "测试患者", doctorName: "李医生", amount: 58, status: 0, createTime: "2026-09-22 09:40" }],
    drugs: [{ id: 1, name: "布洛芬", stock: 200, price: 12.5 }, { id: 2, name: "阿莫西林", stock: 120, price: 18 }],
    books: [{ id: 1, title: "数据库系统概论", name: "数据库系统概论", author: "王珊", isbn: "9787040406641", stock: 8, status: 1 }, { id: 2, title: "Java 编程思想", name: "Java 编程思想", author: "Bruce Eckel", isbn: "9787111213826", stock: 5, status: 1 }],
    readers: [{ id: 1, name: "张同学", cardNo: "R2026001", phone: "13800000001", status: 1 }],
    borrows: [{ id: 1, bookName: "数据库系统概论", readerName: "张同学", borrowDate: "2026-09-10", dueDate: "2026-09-28", status: 1 }],
    notices: [{ id: 1, title: "国庆开放安排", content: "假期期间图书馆正常开放。", status: 1 }],
    movies: [{ id: 1, title: "星际穿越", name: "星际穿越", year: 2014, country: "美国", score: 9.6, genres: ["科幻"], poster: "" }, { id: 2, title: "盗梦空间", name: "盗梦空间", year: 2010, country: "美国", score: 9.4, genres: ["悬疑"], poster: "" }],
    genres: [{ id: 1, name: "科幻" }, { id: 2, name: "悬疑" }, { id: 3, name: "剧情" }],
    reviews: [{ id: 1, movieId: 1, username: "影迷小许", content: "节奏和想象力都很出色。", likes: 12, status: 1 }],
    students: [{ id: 1, name: "张同学", studentNo: "S2026001", className: "软件 2401" }, { id: 2, name: "李同学", studentNo: "S2026002", className: "软件 2402" }],
    teachers: [{ id: 1, name: "周老师", teacherNo: "T2026001" }, { id: 2, name: "王老师", teacherNo: "T2026002" }],
    classes: [{ id: 1, name: "软件 2401" }, { id: 2, name: "软件 2402" }],
    courses: [{ id: 1, name: "软件工程", teacherName: "周老师", capacity: 60 }, { id: 2, name: "数据库原理", teacherName: "王老师", capacity: 60 }],
    offerings: [
      { id: 1, offeringId: 1, courseId: 1, courseName: "软件工程", courseCode: "SE-2401", teacherName: "周老师", credit: 3, courseType: 1, streamType: 1, selectedCount: 38, maxStudents: 60, classroomName: "A302", scheduleInfo: "周一 第1-2节", dayOfWeek: 1, startSection: 1, endSection: 2, weekStart: 1, weekEnd: 16, description: "围绕软件生命周期、需求分析、设计与测试展开。" },
      { id: 2, offeringId: 2, courseId: 2, courseName: "数据库原理", courseCode: "DB-2402", teacherName: "王老师", credit: 4, courseType: 1, streamType: 2, selectedCount: 55, maxStudents: 60, classroomName: "B208", scheduleInfo: "周三 第3-4节", dayOfWeek: 3, startSection: 3, endSection: 4, weekStart: 1, weekEnd: 16, description: "学习关系模型、SQL、事务与数据库设计。" },
      { id: 3, offeringId: 3, courseId: 3, courseName: "Python 程序设计", courseCode: "PY-2403", teacherName: "陈老师", credit: 2, courseType: 2, streamType: 1, selectedCount: 28, maxStudents: 50, classroomName: "C105", scheduleInfo: "周五 第5-6节", dayOfWeek: 5, startSection: 5, endSection: 6, weekStart: 2, weekEnd: 14, description: "通过案例掌握 Python 基础和数据处理。" },
    ],
    selections: [{ id: 1, offeringId: 1, courseName: "软件工程", teacherName: "周老师", credit: 3 }],
    grades: [
      { id: 1, gradeId: 1, studentId: 1, studentNo: "S2026001", studentName: "张同学", offeringId: 1, courseName: "软件工程", usualScore: 88, finalScore: 91, totalScore: 90.1, gpa: 4.0, gradeStatus: 3 },
      { id: 2, gradeId: 2, studentId: 2, studentNo: "S2026002", studentName: "李同学", offeringId: 1, courseName: "软件工程", usualScore: 78, finalScore: 83, totalScore: 81.5, gpa: 3.3, gradeStatus: 1 },
    ],
    appeals: [{ id: 1, gradeId: 2, courseName: "软件工程", studentName: "李同学", appealReason: "希望复核期末试卷得分。", status: 0, processResult: "" }],
    sessions: [{ id: 1, courseName: "软件工程", className: "软件 2401", startTime: "2026-09-22 08:00", status: 1 }],
    attendance: [{ id: 1, studentName: "张同学", courseName: "软件工程", signTime: "08:03", status: "正常" }],
    leaves: [{ id: 1, studentName: "李同学", courseName: "数据库原理", reason: "身体不适", status: 0 }],
    logs: [{ id: 1, username: "admin", action: "登录系统", ip: "127.0.0.1", createTime: "2026-09-22 09:00" }],
    equipment: [{ id: 1, name: "光谱检测仪", type: "检测设备", status: "库存", health: 96 }, { id: 2, name: "便携终端", type: "终端设备", status: "服役中", health: 82 }],
    requests: [{ id: 1, equipmentName: "便携终端", applicantName: "普通用户", type: "BORROW", status: "PENDING", progress: 35 }],
    parkingAreas: [
      { id: 1, areaName: "A 区地面停车区", areaCode: "A", floorNo: "F1", totalSpaces: 12, remark: "靠近入口，适合临停车辆", status: 1 },
      { id: 2, areaName: "B 区地下停车区", areaCode: "B", floorNo: "B1", totalSpaces: 14, remark: "长停与月卡车辆主要区域", status: 1 },
      { id: 3, areaName: "C 区新能源车位", areaCode: "C", floorNo: "F1", totalSpaces: 8, remark: "包含充电桩车位", status: 1 },
      { id: 4, areaName: "D 区综合停车区", areaCode: "D", floorNo: "B2", totalSpaces: 6, remark: "演示维修、预约等状态", status: 1 },
    ],
    parkingSpaces: [
      { id: 1, areaId: 1, areaName: "A 区地面停车区", spaceNo: "A-001", spaceType: "NORMAL", status: "OCCUPIED", plateNo: "京A12345" },
      { id: 2, areaId: 1, areaName: "A 区地面停车区", spaceNo: "A-002", spaceType: "NORMAL", status: "FREE", plateNo: "" },
      { id: 3, areaId: 1, areaName: "A 区地面停车区", spaceNo: "A-003", spaceType: "DISABLED", status: "FREE", plateNo: "" },
      { id: 4, areaId: 2, areaName: "B 区地下停车区", spaceNo: "B-012", spaceType: "NORMAL", status: "OCCUPIED", plateNo: "京H23456" },
      { id: 5, areaId: 2, areaName: "B 区地下停车区", spaceNo: "B-016", spaceType: "NORMAL", status: "FREE", plateNo: "" },
      { id: 6, areaId: 3, areaName: "C 区新能源车位", spaceNo: "C-006", spaceType: "CHARGING", status: "RESERVED", plateNo: "" },
      { id: 7, areaId: 3, areaName: "C 区新能源车位", spaceNo: "C-009", spaceType: "NEW_ENERGY", status: "FREE", plateNo: "" },
      { id: 8, areaId: 4, areaName: "D 区综合停车区", spaceNo: "D-009", spaceType: "NORMAL", status: "MAINTENANCE", plateNo: "" },
    ],
    parkingRecords: [
      { id: 1, recordNo: "PR202609220001", plateNo: "京A12345", displayPlateNo: "京A·12345", areaName: "A 区地面停车区", spaceId: 1, spaceNo: "A-001", spaceType: "NORMAL", entryTime: "2026-09-25 08:20:00", exitTime: "", durationMinutes: 0, amount: 0, discountAmount: 0, actualAmount: 0, payType: "", status: "PARKING" },
      { id: 2, recordNo: "PR202609220002", plateNo: "京H23456", displayPlateNo: "京H·23456", areaName: "B 区地下停车区", spaceId: 4, spaceNo: "B-012", spaceType: "NORMAL", entryTime: "2026-09-25 10:05:00", exitTime: "", durationMinutes: 0, amount: 0, discountAmount: 0, actualAmount: 0, payType: "", status: "PARKING" },
      { id: 3, recordNo: "PR202609210018", plateNo: "京C45000", displayPlateNo: "京C·45000", areaName: "C 区新能源车位", spaceId: 6, spaceNo: "C-006", spaceType: "CHARGING", entryTime: "2026-09-24 21:30:00", exitTime: "2026-09-25 07:20:00", durationMinutes: 590, amount: 32, discountAmount: 0, actualAmount: 32, payType: "SCAN", status: "PAID" },
    ],
    billingRules: [
      { id: 1, spaceType: "NORMAL", freeMinutes: 15, firstHourPrice: 5, nextHourPrice: 3, dailyCap: 45, nightDiscount: 0.5, status: 1 },
      { id: 2, spaceType: "NEW_ENERGY", freeMinutes: 20, firstHourPrice: 4, nextHourPrice: 2.5, dailyCap: 40, nightDiscount: 0.5, status: 1 },
      { id: 3, spaceType: "CHARGING", freeMinutes: 10, firstHourPrice: 8, nextHourPrice: 5, dailyCap: 68, nightDiscount: 0.6, status: 1 },
    ],
    vehicles: [
      { id: 1, ownerId: 3, ownerName: "车主陈晓明", plateNo: "京A12345", displayPlateNo: "京A·12345", brand: "比亚迪", color: "白色", vehicleType: "小型汽车", phone: "13800000001", status: 1 },
      { id: 2, ownerId: 3, ownerName: "车主陈晓明", plateNo: "京H23456", displayPlateNo: "京H·23456", brand: "大众", color: "黑色", vehicleType: "小型汽车", phone: "13800000001", status: 1 },
    ],
    monthCards: [
      { id: 1, cardNo: "MC2026000001", ownerName: "车主陈晓明", plateNo: "京A12345", displayPlateNo: "京A·12345", spaceType: "NORMAL", startDate: "2026-09-01", endDate: "2026-12-31", amount: 600, status: "VALID" },
      { id: 2, cardNo: "MC2026000002", ownerName: "车主刘洋", plateNo: "京C45000", displayPlateNo: "京C·45000", spaceType: "NORMAL", startDate: "2026-06-01", endDate: "2026-08-31", amount: 500, status: "EXPIRED" },
    ],
    storedCards: [
      { id: 1, cardNo: "SC2026000001", ownerName: "车主陈晓明", plateNo: "京H23456", displayPlateNo: "京H·23456", balance: 128, totalRecharge: 300, totalConsume: 172, status: "NORMAL" },
      { id: 2, cardNo: "SC2026000002", ownerName: "车主赵丽华", plateNo: "京N88112", displayPlateNo: "京N·88112", balance: 0, totalRecharge: 100, totalConsume: 100, status: "FROZEN" },
    ],
    rechargeRecords: [{ id: 1, cardNo: "SC2026000001", ownerName: "车主陈晓明", amount: 100, createTime: "2026-09-20 14:22:00", operatorName: "收费员李静" }],
    paymentRecords: [
      { id: 1, payNo: "PAY202609250001", recordNo: "PR202609210018", plateNo: "京C45000", displayPlateNo: "京C·45000", amount: 32, payType: "SCAN", operatorName: "收费员李静", createTime: "2026-09-25 07:20:00" },
    ],
    sysConfigs: [{ id: 1, configKey: "free_minutes_default", configValue: "15", configGroup: "billing", remark: "默认免费分钟数", status: 1 }],
  };

  const listBy = (key) => db[key] || [];
  const addItem = (key, body) => {
    const item = { id: ++idSeq, createTime: new Date().toLocaleString(), status: 1, ...body };
    listBy(key).unshift(item);
    return item;
  };
  const updateItem = (key, id, body) => {
    const rows = listBy(key);
    const row = rows.find((item) => String(item.id) === String(id));
    if (row) Object.assign(row, body);
    return row || { id, ...body };
  };
  const removeItem = (key, id) => {
    const rows = listBy(key);
    const index = rows.findIndex((item) => String(item.id) === String(id));
    if (index >= 0) rows.splice(index, 1);
    return true;
  };

  const bodyOf = (body) => {
    if (!body) return {};
    if (typeof body === "string") {
      try { return JSON.parse(body); } catch { return {}; }
    }
    if (body instanceof FormData) return Object.fromEntries(body.entries());
    return body;
  };

  const mapResource = (url) => {
    const u = url.toLowerCase();
    if (project === "parking-management") {
      if (u.includes("/area")) return "parkingAreas";
      if (u.includes("/space")) return "parkingSpaces";
      if (u.includes("/record")) return "parkingRecords";
      if (u.includes("/rule")) return "billingRules";
      if (u.includes("monthcard") || u.includes("/card/month")) return "monthCards";
      if (u.includes("storedcard") || u.includes("/card/stored")) return "storedCards";
      if (u.includes("recharge")) return "rechargeRecords";
      if (u.includes("/payment")) return "paymentRecords";
      if (u.includes("/vehicle")) return "vehicles";
      if (u.includes("/config")) return "sysConfigs";
    }
    if (u.includes("grade-appeal")) return "appeals";
    if (u.includes("/grade")) return "grades";
    if (u.includes("course-selection")) return "selections";
    if (u.includes("offering")) return "offerings";
    if (u.includes("category") || u.includes("genre")) return u.includes("genre") ? "genres" : "categories";
    if (u.includes("product")) return "products";
    if (u.includes("order")) return "orders";
    if (u.includes("message")) return "messages";
    if (u.includes("address")) return "addresses";
    if (u.includes("department")) return "departments";
    if (u.includes("doctor")) return "doctors";
    if (u.includes("schedule")) return "schedules";
    if (u.includes("appointment")) return "appointments";
    if (u.includes("prescription")) return "prescriptions";
    if (u.includes("record")) return "records";
    if (u.includes("drug")) return "drugs";
    if (u.includes("book")) return "books";
    if (u.includes("reader")) return "readers";
    if (u.includes("borrow")) return "borrows";
    if (u.includes("reservation")) return "borrows";
    if (u.includes("fine")) return "borrows";
    if (u.includes("notice")) return "notices";
    if (u.includes("movie")) return "movies";
    if (u.includes("review")) return "reviews";
    if (u.includes("student")) return "students";
    if (u.includes("teacher")) return "teachers";
    if (u.includes("class")) return "classes";
    if (u.includes("course")) return "courses";
    if (u.includes("session")) return "sessions";
    if (u.includes("log")) return "logs";
    if (u.includes("attendance")) return "attendance";
    if (u.includes("leave")) return "leaves";
    if (u.includes("equipment")) return "equipment";
    if (u.includes("request") || u.includes("maintenance")) return "requests";
    if (u.includes("user")) return "users";
    return "products";
  };

  const detailVO = (item) => ({ product: item, seller: { id: 2, username: "seller", realName: "测试卖家" }, favorite: false });
  const normalizeRows = (key, rows) => key === "products" && project === "campus-marketplace" ? rows.map(detailVO) : rows;

  const handle = (method, rawUrl, requestBody) => {
    const urlObj = new URL(rawUrl, location.origin);
    const url = urlObj.pathname + urlObj.search;
    const lower = url.toLowerCase();
    const params = paramsOf(rawUrl);
    const body = bodyOf(requestBody);
    const key = mapResource(url);
    const current = Number(params.current || params.page || 1);
    const size = Number(params.size || params.pageSize || 10);
    const plateNorm = (value = "") => String(value).replace(/[·\-\s]/g, "").toUpperCase();
    const calcParkingFee = (record) => {
      const entry = new Date(String(record.entryTime).replace(/-/g, "/")).getTime();
      const minutes = Math.max(30, Math.ceil((Date.now() - entry) / 60000));
      const rule = db.billingRules.find((item) => item.spaceType === record.spaceType) || db.billingRules[0];
      const billable = Math.max(0, minutes - Number(rule.freeMinutes || 0));
      const hours = Math.ceil(billable / 60);
      const raw = hours <= 0 ? 0 : Number(rule.firstHourPrice || 0) + Math.max(0, hours - 1) * Number(rule.nextHourPrice || 0);
      return { minutes, amount: Math.min(raw, Number(rule.dailyCap || raw || 0)) };
    };
    const parkingStatusText = { FREE: "空闲", OCCUPIED: "已占用", RESERVED: "已预约", MAINTENANCE: "维修中" };
    const enrichSpace = (space) => ({ ...space, statusText: parkingStatusText[space.status] || space.status, currentPlateNo: space.plateNo || "" });
    const parkingTrend = () => ({
      dates: ["2026-09-19", "2026-09-20", "2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25"],
      amounts: [860, 980, 1260, 1188, 1420, 1106, 1286],
      counts: [18, 21, 26, 24, 31, 22, 28],
    });

    if (lower.includes("/auth/login")) {
      const username = body.username || "demo";
      const role = username.includes("admin") ? "ADMIN" : username.includes("operator") ? "OPERATOR" : username.includes("owner") ? "OWNER" : username.includes("doctor") ? "DOCTOR" : username.includes("worker") ? "WORKER" : username.includes("teacher") ? "TEACHER" : username.includes("student") ? "STUDENT" : username.includes("patient") ? "PATIENT" : "USER";
      return ok({ token: "demo-token", userInfo: { id: 1, username, realName: "测试用户", fullName: "测试用户", role, userType: role === "STUDENT" ? 1 : role === "TEACHER" ? 2 : role === "ADMIN" ? 4 : 3, roles: ["ROLE_" + role] }, role, fullName: "测试用户" });
    }
    if (lower.includes("/auth/info") || lower.includes("/auth/me")) return ok({ id: 1, username: "demo", realName: "测试用户", role: "ADMIN", userType: 4, roles: ["ROLE_SYSTEM_ADMIN"] });
    if (lower.includes("/upload") || lower.includes("/file/upload")) return ok({ url: "https://dummyimage.com/480x320/daeafe/334155&text=Mock+Image" });
    if (lower.includes("export")) return ok("mock-export");
    if (project === "parking-management" && (lower.includes("/stats") || lower.includes("/stat/"))) {
      if (lower.includes("overview")) return ok({
        spaceTotal: db.parkingSpaces.length,
        spaceFree: db.parkingSpaces.filter((item) => item.status === "FREE").length,
        spaceOccupied: db.parkingSpaces.filter((item) => item.status === "OCCUPIED").length,
        parkingNow: db.parkingRecords.filter((item) => item.status === "PARKING").length,
        occupancyRate: Math.round((db.parkingSpaces.filter((item) => item.status === "OCCUPIED").length / db.parkingSpaces.length) * 100),
        todayRecords: 28,
        recordTotal: db.parkingRecords.length + 42,
        todayIncome: 1286,
        totalIncome: 38620,
        validMonthCard: db.monthCards.filter((item) => item.status === "VALID").length,
        expiredMonthCard: db.monthCards.filter((item) => item.status === "EXPIRED").length,
        storedBalance: db.storedCards.reduce((sum, item) => sum + Number(item.balance || 0), 0),
        storedCardCount: db.storedCards.length,
      });
      if (lower.includes("income/trend")) return ok(parkingTrend());
      if (lower.includes("income/month")) return ok({ months: ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09"], amounts: [28600, 30180, 34220, 36100, 38620], counts: [520, 558, 606, 642, 684] });
      if (lower.includes("traffic/hour")) return ok({ labels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"], values: [3, 1, 0, 6, 18, 24, 16, 19, 25, 31, 22, 12] });
      if (lower.includes("space/type")) return ok({ data: [{ name: "普通车位", value: 28 }, { name: "新能源", value: 6 }, { name: "无障碍", value: 3 }, { name: "充电桩", value: 3 }] });
      if (lower.includes("space/turnover")) return ok({ names: ["A区地面", "B区地下", "C区新能源", "D区综合"], counts: [42, 35, 18, 12], rates: [2.8, 2.1, 1.7, 1.2] });
      if (lower.includes("pay/type")) return ok({ data: [{ name: "月卡抵扣", value: 8 }, { name: "储值卡", value: 10 }, { name: "现金", value: 4 }, { name: "扫码", value: 12 }] });
      if (lower.includes("space/stat")) return ok({ data: [{ name: "普通车位", count: 48, amount: 18600, avgMinutes: 168 }, { name: "新能源车位", count: 18, amount: 6900, avgMinutes: 142 }, { name: "无障碍车位", count: 8, amount: 2100, avgMinutes: 96 }, { name: "充电桩车位", count: 12, amount: 7020, avgMinutes: 188 }] });
      return ok([]);
    }
    if (project === "parking-management" && lower.includes("/space/map")) {
      const selected = params.areaId ? db.parkingAreas.filter((area) => String(area.id) === String(params.areaId)) : db.parkingAreas;
      return ok(selected.map((area) => ({ ...area, spaces: db.parkingSpaces.filter((space) => String(space.areaId) === String(area.id)).map(enrichSpace) })));
    }
    if (project === "parking-management" && lower.includes("/operator/record/preview/")) {
      const id = (url.match(/preview\/(\d+)/) || [])[1];
      const record = db.parkingRecords.find((item) => String(item.id) === String(id)) || db.parkingRecords[0];
      const fee = calcParkingFee(record);
      const hasMonth = db.monthCards.some((card) => plateNorm(card.plateNo) === plateNorm(record.plateNo) && card.status === "VALID" && card.spaceType === record.spaceType);
      const stored = db.storedCards.find((card) => plateNorm(card.plateNo) === plateNorm(record.plateNo) && card.status === "NORMAL");
      const payType = hasMonth ? "MONTH_CARD" : stored && Number(stored.balance) >= fee.amount ? "BALANCE" : (params.payType || "SCAN");
      const actualAmount = hasMonth ? 0 : fee.amount;
      return ok({ record, durationMinutes: fee.minutes, amount: fee.amount, discountAmount: fee.amount - actualAmount, actualAmount, payType, storedCard: stored || null, monthCardValid: hasMonth });
    }
    if (project === "parking-management" && lower.includes("/owner/monthcard")) return ok(clone(db.monthCards));
    if (project === "parking-management" && lower.includes("/owner/storedcard")) return ok(clone(db.storedCards));
    if (project === "parking-management" && lower.includes("/owner/recharge")) return ok(clone(db.rechargeRecords));
    if (project === "parking-management" && lower.includes("/vehicle/owner/my")) return ok(clone(db.vehicles));
    if (project === "parking-management" && lower.includes("/profile/info")) return ok({ id: 1, username: "demo", realName: "测试用户", phone: "13800000000", role: "ADMIN", avatar: "" });
    if (project === "parking-management" && lower.includes("/admin/user/rolestat")) return ok({ ADMIN: 1, OPERATOR: 2, OWNER: 4 });
    if (lower.includes("/stats") || lower.includes("/stat/")) {
      if (lower.includes("overview") || lower.includes("dashboard")) return ok({ userCount: 128, movieCount: 236, bookCount: 4826, borrowCount: 326, todayCount: 86, attendanceRate: 96, equipmentCount: 623, pendingCount: 13, total: 999 });
      return ok([{ name: "一月", value: 32 }, { name: "二月", value: 58 }, { name: "三月", value: 76 }, { name: "四月", value: 64 }]);
    }
    if (lower.includes("/wallet/info")) return ok({ balance: 268.5, frozen: 0 });
    if (lower.includes("/wallet/transactions")) return ok(page([{ id: 1, type: "充值", amount: 100, createTime: "2026-09-22" }], current, size));
    if (lower.includes("/config")) return ok({ maxBorrowDays: 30, maxBorrowCount: 8, finePerDay: 0.5, systemName: "图书馆管理系统" });
    if (lower.includes("/movies/years")) return ok([2026, 2025, 2024, 2014, 2010]);
    if (lower.includes("/movies/countries")) return ok(["中国", "美国", "日本", "英国"]);
    if (lower.includes("/recommend")) return ok(clone(db.movies));
    if (lower.includes("/favorites/toggle")) return ok({ favorite: true });
    if (lower.includes("/favorites") || lower.includes("/browse")) return ok(clone(db.movies));
    if (lower.includes("/face/recognize") || lower.includes("/face/sign")) return ok({ success: true, studentName: "张同学", confidence: 92, status: "正常" });
    if (lower.includes("/face/samples")) return ok([{ id: 1, imageUrl: "", createTime: "2026-09-22" }]);
    if (lower.includes("/face/train") || lower.includes("/face/enroll")) return ok({ sampleCount: 8, message: "训练完成" });
    if (lower.includes("/equipment/types")) return clone(["检测设备", "终端设备", "通信设备"]);
    if (lower.includes("/equipment/stock/")) return clone(db.equipment.filter((item) => item.status === "库存"));
    if (lower.includes("/equipment/my/")) return clone(db.equipment.filter((item) => item.status === "服役中"));
    if (lower.includes("/requests/pending")) return clone(db.requests.filter((item) => item.status === "PENDING"));
    if (lower.includes("/requests/user/")) return clone(db.requests);
    if (lower.includes("/maintenance/worker/")) return clone(db.requests.map((item) => ({ ...item, equipmentName: item.equipmentName || "便携终端", progress: item.progress || 35 })));

    if (lower.includes("/course/common/teachers")) return ok(page(clone(db.teachers), current, size));
    if (lower.includes("/course/common/semesters")) return ok([{ value: "2026-2027-1", label: "2026-2027 学年第 1 学期", isCurrent: true }, { value: "2025-2026-2", label: "2025-2026 学年第 2 学期" }]);
    if (lower.includes("/course/common/classrooms")) return ok([{ id: 1, name: "A302" }, { id: 2, name: "B208" }, { id: 3, name: "C105" }]);
    if (lower.includes("/course/common/courses")) return ok(clone(db.courses));
    if (lower.includes("/course/common/classes")) return ok(clone(db.classes));
    if (lower.includes("/course-selection/available")) return ok(page(clone(db.offerings), current, size));
    if (lower.includes("/course-selection/my-schedule")) return ok(clone(db.offerings.filter((item) => db.selections.some((sel) => sel.offeringId === item.id))));
    if (lower.includes("/course-selection/my-selections")) return ok(page(clone(db.selections), current, size));
    if (lower.includes("/course/teacher/offerings")) return ok(page(clone(db.offerings), current, size));
    if (lower.includes("/course/offering/list")) return ok(page(clone(db.offerings), current, size));
    if (lower.includes("/course/offering/") && lower.includes("/students")) return ok(clone(db.students));
    if (lower.includes("/grade/my-stats")) return ok({ gpa: 3.72, totalCredits: 18, courseCount: 6, passedCount: 6, passRate: 100, rank: 8, totalStudents: 126 });
    if (lower.includes("/grade/my-grades")) return ok(page(clone(db.grades), current, size));
    if (lower.includes("/grade/offering/")) return ok(page(clone(db.grades), current, size));
    if (lower.includes("/grade/pending-audit")) return ok(page(clone(db.offerings.map((item) => ({ ...item, submitStatus: 2, avgScore: 86.4 }))), current, size));
    if (lower.includes("/grade-appeal/my") || lower.includes("/grade-appeal/page")) return ok(page(clone(db.appeals), current, size));
    if (lower.includes("/user/stats/admin")) return ok({ userCount: 42, roleCount: 4, logCount: 128, onlineCount: 6 });
    if (lower.includes("/user/stats/academic")) return ok({ courseCount: 86, offeringCount: 34, studentCount: 1200, pendingGradeCount: 3 });

    if (method === "GET") {
      let rows = normalizeRows(key, clone(listBy(key)));
      if (project === "parking-management") {
        if (params.status) rows = rows.filter((item) => String(item.status) === String(params.status));
        if (params.keyword) {
          const keyword = String(params.keyword).toLowerCase();
          rows = rows.filter((item) => JSON.stringify(item).toLowerCase().includes(keyword));
        }
        if (params.plateNo) rows = rows.filter((item) => plateNorm(item.plateNo).includes(plateNorm(params.plateNo)));
      }
      if (lower.includes("/page")) return ok(page(rows, current, size));
      if (lower.includes("/list") || lower.includes("/all") || lower.includes("/mine") || lower.includes("/active")) return ok(rows);
      const id = (url.match(/\/(\d+)(?:\?|$)/) || [])[1];
      if (id) return ok(key === "products" && project === "campus-marketplace" ? detailVO(clone(listBy(key).find((item) => String(item.id) === id) || listBy(key)[0])) : clone(listBy(key).find((item) => String(item.id) === id) || listBy(key)[0]));
      return ok(rows);
    }

    if (method === "POST") {
      if (project === "parking-management" && lower.includes("/record/calc")) {
        const fake = { entryTime: body.entryTime || new Date(Date.now() - 3 * 3600000).toLocaleString(), spaceType: body.spaceType || "NORMAL" };
        const fee = calcParkingFee(fake);
        return ok({ durationMinutes: fee.minutes, amount: fee.amount });
      }
      if (project === "parking-management" && lower.includes("/operator/record/entry")) {
        const space = db.parkingSpaces.find((item) => String(item.id) === String(body.spaceId)) || db.parkingSpaces.find((item) => item.status === "FREE") || db.parkingSpaces[0];
        const plateNo = plateNorm(body.plateNo || "京Z99999");
        space.status = "OCCUPIED";
        space.plateNo = plateNo;
        space.currentPlateNo = plateNo;
        const record = addItem("parkingRecords", {
          recordNo: "PR" + Date.now(),
          plateNo,
          displayPlateNo: plateNo.replace(/^(.{2})/, "$1·"),
          areaName: space.areaName,
          spaceId: space.id,
          spaceNo: space.spaceNo,
          spaceType: space.spaceType,
          entryTime: new Date().toLocaleString(),
          status: "PARKING",
        });
        return ok(record);
      }
      if (project === "parking-management" && lower.includes("/operator/record/exit")) {
        const record = db.parkingRecords.find((item) => String(item.id) === String(body.recordId || body.id)) || db.parkingRecords.find((item) => item.status === "PARKING");
        const fee = calcParkingFee(record);
        const hasMonth = db.monthCards.some((card) => plateNorm(card.plateNo) === plateNorm(record.plateNo) && card.status === "VALID" && card.spaceType === record.spaceType);
        const actualAmount = hasMonth ? 0 : fee.amount;
        Object.assign(record, { exitTime: new Date().toLocaleString(), durationMinutes: fee.minutes, amount: fee.amount, discountAmount: fee.amount - actualAmount, actualAmount, payType: hasMonth ? "MONTH_CARD" : (body.payType || "SCAN"), status: "PAID" });
        const space = db.parkingSpaces.find((item) => String(item.id) === String(record.spaceId));
        if (space) Object.assign(space, { status: "FREE", plateNo: "", currentPlateNo: "" });
        const payment = addItem("paymentRecords", { payNo: "PAY" + Date.now(), recordNo: record.recordNo, plateNo: record.plateNo, displayPlateNo: record.displayPlateNo, amount: actualAmount, payType: record.payType, operatorName: "收费员李静" });
        return ok({ record, payment });
      }
      if (project === "parking-management" && lower.includes("/card/month/renew/")) {
        return ok(updateItem("monthCards", (url.match(/renew\/(\d+)/) || [])[1], { endDate: "2027-03-31", status: "VALID" }));
      }
      if (project === "parking-management" && lower.includes("/card/stored/recharge")) {
        const card = db.storedCards.find((item) => String(item.id) === String(body.cardId || body.id)) || db.storedCards[0];
        const amount = Number(body.amount || 100);
        card.balance = Number(card.balance || 0) + amount;
        card.totalRecharge = Number(card.totalRecharge || 0) + amount;
        db.rechargeRecords.unshift({ id: ++idSeq, cardNo: card.cardNo, ownerName: card.ownerName, amount, createTime: new Date().toLocaleString(), operatorName: "收费员李静" });
        return ok(card);
      }
      if (lower.includes("/course-selection/select/")) {
        const id = Number((url.match(/select\/(\d+)/) || [])[1]);
        const offering = db.offerings.find((item) => item.id === id);
        if (offering && !db.selections.some((item) => item.offeringId === id)) {
          db.selections.push({ id: ++idSeq, offeringId: id, courseName: offering.courseName, teacherName: offering.teacherName, credit: offering.credit });
          offering.selectedCount += 1;
        }
        return ok(true);
      }
      if (lower.includes("/course-selection/drop/")) {
        const id = Number((url.match(/drop\/(\d+)/) || [])[1]);
        removeItem("selections", db.selections.find((item) => item.offeringId === id)?.id);
        const offering = db.offerings.find((item) => item.id === id);
        if (offering) offering.selectedCount = Math.max(0, offering.selectedCount - 1);
        return ok(true);
      }
      if (lower.includes("/grade/batch-input")) {
        const rows = Array.isArray(body) ? body : [];
        rows.forEach((row) => {
          const currentGrade = db.grades.find((item) => item.studentId === row.studentId && item.offeringId === row.offeringId);
          if (currentGrade) Object.assign(currentGrade, row, { gradeStatus: 1, totalScore: Number(((row.usualScore || 0) * 0.3 + (row.finalScore || 0) * 0.7).toFixed(1)) });
        });
        return ok(true);
      }
      if (lower.includes("/grade/input")) return ok(addItem("grades", { ...body, gradeStatus: 1 }));
      if (lower.includes("/grade/submit/")) {
        db.grades.forEach((item) => { item.gradeStatus = Math.max(item.gradeStatus || 0, 2); });
        return ok(true);
      }
      if (lower.includes("/grade/audit/") || lower.includes("/grade/publish/")) {
        db.grades.forEach((item) => { item.gradeStatus = lower.includes("publish") ? 4 : 3; });
        return ok(true);
      }
      if (lower.includes("/grade-appeal/submit")) return ok(addItem("appeals", { gradeId: params.gradeId || 1, appealReason: params.appealReason || "申请复核", status: 0 }));
      if (lower.includes("/grade-appeal/process/")) return ok(updateItem("appeals", (url.match(/process\/(\d+)/) || [])[1], { status: params.approved === "true" ? 1 : 2, processResult: params.result || params.remark || "已处理" }));
      if (lower.includes("/borrow/return")) return ok(updateItem("borrows", body.id || body.borrowId || 1, { status: 2, returnDate: new Date().toLocaleDateString() }));
      if (lower.includes("/borrow/renew")) return ok(updateItem("borrows", body.id || body.borrowId || 1, { dueDate: "2026-10-28" }));
      if (lower.includes("/borrow")) return ok(addItem("borrows", { ...body, bookName: "数据库系统概论", readerName: "张同学", status: 1 }));
      if (lower.includes("/reservation")) return ok(addItem("borrows", { ...body, bookName: "Java 编程思想", readerName: "张同学", status: "已预约" }));
      if (lower.includes("/fine/pay")) return ok(true);
      if (lower.includes("/appointment/book")) {
        const schedule = db.schedules.find((item) => String(item.id) === String(body.scheduleId)) || db.schedules[0];
        if (schedule) schedule.leftNum = Math.max(0, (schedule.leftNum || 1) - 1);
        return ok(addItem("appointments", { ...body, patientName: "测试患者", doctorName: schedule?.doctorName || "李医生", departmentName: schedule?.departmentName || "内科", status: 1 }));
      }
      if (lower.includes("/record")) return ok(addItem("records", { ...body, patientName: "测试患者", doctorName: "李医生" }));
      if (lower.includes("/prescription")) return ok(addItem("prescriptions", { ...body, patientName: "测试患者", amount: 58, status: 0 }));
      if (lower.includes("/requests/borrow")) return ok(addItem("requests", { ...body, type: "BORROW", status: "PENDING", applicantName: "普通用户" }));
      if (lower.includes("/requests/scrap")) return ok(addItem("requests", { ...body, type: "SCRAP", status: "PENDING", applicantName: "普通用户" }));
      if (lower.includes("/requests/") && lower.includes("/approve")) return ok(updateItem("requests", (url.match(/requests\/(\d+)/) || [])[1], { status: "APPROVED" }));
      if (lower.includes("/requests/") && lower.includes("/reject")) return ok(updateItem("requests", (url.match(/requests\/(\d+)/) || [])[1], { status: "REJECTED" }));
      if (lower.includes("/maintenance/") && lower.includes("/progress")) return ok(updateItem("requests", (url.match(/maintenance\/(\d+)/) || [])[1], { progress: Number(params.progress || 100), status: params.status || "PROCESSING" }));
      if (lower.includes("/delete/") || lower.includes("/cancel") || lower.includes("/remove")) {
        removeItem(key, (url.match(/\/(\d+)(?:\?|$)/) || [])[1]);
        return ok(true);
      }
      if (lower.includes("/approve") || lower.includes("/reject") || lower.includes("/pay") || lower.includes("/ship") || lower.includes("/confirm") || lower.includes("/status") || lower.includes("/progress")) return ok(true);
      return ok(addItem(key, body));
    }

    if (method === "PUT" || method === "PATCH") {
      const id = (url.match(/\/(\d+)(?:\?|$)/) || [])[1] || body.id;
      return ok(updateItem(key, id, body));
    }

    if (method === "DELETE") {
      removeItem(key, (url.match(/\/(\d+)(?:\?|$)/) || [])[1]);
      return ok(true);
    }

    return ok(null);
  };

  const payloadForProject = (payload) => {
    if (project === "equipment-system" && payload && payload.code === 200 && Object.prototype.hasOwnProperty.call(payload, "data")) {
      return payload.data;
    }
    return payload;
  };

  const makeResponse = (data, status = 200) => new Response(JSON.stringify(payloadForProject(data)), { status, headers: { "Content-Type": "application/json" } });
  const originalFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init = {}) {
    const url = typeof input === "string" ? input : input.url;
    if (/\/api|localhost:8088|127\.0\.0\.1:8088/.test(url)) {
      return Promise.resolve(makeResponse(handle((init.method || "GET").toUpperCase(), url, init.body)));
    }
    return originalFetch ? originalFetch(input, init) : Promise.resolve(makeResponse(ok()));
  };

  const OriginalXHR = window.XMLHttpRequest;
  function MockXHR() {
    const xhr = new OriginalXHR();
    let method = "GET";
    let url = "";
    let async = true;
    let headers = {};
    let mocked = false;
    const listeners = {};
    const fire = (type) => {
      if (typeof xhr["on" + type] === "function") xhr["on" + type]();
      (listeners[type] || []).forEach((fn) => fn.call(xhr));
    };
    const originalOpen = xhr.open;
    xhr.open = function (m, u, a = true) {
      method = String(m || "GET").toUpperCase();
      url = String(u || "");
      async = a !== false;
      mocked = /\/api|localhost:8088|127\.0\.0\.1:8088/.test(url);
      if (!mocked) return originalOpen.apply(xhr, arguments);
    };
    const originalSet = xhr.setRequestHeader;
    xhr.setRequestHeader = function (k, v) {
      headers[k] = v;
      if (!mocked) return originalSet.apply(xhr, arguments);
    };
    const originalGetHeader = xhr.getResponseHeader;
    xhr.getResponseHeader = function (name) {
      if (!mocked) return originalGetHeader.apply(xhr, arguments);
      return String(name).toLowerCase() === "content-type" ? "application/json" : null;
    };
    const originalGetAllHeaders = xhr.getAllResponseHeaders;
    xhr.getAllResponseHeaders = function () {
      if (!mocked) return originalGetAllHeaders.apply(xhr, arguments);
      return "content-type: application/json\r\n";
    };
    const originalAdd = xhr.addEventListener;
    xhr.addEventListener = function (type, fn) {
      if (!mocked) return originalAdd.apply(xhr, arguments);
      (listeners[type] || (listeners[type] = [])).push(fn);
    };
    const originalSend = xhr.send;
    xhr.send = function (body) {
      if (!mocked) return originalSend.apply(xhr, arguments);
      const data = payloadForProject(handle(method, url, body));
      const text = JSON.stringify(data);
      const complete = () => {
        Object.defineProperty(xhr, "readyState", { value: 4, configurable: true });
        Object.defineProperty(xhr, "status", { value: 200, configurable: true });
        Object.defineProperty(xhr, "statusText", { value: "OK", configurable: true });
        Object.defineProperty(xhr, "responseText", { value: text, configurable: true });
        Object.defineProperty(xhr, "response", { value: text, configurable: true });
        fire("readystatechange");
        fire("load");
        fire("loadend");
      };
      async ? setTimeout(complete, 80) : complete();
    };
    return xhr;
  }
  window.XMLHttpRequest = MockXHR;
})();
