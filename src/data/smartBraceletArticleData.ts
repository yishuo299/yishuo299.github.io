export const projectUrl = "https://github.com/yishuo299/smart_bracelet";

export const screenshots = [
  {
    title: "电路原理图",
    desc: "展示 STM32、传感器、蓝牙、LCD、语音和报警模块之间的硬件连接关系。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsrGqiwzwnoVxFZW45FYv3jmPBV1X0AAKpJAACMD4RVcp375poFusuPQQ.jpg",
  },
  {
    title: "手机蓝牙 App",
    desc: "App 用于连接手环蓝牙模块，显示实时生命体征、报警状态和历史数据。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsq2qiwwS1PDzK5X5DznHojC-fakx_AAKmJAACMD4RVYMJgbN5y5T4PQQ.jpg",
  },
  {
    title: "手环 PCB",
    desc: "硬件板卡集成主控、传感器接口、通信接口与供电相关电路。",
    src: "https://piv.cc.cd/file/BQACAgUAAyEGAASLVN5eAAJsr2qixgFZqtQuWzM36BlFbsW4LUyHAAKzJAACMD4RVUukm-AtwMjQPQQ.jpg",
  },
];

export const modules = [
  ["主控调度层", "以 STM32F103 为核心，main.c 中持续执行初始化、数据采集、页面显示和业务处理。"],
  ["传感器采集层", "MAX30102 获取心率血氧，DS18B20 获取体温，AD8232 获取心电 ADC，MPU6050 提供跌倒检测基础数据。"],
  ["本地交互层", "LCD 展示时钟、指标、心电波形、菜单和阈值；按键用于页面切换、闹钟关闭和本地设置。"],
  ["报警提醒层", "生命体征异常或跌倒风险触发 LED、蜂鸣器、蓝牙 Danger 提示和 ASRPRO 语音播报。"],
  ["无线通信层", "USART 蓝牙模块以 9600 波特率收发 ASCII 数据，App 解析数据并可下发阈值。"],
  ["移动端展示层", "Android Kotlin + Jetpack Compose 构建界面，StateFlow 管理实时数据、历史记录、报警与连接状态。"],
];

export const techStack = [
  ["STM32F103", "负责传感器采集、LCD 显示、蓝牙通信、报警控制和整体任务调度。"],
  ["C / 标准外设库", "使用 STM32F10x Standard Peripheral Library 完成 GPIO、USART、ADC、TIM 等外设配置。"],
  ["Keil uVision5", "用于打开 USER/target.uvprojx、编译固件并下载到开发板。"],
  ["MAX30102", "通过模拟 I2C 获取红光/红外数据，并进一步得到心率、血氧指标。"],
  ["DS18B20", "使用单总线时序读取体温数据，适合低成本体温监测场景。"],
  ["AD8232", "将心电模拟信号输入 STM32 ADC，经过采样后用于 LCD 波形和 App 显示。"],
  ["MPU6050", "采集三轴加速度，为跌倒检测提供姿态和冲击变化依据。"],
  ["USART 蓝牙", "负责 STM32 与 Android App 的实时数据传输和阈值命令下发。"],
  ["Android Kotlin", "实现蓝牙连接、数据解析、状态更新、历史记录和可视化界面。"],
  ["Jetpack Compose", "用声明式 UI 构建实时健康卡片、设备选择弹窗、历史页和详情页。"],
];

export const protocolRows = [
  ["Temperature: 36.5 C", "体温上报", "App 使用正则提取 36.5 并刷新体温卡片。"],
  ["Heart Rate: 78 bpm", "心率上报", "App 提取 bpm 前的数字，判断范围后写入心率状态。"],
  ["Blood Oxygen: 98 %", "血氧上报", "App 提取百分比，低于阈值时本地状态也会标记异常。"],
  ["AD8232: 1840 1855 1872", "心电批量采样", "App 取最后一个有效 ADC 值作为当前心电数据。"],
  ["Danger!!!", "异常报警", "App 显示报警横幅，提醒用户关注设备状态。"],
  ["TH:0:60", "阈值下发", "设置心率下限；其他索引对应心率上限、血氧下限、体温上下限。"],
];

export const codeSections = [
  {
    title: "主循环：把系统拆成采集、显示、处理三步",
    method: "在 main.c 中先初始化外设，然后在 while(1) 中持续轮询业务函数。",
    purpose: "让项目结构清晰：采集函数只负责读数据，显示函数只负责界面，处理函数负责报警、蓝牙和闹钟。",
    code: `int main(void)
{
  Hardware_Init();
  while(1)
  {
    Get_Data();
    OLED_Show();
    Hardware_Hander();
  }
}`,
  },
  {
    title: "硬件初始化：一次性启动所有模块",
    method: "集中调用 LCD、LED、按键、蜂鸣器、定时器、传感器、RTC、蓝牙、语音和心电初始化函数。",
    purpose: "减少主函数复杂度，也方便定位某个硬件模块是否初始化失败。",
    code: `void Hardware_Init(void)
{
  NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);
  delay_init();
  LCD_Init();
  LED_Init();
  KEY_Init();
  BEEP_Init();
  TIM3_Int_Init(4999,7199);
  TIM4_Int_Init(99,7199);
  DS18B20_Init();
  MAX30102_Init();
  DS1307_Init();
  Bluetooth_Init(9600);
  ASRPRO_Init();
  AD8232_Init();
}`,
  },
  {
    title: "阈值数组：统一管理报警边界",
    method: "使用 threshold[5] 保存心率下限、心率上限、血氧下限、体温下限和体温上限。",
    purpose: "本地菜单和蓝牙 App 都可以修改同一组阈值，报警逻辑只读取一个数据源。",
    code: `int16_t threshold[5] = { 40, 140, 80, 20, 38 };

void Driver_Set_Threshold(int8_t index, int16_t val)
{
  if (index >= 0 && index < 5)
    threshold[index] = val;
}`,
  },
  {
    title: "传感器采集：体温、心率血氧、时间、心电同步刷新",
    method: "每轮读取 DS18B20、MAX30102、DS1307 与 AD8232，并把心电数据暂存到缓冲区。",
    purpose: "为 LCD 当前页面和蓝牙定时上报提供最新数据，心电多点缓存可形成连续波形。",
    code: `void Get_Data(void)
{
  temperature = Get_Temp_Val();
  MAX30102_GetXlXy(&maxXlXy.xl, &maxXlXy.xy);
  DS1307_GetTime(&watch_time.year, &watch_time.month,
                 &watch_time.date, &watch_time.week,
                 &watch_time.hour, &watch_time.minute,
                 &watch_time.second);
  AD8232_val[ad8232_count] = AD8232_ReadADC();
  if(AD8232_val[ad8232_count] >= 4000) AD8232_val[ad8232_count] = 4000;
  if(AD8232_val[ad8232_count] <= 500)  AD8232_val[ad8232_count] = 500;
  ad8232_count++;
}`,
  },
  {
    title: "报警判断：按开关与阈值决定是否触发",
    method: "分别判断心率、血氧、体温是否启用报警，再比较实时值和阈值。",
    purpose: "用户可只开启关注的指标；任一指标异常就进入统一报警流程。",
    code: `if(warn_mode[0] % 2) {
  warn_flag[0] = (maxXlXy.xl < threshold[0] || maxXlXy.xl > threshold[1]);
}
if(warn_mode[1] % 2) {
  warn_flag[1] = (maxXlXy.xy < threshold[2]);
}
if(warn_mode[2] % 2) {
  warn_flag[2] = (temperature < threshold[3] || temperature > threshold[4]);
}`,
  },
  {
    title: "声光与蓝牙报警：本地提醒和 App 提示同步出现",
    method: "任一 warn_flag 为 1 时，周期性发送 Danger、点亮 LED 并驱动蜂鸣器。",
    purpose: "用户看屏幕、听蜂鸣或看手机 App 都能知道当前数据异常。",
    code: `if(warn_flag[0] || warn_flag[1] || warn_flag[2] || warn_flag[3])
{
  if(warn_count % 2 == 0) {
    Bluetooth_Send_Data("\\r\\nDanger!!!\\r\\n");
    LED_Mode(LED_ON);
    BEEP = 1;
  } else {
    LED_Mode(LED_OFF);
    BEEP = 0;
  }
}`,
  },
  {
    title: "蓝牙数据帧：把健康数据拼成 App 可解析文本",
    method: "使用 sprintf 组合 Temperature、Heart Rate、Blood Oxygen 和 AD8232 多点数据。",
    purpose: "文本协议便于调试，手机端也可以通过正则稳定提取字段。",
    code: `len = sprintf(send_str, "\\r\\nTemperature:  %.1f C\\r\\n", temperature);
len += sprintf(send_str + len, "Heart Rate:  %d bpm\\r\\n", maxXlXy.xl);
len += sprintf(send_str + len, "Blood Oxygen: %d %%\\r\\n", maxXlXy.xy);
len += sprintf(send_str + len, "AD8232:");
for(i = 0; i < ad8232_count; i++) {
  len += sprintf(send_str + len, " %d", AD8232_val[i]);
}
Bluetooth_Send_Data(send_str);`,
  },
  {
    title: "蓝牙阈值解析：手机端可远程修改报警范围",
    method: "STM32 接收一行 TH 指令，支持单项 TH:索引:值，也支持批量 TH:v0,v1,v2,v3,v4。",
    purpose: "不用重新烧录固件，用户就能在 App 上调整报警阈值。",
    code: `static void BLE_Parse_Threshold_Cmd(const char* buf)
{
  const char* p = strstr(buf, "TH:");
  if (!p) return;
  p += 3;
  if (p[0] >= '0' && p[0] <= '4' && p[1] == ':') {
    int idx = p[0] - '0';
    int val = atoi(p + 2);
    Driver_Set_Threshold((int8_t)idx, (int16_t)val);
  }
}`,
  },
  {
    title: "AD8232 心电采样：ADC 连续转换读取原始值",
    method: "将 PB0 配置为 ADC1 通道 8，启动连续转换后读取 12 位 ADC 数据。",
    purpose: "获得心电模块输出的模拟波形基础数据，用于 LCD 波形与 App 心电显示。",
    code: `uint16_t AD8232_ReadADC(void)
{
  while(ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC) == RESET);
  return ADC_GetConversionValue(ADC1);
}`,
  },
  {
    title: "DS18B20 体温换算：从两个字节得到摄氏温度",
    method: "读取温度低字节和高字节，合并后乘以分辨率系数得到实际温度。",
    purpose: "为体温页面、蓝牙上报和体温异常判断提供输入。",
    code: `TL = DS18B20_Read_Byte();
TH = DS18B20_Read_Byte();
tem = TH;
tem <<= 8;
tem += TL;
res = (float)tem * 0.625 * 0.1;`,
  },
  {
    title: "Android 蓝牙连接：优先使用 SPP UUID，失败后尝试反射通道",
    method: "通过 createInsecureRfcommSocketToServiceRecord 连接，异常时回退到 createRfcommSocket(1)。",
    purpose: "提高不同蓝牙模块和手机系统版本下的连接成功率。",
    code: `var socket: BluetoothSocket? = null
try {
  socket = device.createInsecureRfcommSocketToServiceRecord(SPP_UUID)
  socket.connect()
} catch (e: IOException) {
  socket?.close()
  socket = createRfcommSocketByReflect(device)
  socket?.connect()
}`,
  },
  {
    title: "App 数据解析：用接收缓冲解决蓝牙分包问题",
    method: "先把字节转为字符串追加到 receiveBuffer，再逐项匹配体温、心率、血氧、心电和 Danger。",
    purpose: "蓝牙数据可能被拆成多段到达，缓冲解析能避免半包导致数据丢失。",
    code: `receiveBuffer.append(text)
val hrMatcher = heartRatePattern.matcher(content)
if (hrMatcher.find()) {
  hrMatcher.group(1)?.toIntOrNull()?.let { v ->
    if (v in 40..220) updateMetric(_heartRate, v.toFloat())
  }
  receiveBuffer.delete(hrMatcher.start(), hrMatcher.end())
}`,
  },
  {
    title: "App 阈值下发：把页面设置转换为 TH 命令",
    method: "根据指标类型生成一个或多个 TH 指令，并通过蓝牙串口发送给 STM32。",
    purpose: "实现手机端配置与固件端报警逻辑联动。",
    code: `fun sendThresholdToMcu(type: MetricType, min: Float, max: Float): Boolean {
  val commands = when (type) {
    MetricType.HEART_RATE -> listOf("TH:0:\${min.toInt()}\\r\\n", "TH:1:\${max.toInt()}\\r\\n")
    MetricType.SPO2 -> listOf("TH:2:\${min.toInt()}\\r\\n")
    MetricType.TEMPERATURE -> listOf("TH:3:\${min.toInt()}\\r\\n", "TH:4:\${max.toInt()}\\r\\n")
    MetricType.ECG -> listOf("TH:5:\${min.toInt()}\\r\\n", "TH:6:\${max.toInt()}\\r\\n")
  }
  return commands.all { sendBluetoothData(it) }
}`,
  },
];
