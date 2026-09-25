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
      { id: 1, areaCode: "A", areaName: "A区·地面综合停车区", areaType: "GROUND", floorName: "地面一层", totalSpaces: 8, description: "靠近东门出入口，普通燃油车为主", status: 1 },
      { id: 2, areaCode: "B", areaName: "B区·地下负一层停车区", areaType: "UNDERGROUND", floorName: "地下负一层", totalSpaces: 8, description: "紧邻商场电梯厅，车位充裕", status: 1 },
      { id: 3, areaCode: "C", areaName: "C区·新能源充电专区", areaType: "GROUND", floorName: "地面二层", totalSpaces: 8, description: "新能源与充电桩专用车位", status: 1 },
      { id: 4, areaCode: "D", areaName: "D区·地下负二层停车区", areaType: "UNDERGROUND", floorName: "地下负二层", totalSpaces: 6, description: "以长租月租车位为主", status: 1 },
      { id: 5, areaCode: "E", areaName: "E区·临时访客停车区", areaType: "GROUND", floorName: "地面一层", totalSpaces: 6, description: "临停短时停放，靠近西门", status: 1 },
      { id: 6, areaCode: "F", areaName: "F区·无障碍专用停车区", areaType: "GROUND", floorName: "地面一层", totalSpaces: 4, description: "设无障碍通道", status: 1 },
    ],
    parkingSpaces: [
      ["A-001",1,"NORMAL","FREE",""],["A-002",1,"NORMAL","OCCUPIED","京F10288"],["A-003",1,"NORMAL","FREE",""],["A-004",1,"NORMAL","OCCUPIED","京A12345"],["A-005",1,"NORMAL","MAINTENANCE",""],["A-006",1,"NORMAL","FREE",""],["A-007",1,"NORMAL","RESERVED",""],["A-008",1,"NORMAL","FREE",""],
      ["B-101",2,"NORMAL","OCCUPIED","沪A66666"],["B-102",2,"NORMAL","FREE",""],["B-103",2,"NORMAL","OCCUPIED","京E77521"],["B-104",2,"NORMAL","FREE",""],["B-105",2,"NORMAL","OCCUPIED","粤B12345"],["B-106",2,"NORMAL","FREE",""],["B-107",2,"NORMAL","OCCUPIED","京C45000"],["B-108",2,"NORMAL","FREE",""],
      ["C-201",3,"NEW_ENERGY","OCCUPIED","京AD67890"],["C-202",3,"NEW_ENERGY","OCCUPIED","京AF13579"],["C-203",3,"CHARGING","OCCUPIED","京N88112"],["C-204",3,"CHARGING","OCCUPIED","京AF97531"],["C-205",3,"CHARGING","MAINTENANCE",""],["C-206",3,"NEW_ENERGY","FREE",""],["C-207",3,"NEW_ENERGY","FREE",""],["C-208",3,"NEW_ENERGY","OCCUPIED","京AF24680"],
      ["D-301",4,"NORMAL","OCCUPIED","京G56789"],["D-302",4,"NORMAL","FREE",""],["D-303",4,"NORMAL","FREE",""],["D-304",4,"NORMAL","RESERVED",""],["D-305",4,"NORMAL","FREE",""],["D-306",4,"NORMAL","FREE",""],
      ["E-401",5,"NORMAL","OCCUPIED","京H23456"],["E-402",5,"NORMAL","FREE",""],["E-403",5,"NORMAL","OCCUPIED","京D55000"],["E-404",5,"NORMAL","FREE",""],["E-405",5,"NORMAL","FREE",""],["E-406",5,"NORMAL","FREE",""],
      ["F-501",6,"DISABLED","FREE",""],["F-502",6,"DISABLED","OCCUPIED","京Q88888"],["F-503",6,"DISABLED","OCCUPIED","京B35000"],["F-504",6,"DISABLED","FREE",""]
    ].map((row, index) => ({ id: index + 1, spaceNo: row[0], areaId: row[1], spaceType: row[2], status: row[3], plateNo: row[4] })),
    parkingRecords: [
      ["PR20260925002","京F10288",2,"A-002",1,"A区·地面综合停车区","NORMAL","2026-09-25 08:30:00"],
      ["PR20260925003","京H23456",31,"E-401",5,"E区·临时访客停车区","NORMAL","2026-09-25 09:10:00"],
      ["PR20260925004","京AD67890",17,"C-201",3,"C区·新能源充电专区","NEW_ENERGY","2026-09-25 07:00:00"],
      ["PR20260925005","京C45000",15,"B-107",2,"B区·地下负一层停车区","NORMAL","2026-09-25 10:20:00"],
      ["PR20260925006","京D55000",33,"E-403",5,"E区·临时访客停车区","NORMAL","2026-09-25 06:40:00"],
      ["PR20260925007","京Q88888",38,"F-502",6,"F区·无障碍专用停车区","DISABLED","2026-09-25 11:00:00"],
      ["PR20260925008","京AF13579",18,"C-202",3,"C区·新能源充电专区","NEW_ENERGY","2026-09-25 12:30:00"],
      ["PR20260925009","京AF24680",24,"C-208",3,"C区·新能源充电专区","NEW_ENERGY","2026-09-25 13:15:00"],
      ["PR20260925010","京AF97531",20,"C-204",3,"C区·新能源充电专区","CHARGING","2026-09-25 14:00:00"],
      ["PR20260925011","沪A66666",9,"B-101",2,"B区·地下负一层停车区","NORMAL","2026-09-25 08:05:00"],
      ["PR20260925012","京E77521",11,"B-103",2,"B区·地下负一层停车区","NORMAL","2026-09-25 09:45:00"],
      ["PR20260925013","粤B12345",13,"B-105",2,"B区·地下负一层停车区","NORMAL","2026-09-25 10:50:00"],
      ["PR20260925014","京N88112",19,"C-203",3,"C区·新能源充电专区","CHARGING","2026-09-25 11:35:00"],
      ["PR20260925015","京G56789",25,"D-301",4,"D区·地下负二层停车区","NORMAL","2026-09-25 12:10:00"],
      ["PR20260925016","京B35000",39,"F-503",6,"F区·无障碍专用停车区","DISABLED","2026-09-25 13:40:00"],
      ["PR20260925017","京A12345",4,"A-004",1,"A区·地面综合停车区","NORMAL","2026-09-25 07:20:00"]
    ].map((row, index) => ({ id: index + 25, recordNo: row[0], plateNo: row[1], displayPlateNo: String(row[1]).replace(/^(.{2})/, "$1·"), spaceId: row[2], spaceNo: row[3], areaId: row[4], areaName: row[5], spaceType: row[6], entryTime: row[7], exitTime: "", durationMinutes: 0, amount: 0, paidAmount: 0, discountAmount: 0, payType: "UNPAID", payStatus: "UNPAID", status: "PARKING" })).concat([
      { id: 42, recordNo: "PR20260925019", plateNo: "京C30927", displayPlateNo: "京C·30927", spaceId: 10, spaceNo: "B-102", areaId: 2, areaName: "B区·地下负一层停车区", spaceType: "NORMAL", entryTime: "2026-09-25 12:00:00", exitTime: "2026-09-25 15:10:00", durationMinutes: 190, amount: 11, paidAmount: 11, discountAmount: 0, payType: "BALANCE", payStatus: "PAID", status: "EXITED" },
      { id: 41, recordNo: "PR20260925018", plateNo: "京D55001", displayPlateNo: "京D·55001", spaceId: 1, spaceNo: "A-001", areaId: 1, areaName: "A区·地面综合停车区", spaceType: "NORMAL", entryTime: "2026-09-25 09:15:00", exitTime: "2026-09-25 11:45:00", durationMinutes: 150, amount: 8, paidAmount: 8, discountAmount: 0, payType: "SCAN", payStatus: "PAID", status: "EXITED" },
      { id: 24, recordNo: "PR20260925001", plateNo: "京E65000", displayPlateNo: "京E·65000", spaceId: 22, spaceNo: "C-206", areaId: 3, areaName: "C区·新能源充电专区", spaceType: "NEW_ENERGY", entryTime: "2026-09-25 07:50:00", exitTime: "2026-09-25 08:40:00", durationMinutes: 50, amount: 0, paidAmount: 0, discountAmount: 0, payType: "CASH", payStatus: "PAID", status: "EXITED" },
      { id: 23, recordNo: "PR20260924001", plateNo: "京Q88888", displayPlateNo: "京Q·88888", spaceId: 37, spaceNo: "F-501", areaId: 6, areaName: "F区·无障碍专用停车区", spaceType: "DISABLED", entryTime: "2026-09-24 08:00:00", exitTime: "2026-09-24 14:00:00", durationMinutes: 360, amount: 7.5, paidAmount: 0, discountAmount: 7.5, payType: "MONTH_CARD", payStatus: "PAID", status: "EXITED" },
      { id: 22, recordNo: "PR20260923001", plateNo: "京G56789", displayPlateNo: "京G·56789", spaceId: 26, spaceNo: "D-302", areaId: 4, areaName: "D区·地下负二层停车区", spaceType: "NORMAL", entryTime: "2026-09-23 18:00:00", exitTime: "2026-09-23 21:40:00", durationMinutes: 220, amount: 14, paidAmount: 0, discountAmount: 14, payType: "MONTH_CARD", payStatus: "PAID", status: "EXITED" },
      { id: 21, recordNo: "PR20260922001", plateNo: "京AF97531", displayPlateNo: "京AF·97531", spaceId: 20, spaceNo: "C-204", areaId: 3, areaName: "C区·新能源充电专区", spaceType: "CHARGING", entryTime: "2026-09-22 08:30:00", exitTime: "2026-09-22 16:30:00", durationMinutes: 480, amount: 34, paidAmount: 34, discountAmount: 0, payType: "SCAN", payStatus: "PAID", status: "EXITED" }
    ]),
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
      { id: 26, paymentNo: "PY20260925003", recordId: 42, recordNo: "PR20260925019", plateNo: "京C30927", displayPlateNo: "京C·30927", amount: 11, paidAmount: 11, discountAmount: 0, payType: "BALANCE", payChannel: "储值卡余额", operatorName: "收费员李静", payTime: "2026-09-25 15:10:00" },
      { id: 25, paymentNo: "PY20260925002", recordId: 41, recordNo: "PR20260925018", plateNo: "京D55001", displayPlateNo: "京D·55001", amount: 8, paidAmount: 8, discountAmount: 0, payType: "SCAN", payChannel: "扫码支付", operatorName: "收费员李静", payTime: "2026-09-25 11:45:00" },
      { id: 24, paymentNo: "PY20260925001", recordId: 24, recordNo: "PR20260925001", plateNo: "京E65000", displayPlateNo: "京E·65000", amount: 0, paidAmount: 0, discountAmount: 0, payType: "CASH", payChannel: "现金", operatorName: "收费员李静", payTime: "2026-09-25 08:40:00" },
      { id: 23, paymentNo: "PY20260924001", recordId: 23, recordNo: "PR20260924001", plateNo: "京Q88888", displayPlateNo: "京Q·88888", amount: 7.5, paidAmount: 0, discountAmount: 7.5, payType: "MONTH_CARD", payChannel: "月卡自动抵扣", operatorName: "收费员李静", payTime: "2026-09-24 14:00:00" },
      { id: 22, paymentNo: "PY20260923001", recordId: 22, recordNo: "PR20260923001", plateNo: "京G56789", displayPlateNo: "京G·56789", amount: 14, paidAmount: 0, discountAmount: 14, payType: "MONTH_CARD", payChannel: "月卡自动抵扣", operatorName: "收费员李静", payTime: "2026-09-23 21:40:00" },
      { id: 21, paymentNo: "PY20260922001", recordId: 21, recordNo: "PR20260922001", plateNo: "京AF97531", displayPlateNo: "京AF·97531", amount: 34, paidAmount: 34, discountAmount: 0, payType: "SCAN", payChannel: "扫码支付", operatorName: "收费员李静", payTime: "2026-09-22 16:30:00" },
      { id: 20, paymentNo: "PY20260920001", recordId: 20, recordNo: "PR20260920001", plateNo: "京B66888", displayPlateNo: "京B·66888", amount: 38, paidAmount: 0, discountAmount: 38, payType: "MONTH_CARD", payChannel: "月卡自动抵扣", operatorName: "收费员李静", payTime: "2026-09-20 20:15:00" }
    ],
    sysConfigs: [{ id: 1, configKey: "free_minutes_default", configValue: "15", configGroup: "billing", remark: "默认免费分钟数", status: 1 }],
  };

  const listBy = (key) => db[key] || [];
  db.parkingSpaces.forEach((space) => {
    const area = db.parkingAreas.find((item) => Number(item.id) === Number(space.areaId));
    space.areaName = area?.areaName || "";
  });
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
        todayRecords: db.parkingRecords.filter((item) => String(item.entryTime || "").startsWith("2026-09-25")).length,
        recordTotal: db.parkingRecords.length,
        todayIncome: db.paymentRecords.filter((item) => String(item.payTime || "").startsWith("2026-09-25")).reduce((sum, item) => sum + Number(item.paidAmount || 0), 0),
        totalIncome: db.paymentRecords.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0),
        validMonthCard: db.monthCards.filter((item) => item.status === "VALID").length,
        expiredMonthCard: db.monthCards.filter((item) => item.status === "EXPIRED").length,
        storedBalance: db.storedCards.reduce((sum, item) => sum + Number(item.balance || 0), 0),
        storedCardCount: db.storedCards.length,
      });
      if (lower.includes("income/trend")) return ok(parkingTrend());
      if (lower.includes("income/month")) return ok({ months: ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09"], amounts: [28600, 30180, 34220, 36100, 38620], counts: [520, 558, 606, 642, 684] });
      if (lower.includes("traffic/hour")) return ok({ labels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"], values: [3, 1, 0, 6, 18, 24, 16, 19, 25, 31, 22, 12] });
      if (lower.includes("space/type")) return ok({ data: [
        { name: "普通车位", value: db.parkingSpaces.filter((item) => item.spaceType === "NORMAL" && item.status === "OCCUPIED").length },
        { name: "新能源", value: db.parkingSpaces.filter((item) => item.spaceType === "NEW_ENERGY" && item.status === "OCCUPIED").length },
        { name: "无障碍", value: db.parkingSpaces.filter((item) => item.spaceType === "DISABLED" && item.status === "OCCUPIED").length },
        { name: "充电桩", value: db.parkingSpaces.filter((item) => item.spaceType === "CHARGING" && item.status === "OCCUPIED").length },
      ] });
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
    if (project === "campus-marketplace" && lower.includes("/admin/stats")) return ok({
      userCount: db.users.length,
      productCount: db.products.length,
      orderCount: db.orders.length,
      salesAmount: db.orders.filter((item) => Number(item.status) === 3).reduce((sum, item) => sum + Number(item.totalAmount || item.amount || 0), 0),
      statusDist: [{ name: "待付款", value: 1 }, { name: "已完成", value: 1 }],
      categoryDist: db.categories.map((item) => ({ name: item.name, value: db.products.filter((product) => product.categoryId === item.id).length })),
      trend: [{ name: "09-20", value: 2 }, { name: "09-21", value: 4 }, { name: "09-22", value: 5 }, { name: "09-23", value: 3 }, { name: "09-24", value: 6 }, { name: "09-25", value: 8 }],
    });
    if (project === "clinic-appointment" && lower.includes("/stats/dashboard")) return ok({
      departmentCount: db.departments.length,
      doctorCount: db.doctors.length,
      patientCount: new Set(db.appointments.map((item) => item.patientName)).size + 5,
      todayAppointments: db.appointments.length,
    });
    if (project === "clinic-appointment" && lower.includes("/stats/charts")) return ok({
      deptVisits: db.departments.map((item, index) => ({ name: item.name, value: [18, 13, 9, 7][index] || 5 })),
      trend: [{ day: "09-19", cnt: 12 }, { day: "09-20", cnt: 16 }, { day: "09-21", cnt: 9 }, { day: "09-22", cnt: 21 }, { day: "09-23", cnt: 18 }, { day: "09-24", cnt: 24 }, { day: "09-25", cnt: 17 }],
      doctorWorkload: db.doctors.map((item, index) => ({ name: item.name, value: [26, 19][index] || 12 })),
    });
    if (project === "library-management" && lower.includes("/stats/overview")) return ok({
      totalBooks: db.books.length,
      totalCopies: db.books.reduce((sum, item) => sum + Number(item.stock || 0), 0),
      totalReaders: db.readers.length,
      currentBorrowing: db.borrows.filter((item) => Number(item.status) === 1).length,
      overdueCount: db.borrows.filter((item) => Number(item.status) === 1 && String(item.dueDate) < "2026-09-25").length,
      unpaidFineAmount: 6.5,
    });
    if (project === "library-management" && lower.includes("/stats/borrow-trend")) return ok([
      { month: "2026-04", count: 86 }, { month: "2026-05", count: 104 }, { month: "2026-06", count: 128 }, { month: "2026-07", count: 72 }, { month: "2026-08", count: 91 }, { month: "2026-09", count: 116 },
    ]);
    if (project === "library-management" && lower.includes("/stats/category-ratio")) return ok([
      { name: "计算机", cnt: 38 }, { name: "文学", cnt: 27 }, { name: "历史", cnt: 16 }, { name: "经济管理", cnt: 19 },
    ]);
    if (project === "library-management" && lower.includes("/stats/hot-books")) return ok(db.books.map((item, index) => ({ title: item.title, cnt: [28, 23][index] || 12 })));
    if (project === "movie-recommend" && lower.includes("/stats/overview")) return ok({ movies: db.movies.length, users: db.users.length, ratings: 126, reviews: db.reviews.length, genres: db.genres.length, persons: 18 });
    if (project === "movie-recommend" && lower.includes("/stats/genre-distribution")) return ok([{ name: "科幻", value: 36 }, { name: "悬疑", value: 28 }, { name: "剧情", value: 42 }]);
    if (project === "movie-recommend" && lower.includes("/stats/score-distribution")) return ok([{ name: "6-7", value: 12 }, { name: "7-8", value: 31 }, { name: "8-9", value: 54 }, { name: "9-10", value: 29 }]);
    if (project === "movie-recommend" && lower.includes("/stats/year-trend")) return ok([{ year: "2022", value: 18 }, { year: "2023", value: 25 }, { year: "2024", value: 34 }, { year: "2025", value: 42 }, { year: "2026", value: 51 }]);
    if (project === "movie-recommend" && lower.includes("/stats/top-movies")) return ok(db.movies.map((item) => ({ name: item.title, title: item.title, value: item.score, score: item.score })));
    if (project === "movie-recommend" && lower.includes("/stats/user-activity")) return ok([{ name: "09-21", value: 32 }, { name: "09-22", value: 46 }, { name: "09-23", value: 39 }, { name: "09-24", value: 58 }, { name: "09-25", value: 61 }]);
    if (project === "movie-recommend" && lower.includes("/stats/country-distribution")) return ok([{ name: "中国", value: 42 }, { name: "美国", value: 38 }, { name: "日本", value: 20 }]);
    if (project === "face-attendance" && lower.includes("/stat/overview")) return ok({
      student_count: db.students.length,
      teacher_count: db.teachers.length,
      course_count: db.courses.length,
      today_sign: db.attendance.length,
      pending_leave: db.leaves.filter((item) => Number(item.status) === 0).length,
      attendance_rate: 96,
      recent: db.attendance.map((item) => ({ student_name: item.studentName, course_name: item.courseName, status: item.status, sign_time: `2026-09-25 ${item.signTime}:00` })),
    });
    if (project === "face-attendance" && lower.includes("/stat/trend")) return ok([{ session_name: "软件工程", rate: 96 }, { session_name: "数据库原理", rate: 92 }, { session_name: "Python 程序设计", rate: 94 }]);
    if (project === "face-attendance" && lower.includes("/stat/class-compare")) return ok([{ class_name: "软件 2401", rate: 96 }, { class_name: "软件 2402", rate: 91 }, { class_name: "计科 2401", rate: 94 }]);
    if (project === "face-attendance" && lower.includes("/stat/rank")) return ok([{ student_name: "张同学", rate: 100 }, { student_name: "李同学", rate: 96 }]);
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
        Object.assign(record, { exitTime: new Date().toLocaleString(), durationMinutes: fee.minutes, amount: fee.amount, paidAmount: actualAmount, discountAmount: fee.amount - actualAmount, actualAmount, payType: hasMonth ? "MONTH_CARD" : (body.payType || "SCAN"), payStatus: "PAID", status: "EXITED" });
        const space = db.parkingSpaces.find((item) => String(item.id) === String(record.spaceId));
        if (space) Object.assign(space, { status: "FREE", plateNo: "", currentPlateNo: "" });
        const payment = addItem("paymentRecords", { paymentNo: "PY" + Date.now(), recordId: record.id, recordNo: record.recordNo, plateNo: record.plateNo, displayPlateNo: record.displayPlateNo, amount: fee.amount, paidAmount: actualAmount, discountAmount: fee.amount - actualAmount, payType: record.payType, payChannel: record.payType === "MONTH_CARD" ? "月卡自动抵扣" : "现场收款", operatorName: "收费员李静", payTime: new Date().toLocaleString() });
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
