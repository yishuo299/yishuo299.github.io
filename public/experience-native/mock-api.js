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
    financeAccounts: [
      { id: 201, userId: 2, name: "招商银行卡", type: "BANK", typeLabel: "银行卡", initialBalance: 5000, balance: 27279.9, creditLimit: 0, usedCredit: 0, availableCredit: 0, icon: "CreditCard", color: "#10b981", remark: "工资与主要储蓄账户", status: 1, isCredit: false },
      { id: 202, userId: 2, name: "支付宝", type: "ALIPAY", typeLabel: "支付宝", initialBalance: 4000, balance: 3226, creditLimit: 0, usedCredit: 0, availableCredit: 0, icon: "Wallet", color: "#1677ff", remark: "日常小额消费", status: 1, isCredit: false },
      { id: 203, userId: 2, name: "微信钱包", type: "WECHAT", typeLabel: "微信", initialBalance: 7000, balance: 1502, creditLimit: 0, usedCredit: 0, availableCredit: 0, icon: "Wallet", color: "#07c160", remark: "生活缴费", status: 1, isCredit: false },
      { id: 204, userId: 2, name: "交通信用卡", type: "CREDIT", typeLabel: "信用卡", initialBalance: 0, balance: -1650, creditLimit: 20000, usedCredit: 1650, availableCredit: 18350, icon: "CreditCard", color: "#ef4444", remark: "账单日每月 12 日", status: 1, isCredit: true },
      { id: 205, userId: 2, name: "现金", type: "CASH", typeLabel: "现金", initialBalance: 800, balance: 787.5, creditLimit: 0, usedCredit: 0, availableCredit: 0, icon: "Money", color: "#f59e0b", remark: "随身现金", status: 1, isCredit: false },
    ],
    financeUsers: [
      { id: 1, username: "admin", realName: "系统管理员", role: "ADMIN", avatar: "", email: "admin@example.com", phone: "13800000001", status: 1, createTime: "2026-07-01 09:00:00" },
      { id: 2, username: "zhangsan", realName: "张伟", role: "USER", avatar: "", email: "zhangsan@example.com", phone: "13800000002", status: 1, createTime: "2026-07-02 10:20:00" },
      { id: 3, username: "lisi", realName: "李娜", role: "USER", avatar: "", email: "lisi@example.com", phone: "13800000003", status: 1, createTime: "2026-07-03 11:30:00" },
    ],
    financeCategories: [
      { id: 301, name: "餐饮", type: "EXPENSE", icon: "Food", color: "#f97316", parentId: null, parentName: null, fullName: "餐饮", isSystem: true, sort: 1 },
      { id: 302, name: "早餐", type: "EXPENSE", icon: "Coffee", color: "#fb923c", parentId: 301, parentName: "餐饮", fullName: "餐饮 / 早餐", isSystem: true, sort: 1 },
      { id: 303, name: "午餐", type: "EXPENSE", icon: "Food", color: "#fb923c", parentId: 301, parentName: "餐饮", fullName: "餐饮 / 午餐", isSystem: true, sort: 2 },
      { id: 304, name: "聚餐", type: "EXPENSE", icon: "Dish", color: "#f97316", parentId: 301, parentName: "餐饮", fullName: "餐饮 / 聚餐", isSystem: true, sort: 3 },
      { id: 305, name: "交通", type: "EXPENSE", icon: "Van", color: "#3b82f6", parentId: null, parentName: null, fullName: "交通", isSystem: true, sort: 2 },
      { id: 306, name: "地铁公交", type: "EXPENSE", icon: "Guide", color: "#60a5fa", parentId: 305, parentName: "交通", fullName: "交通 / 地铁公交", isSystem: true, sort: 1 },
      { id: 307, name: "打车", type: "EXPENSE", icon: "Van", color: "#3b82f6", parentId: 305, parentName: "交通", fullName: "交通 / 打车", isSystem: true, sort: 2 },
      { id: 308, name: "居住", type: "EXPENSE", icon: "House", color: "#8b5cf6", parentId: null, parentName: null, fullName: "居住", isSystem: true, sort: 3 },
      { id: 309, name: "房租", type: "EXPENSE", icon: "House", color: "#a78bfa", parentId: 308, parentName: "居住", fullName: "居住 / 房租", isSystem: true, sort: 1 },
      { id: 310, name: "购物", type: "EXPENSE", icon: "ShoppingBag", color: "#ec4899", parentId: null, parentName: null, fullName: "购物", isSystem: true, sort: 4 },
      { id: 311, name: "日用品", type: "EXPENSE", icon: "ShoppingCart", color: "#f472b6", parentId: 310, parentName: "购物", fullName: "购物 / 日用品", isSystem: true, sort: 1 },
      { id: 312, name: "工资", type: "INCOME", icon: "Money", color: "#10b981", parentId: null, parentName: null, fullName: "工资", isSystem: true, sort: 1 },
      { id: 313, name: "月薪", type: "INCOME", icon: "Wallet", color: "#34d399", parentId: 312, parentName: "工资", fullName: "工资 / 月薪", isSystem: true, sort: 1 },
      { id: 314, name: "理财", type: "INCOME", icon: "TrendCharts", color: "#14b8a6", parentId: null, parentName: null, fullName: "理财", isSystem: true, sort: 2 },
      { id: 315, name: "基金收益", type: "INCOME", icon: "DataLine", color: "#2dd4bf", parentId: 314, parentName: "理财", fullName: "理财 / 基金收益", isSystem: true, sort: 1 },
    ],
    financeTags: [
      { id: 401, name: "日常", color: "#10b981", remark: "日常生活", usedCount: 4 },
      { id: 402, name: "必要支出", color: "#ef4444", remark: "固定或必要开支", usedCount: 3 },
      { id: 403, name: "通勤", color: "#3b82f6", remark: "上下班交通", usedCount: 2 },
      { id: 404, name: "可报销", color: "#8b5cf6", remark: "保留凭证", usedCount: 1 },
    ],
    financeBills: [
      { id: 501, userId: 2, accountId: 201, accountName: "招商银行卡", accountType: "BANK", categoryId: 313, categoryName: "月薪", parentCategoryName: "工资", categoryIcon: "Wallet", categoryColor: "#34d399", type: "INCOME", amount: 12800, recordDate: "2026-09-24", remark: "九月工资", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 401, name: "日常", color: "#10b981" }] },
      { id: 502, userId: 2, accountId: 202, accountName: "支付宝", accountType: "ALIPAY", categoryId: 303, categoryName: "午餐", parentCategoryName: "餐饮", categoryIcon: "Food", categoryColor: "#fb923c", type: "EXPENSE", amount: 32, recordDate: "2026-09-25", remark: "工作日午餐", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 401, name: "日常", color: "#10b981" }] },
      { id: 503, userId: 2, accountId: 202, accountName: "支付宝", accountType: "ALIPAY", categoryId: 306, categoryName: "地铁公交", parentCategoryName: "交通", categoryIcon: "Guide", categoryColor: "#60a5fa", type: "EXPENSE", amount: 8, recordDate: "2026-09-23", remark: "地铁通勤", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 403, name: "通勤", color: "#3b82f6" }] },
      { id: 504, userId: 2, accountId: 203, accountName: "微信钱包", accountType: "WECHAT", categoryId: 309, categoryName: "房租", parentCategoryName: "居住", categoryIcon: "House", categoryColor: "#a78bfa", type: "EXPENSE", amount: 2600, recordDate: "2026-09-22", remark: "九月房租", source: "RECURRING", sourceLabel: "周期账单", ruleId: 701, tags: [{ id: 402, name: "必要支出", color: "#ef4444" }] },
      { id: 505, userId: 2, accountId: 204, accountName: "交通信用卡", accountType: "CREDIT", categoryId: 304, categoryName: "聚餐", parentCategoryName: "餐饮", categoryIcon: "Dish", categoryColor: "#f97316", type: "EXPENSE", amount: 568, recordDate: "2026-09-20", remark: "朋友聚餐", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 401, name: "日常", color: "#10b981" }] },
      { id: 506, userId: 2, accountId: 201, accountName: "招商银行卡", accountType: "BANK", categoryId: 315, categoryName: "基金收益", parentCategoryName: "理财", categoryIcon: "DataLine", categoryColor: "#2dd4bf", type: "INCOME", amount: 420, recordDate: "2026-09-18", remark: "基金定投收益", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [] },
      { id: 507, userId: 2, accountId: 205, accountName: "现金", accountType: "CASH", categoryId: 302, categoryName: "早餐", parentCategoryName: "餐饮", categoryIcon: "Coffee", categoryColor: "#fb923c", type: "EXPENSE", amount: 12.5, recordDate: "2026-09-18", remark: "包子豆浆", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 401, name: "日常", color: "#10b981" }] },
      { id: 508, userId: 2, accountId: 204, accountName: "交通信用卡", accountType: "CREDIT", categoryId: 311, categoryName: "日用品", parentCategoryName: "购物", categoryIcon: "ShoppingCart", categoryColor: "#f472b6", type: "EXPENSE", amount: 1080, recordDate: "2026-09-16", remark: "家居用品", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 402, name: "必要支出", color: "#ef4444" }] },
      { id: 509, userId: 2, accountId: 201, accountName: "招商银行卡", accountType: "BANK", categoryId: 303, categoryName: "午餐", parentCategoryName: "餐饮", categoryIcon: "Food", categoryColor: "#fb923c", type: "EXPENSE", amount: 420, recordDate: "2026-09-12", remark: "部门聚餐垫付", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 404, name: "可报销", color: "#8b5cf6" }] },
      { id: 510, userId: 2, accountId: 202, accountName: "支付宝", accountType: "ALIPAY", categoryId: 307, categoryName: "打车", parentCategoryName: "交通", categoryIcon: "Van", categoryColor: "#3b82f6", type: "EXPENSE", amount: 86, recordDate: "2026-09-10", remark: "加班打车", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 403, name: "通勤", color: "#3b82f6" }] },
      { id: 511, userId: 2, accountId: 203, accountName: "微信钱包", accountType: "WECHAT", categoryId: 304, categoryName: "聚餐", parentCategoryName: "餐饮", categoryIcon: "Dish", categoryColor: "#f97316", type: "EXPENSE", amount: 298, recordDate: "2026-09-08", remark: "家庭聚餐", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [{ id: 402, name: "必要支出", color: "#ef4444" }] },
      { id: 512, userId: 2, accountId: 201, accountName: "招商银行卡", accountType: "BANK", categoryId: 311, categoryName: "日用品", parentCategoryName: "购物", categoryIcon: "ShoppingCart", categoryColor: "#f472b6", type: "EXPENSE", amount: 3120.1, recordDate: "2026-09-05", remark: "换季用品", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [] },
      { id: 513, userId: 2, accountId: 202, accountName: "支付宝", accountType: "ALIPAY", categoryId: 303, categoryName: "午餐", parentCategoryName: "餐饮", categoryIcon: "Food", categoryColor: "#fb923c", type: "EXPENSE", amount: 648, recordDate: "2026-09-03", remark: "本月餐费集中记录", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [] },
      { id: 514, userId: 2, accountId: 201, accountName: "招商银行卡", accountType: "BANK", categoryId: 313, categoryName: "月薪", parentCategoryName: "工资", categoryIcon: "Wallet", categoryColor: "#34d399", type: "INCOME", amount: 12600, recordDate: "2026-08-24", remark: "八月工资", source: "MANUAL", sourceLabel: "手工记账", ruleId: null, tags: [] },
      { id: 515, userId: 2, accountId: 203, accountName: "微信钱包", accountType: "WECHAT", categoryId: 309, categoryName: "房租", parentCategoryName: "居住", categoryIcon: "House", categoryColor: "#a78bfa", type: "EXPENSE", amount: 2600, recordDate: "2026-08-22", remark: "八月房租", source: "RECURRING", sourceLabel: "周期账单", ruleId: 701, tags: [] },
    ],
    financeBudgets: [
      { id: 601, userId: 2, categoryId: null, categoryName: "总预算", periodMonth: "2026-09", amount: 9000, warnRatio: 80, remark: "控制本月总支出", usedAmount: 8872.6, remaining: 127.4, usedRatio: 98.58, alertLevel: "WARN", alertText: "接近超支" },
      { id: 602, userId: 2, categoryId: 301, categoryName: "餐饮", periodMonth: "2026-09", amount: 1800, warnRatio: 80, remark: "含工作餐和聚餐", usedAmount: 1978.5, remaining: -178.5, usedRatio: 109.92, alertLevel: "DANGER", alertText: "已超支" },
      { id: 603, userId: 2, categoryId: 305, categoryName: "交通", periodMonth: "2026-09", amount: 100, warnRatio: 80, remark: "通勤预算", usedAmount: 94, remaining: 6, usedRatio: 94, alertLevel: "WARN", alertText: "接近超支" },
      { id: 604, userId: 2, categoryId: 308, categoryName: "居住", periodMonth: "2026-09", amount: 2600, warnRatio: 80, remark: "固定房租", usedAmount: 2600, remaining: 0, usedRatio: 100, alertLevel: "WARN", alertText: "接近超支" },
      { id: 605, userId: 2, categoryId: 310, categoryName: "购物", periodMonth: "2026-09", amount: 3800, warnRatio: 80, remark: "非必要消费重点控制", usedAmount: 4200.1, remaining: -400.1, usedRatio: 110.53, alertLevel: "DANGER", alertText: "已超支" },
    ],
    financeRecurring: [
      { id: 701, userId: 2, name: "每月房租", accountId: 203, accountName: "微信钱包", categoryId: 309, categoryName: "房租", categoryIcon: "House", type: "EXPENSE", amount: 2600, cycleType: "MONTHLY", cycleLabel: "每月", cycleValue: 1, nextRunDate: "2026-10-22", lastRunDate: "2026-09-22", autoGenerate: 1, status: 1, remark: "每月固定房租", overdueDays: 0, isOverdue: false, pendingCount: 0, pendingDates: [] },
      { id: 702, userId: 2, name: "视频会员", accountId: 202, accountName: "支付宝", categoryId: 311, categoryName: "日用品", categoryIcon: "ShoppingCart", type: "EXPENSE", amount: 25, cycleType: "MONTHLY", cycleLabel: "每月", cycleValue: 1, nextRunDate: "2026-09-20", lastRunDate: "2026-08-20", autoGenerate: 1, status: 1, remark: "会员自动续费", overdueDays: 6, isOverdue: true, pendingCount: 1, pendingDates: ["2026-09-20"] },
      { id: 703, userId: 2, name: "年度保险", accountId: 201, accountName: "招商银行卡", categoryId: 311, categoryName: "日用品", categoryIcon: "ShoppingCart", type: "EXPENSE", amount: 860, cycleType: "YEARLY", cycleLabel: "每年", cycleValue: 1, nextRunDate: "2027-03-08", lastRunDate: "2026-03-08", autoGenerate: 1, status: 1, remark: "年度保险", overdueDays: 0, isOverdue: false, pendingCount: 0, pendingDates: [] },
    ],
    financeAlerts: [
      { id: 801, userId: 2, budgetId: 602, periodMonth: "2026-09", categoryName: "餐饮", budgetAmount: 1800, usedAmount: 1978.5, usedRatio: 109.92, alertLevel: "DANGER", message: "餐饮预算已超支 9.9%，超出 178.50 元", isRead: 0, createTime: "2026-09-25 18:30:00" },
      { id: 802, userId: 2, budgetId: 605, periodMonth: "2026-09", categoryName: "购物", budgetAmount: 3800, usedAmount: 4200.1, usedRatio: 110.53, alertLevel: "DANGER", message: "购物预算已超支 10.5%，超出 400.10 元", isRead: 0, createTime: "2026-09-25 18:30:00" },
      { id: 803, userId: 2, budgetId: 601, periodMonth: "2026-09", categoryName: "总预算", budgetAmount: 9000, usedAmount: 8872.6, usedRatio: 98.58, alertLevel: "WARN", message: "总预算已使用 98.6%，仅剩 127.40 元", isRead: 0, createTime: "2026-09-25 18:30:00" },
    ],
    financeConfigs: [
      { id: 901, configKey: "budget.warn.ratio", configValue: "80", configName: "预算预警比例", remark: "达到该比例时提醒" },
      { id: 902, configKey: "recurring.auto.enabled", configValue: "true", configName: "周期账单自动生成", remark: "登录和打开看板时检查" },
      { id: 903, configKey: "bill.export.max", configValue: "5000", configName: "账单导出上限", remark: "单次最多导出条数" },
    ],
    financeLogs: [
      { id: 1001, userId: 2, username: "zhangsan", ip: "127.0.0.1", userAgent: "Chrome / Windows", status: 1, message: "登录成功", loginTime: "2026-09-26 09:18:00" },
      { id: 1002, userId: 1, username: "admin", ip: "127.0.0.1", userAgent: "Chrome / Windows", status: 1, message: "登录成功", loginTime: "2026-09-25 20:36:00" },
      { id: 1003, userId: null, username: "unknown", ip: "127.0.0.1", userAgent: "Chrome / Windows", status: 0, message: "用户名或密码错误", loginTime: "2026-09-25 19:42:00" },
    ],
    hrDepartments: [
      { id: 1, deptName: "总公司", parentId: 0, managerId: null, sortOrder: 1, status: 1, remark: "集团总部" },
      { id: 2, deptName: "技术研发部", parentId: 1, managerId: 1, sortOrder: 1, status: 1, remark: "负责产品研发与技术平台" },
      { id: 3, deptName: "平台开发组", parentId: 2, managerId: 1, sortOrder: 1, status: 1, remark: "后端与平台开发" },
      { id: 4, deptName: "数据智能组", parentId: 2, managerId: 3, sortOrder: 2, status: 1, remark: "数据工程与智能应用" },
      { id: 5, deptName: "质量保障部", parentId: 2, managerId: 6, sortOrder: 3, status: 1, remark: "测试与质量保障" },
      { id: 6, deptName: "财务部", parentId: 1, managerId: 5, sortOrder: 2, status: 1, remark: "财务核算" },
      { id: 7, deptName: "人力资源部", parentId: 1, managerId: 4, sortOrder: 3, status: 1, remark: "人事与招聘" },
      { id: 8, deptName: "市场运营部", parentId: 1, managerId: 8, sortOrder: 4, status: 1, remark: "市场与运营" },
    ],
    hrPositions: [
      { id: 1, positionName: "研发经理", positionCode: "RD-MGR", deptId: 2, deptName: "技术研发部", baseSalary: 28000, level: "P7", headcount: 2, status: 1, remark: "研发管理" },
      { id: 2, positionName: "Java 工程师", positionCode: "RD-JAVA", deptId: 3, deptName: "平台开发组", baseSalary: 18000, level: "P5", headcount: 8, status: 1, remark: "服务端开发" },
      { id: 3, positionName: "数据工程师", positionCode: "RD-DATA", deptId: 4, deptName: "数据智能组", baseSalary: 19000, level: "P5", headcount: 5, status: 1, remark: "数据平台" },
      { id: 4, positionName: "测试工程师", positionCode: "QA-TEST", deptId: 5, deptName: "质量保障部", baseSalary: 15000, level: "P4", headcount: 5, status: 1, remark: "质量保障" },
      { id: 5, positionName: "人事专员", positionCode: "HR-SPEC", deptId: 7, deptName: "人力资源部", baseSalary: 12000, level: "P4", headcount: 4, status: 1, remark: "员工关系" },
      { id: 6, positionName: "财务经理", positionCode: "FI-MGR", deptId: 6, deptName: "财务部", baseSalary: 22000, level: "P6", headcount: 2, status: 1, remark: "财务管理" },
      { id: 7, positionName: "运营专员", positionCode: "OP-SPEC", deptId: 8, deptName: "市场运营部", baseSalary: 11000, level: "P3", headcount: 6, status: 1, remark: "用户运营" },
    ],
    hrEmployees: [
      { id: 1, empNo: "EMP2021001", name: "李建", gender: "男", phone: "13800000001", email: "lijian@example.com", deptId: 2, deptName: "技术研发部", positionId: 1, positionName: "研发经理", education: "硕士", school: "示例大学", major: "软件工程", hireDate: "2021-05-10", regularDate: "2021-08-10", status: "ACTIVE", remark: "研发负责人" },
      { id: 2, empNo: "EMP2022001", name: "张伟", gender: "男", phone: "13800000002", email: "zhangwei@example.com", deptId: 3, deptName: "平台开发组", positionId: 2, positionName: "Java 工程师", education: "本科", school: "示例理工大学", major: "计算机科学", hireDate: "2022-03-15", regularDate: "2022-06-15", status: "ACTIVE", remark: "核心服务开发" },
      { id: 3, empNo: "EMP2024001", name: "刘洋", gender: "男", phone: "13800000003", email: "liuyang@example.com", deptId: 4, deptName: "数据智能组", positionId: 3, positionName: "数据工程师", education: "硕士", school: "示例科技大学", major: "数据科学", hireDate: "2024-07-01", regularDate: "2024-10-01", status: "ACTIVE", remark: "数据平台" },
      { id: 4, empNo: "EMP2023001", name: "王雅", gender: "女", phone: "13800000004", email: "wangya@example.com", deptId: 7, deptName: "人力资源部", positionId: 5, positionName: "人事专员", education: "本科", school: "示例大学", major: "人力资源管理", hireDate: "2023-02-06", regularDate: "2023-05-06", status: "ACTIVE", remark: "员工关系" },
      { id: 5, empNo: "EMP2020001", name: "赵峰", gender: "男", phone: "13800000005", email: "zhaofeng@example.com", deptId: 6, deptName: "财务部", positionId: 6, positionName: "财务经理", education: "本科", school: "示例财经大学", major: "会计学", hireDate: "2020-09-18", regularDate: "2020-12-18", status: "ACTIVE", remark: "财务负责人" },
      { id: 6, empNo: "EMP2025001", name: "周宁", gender: "女", phone: "13800000006", email: "zhouning@example.com", deptId: 5, deptName: "质量保障部", positionId: 4, positionName: "测试工程师", education: "本科", school: "示例学院", major: "软件工程", hireDate: "2025-04-12", regularDate: "2025-07-12", status: "LEAVE", remark: "自动化测试" },
      { id: 7, empNo: "EMP2026001", name: "林晓", gender: "女", phone: "13800000007", email: "linxiao@example.com", deptId: 5, deptName: "质量保障部", positionId: 4, positionName: "测试工程师", education: "本科", school: "示例大学", major: "计算机科学", hireDate: "2026-09-01", regularDate: null, status: "PROBATION", remark: "试用期" },
      { id: 8, empNo: "EMP2023002", name: "陈静", gender: "女", phone: "13800000008", email: "chenjing@example.com", deptId: 8, deptName: "市场运营部", positionId: 7, positionName: "运营专员", education: "本科", school: "示例大学", major: "市场营销", hireDate: "2023-05-18", regularDate: "2023-08-18", status: "ACTIVE", remark: "内容运营" },
    ],
    hrAttendance: [
      { id: 1, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", attendDate: "2026-09-28", checkInTime: "09:12:08", checkOutTime: "18:21:15", workHours: 9.15, status: "NORMAL", appealStatus: "NONE", appealReason: "", appealReply: "" },
      { id: 2, employeeId: 3, employeeName: "刘洋", empNo: "EMP2024001", deptName: "数据智能组", attendDate: "2026-09-28", checkInTime: "09:42:30", checkOutTime: "18:18:00", workHours: 8.59, status: "LATE", appealStatus: "PENDING", appealReason: "地铁临时故障", appealReply: "" },
      { id: 3, employeeId: 4, employeeName: "王雅", empNo: "EMP2023001", deptName: "人力资源部", attendDate: "2026-09-28", checkInTime: "09:08:10", checkOutTime: "17:38:20", workHours: 8.5, status: "EARLY_LEAVE", appealStatus: "APPROVED", appealReason: "外出办理员工社保", appealReply: "情况属实" },
      { id: 4, employeeId: 6, employeeName: "周宁", empNo: "EMP2025001", deptName: "质量保障部", attendDate: "2026-09-28", checkInTime: "", checkOutTime: "", workHours: 0, status: "LEAVE", appealStatus: "NONE", appealReason: "", appealReply: "" },
      { id: 5, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", attendDate: "2026-09-27", checkInTime: "09:25:10", checkOutTime: "18:12:06", workHours: 8.78, status: "NORMAL", appealStatus: "NONE", appealReason: "", appealReply: "" },
      { id: 6, employeeId: 7, employeeName: "林晓", empNo: "EMP2026001", deptName: "质量保障部", attendDate: "2026-09-27", checkInTime: "", checkOutTime: "", workHours: 0, status: "ABSENT", appealStatus: "NONE", appealReason: "", appealReply: "" },
    ],
    hrLeaveQuotas: [
      { id: 1, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", year: 2026, leaveType: "ANNUAL", totalDays: 10, usedDays: 3, remainDays: 7 },
      { id: 2, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", year: 2026, leaveType: "SICK", totalDays: 10, usedDays: 1, remainDays: 9 },
      { id: 3, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", year: 2026, leaveType: "PERSONAL", totalDays: 5, usedDays: 0, remainDays: 5 },
      { id: 4, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", year: 2026, leaveType: "COMPENSATORY", totalDays: 3, usedDays: 1, remainDays: 2 },
      { id: 5, employeeId: 6, employeeName: "周宁", empNo: "EMP2025001", deptName: "质量保障部", year: 2026, leaveType: "ANNUAL", totalDays: 5, usedDays: 2, remainDays: 3 },
      { id: 6, employeeId: 3, employeeName: "刘洋", empNo: "EMP2024001", deptName: "数据智能组", year: 2026, leaveType: "ANNUAL", totalDays: 5, usedDays: 1, remainDays: 4 },
    ],
    hrLeaves: [
      { id: 1, applyNo: "LA20260928001", employeeId: 3, employeeName: "刘洋", empNo: "EMP2024001", deptName: "数据智能组", leaveType: "ANNUAL", startDate: "2026-10-08", endDate: "2026-10-09", leaveDays: 2, reason: "家庭事务", status: "PENDING_MANAGER", statusText: "待经理审批", managerRemark: "", hrRemark: "", applyTime: "2026-09-28 09:15:00" },
      { id: 2, applyNo: "LA20260927002", employeeId: 6, employeeName: "周宁", empNo: "EMP2025001", deptName: "质量保障部", leaveType: "SICK", startDate: "2026-09-28", endDate: "2026-09-29", leaveDays: 2, reason: "身体不适", status: "PENDING_HR", statusText: "待 HR 审批", managerRemark: "同意", hrRemark: "", applyTime: "2026-09-27 17:20:00" },
      { id: 3, applyNo: "LA20260920003", employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", leaveType: "ANNUAL", startDate: "2026-09-23", endDate: "2026-09-25", leaveDays: 3, reason: "个人事务", status: "APPROVED", statusText: "已通过", managerRemark: "同意", hrRemark: "额度确认", applyTime: "2026-09-20 10:00:00" },
      { id: 4, applyNo: "LA20260918004", employeeId: 8, employeeName: "陈静", empNo: "EMP2023002", deptName: "市场运营部", leaveType: "PERSONAL", startDate: "2026-09-21", endDate: "2026-09-21", leaveDays: 1, reason: "个人事务", status: "REJECTED", statusText: "已驳回", managerRemark: "活动期间暂不批准", hrRemark: "", applyTime: "2026-09-18 14:20:00" },
    ],
    hrSalaryRules: [
      { id: 1, employeeId: 1, employeeName: "李建", empNo: "EMP2021001", deptName: "技术研发部", positionName: "研发经理", baseSalary: 15400, postSalary: 7840, performanceSalary: 4760, subsidy: 2000, effectiveDate: "2026-01-01", status: 1, remark: "年度薪资标准" },
      { id: 2, employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", positionName: "Java 工程师", baseSalary: 9900, postSalary: 5040, performanceSalary: 3060, subsidy: 1000, effectiveDate: "2026-01-01", status: 1, remark: "年度薪资标准" },
      { id: 3, employeeId: 3, employeeName: "刘洋", empNo: "EMP2024001", deptName: "数据智能组", positionName: "数据工程师", baseSalary: 10450, postSalary: 5320, performanceSalary: 3230, subsidy: 1000, effectiveDate: "2026-01-01", status: 1, remark: "年度薪资标准" },
      { id: 4, employeeId: 4, employeeName: "王雅", empNo: "EMP2023001", deptName: "人力资源部", positionName: "人事专员", baseSalary: 6600, postSalary: 3360, performanceSalary: 2040, subsidy: 800, effectiveDate: "2026-01-01", status: 1, remark: "年度薪资标准" },
    ],
    hrSalaries: [
      { id: 1, salaryMonth: "2026-09", employeeId: 1, employeeName: "李建", empNo: "EMP2021001", deptName: "技术研发部", positionName: "研发经理", baseSalary: 15400, postSalary: 7840, performanceSalary: 4760, subsidy: 2000, grossSalary: 30000, absentDays: 1, absentDeduct: 1379.31, socialPersonal: 3150, fundPersonal: 3600, totalDeduct: 8129.31, taxableIncome: 18250, taxLevel: 3, taxRate: 0.2, taxAmount: 2240, netSalary: 19630.69, status: "CONFIRMED" },
      { id: 2, salaryMonth: "2026-09", employeeId: 2, employeeName: "张伟", empNo: "EMP2022001", deptName: "平台开发组", positionName: "Java 工程师", baseSalary: 9900, postSalary: 5040, performanceSalary: 3060, subsidy: 1000, grossSalary: 19000, absentDays: 0, absentDeduct: 0, socialPersonal: 1995, fundPersonal: 2280, totalDeduct: 4275, taxableIncome: 9725, taxLevel: 2, taxRate: 0.1, taxAmount: 762.5, netSalary: 13962.5, status: "CONFIRMED" },
      { id: 3, salaryMonth: "2026-09", employeeId: 3, employeeName: "刘洋", empNo: "EMP2024001", deptName: "数据智能组", positionName: "数据工程师", baseSalary: 10450, postSalary: 5320, performanceSalary: 3230, subsidy: 1000, grossSalary: 20000, absentDays: 0, absentDeduct: 0, socialPersonal: 2100, fundPersonal: 2400, totalDeduct: 4500, taxableIncome: 10500, taxLevel: 2, taxRate: 0.1, taxAmount: 840, netSalary: 14660, status: "CONFIRMED" },
      { id: 4, salaryMonth: "2026-09", employeeId: 4, employeeName: "王雅", empNo: "EMP2023001", deptName: "人力资源部", positionName: "人事专员", baseSalary: 6600, postSalary: 3360, performanceSalary: 2040, subsidy: 800, grossSalary: 12800, absentDays: 0, absentDeduct: 0, socialPersonal: 1344, fundPersonal: 1536, totalDeduct: 2880, taxableIncome: 4920, taxLevel: 2, taxRate: 0.1, taxAmount: 282, netSalary: 9638, status: "PAID" },
    ],
    hrSocial: [{ id: 1, configName: "2026 年度演示方案", pensionRate: 0.08, medicalRate: 0.02, unemploymentRate: 0.005, fundRate: 0.12, pensionCompanyRate: 0.16, medicalCompanyRate: 0.1, unemploymentCompanyRate: 0.005, fundCompanyRate: 0.12, socialBaseMin: 7350, socialBaseMax: 37800, effectiveDate: "2026-01-01", status: 1 }],
    hrTaxRates: [
      { id: 1, levelNo: 1, minIncome: 0, maxIncome: 3000, taxRate: 0.03, quickDeduct: 0, threshold: 5000 },
      { id: 2, levelNo: 2, minIncome: 3000, maxIncome: 12000, taxRate: 0.1, quickDeduct: 210, threshold: 5000 },
      { id: 3, levelNo: 3, minIncome: 12000, maxIncome: 25000, taxRate: 0.2, quickDeduct: 1410, threshold: 5000 },
      { id: 4, levelNo: 4, minIncome: 25000, maxIncome: 35000, taxRate: 0.25, quickDeduct: 2660, threshold: 5000 },
      { id: 5, levelNo: 5, minIncome: 35000, maxIncome: 55000, taxRate: 0.3, quickDeduct: 4410, threshold: 5000 },
      { id: 6, levelNo: 6, minIncome: 55000, maxIncome: 80000, taxRate: 0.35, quickDeduct: 7160, threshold: 5000 },
      { id: 7, levelNo: 7, minIncome: 80000, maxIncome: null, taxRate: 0.45, quickDeduct: 15160, threshold: 5000 },
    ],
    hrRecruitPositions: [
      { id: 1, positionName: "高级 Java 工程师", deptId: 3, deptName: "平台开发组", headcount: 2, hiredCount: 0, education: "本科", experience: "3 年以上", salaryRange: "18K-26K", status: "OPEN", publishDate: "2026-09-10", deadline: "2026-10-31", description: "负责核心业务服务设计与开发" },
      { id: 2, positionName: "数据分析师", deptId: 4, deptName: "数据智能组", headcount: 1, hiredCount: 0, education: "硕士", experience: "2 年以上", salaryRange: "16K-23K", status: "OPEN", publishDate: "2026-09-15", deadline: "2026-10-20", description: "负责数据分析与指标体系" },
      { id: 3, positionName: "测试工程师", deptId: 5, deptName: "质量保障部", headcount: 1, hiredCount: 1, education: "本科", experience: "1 年以上", salaryRange: "12K-18K", status: "FILLED", publishDate: "2026-08-01", deadline: "2026-09-15", description: "负责接口和自动化测试" },
    ],
    hrResumes: [
      { id: 1, recruitId: 1, positionName: "高级 Java 工程师", deptName: "平台开发组", candidateName: "候选人甲", gender: "男", age: 28, phone: "13900000001", email: "candidate1@example.com", education: "本科", school: "示例理工大学", major: "软件工程", workYears: 5, currentCompany: "示例科技", expectSalary: "22K", source: "招聘网站", status: "INTERVIEW", selfEval: "熟悉 Spring Boot 与分布式系统", interviewCount: 1 },
      { id: 2, recruitId: 2, positionName: "数据分析师", deptName: "数据智能组", candidateName: "候选人乙", gender: "女", age: 26, phone: "13900000002", email: "candidate2@example.com", education: "硕士", school: "示例大学", major: "统计学", workYears: 2, currentCompany: "示例数据", expectSalary: "19K", source: "内部推荐", status: "PENDING", selfEval: "熟悉 SQL、Python 与业务分析", interviewCount: 0 },
      { id: 3, recruitId: 3, positionName: "测试工程师", deptName: "质量保障部", candidateName: "候选人丙", gender: "女", age: 24, phone: "13900000003", email: "candidate3@example.com", education: "本科", school: "示例学院", major: "计算机科学", workYears: 1, currentCompany: "", expectSalary: "14K", source: "校园招聘", status: "HIRED", selfEval: "熟悉自动化测试", interviewCount: 2 },
    ],
    hrInterviews: [
      { id: 1, resumeId: 1, candidateName: "候选人甲", interviewRound: "一面", interviewTime: "2026-09-29 14:00:00", interviewer: "李建", score: 86, result: "PASS", comment: "基础扎实，项目经验匹配" },
      { id: 2, resumeId: 3, candidateName: "候选人丙", interviewRound: "终面", interviewTime: "2026-09-08 10:00:00", interviewer: "王雅", score: 88, result: "PASS", comment: "通过录用" },
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

  const financeTypeLabel = { CASH: "现金", BANK: "银行卡", ALIPAY: "支付宝", WECHAT: "微信", CREDIT: "信用卡" };
  const financeUser = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("pf_user") || "null");
      return stored || db.financeUsers[1];
    } catch {
      return db.financeUsers[1];
    }
  };
  const financeCategory = (id) => db.financeCategories.find((item) => String(item.id) === String(id));
  const financeAccount = (id) => db.financeAccounts.find((item) => String(item.id) === String(id));
  const financeMonth = (date) => String(date || "").slice(0, 7);
  const financeMoney = (value) => Number(Number(value || 0).toFixed(2));
  const recalcFinanceAccounts = () => {
    db.financeAccounts.forEach((account) => {
      const related = db.financeBills.filter((bill) => String(bill.accountId) === String(account.id));
      const income = related.filter((bill) => bill.type === "INCOME").reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
      const expense = related.filter((bill) => bill.type === "EXPENSE").reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
      account.balance = financeMoney(Number(account.initialBalance || 0) + income - expense);
      account.isCredit = account.type === "CREDIT";
      account.typeLabel = financeTypeLabel[account.type] || account.type;
      account.usedCredit = account.isCredit ? financeMoney(Math.max(0, -account.balance)) : 0;
      account.availableCredit = account.isCredit ? financeMoney(Math.max(0, Number(account.creditLimit || 0) - account.usedCredit)) : 0;
    });
  };
  const financeAccountSummary = () => {
    recalcFinanceAccounts();
    const totalAssets = financeMoney(db.financeAccounts.filter((item) => item.balance > 0).reduce((sum, item) => sum + item.balance, 0));
    const totalDebt = financeMoney(db.financeAccounts.filter((item) => item.balance < 0).reduce((sum, item) => sum - item.balance, 0));
    const creditUsed = financeMoney(db.financeAccounts.filter((item) => item.isCredit).reduce((sum, item) => sum + item.usedCredit, 0));
    const creditLimit = financeMoney(db.financeAccounts.filter((item) => item.isCredit).reduce((sum, item) => sum + Number(item.creditLimit || 0), 0));
    return { accounts: clone(db.financeAccounts), totalAssets, totalDebt, netAssets: financeMoney(totalAssets - totalDebt), creditUsed, creditLimit, accountCount: db.financeAccounts.length };
  };
  const financeBillRows = (params = {}) => db.financeBills.filter((bill) => {
    if (params.type && bill.type !== params.type) return false;
    if (params.accountId && String(bill.accountId) !== String(params.accountId)) return false;
    if (params.categoryId) {
      const selected = financeCategory(params.categoryId);
      const current = financeCategory(bill.categoryId);
      if (String(bill.categoryId) !== String(params.categoryId) && String(current?.parentId) !== String(selected?.id)) return false;
    }
    if (params.tagId && !(bill.tags || []).some((tag) => String(tag.id) === String(params.tagId))) return false;
    if (params.startDate && bill.recordDate < params.startDate) return false;
    if (params.endDate && bill.recordDate > params.endDate) return false;
    if (params.minAmount && Number(bill.amount) < Number(params.minAmount)) return false;
    if (params.maxAmount && Number(bill.amount) > Number(params.maxAmount)) return false;
    if (params.source && bill.source !== params.source) return false;
    if (params.keyword && !String(bill.remark || "").toLowerCase().includes(String(params.keyword).toLowerCase())) return false;
    return true;
  }).sort((a, b) => String(b.recordDate).localeCompare(String(a.recordDate)) || Number(b.id) - Number(a.id));
  const refreshFinanceBudgets = (month = "2026-09") => {
    const expenses = db.financeBills.filter((bill) => bill.type === "EXPENSE" && financeMonth(bill.recordDate) === month);
    db.financeBudgets.filter((budget) => budget.periodMonth === month).forEach((budget) => {
      let selected = expenses;
      if (budget.categoryId) {
        selected = expenses.filter((bill) => {
          const category = financeCategory(bill.categoryId);
          return String(bill.categoryId) === String(budget.categoryId) || String(category?.parentId) === String(budget.categoryId);
        });
      }
      budget.usedAmount = financeMoney(selected.reduce((sum, bill) => sum + Number(bill.amount || 0), 0));
      budget.remaining = financeMoney(Number(budget.amount || 0) - budget.usedAmount);
      budget.usedRatio = Number(budget.amount) > 0 ? Number((budget.usedAmount / Number(budget.amount) * 100).toFixed(2)) : 0;
      budget.alertLevel = budget.usedRatio > 100 ? "DANGER" : budget.usedRatio >= Number(budget.warnRatio || 80) ? "WARN" : "NORMAL";
      budget.alertText = { DANGER: "已超支", WARN: "接近超支", NORMAL: "正常" }[budget.alertLevel];
    });
    return db.financeBudgets.filter((budget) => budget.periodMonth === month);
  };
  const financeMonthSummary = (month) => {
    const rows = db.financeBills.filter((bill) => financeMonth(bill.recordDate) === month);
    const income = financeMoney(rows.filter((bill) => bill.type === "INCOME").reduce((sum, bill) => sum + Number(bill.amount || 0), 0));
    const expense = financeMoney(rows.filter((bill) => bill.type === "EXPENSE").reduce((sum, bill) => sum + Number(bill.amount || 0), 0));
    return { month, income, expense, balance: financeMoney(income - expense), count: rows.length };
  };
  recalcFinanceAccounts();

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

  const hrCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("hr_user") || "null") || { userId: 1, username: "admin", realName: "系统管理员", role: "ADMIN", employeeId: null, deptId: null };
    } catch {
      return { userId: 1, username: "admin", realName: "系统管理员", role: "ADMIN", employeeId: null, deptId: null };
    }
  };
  const hrStatusText = { PENDING_MANAGER: "待经理审批", PENDING_HR: "待 HR 审批", APPROVED: "已通过", REJECTED: "已驳回", CANCELLED: "已取消" };
  const hrDepartmentTree = (parentId = 0) => db.hrDepartments
    .filter((item) => Number(item.parentId || 0) === Number(parentId))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .map((item) => ({ ...clone(item), children: hrDepartmentTree(item.id) }));
  const hrEmployee = (id) => db.hrEmployees.find((item) => String(item.id) === String(id));
  const hrEnrichEmployee = (employee) => {
    const dept = db.hrDepartments.find((item) => String(item.id) === String(employee.deptId));
    const position = db.hrPositions.find((item) => String(item.id) === String(employee.positionId));
    return { ...employee, deptName: dept?.deptName || employee.deptName || "-", positionName: position?.positionName || employee.positionName || "-" };
  };
  const hrFilter = (rows, params) => rows.filter((item) => {
    if (params.status && String(item.status) !== String(params.status)) return false;
    if (params.deptId && String(item.deptId) !== String(params.deptId) && String(item.departmentId) !== String(params.deptId)) return false;
    if (params.employeeId && String(item.employeeId) !== String(params.employeeId)) return false;
    if (params.leaveType && String(item.leaveType) !== String(params.leaveType)) return false;
    if (params.month && !String(item.attendDate || item.salaryMonth || "").startsWith(params.month)) return false;
    if (params.keyword && !JSON.stringify(item).toLowerCase().includes(String(params.keyword).toLowerCase())) return false;
    return true;
  });
  const hrTax = (taxable) => {
    const value = Math.max(0, Number(taxable || 0));
    const rate = db.hrTaxRates.find((item) => value > item.minIncome && (item.maxIncome == null || value <= item.maxIncome)) || db.hrTaxRates[0];
    return { taxableIncome: value, levelNo: rate.levelNo, taxRate: rate.taxRate, quickDeduct: rate.quickDeduct, taxAmount: Math.max(0, Number((value * rate.taxRate - rate.quickDeduct).toFixed(2))) };
  };
  const hrOverview = () => {
    const latestMonth = db.hrSalaries.map((item) => item.salaryMonth).sort().reverse()[0] || "-";
    const latest = db.hrSalaries.filter((item) => item.salaryMonth === latestMonth);
    const sum = (field) => Number(latest.reduce((total, item) => total + Number(item[field] || 0), 0).toFixed(2));
    return {
      totalEmployee: db.hrEmployees.length,
      activeEmployee: db.hrEmployees.filter((item) => item.status === "ACTIVE").length,
      probationEmployee: db.hrEmployees.filter((item) => item.status === "PROBATION").length,
      leaveEmployee: db.hrEmployees.filter((item) => item.status === "LEAVE").length,
      resignedEmployee: db.hrEmployees.filter((item) => item.status === "RESIGNED").length,
      deptCount: db.hrDepartments.length,
      openPosition: db.hrRecruitPositions.filter((item) => item.status === "OPEN").length,
      resumeCount: db.hrResumes.length,
      pendingLeave: db.hrLeaves.filter((item) => ["PENDING_MANAGER", "PENDING_HR"].includes(item.status)).length,
      pendingAppeal: db.hrAttendance.filter((item) => item.appealStatus === "PENDING").length,
      salaryMonth: latestMonth,
      totalNetSalary: sum("netSalary"),
      totalTax: sum("taxAmount"),
      totalGrossSalary: sum("grossSalary"),
      avgNetSalary: latest.length ? Number((sum("netSalary") / latest.length).toFixed(2)) : 0,
    };
  };
  const hrMonthly = (month = "2026-09") => {
    const rows = db.hrAttendance.filter((item) => String(item.attendDate).startsWith(month));
    const employeeDetail = db.hrEmployees.filter((item) => item.status !== "RESIGNED").map((employee) => {
      const own = rows.filter((item) => String(item.employeeId) === String(employee.id));
      const count = (status) => own.filter((item) => item.status === status).length;
      return { employeeId: employee.id, employeeName: employee.name, empNo: employee.empNo, deptName: employee.deptName, normal: count("NORMAL"), late: count("LATE"), early: count("EARLY_LEAVE"), absent: count("ABSENT"), leave: count("LEAVE"), totalDays: own.length };
    });
    const count = (status) => rows.filter((item) => item.status === status).length;
    const byDay = {};
    rows.forEach((item) => { const day = String(item.attendDate).slice(8, 10); byDay[day] ||= { normal: 0, late: 0, early: 0, absent: 0, leave: 0 }; const key = { NORMAL: "normal", LATE: "late", EARLY_LEAVE: "early", ABSENT: "absent", LEAVE: "leave" }[item.status]; if (key) byDay[day][key] += 1; });
    return { month, normal: count("NORMAL"), late: count("LATE"), early: count("EARLY_LEAVE"), absent: count("ABSENT"), leave: count("LEAVE"), byDay, employeeDetail };
  };
  const hrSalaryDetail = (salary) => ({
    salary,
    items: [
      { itemName: "基本工资", amount: salary.baseSalary, remark: "固定发放" }, { itemName: "岗位工资", amount: salary.postSalary, remark: "按岗位标准" },
      { itemName: "绩效工资", amount: salary.performanceSalary, remark: "按绩效核算" }, { itemName: "补贴", amount: salary.subsidy, remark: "餐补、交通与通讯" },
      { itemName: "缺勤扣款", amount: -Number(salary.absentDeduct || 0), remark: `缺勤 ${salary.absentDays || 0} 天` }, { itemName: "社保个人部分", amount: -Number(salary.socialPersonal || 0), remark: "养老、医疗与失业" },
      { itemName: "公积金个人部分", amount: -Number(salary.fundPersonal || 0), remark: "个人缴费" }, { itemName: "个人所得税", amount: -Number(salary.taxAmount || 0), remark: "七级超额累进税率" },
    ],
    socialConfig: clone(db.hrSocial[0]), threshold: 5000, taxLevel: salary.taxLevel, taxRate: salary.taxRate,
    quickDeduct: db.hrTaxRates.find((item) => item.levelNo === salary.taxLevel)?.quickDeduct || 0,
  });

  const handleHr = (method, lower, url, params, body, current, size) => {
    const user = hrCurrentUser();
    const employeeId = user.employeeId || 2;
    const paged = (rows) => ok(page(clone(rows), current, size));
    const idFromUrl = () => (url.match(/\/(\d+)(?:\?|$)/) || [])[1];
    const removeAt = (key, id) => { removeItem(key, id); return ok(true); };

    if (lower.includes("/auth/login")) {
      const username = body.username || "admin";
      const map = username.startsWith("hr") ? { role: "HR", employeeId: 4, deptId: 7, realName: "人事专员王雅" }
        : username.startsWith("mgr") ? { role: "MANAGER", employeeId: 1, deptId: 2, realName: "研发经理李建" }
        : username.startsWith("emp") ? { role: "EMPLOYEE", employeeId: 2, deptId: 3, realName: "员工张伟" }
        : { role: "ADMIN", employeeId: null, deptId: null, realName: "系统管理员" };
      return ok({ token: "demo-token", userInfo: { userId: 1, username, ...map } });
    }
    if (lower.includes("/auth/info")) return ok(clone(user));
    if (lower.includes("/auth/logout")) return ok(true);
    if (lower.includes("/file/upload")) return ok({ url: "https://dummyimage.com/240x240/e2e8f0/1e3a8a&text=HR" });
    if (lower.includes("/export")) return ok("mock-export");

    if (method === "GET" && lower.includes("/dept/tree")) return ok(hrDepartmentTree());
    if (method === "GET" && (lower.includes("/dept/list") || lower.includes("/dept/parent-options"))) return ok(clone(db.hrDepartments));
    if (method === "POST" && lower.includes("/dept/save")) {
      const item = body.id ? updateItem("hrDepartments", body.id, body) : addItem("hrDepartments", { parentId: 1, sortOrder: 99, status: 1, ...body });
      return ok(item);
    }
    if (method === "DELETE" && lower.includes("/dept/")) return removeAt("hrDepartments", idFromUrl());

    if (method === "GET" && lower.includes("/position/page")) return paged(hrFilter(db.hrPositions, params));
    if (method === "GET" && lower.includes("/position/list")) return ok(clone(db.hrPositions.filter((item) => item.status === 1)));
    if (method === "POST" && lower.includes("/position/save")) {
      const dept = db.hrDepartments.find((item) => String(item.id) === String(body.deptId));
      const fields = { status: 1, ...body, deptName: dept?.deptName || body.deptName || "-" };
      return ok(body.id ? updateItem("hrPositions", body.id, fields) : addItem("hrPositions", fields));
    }
    if (method === "DELETE" && lower.includes("/position/")) return removeAt("hrPositions", idFromUrl());

    if (method === "GET" && lower.includes("/employee/me")) return ok(clone(hrEnrichEmployee(hrEmployee(employeeId) || db.hrEmployees[0])));
    if (method === "GET" && lower.includes("/employee/page")) return paged(hrFilter(db.hrEmployees.map(hrEnrichEmployee), params));
    if (method === "GET" && /\/employee\/\d+/.test(lower)) return ok(clone(hrEnrichEmployee(hrEmployee(idFromUrl()) || db.hrEmployees[0])));
    if (method === "POST" && lower.includes("/employee/save")) {
      const hireDate = body.hireDate || "2026-09-28";
      const fields = hrEnrichEmployee({ id: ++idSeq, empNo: `EMP${String(hireDate).slice(0, 4)}${String(db.hrEmployees.length + 1).padStart(3, "0")}`, regularDate: null, status: "PROBATION", ...body });
      db.hrEmployees.unshift(fields);
      ["ANNUAL", "SICK", "PERSONAL", "COMPENSATORY"].forEach((leaveType, index) => db.hrLeaveQuotas.push({ id: ++idSeq, employeeId: fields.id, employeeName: fields.name, empNo: fields.empNo, deptName: fields.deptName, year: 2026, leaveType, totalDays: [0, 10, 5, 3][index], usedDays: 0, remainDays: [0, 10, 5, 3][index] }));
      return ok(fields);
    }
    if (method === "POST" && lower.includes("/employee/update")) return ok(updateItem("hrEmployees", body.id, hrEnrichEmployee(body)));
    if (method === "POST" && lower.includes("/employee/regular")) return ok(updateItem("hrEmployees", body.id, { status: "ACTIVE", regularDate: body.regularDate || "2026-09-28" }));
    if (method === "POST" && lower.includes("/employee/transfer")) return ok(updateItem("hrEmployees", body.id, hrEnrichEmployee(body)));
    if (method === "POST" && lower.includes("/employee/resign")) return ok(updateItem("hrEmployees", body.id, { status: "RESIGNED", resignDate: body.resignDate || "2026-09-28", remark: body.remark || "办理离职" }));
    if (method === "DELETE" && lower.includes("/employee/")) return removeAt("hrEmployees", idFromUrl());

    if (method === "GET" && lower.includes("/attendance/monthly")) return ok(hrMonthly(params.month || "2026-09"));
    if (method === "GET" && lower.includes("/attendance/appeal/page")) return paged(hrFilter(db.hrAttendance.filter((item) => item.appealStatus !== "NONE"), params));
    if (method === "GET" && lower.includes("/attendance/me")) return paged(hrFilter(db.hrAttendance.filter((item) => String(item.employeeId) === String(employeeId)), params));
    if (method === "GET" && lower.includes("/attendance/page")) return paged(hrFilter(db.hrAttendance, params));
    if (method === "POST" && lower.includes("/attendance/punch")) {
      let row = db.hrAttendance.find((item) => String(item.employeeId) === String(employeeId) && item.attendDate === "2026-09-28");
      const emp = hrEmployee(employeeId) || db.hrEmployees[0];
      if (!row) row = addItem("hrAttendance", { employeeId, employeeName: emp.name, empNo: emp.empNo, deptName: emp.deptName, attendDate: "2026-09-28", checkInTime: "09:18:00", checkOutTime: "", workHours: 0, status: "NORMAL", appealStatus: "NONE" });
      else if (!row.checkOutTime) Object.assign(row, { checkOutTime: "18:16:00", workHours: 8.97 });
      return ok(clone(row));
    }
    if (method === "POST" && lower.includes("/attendance/appeal/handle")) return ok(updateItem("hrAttendance", body.id, { appealStatus: body.pass ? "APPROVED" : "REJECTED", appealReply: body.reply || body.remark || "已处理" }));
    if (method === "POST" && lower.includes("/attendance/appeal")) return ok(updateItem("hrAttendance", body.id, { appealStatus: "PENDING", appealReason: body.reason || "申请复核" }));

    if (method === "GET" && lower.includes("/leave/quota/my")) return ok(clone(db.hrLeaveQuotas.filter((item) => String(item.employeeId) === String(employeeId))));
    if (method === "GET" && lower.includes("/leave/quota/page")) return paged(hrFilter(db.hrLeaveQuotas, params));
    if (method === "POST" && lower.includes("/leave/quota/save")) {
      const existing = db.hrLeaveQuotas.find((item) => String(item.employeeId) === String(body.employeeId) && item.leaveType === body.leaveType && String(item.year) === String(body.year || 2026));
      const emp = hrEmployee(body.employeeId) || db.hrEmployees[0];
      const fields = { ...body, year: body.year || 2026, employeeName: emp.name, empNo: emp.empNo, deptName: emp.deptName, remainDays: Number(body.totalDays || 0) - Number(body.usedDays || existing?.usedDays || 0) };
      return ok(existing ? updateItem("hrLeaveQuotas", existing.id, fields) : addItem("hrLeaveQuotas", { usedDays: 0, ...fields }));
    }
    if (method === "GET" && lower.includes("/leave/todo")) return paged(hrFilter(db.hrLeaves.filter((item) => user.role === "MANAGER" ? item.status === "PENDING_MANAGER" : item.status === "PENDING_HR"), params));
    if (method === "GET" && lower.includes("/leave/my")) return paged(hrFilter(db.hrLeaves.filter((item) => String(item.employeeId) === String(employeeId)), params));
    if (method === "GET" && lower.includes("/leave/page")) return paged(hrFilter(db.hrLeaves, params));
    if (method === "POST" && lower.includes("/leave/apply")) {
      const emp = hrEmployee(employeeId) || db.hrEmployees[0];
      const item = addItem("hrLeaves", { applyNo: "LA" + Date.now(), employeeId, employeeName: emp.name, empNo: emp.empNo, deptName: emp.deptName, status: "PENDING_MANAGER", statusText: hrStatusText.PENDING_MANAGER, applyTime: new Date().toLocaleString(), ...body });
      return ok(item);
    }
    if (method === "POST" && lower.includes("/leave/approve")) {
      const item = db.hrLeaves.find((row) => String(row.id) === String(body.id)) || db.hrLeaves[0];
      if (!body.pass) item.status = "REJECTED";
      else if (item.status === "PENDING_MANAGER") item.status = "PENDING_HR";
      else item.status = "APPROVED";
      item.statusText = hrStatusText[item.status];
      if (item.status === "APPROVED") {
        const quota = db.hrLeaveQuotas.find((row) => String(row.employeeId) === String(item.employeeId) && row.leaveType === item.leaveType);
        if (quota) { quota.usedDays = Number(quota.usedDays) + Number(item.leaveDays || 0); quota.remainDays = Number(quota.totalDays) - Number(quota.usedDays); }
      }
      return ok(clone(item));
    }
    if (method === "POST" && lower.includes("/leave/cancel")) return ok(updateItem("hrLeaves", body.id, { status: "CANCELLED", statusText: hrStatusText.CANCELLED }));

    if (method === "GET" && lower.includes("/salary/tax/rates")) return ok(clone(db.hrTaxRates));
    if (method === "POST" && lower.includes("/salary/tax/calc")) {
      const grossSalary = Number(body.baseSalary || 0) + Number(body.postSalary || 0) + Number(body.performanceSalary || 0) + Number(body.subsidy || 0);
      const absentDeduct = Number((grossSalary / 21.75 * Number(body.absentDays || 0)).toFixed(2));
      const socialBase = Math.min(37800, Math.max(7350, grossSalary));
      const socialPersonal = Number((socialBase * 0.105).toFixed(2));
      const fundPersonal = Number((socialBase * 0.12).toFixed(2));
      const taxableIncome = Math.max(0, Number((grossSalary - socialPersonal - fundPersonal - 5000).toFixed(2)));
      const tax = hrTax(taxableIncome);
      const totalDeduct = Number((absentDeduct + socialPersonal + fundPersonal).toFixed(2));
      return ok({ grossSalary, absentDeduct, socialPersonal, fundPersonal, totalDeduct, threshold: 5000, ...tax, netSalary: Number((grossSalary - totalDeduct - tax.taxAmount).toFixed(2)) });
    }
    if (method === "GET" && lower.includes("/salary/social/list")) return ok(clone(db.hrSocial));
    if (method === "POST" && lower.includes("/salary/social/save")) return ok(body.id ? updateItem("hrSocial", body.id, body) : addItem("hrSocial", body));
    if (method === "GET" && lower.includes("/salary/rule/page")) return paged(hrFilter(db.hrSalaryRules, params));
    if (method === "POST" && lower.includes("/salary/rule/save")) return ok(body.id ? updateItem("hrSalaryRules", body.id, body) : addItem("hrSalaryRules", body));
    if (method === "GET" && lower.includes("/salary/my")) return paged(db.hrSalaries.filter((item) => String(item.employeeId) === String(employeeId)));
    if (method === "GET" && /\/salary\/\d+/.test(lower)) return ok(hrSalaryDetail(clone(db.hrSalaries.find((item) => String(item.id) === String(idFromUrl())) || db.hrSalaries[0])));
    if (method === "GET" && lower.includes("/salary/page")) return paged(hrFilter(db.hrSalaries, params));
    if (method === "POST" && lower.includes("/salary/generate")) return ok({ created: 0, updated: db.hrSalaries.length, skipped: 0, month: body.month || body.salaryMonth || "2026-09" });
    if (method === "POST" && lower.includes("/salary/status")) { (body.ids || []).forEach((id) => updateItem("hrSalaries", id, { status: body.status })); return ok({ updated: (body.ids || []).length }); }

    if (method === "GET" && lower.includes("/recruit/board")) return ok({ openPositions: db.hrRecruitPositions.filter((item) => item.status === "OPEN").length, totalPositions: db.hrRecruitPositions.length, totalResumes: db.hrResumes.length, interviewing: db.hrResumes.filter((item) => item.status === "INTERVIEW").length, hired: db.hrResumes.filter((item) => item.status === "HIRED").length, pendingResumes: db.hrResumes.filter((item) => item.status === "PENDING").length, statusDistribution: { PENDING: 1, INTERVIEW: 1, HIRED: 1 }, sourceDistribution: { 招聘网站: 1, 内部推荐: 1, 校园招聘: 1 } });
    if (method === "GET" && lower.includes("/recruit/position/page")) return paged(hrFilter(db.hrRecruitPositions, params));
    if (method === "POST" && lower.includes("/recruit/position/save")) { const dept = db.hrDepartments.find((item) => String(item.id) === String(body.deptId)); return ok(body.id ? updateItem("hrRecruitPositions", body.id, { ...body, deptName: dept?.deptName || body.deptName }) : addItem("hrRecruitPositions", { hiredCount: 0, status: "OPEN", ...body, deptName: dept?.deptName || "-" })); }
    if (method === "DELETE" && lower.includes("/recruit/position/")) return removeAt("hrRecruitPositions", idFromUrl());
    if (method === "GET" && lower.includes("/recruit/interview/list")) return ok(clone(db.hrInterviews.filter((item) => !params.resumeId || String(item.resumeId) === String(params.resumeId))));
    if (method === "POST" && lower.includes("/recruit/interview/save")) { const resume = db.hrResumes.find((item) => String(item.id) === String(body.resumeId)); const item = body.id ? updateItem("hrInterviews", body.id, body) : addItem("hrInterviews", { candidateName: resume?.candidateName || "候选人", ...body }); if (resume) { resume.status = "INTERVIEW"; resume.interviewCount = db.hrInterviews.filter((row) => String(row.resumeId) === String(resume.id)).length; } return ok(item); }
    if (method === "DELETE" && lower.includes("/recruit/interview/")) return removeAt("hrInterviews", idFromUrl());
    if (method === "GET" && lower.includes("/recruit/resume/page")) return paged(hrFilter(db.hrResumes, params));
    if (method === "GET" && /\/recruit\/resume\/\d+/.test(lower)) return ok(clone(db.hrResumes.find((item) => String(item.id) === String(idFromUrl())) || db.hrResumes[0]));
    if (method === "POST" && lower.includes("/recruit/resume/save")) { const recruit = db.hrRecruitPositions.find((item) => String(item.id) === String(body.recruitId)); return ok(body.id ? updateItem("hrResumes", body.id, body) : addItem("hrResumes", { status: "PENDING", interviewCount: 0, positionName: recruit?.positionName || "-", deptName: recruit?.deptName || "-", ...body })); }
    if (method === "DELETE" && lower.includes("/recruit/resume/")) return removeAt("hrResumes", idFromUrl());
    if (method === "POST" && lower.includes("/recruit/hire")) {
      const resume = db.hrResumes.find((item) => String(item.id) === String(body.resumeId)) || db.hrResumes[0];
      const employee = hrEnrichEmployee({ id: ++idSeq, empNo: `EMP2026${String(db.hrEmployees.length + 1).padStart(3, "0")}`, name: resume.candidateName, gender: resume.gender, phone: resume.phone, email: resume.email, education: resume.education, school: resume.school, major: resume.major, deptId: body.deptId, positionId: body.positionId, hireDate: body.hireDate || "2026-10-08", regularDate: null, status: "PROBATION", remark: "由招聘录用转入" });
      db.hrEmployees.unshift(employee); resume.status = "HIRED"; const recruit = db.hrRecruitPositions.find((item) => String(item.id) === String(resume.recruitId)); if (recruit) recruit.hiredCount = Number(recruit.hiredCount || 0) + 1;
      return ok(employee);
    }

    if (method === "GET" && lower.includes("/stats/overview")) return ok(hrOverview());
    if (method === "GET" && lower.includes("/stats/dept-distribution")) return ok(db.hrDepartments.map((dept) => ({ name: dept.deptName, value: db.hrEmployees.filter((employee) => String(employee.deptId) === String(dept.id) && employee.status !== "RESIGNED").length })).filter((item) => item.value > 0));
    if (method === "GET" && lower.includes("/stats/education")) return ok(["博士", "硕士", "本科", "大专"].map((name) => ({ name, value: db.hrEmployees.filter((item) => item.education === name && item.status !== "RESIGNED").length })).filter((item) => item.value > 0));
    if (method === "GET" && lower.includes("/stats/tenure")) return ok([{ name: "1年以内", value: 1 }, { name: "1-3年", value: 3 }, { name: "3-5年", value: 2 }, { name: "5-10年", value: 2 }, { name: "10年以上", value: 0 }]);
    if (method === "GET" && lower.includes("/stats/attendance-trend")) return ok({ months: ["2026-07", "2026-08", "2026-09"], series: [{ name: "正常", data: [128, 136, db.hrAttendance.filter((item) => item.status === "NORMAL").length] }, { name: "迟到", data: [8, 6, db.hrAttendance.filter((item) => item.status === "LATE").length] }, { name: "早退", data: [3, 4, db.hrAttendance.filter((item) => item.status === "EARLY_LEAVE").length] }, { name: "缺勤", data: [2, 1, db.hrAttendance.filter((item) => item.status === "ABSENT").length] }, { name: "请假", data: [5, 7, db.hrAttendance.filter((item) => item.status === "LEAVE").length] }] });
    if (method === "GET" && lower.includes("/stats/leave-type")) return ok(["ANNUAL", "SICK", "PERSONAL", "COMPENSATORY"].map((type) => ({ name: { ANNUAL: "年假", SICK: "病假", PERSONAL: "事假", COMPENSATORY: "调休" }[type], value: db.hrLeaves.filter((item) => item.leaveType === type).length })));
    if (method === "GET" && lower.includes("/stats/salary-range")) return ok([{ name: "8000元以下", value: 0 }, { name: "8000-12000元", value: 1 }, { name: "12000-16000元", value: 2 }, { name: "16000-20000元", value: 1 }, { name: "20000-30000元", value: 0 }, { name: "30000元以上", value: 0 }]);
    if (method === "GET" && lower.includes("/stats/dept-salary")) return ok(Object.values(db.hrSalaries.reduce((acc, item) => { acc[item.deptName] ||= { name: item.deptName, value: 0 }; acc[item.deptName].value += Number(item.netSalary || 0); return acc; }, {})));

    return ok(null);
  };

  const handle = (method, rawUrl, requestBody) => {
    const urlObj = new URL(rawUrl, location.origin);
    const url = urlObj.pathname + urlObj.search;
    const lower = url.toLowerCase();
    const params = paramsOf(rawUrl);
    const body = bodyOf(requestBody);
    const key = mapResource(url);
    const current = Number(params.current || params.page || 1);
    const size = Number(params.size || params.pageSize || 10);
    if (project === "hr-management") return handleHr(method, lower, url, params, body, current, size);
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

    if (project === "personal-finance") {
      const month = params.periodMonth || "2026-09";
      const user = financeUser();
      const financePage = (rows) => page(rows, current, size);
      const treeFor = (type) => {
        const rows = db.financeCategories.filter((item) => !type || item.type === type);
        return rows.filter((item) => item.parentId == null).map((parent) => ({
          ...clone(parent),
          children: rows.filter((item) => String(item.parentId) === String(parent.id)).map((item) => ({ ...clone(item), children: [] })),
        }));
      };
      const saveSimple = (keyName, defaults = {}) => {
        const id = body.id;
        if (id) return updateItem(keyName, id, { ...body });
        return addItem(keyName, { ...defaults, ...body });
      };
      const removeSimple = (keyName) => {
        removeItem(keyName, body.id || params.id);
        return ok(true);
      };

      if (lower.includes("/auth/login")) {
        const matched = db.financeUsers.find((item) => item.username === body.username) || db.financeUsers[1];
        localStorage.setItem("pf_user", JSON.stringify(matched));
        localStorage.setItem("pf_token", "demo-token");
        return ok({ token: "demo-token", userInfo: clone(matched), recurringGenerated: [], recurringCount: 0 });
      }
      if (lower.includes("/auth/info") || lower.includes("/auth/me")) return ok({ ...clone(user), permissions: user.role === "ADMIN" ? ["*"] : ["finance"] });
      if (lower.includes("/auth/logout") || lower.includes("/auth/changepassword")) return ok(true);
      if (lower.includes("/user/uploadavatar")) return ok({ url: "https://dummyimage.com/160x160/d1fae5/047857&text=PF" });

      if (method === "GET" && lower.includes("/user/page")) return ok(financePage(clone(db.financeUsers)));
      if (method === "GET" && lower.includes("/user/list")) return ok(clone(db.financeUsers).map(({ id, username, realName, role }) => ({ id, username, realName, role })));
      if (method === "POST" && lower.includes("/user/save")) return ok(saveSimple("financeUsers", { role: "USER", status: 1, avatar: "", createTime: new Date().toLocaleString() }));
      if (method === "POST" && lower.includes("/user/delete")) return removeSimple("financeUsers");
      if (method === "POST" && lower.includes("/user/resetpassword")) return ok(true);

      if (method === "GET" && lower.includes("/config/list")) return ok(clone(db.financeConfigs));
      if (method === "POST" && lower.includes("/config/save")) return ok(saveSimple("financeConfigs"));
      if (method === "GET" && lower.includes("/log/page")) {
        let rows = clone(db.financeLogs);
        if (params.username) rows = rows.filter((item) => item.username.includes(params.username));
        if (params.status !== undefined && params.status !== "") rows = rows.filter((item) => String(item.status) === String(params.status));
        return ok(financePage(rows));
      }

      if (method === "GET" && lower.includes("/account/page")) {
        recalcFinanceAccounts();
        let rows = clone(db.financeAccounts);
        if (params.keyword) rows = rows.filter((item) => `${item.name}${item.remark}`.includes(params.keyword));
        if (params.type) rows = rows.filter((item) => item.type === params.type);
        return ok(financePage(rows));
      }
      if (method === "GET" && lower.includes("/account/list")) { recalcFinanceAccounts(); return ok(clone(db.financeAccounts.filter((item) => item.status === 1))); }
      if (method === "POST" && lower.includes("/account/save")) {
        const item = body.id ? updateItem("financeAccounts", body.id, body) : addItem("financeAccounts", { userId: 2, status: 1, initialBalance: 0, balance: 0, creditLimit: 0, icon: "Wallet", color: "#10b981", ...body });
        item.typeLabel = financeTypeLabel[item.type] || item.type;
        item.isCredit = item.type === "CREDIT";
        recalcFinanceAccounts();
        return ok({ id: item.id });
      }
      if (method === "POST" && lower.includes("/account/delete")) return removeSimple("financeAccounts");

      if (method === "GET" && lower.includes("/category/tree")) return ok(treeFor(params.type));
      if (method === "GET" && lower.includes("/category/list")) return ok(clone(db.financeCategories.filter((item) => !params.type || item.type === params.type)));
      if (method === "POST" && lower.includes("/category/save")) {
        const item = saveSimple("financeCategories", { isSystem: false, parentId: null, icon: "PriceTag", color: "#10b981", sort: 99 });
        const parent = financeCategory(item.parentId);
        item.parentName = parent?.name || null;
        item.fullName = parent ? `${parent.name} / ${item.name}` : item.name;
        return ok({ id: item.id });
      }
      if (method === "POST" && lower.includes("/category/delete")) return removeSimple("financeCategories");

      if (method === "GET" && lower.includes("/bill/page")) {
        const rows = financeBillRows(params);
        const result = financePage(clone(rows));
        result.sumIncome = financeMoney(rows.filter((item) => item.type === "INCOME").reduce((sum, item) => sum + Number(item.amount || 0), 0));
        result.sumExpense = financeMoney(rows.filter((item) => item.type === "EXPENSE").reduce((sum, item) => sum + Number(item.amount || 0), 0));
        return ok(result);
      }
      if (method === "GET" && lower.includes("/bill/detail")) return ok(clone(db.financeBills.find((item) => String(item.id) === String(params.id)) || db.financeBills[0]));
      if (method === "POST" && lower.includes("/bill/save")) {
        const account = financeAccount(body.accountId);
        const category = financeCategory(body.categoryId);
        const parent = financeCategory(category?.parentId);
        const tags = (body.tagIds || []).map((id) => db.financeTags.find((tag) => String(tag.id) === String(id))).filter(Boolean);
        const fields = {
          userId: 2, accountId: Number(body.accountId), accountName: account?.name || "未命名账户", accountType: account?.type || "CASH",
          categoryId: Number(body.categoryId), categoryName: category?.name || "其他", parentCategoryName: parent?.name || null,
          categoryIcon: category?.icon || "PriceTag", categoryColor: category?.color || "#10b981", type: body.type || "EXPENSE",
          amount: Number(body.amount || 0), recordDate: body.recordDate || "2026-09-26", remark: body.remark || "",
          source: body.source || "MANUAL", sourceLabel: body.source === "RECURRING" ? "周期账单" : "手工记账", ruleId: body.ruleId || null, tags: clone(tags),
        };
        const item = body.id ? updateItem("financeBills", body.id, fields) : addItem("financeBills", fields);
        recalcFinanceAccounts(); refreshFinanceBudgets(financeMonth(item.recordDate));
        return ok({ id: item.id });
      }
      if (method === "POST" && lower.includes("/bill/batchdelete")) {
        const ids = Array.isArray(body.ids) ? body.ids : [];
        ids.forEach((id) => removeItem("financeBills", id));
        recalcFinanceAccounts(); refreshFinanceBudgets(month);
        return ok({ count: ids.length });
      }
      if (method === "POST" && lower.includes("/bill/delete")) { removeItem("financeBills", body.id); recalcFinanceAccounts(); refreshFinanceBudgets(month); return ok(true); }
      if (lower.includes("/bill/export")) return ok("日期,类型,分类,金额,账户,备注\n2026-09-25,支出,餐饮/午餐,32,支付宝,工作日午餐");

      if (method === "GET" && lower.includes("/tag/list")) return ok(clone(db.financeTags));
      if (method === "POST" && lower.includes("/tag/save")) return ok(saveSimple("financeTags", { color: "#10b981", remark: "", usedCount: 0 }));
      if (method === "POST" && lower.includes("/tag/delete")) return removeSimple("financeTags");

      if (method === "GET" && lower.includes("/budget/page")) return ok(financePage(clone(refreshFinanceBudgets(month))));
      if (method === "GET" && lower.includes("/budget/status")) {
        const items = clone(refreshFinanceBudgets(month));
        const totalBudget = items.find((item) => item.categoryId == null) || null;
        const categoryBudgets = items.filter((item) => item.categoryId != null).sort((a, b) => b.usedRatio - a.usedRatio);
        return ok({ periodMonth: month, items, totalBudget, categoryBudgets, dangerCount: items.filter((item) => item.alertLevel === "DANGER").length, warnCount: items.filter((item) => item.alertLevel === "WARN").length, usedTotal: financeMoney(items.filter((item) => item.alertLevel !== "NORMAL").reduce((sum, item) => sum + item.amount, 0)) });
      }
      if (method === "GET" && lower.includes("/budget/checkalert")) return ok(clone(refreshFinanceBudgets(month).filter((item) => !params.categoryId || item.categoryId == null || String(item.categoryId) === String(params.categoryId))));
      if (method === "POST" && lower.includes("/budget/save")) {
        const category = financeCategory(body.categoryId);
        const item = body.id ? updateItem("financeBudgets", body.id, { ...body, categoryName: category?.name || "总预算" }) : addItem("financeBudgets", { userId: 2, periodMonth: month, warnRatio: 80, remark: "", categoryName: category?.name || "总预算", ...body, categoryId: body.categoryId || null });
        refreshFinanceBudgets(item.periodMonth || month);
        return ok({ id: item.id, status: clone(item) });
      }
      if (method === "POST" && lower.includes("/budget/delete")) return removeSimple("financeBudgets");

      if (method === "GET" && lower.includes("/recurring/page")) return ok(financePage(clone(db.financeRecurring)));
      if (method === "GET" && lower.includes("/recurring/preview")) {
        const items = db.financeRecurring.filter((item) => item.pendingCount > 0).map((item) => ({ ruleId: item.id, ruleName: item.name, userId: item.userId, nextRunDate: item.nextRunDate, overdueDays: item.overdueDays, count: item.pendingCount, dates: item.pendingDates }));
        return ok({ items: clone(items), totalCount: items.reduce((sum, item) => sum + item.count, 0) });
      }
      if (method === "POST" && (lower.includes("/recurring/check") || lower.includes("/recurring/run"))) {
        const rows = lower.includes("/run") ? db.financeRecurring.filter((item) => String(item.id) === String(body.id)) : db.financeRecurring.filter((item) => item.pendingCount > 0);
        const generated = [];
        rows.forEach((rule) => {
          (rule.pendingDates || []).forEach((date) => {
            const account = financeAccount(rule.accountId); const category = financeCategory(rule.categoryId); const parent = financeCategory(category?.parentId);
            addItem("financeBills", { userId: 2, accountId: rule.accountId, accountName: account?.name, accountType: account?.type, categoryId: rule.categoryId, categoryName: category?.name, parentCategoryName: parent?.name, categoryIcon: category?.icon, categoryColor: category?.color, type: rule.type, amount: rule.amount, recordDate: date, remark: `${rule.name}（周期账单自动生成）`, source: "RECURRING", sourceLabel: "周期账单", ruleId: rule.id, tags: [] });
          });
          if (rule.pendingCount) generated.push({ rule_id: rule.id, rule_name: rule.name, count: rule.pendingCount, next_run_date: "2026-10-20", account_id: rule.accountId });
          rule.lastRunDate = rule.pendingDates?.at(-1) || rule.lastRunDate; rule.nextRunDate = "2026-10-20"; rule.pendingCount = 0; rule.pendingDates = []; rule.overdueDays = 0; rule.isOverdue = false;
        });
        recalcFinanceAccounts(); refreshFinanceBudgets(month);
        return ok({ generated, totalCount: generated.reduce((sum, item) => sum + item.count, 0), today: "2026-09-26" });
      }
      if (method === "POST" && lower.includes("/recurring/save")) {
        const account = financeAccount(body.accountId); const category = financeCategory(body.categoryId);
        const labels = { DAILY: "每天", WEEKLY: "每周", MONTHLY: "每月", YEARLY: "每年" };
        const item = saveSimple("financeRecurring", { userId: 2, accountName: account?.name, categoryName: category?.name, categoryIcon: category?.icon, cycleLabel: labels[body.cycleType] || "每月", lastRunDate: null, overdueDays: 0, isOverdue: false, pendingCount: 0, pendingDates: [] });
        return ok({ id: item.id });
      }
      if (method === "POST" && lower.includes("/recurring/delete")) return removeSimple("financeRecurring");

      if (method === "GET" && lower.includes("/dashboard/overview")) {
        const summary = financeAccountSummary();
        const ms = financeMonthSummary(month);
        const budgets = refreshFinanceBudgets(month);
        const alerts = clone(budgets.filter((item) => item.alertLevel !== "NORMAL").sort((a, b) => b.usedRatio - a.usedRatio));
        const days = Array.from({ length: 30 }, (_, index) => String(index + 1).padStart(2, "0"));
        const daily = days.map((day) => financeMoney(db.financeBills.filter((bill) => bill.type === "EXPENSE" && bill.recordDate === `${month}-${day}`).reduce((sum, bill) => sum + Number(bill.amount || 0), 0)));
        return ok({ month, summary, monthSummary: ms, todayExpense: 32, monthIncome: ms.income, monthExpense: ms.expense, budgetAlerts: alerts, dangerCount: alerts.filter((item) => item.alertLevel === "DANGER").length, warnCount: alerts.filter((item) => item.alertLevel === "WARN").length, recentBills: clone(financeBillRows({}).slice(0, 8)), dailyExpense: { labels: days, values: daily }, overdueRules: clone(db.financeRecurring.filter((item) => item.isOverdue)), autoGenerated: [], autoGeneratedCount: 0 });
      }
      if (method === "GET" && (lower.includes("/stat/trend") || lower.includes("/stat/monthcompare"))) {
        const months = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
        const fallbackIncome = [11800, 12100, 12400, 12600, 12600, 13220];
        const fallbackExpense = [7200, 6890, 7540, 8010, 7900, 8872.6];
        const items = months.map((label, index) => {
          const actual = financeMonthSummary(label);
          const income = actual.count ? actual.income : fallbackIncome[index]; const expense = actual.count ? actual.expense : fallbackExpense[index];
          return { month: label, income, expense, balance: financeMoney(income - expense), count: actual.count || 18 + index };
        });
        return ok({ labels: months, income: items.map((item) => item.income), expense: items.map((item) => item.expense), balance: items.map((item) => item.balance), items });
      }
      if (method === "GET" && lower.includes("/stat/category")) {
        const type = params.type || "EXPENSE"; const rows = db.financeBills.filter((bill) => bill.type === type && financeMonth(bill.recordDate) === month); const groups = {};
        rows.forEach((bill) => { const category = financeCategory(bill.categoryId); const parent = financeCategory(category?.parentId) || category; if (!parent) return; groups[parent.id] ||= { name: parent.name, value: 0, color: parent.color }; groups[parent.id].value += Number(bill.amount || 0); });
        const items = Object.values(groups).map((item) => ({ ...item, value: financeMoney(item.value) })).sort((a, b) => b.value - a.value); const total = financeMoney(items.reduce((sum, item) => sum + item.value, 0)); items.forEach((item) => { item.percent = total ? Number((item.value / total * 100).toFixed(2)) : 0; });
        return ok({ periodMonth: month, type, total, items });
      }
      if (method === "GET" && lower.includes("/stat/budgetrate")) { const items = clone(refreshFinanceBudgets(month).sort((a, b) => b.usedRatio - a.usedRatio)); return ok({ periodMonth: month, labels: items.map((item) => item.categoryName), ratios: items.map((item) => item.usedRatio), amounts: items.map((item) => item.amount), usedAmounts: items.map((item) => item.usedAmount), levels: items.map((item) => item.alertLevel), items }); }
      if (method === "GET" && lower.includes("/stat/account")) { const summary = financeAccountSummary(); return ok({ items: summary.accounts.filter((item) => Math.abs(item.balance) > 0).map((item) => ({ name: item.name, value: Math.abs(item.balance), color: item.color, typeLabel: item.typeLabel, raw: item.balance })).sort((a, b) => b.value - a.value), summary }); }
      if (method === "GET" && lower.includes("/stat/daily")) { const labels = Array.from({ length: 30 }, (_, index) => `${index + 1} 日`); const income = Array(30).fill(0); const expense = Array(30).fill(0); db.financeBills.filter((bill) => financeMonth(bill.recordDate) === month).forEach((bill) => { const index = Number(bill.recordDate.slice(8, 10)) - 1; (bill.type === "INCOME" ? income : expense)[index] += Number(bill.amount || 0); }); return ok({ periodMonth: month, labels, income: income.map(financeMoney), expense: expense.map(financeMoney) }); }
      if (method === "GET" && lower.includes("/stat/ranking")) { const groups = {}; db.financeBills.filter((bill) => bill.type === "EXPENSE" && financeMonth(bill.recordDate) === month).forEach((bill) => { groups[bill.categoryName] = (groups[bill.categoryName] || 0) + Number(bill.amount || 0); }); return ok({ periodMonth: month, items: Object.entries(groups).map(([name, value]) => ({ name, value: financeMoney(value) })).sort((a, b) => b.value - a.value).slice(0, 10) }); }

      if (method === "GET" && lower.includes("/alert/list")) return ok(financePage(clone(db.financeAlerts.filter((item) => !params.alertLevel || item.alertLevel === params.alertLevel))));
      if (method === "POST" && lower.includes("/alert/read")) { db.financeAlerts.forEach((item) => { if (!body.id || String(item.id) === String(body.id)) item.isRead = 1; }); return ok(true); }
    }

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
