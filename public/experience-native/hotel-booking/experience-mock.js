(function () {
  const clone = value => JSON.parse(JSON.stringify(value));
  let seq = 100;
  const db = {
    roomTypes: [
      { id: 1, typeName: '高级大床房', bedType: '1.8m 大床', area: 32, capacity: 2, basePrice: 388, facilities: 'Wi-Fi,浴缸,迷你吧', status: 1 },
      { id: 2, typeName: '豪华双床房', bedType: '1.35m 双床', area: 38, capacity: 2, basePrice: 428, facilities: 'Wi-Fi,沙发,书桌', status: 1 },
      { id: 3, typeName: '家庭亲子房', bedType: '大床+儿童床', area: 48, capacity: 3, basePrice: 568, facilities: '儿童用品,浴缸', status: 1 },
      { id: 4, typeName: '行政套房', bedType: '2m 大床', area: 68, capacity: 2, basePrice: 888, facilities: '客厅,行政酒廊', status: 1 }
    ],
    rooms: [
      ['301',1,'FREE'],['302',1,'BOOKED'],['303',1,'OCCUPIED'],['401',2,'FREE'],['402',2,'CLEANING'],['501',3,'FREE'],['601',4,'MAINTENANCE']
    ].map((r,i)=>({id:i+1,roomNo:r[0],floor:Number(r[0][0]),roomTypeId:r[1],typeName:['高级大床房','豪华双床房','家庭亲子房','行政套房'][r[1]-1],status:r[2]})),
    guests: [
      {id:1,name:'张伟',phone:'138****1001',idCard:'110101********1234',source:'携程',memberLevel:'金卡'},
      {id:2,name:'刘芳',phone:'139****2202',idCard:'320102********4567',source:'美团',memberLevel:'银卡'},
      {id:3,name:'陈晓明',phone:'136****3303',idCard:'440103********7788',source:'散客',memberLevel:'普通'}
    ],
    bookings: [
      {id:1,bookingNo:'BK20260930001',guestId:1,guestName:'张伟',guestPhone:'138****1001',roomTypeId:1,typeName:'高级大床房',roomId:2,roomNo:'302',checkInDate:'2026-10-01',checkOutDate:'2026-10-03',roomCount:1,status:'BOOKED',source:'携程',totalAmount:1164},
      {id:2,bookingNo:'BK20260929002',guestId:2,guestName:'刘芳',guestPhone:'139****2202',roomTypeId:1,typeName:'高级大床房',roomId:3,roomNo:'303',checkInDate:'2026-09-29',checkOutDate:'2026-10-02',roomCount:1,status:'CHECKED_IN',source:'前台',totalAmount:970},
      {id:3,bookingNo:'BK20260928003',guestId:3,guestName:'陈晓明',guestPhone:'136****3303',roomTypeId:2,typeName:'豪华双床房',roomId:4,roomNo:'401',checkInDate:'2026-10-04',checkOutDate:'2026-10-06',roomCount:1,status:'BOOKED',source:'官网',totalAmount:1070}
    ],
    checkins: [{id:1,checkinNo:'CI20260929001',bookingId:2,bookingNo:'BK20260929002',guestId:2,guestName:'刘芳',roomId:3,roomNo:'303',roomTypeId:1,typeName:'高级大床房',checkInTime:'2026-09-29 14:10:00',plannedCheckOutDate:'2026-10-02',deposit:1000,status:'IN_HOUSE'}],
    bills: [{id:1,billNo:'BL20260928001',guestName:'陈晓明',roomNo:'401',roomFee:856,consumptionAmount:86,deposit:500,receivableAmount:442,paidAmount:442,status:'PAID',payType:'微信'}],
    payments: [{id:1,billId:1,direction:'PAY',amount:442,payType:'微信',payTime:'2026-09-28 12:20:00'}],
    cleanings: [{id:1,roomId:5,roomNo:'402',cleaner:'保洁员周姐',status:'PENDING',createTime:'2026-09-30 11:20:00'}],
    consumptions: [{id:1,checkinId:1,type:'MINIBAR',itemName:'迷你吧饮品',amount:38,quantity:1,createTime:'2026-09-30 20:10:00'}]
  };
  const ok = (data=null,msg='操作成功') => ({code:200,msg,data});
  const page = (rows,p) => { const c=Number(p.current||1),s=Number(p.size||10); return {records:clone(rows.slice((c-1)*s,c*s)),total:rows.length,current:c,size:s,pages:Math.max(1,Math.ceil(rows.length/s))}; };
  const bodyOf = b => { try { return typeof b==='string' ? JSON.parse(b||'{}') : {}; } catch { return {}; } };
  const idOf = path => Number((path.match(/\/(\d+)(?:\/|$)/)||[])[1]);
  const save = (key,body) => { const list=db[key]; if(body.id){const x=list.find(v=>v.id==body.id);Object.assign(x||{},body);return x;} const x={id:++seq,...body};list.unshift(x);return x; };
  function handle(method,raw,rawBody){
    const u=new URL(raw,location.origin), path=u.pathname.toLowerCase(), p=Object.fromEntries(u.searchParams), b=bodyOf(rawBody), id=idOf(path);
    if(path.includes('/auth/info')) return ok(JSON.parse(localStorage.getItem('hotel_user')||'{}'));
    if(path.includes('/auth/login')) return ok({token:'demo-token',userInfo:{id:1,username:b.username||'admin',realName:'演示用户',role:'ADMIN'}});
    if(path.includes('/stat/overview')) return ok({roomTotal:db.rooms.length,freeRooms:db.rooms.filter(x=>x.status==='FREE').length,occupiedRooms:db.rooms.filter(x=>x.status==='OCCUPIED').length,todayBookings:db.bookings.length,todayCheckins:1,todayRevenue:12860,occupancyRate:Math.round(db.rooms.filter(x=>x.status==='OCCUPIED').length/db.rooms.length*100)});
    if(path.includes('/stat/occupancy')) return ok([{date:'09-24',rate:62},{date:'09-25',rate:68},{date:'09-26',rate:75},{date:'09-27',rate:81},{date:'09-28',rate:77},{date:'09-29',rate:84},{date:'09-30',rate:79}]);
    if(path.includes('/stat/guest-source')) return ok([{name:'携程',value:38},{name:'美团',value:27},{name:'官网',value:21},{name:'前台散客',value:14}]);
    if(path.includes('/stat/report')) return ok({months:['5月','6月','7月','8月','9月'],revenues:[186000,214000,238000,265000,292000],roomTypeSales:db.roomTypes.map((x,i)=>({name:x.typeName,value:[126,108,74,42][i]})),consumption:[{name:'餐饮',value:46},{name:'迷你吧',value:28},{name:'洗衣',value:16},{name:'其他',value:10}]});
    if(path.includes('/room/status-stat')) return ok(['FREE','BOOKED','OCCUPIED','CLEANING','MAINTENANCE'].map(s=>({status:s,name:{FREE:'空闲',BOOKED:'已预订',OCCUPIED:'已入住',CLEANING:'待清洁',MAINTENANCE:'维护中'}[s],value:db.rooms.filter(x=>x.status===s).length})));
    if(path.includes('/room/floors')) return ok([3,4,5,6]);
    if(path.includes('/room/calendar/room-day')) return ok(clone(db.bookings.filter(x=>x.roomId==p.roomId)));
    if(path.includes('/room/calendar')) { const dates=['2026-09-30','2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05','2026-10-06']; return ok({dates,rooms:db.rooms.map(r=>({...r,cells:dates.map(d=>{const bk=db.bookings.find(x=>x.roomId===r.id&&d>=x.checkInDate&&d<x.checkOutDate);return {date:d,state:bk?(bk.status==='CHECKED_IN'?'OCCUPIED':'BOOKED'):r.status==='MAINTENANCE'?'MAINTENANCE':'FREE',bookingId:bk?.id,bookingNo:bk?.bookingNo,guestName:bk?.guestName};})}))}); }
    if(path.includes('/booking/available-rooms')) return ok(clone(db.rooms.filter(x=>x.roomTypeId==p.roomTypeId&&x.status!=='MAINTENANCE')));
    if(path.includes('/booking/check-conflict')) return ok({conflict:false,message:'所选日期可预订'});
    if(path.includes('/booking/options')) return ok(clone(db.bookings));
    if(path.includes('/checkin/options')||path.includes('/checkin/in-house')) return ok(clone(db.checkins));
    if(path.includes('/guest/options')||path.includes('/guest/list')) return ok(clone(db.guests));
    if(path.includes('/guest/addresses')) return ok(['北京','上海','广东','浙江']);
    if(path.includes('/room-type/options')||path.includes('/room-type/list')) return ok(clone(db.roomTypes));
    if(path.includes('/room/list')) return ok(clone(db.rooms));
    if(path.includes('/price/trend')||path.includes('/price/list')) return ok(Array.from({length:14},(_,i)=>({id:i+1,roomTypeId:Number(p.roomTypeId||1),priceDate:`2026-10-${String(i+1).padStart(2,'0')}`,price:i<7?582:485,priceType:i<7?'HOLIDAY':'NORMAL',remark:i<7?'国庆黄金周':'平日价'})));
    if(path.includes('/bill/pay-type-stat')) return ok([{name:'微信',value:48},{name:'支付宝',value:31},{name:'现金',value:14},{name:'银行卡',value:7}]);
    if(path.match(/\/bill\/\d+\/payments/)) return ok(clone(db.payments.filter(x=>x.billId===id)));
    if(path.includes('/bill/preview')) { const c=db.checkins.find(x=>x.id==p.checkinId)||db.checkins[0]; const consume=db.consumptions.filter(x=>x.checkinId===c.id).reduce((n,x)=>n+Number(x.amount),0); return ok({checkinId:c.id,guestName:c.guestName,roomNo:c.roomNo,roomFee:1164,consumptionAmount:consume,deposit:c.deposit,receivableAmount:164+consume,dayPrices:[{date:'2026-10-01',price:582},{date:'2026-10-02',price:582}]}); }
    if(path.includes('/consumption/list')) return ok(clone(db.consumptions.filter(x=>x.checkinId==p.checkinId)));
    const mapping=[['room-type','roomTypes'],['booking','bookings'],['checkin','checkins'],['bill','bills'],['guest','guests'],['cleaning','cleanings'],['consumption','consumptions'],['room','rooms']];
    const hit=mapping.find(([route])=>path.includes('/'+route));
    if(method==='GET'&&hit){const row=id&&db[hit[1]].find(x=>x.id===id);return ok(row?clone(row):page(db[hit[1]],p));}
    if(method==='POST'&&path.includes('/booking/save')) return ok(save('bookings',{bookingNo:`BK${Date.now()}`,status:'BOOKED',...b}));
    if(method==='PUT'&&path.match(/\/booking\/\d+\/change-dates/)) { const x=db.bookings.find(v=>v.id===id); if(x){x.checkInDate=p.checkInDate;x.checkOutDate=p.checkOutDate;} return ok(x); }
    if(method==='PUT'&&path.includes('/booking/')&&path.includes('/cancel')) {const x=db.bookings.find(v=>v.id===id);if(x)x.status='CANCELLED';return ok(x);}
    if(method==='POST'&&path.includes('/checkin/check-in')) {const room=db.rooms.find(x=>x.id==b.roomId)||db.rooms[0];room.status='OCCUPIED';return ok(save('checkins',{checkinNo:`CI${Date.now()}`,status:'IN_HOUSE',roomNo:room.roomNo,...b}));}
    if(method==='POST'&&path.includes('/checkin/change-room')) {const x=db.checkins.find(v=>v.id==b.checkinId);if(x){x.roomId=b.newRoomId;x.roomNo=db.rooms.find(r=>r.id==b.newRoomId)?.roomNo;}return ok(x);}
    if(method==='POST'&&path.includes('/bill/settle')) {const x=save('bills',{billNo:`BL${Date.now()}`,status:'PAID',...b});const c=db.checkins.find(v=>v.id==b.checkinId);if(c)c.status='CHECKED_OUT';return ok(x);}
    if(method==='POST'&&path.includes('/price/generate')) return ok(30);
    if(method==='POST'&&path.includes('/price/update')) return ok(b);
    if(method==='PUT'&&path.includes('/cleaning/')&&path.includes('/finish')) {const x=db.cleanings.find(v=>v.id===id);if(x)x.status='FINISHED';return ok(x);}
    if(method==='PUT'&&path.includes('/room/')&&path.includes('/status')) {const x=db.rooms.find(v=>v.id===id);if(x)x.status=p.status;return ok(x);}
    if((method==='POST'||method==='PUT')&&hit) return ok(save(hit[1],b));
    if(method==='DELETE'&&hit){const list=db[hit[1]],i=list.findIndex(x=>x.id===id);if(i>=0)list.splice(i,1);return ok(true);}
    if(path.includes('/file/upload')) return ok({url:''});
    return ok(null);
  }
  function install(){
    const Orig=window.XMLHttpRequest;
    window.XMLHttpRequest=function(){const x=new Orig();let method='GET',url='',mock=false;const listeners={};const fire=t=>{if(typeof x['on'+t]==='function')x['on'+t]();(listeners[t]||[]).forEach(f=>f.call(x));};const open=x.open;x.open=function(m,u){method=String(m).toUpperCase();url=String(u);mock=/\/api/.test(url);if(!mock)return open.apply(x,arguments);};const send=x.send;x.send=function(b){if(!mock)return send.apply(x,arguments);const text=JSON.stringify(handle(method,url,b));setTimeout(()=>{for(const [k,v] of Object.entries({readyState:4,status:200,statusText:'OK',responseText:text,response:text}))Object.defineProperty(x,k,{value:v,configurable:true});fire('readystatechange');fire('load');fire('loadend');},30);};const add=x.addEventListener;x.addEventListener=function(t,f){if(!mock)return add.apply(x,arguments);(listeners[t]||(listeners[t]=[])).push(f);};x.setRequestHeader=function(){};x.getResponseHeader=()=> 'application/json';x.getAllResponseHeaders=()=> 'content-type: application/json\r\n';return x;};
  }
  install(); window.__HOTEL_EXPERIENCE_HANDLE__=handle;
})();
