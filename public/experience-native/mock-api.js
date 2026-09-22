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
    sessions: [{ id: 1, courseName: "软件工程", className: "软件 2401", startTime: "2026-09-22 08:00", status: 1 }],
    attendance: [{ id: 1, studentName: "张同学", courseName: "软件工程", signTime: "08:03", status: "正常" }],
    leaves: [{ id: 1, studentName: "李同学", courseName: "数据库原理", reason: "身体不适", status: 0 }],
    equipment: [{ id: 1, name: "光谱检测仪", type: "检测设备", status: "库存", health: 96 }, { id: 2, name: "便携终端", type: "终端设备", status: "服役中", health: 82 }],
    requests: [{ id: 1, equipmentName: "便携终端", applicantName: "普通用户", type: "BORROW", status: "PENDING", progress: 35 }],
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
    if (u.includes("category") || u.includes("genre")) return u.includes("genre") ? "genres" : "categories";
    if (u.includes("product")) return "products";
    if (u.includes("order")) return "orders";
    if (u.includes("message")) return "messages";
    if (u.includes("address")) return "addresses";
    if (u.includes("department")) return "departments";
    if (u.includes("doctor")) return "doctors";
    if (u.includes("schedule")) return "schedules";
    if (u.includes("appointment")) return "appointments";
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

    if (lower.includes("/auth/login")) {
      const username = body.username || "demo";
      const role = username.includes("admin") ? "ADMIN" : username.includes("doctor") ? "DOCTOR" : username.includes("worker") ? "WORKER" : username.includes("teacher") ? "TEACHER" : username.includes("student") ? "STUDENT" : username.includes("patient") ? "PATIENT" : "USER";
      return ok({ token: "demo-token", userInfo: { id: 1, username, realName: "测试用户", fullName: "测试用户", role, userType: role === "STUDENT" ? 1 : role === "TEACHER" ? 2 : role === "ADMIN" ? 4 : 3, roles: ["ROLE_" + role] }, role, fullName: "测试用户" });
    }
    if (lower.includes("/auth/info") || lower.includes("/auth/me")) return ok({ id: 1, username: "demo", realName: "测试用户", role: "ADMIN", userType: 4, roles: ["ROLE_SYSTEM_ADMIN"] });
    if (lower.includes("/upload") || lower.includes("/file/upload")) return ok({ url: "https://dummyimage.com/480x320/daeafe/334155&text=Mock+Image" });
    if (lower.includes("export")) return ok("mock-export");
    if (lower.includes("/stats") || lower.includes("/stat/")) {
      if (lower.includes("overview") || lower.includes("dashboard")) return ok({ userCount: 128, movieCount: 236, bookCount: 4826, borrowCount: 326, todayCount: 86, attendanceRate: 96, equipmentCount: 623, pendingCount: 13, total: 999 });
      return ok([{ name: "一月", value: 32 }, { name: "二月", value: 58 }, { name: "三月", value: 76 }, { name: "四月", value: 64 }]);
    }
    if (lower.includes("/wallet/info")) return ok({ balance: 268.5, frozen: 0 });
    if (lower.includes("/wallet/transactions")) return ok(page([{ id: 1, type: "充值", amount: 100, createTime: "2026-09-22" }], current, size));
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

    if (method === "GET") {
      const rows = normalizeRows(key, clone(listBy(key)));
      if (lower.includes("/page")) return ok(page(rows, current, size));
      if (lower.includes("/list") || lower.includes("/all") || lower.includes("/mine") || lower.includes("/active")) return ok(rows);
      const id = (url.match(/\/(\d+)(?:\?|$)/) || [])[1];
      if (id) return ok(key === "products" && project === "campus-marketplace" ? detailVO(clone(listBy(key).find((item) => String(item.id) === id) || listBy(key)[0])) : clone(listBy(key).find((item) => String(item.id) === id) || listBy(key)[0]));
      return ok(rows);
    }

    if (method === "POST") {
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
