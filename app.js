// ===== Firebase Config =====
firebase.initializeApp({
  apiKey: "AIzaSyAs4VI1JZNxnIWb5wUe5b1k9YbiXxSc7ro",
  authDomain: "sunflower-checklist.firebaseapp.com",
  projectId: "sunflower-checklist",
  storageBucket: "sunflower-checklist.firebasestorage.app",
  messagingSenderId: "339122015370",
  appId: "1:339122015370:web:dbb2579440d18568d67173"
});
var db = firebase.firestore();

// ===== Constants =====
var STUDENTS = [
  {id:1,name:"길선균"},{id:2,name:"김시우"},{id:3,name:"김주혁"},{id:4,name:"김지안"},
  {id:5,name:"류승호"},{id:6,name:"박인채"},{id:7,name:"박제이"},{id:8,name:"박준혁"},
  {id:9,name:"박태현"},{id:10,name:"배규연"},{id:11,name:"임순"},{id:12,name:"정한율"},
  {id:13,name:"고예은"},{id:14,name:"김가율"},{id:15,name:"김규빈"},{id:16,name:"김윤재"},
  {id:17,name:"박세아"},{id:18,name:"박예솜"},{id:19,name:"신수아"},{id:20,name:"심해나"},
  {id:21,name:"장하나"},{id:22,name:"정유주"}
];
var ADMIN_PASSWORD = "9494";

// ===== 오늘의 미션 =====
// 하루에 2개(마음 표현 1 + 함께하기 1)를 날짜 기준으로 순환해서 보여주고, 하나 완료할 때마다 1점.
var MISSION_POOL_A = [
  {icon:"👋",text:"친구에게 밝게 인사하기"},
  {icon:"😊",text:"친구와 눈이 마주치면 활짝 웃어주기"},
  {icon:"🍚",text:"친구에게 오늘 점심 어땠냐고 물어보기"},
  {icon:"🙏",text:"친구에게 \"고마워\"라고 말하거나 쪽지로 전하기"},
  {icon:"🌟",text:"친구의 좋은 점 하나 찾아서 알려주기"},
  {icon:"👍",text:"친구에게 엄지척 해주기"},
  {icon:"💌",text:"친구에게 응원 쪽지 써서 전하기"},
  {icon:"👂",text:"친구가 이야기할 때 끝까지 들어주기"},
  {icon:"🎨",text:"친구 칭찬하기"},
  {icon:"👏",text:"친구가 잘한 일에 박수쳐 주기"},
  {icon:"🌈",text:"오늘 기분이 어떤지 친구에게 물어보기"},
  {icon:"🤗",text:"친구에게 \"잘했어!\" 응원해 주기"}
];
var MISSION_POOL_B = [
  {icon:"✏️",text:"친구가 떨어뜨린 물건 주워주기"},
  {icon:"🤝",text:"도움이 필요한 친구에게 \"도와줄까?\" 물어보기"},
  {icon:"🧸",text:"쉬는 시간에 혼자 있는 친구에게 같이 놀자고 하기"},
  {icon:"📏",text:"친구에게 준비물 빌려주기"},
  {icon:"🙌",text:"친구가 발표할 때 집중해서 들어주기"},
  {icon:"🚶",text:"줄을 설 때 친구에게 양보하기"},
  {icon:"🧹",text:"친구와 함께 교실 정리하기"},
  {icon:"💬",text:"모둠 활동에서 친구 의견 먼저 들어주기"},
  {icon:"⚽",text:"친구에게 같이 하고 싶은 놀이 제안하기"},
  {icon:"💛",text:"친구가 실수했을 때 \"괜찮아\" 하고 다독여주기"},
  {icon:"📖",text:"짝에게 오늘 배운 것 알려주기"},
  {icon:"🏷️",text:"친구 이름을 불러주며 인사하기"},
  {icon:"🪑",text:"친구와 나란히 앉거나 함께 걷기"},
  {icon:"🎁",text:"친구에게 작은 칭찬 한 가지 해주기"}
];
// 쉬운 단계: 부담 없는 행동 1개 + 한 마디 말하기 1개 (말하기 미션이 매일 반드시 포함됨)
var MISSION_POOL_BASIC_A = [
  {icon:"👋",text:"친구에게 손 흔들며 인사하기"},
  {icon:"😊",text:"친구에게 활짝 웃어주기"},
  {icon:"👍",text:"친구에게 엄지척 해주기"},
  {icon:"🙂",text:"친구와 눈을 마주치고 고개 끄덕이기"},
  {icon:"💌",text:"친구에게 짧은 쪽지나 그림 전하기"},
  {icon:"👏",text:"친구가 발표할 때 박수쳐 주기"},
  {icon:"🤝",text:"친구와 함께 놀이하거나 나란히 앉기"},
  {icon:"✏️",text:"친구가 떨어뜨린 물건 주워주기"}
];
var MISSION_POOL_BASIC_B = [
  {icon:"🗣️",text:"친구에게 \"안녕\" 한 마디 하기"},
  {icon:"🙇",text:"선생님께 \"안녕하세요\" 인사하기"},
  {icon:"🙏",text:"친구에게 \"고마워\" 한 마디 하기"},
  {icon:"📣",text:"친구 이름을 한 번 불러보기"},
  {icon:"🏠",text:"친구에게 \"잘 가\" 인사하기"},
  {icon:"✅",text:"질문을 받으면 \"네\" 또는 \"아니요\"로 대답하기"},
  {icon:"😄",text:"친구에게 \"좋아\" 한 마디 해주기"},
  {icon:"🌼",text:"스스로 할 수 있는 일도 \"도와줄 수 있어?\" 하고 물어보고 같이 하기"}
];
var BASIC_MISSION_STUDENT_IDS = [21]; // 기본값. 관리자 '미션 관리' 탭에서 바꾸면 그 값을 사용
var MISSION_HINT_DEFAULT = "말이 어려우면 손짓, 웃음, 쪽지로 전해도 좋아요 😊";
var MISSION_HINT_BASIC = "작은 목소리로 한 마디면 충분해요 🌱";
function getDayNumber(){
  var n=new Date(); return Math.floor(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())/86400000);
}
function getTodayMissions(student){
  var day=getDayNumber();
  var c=missionConfig;
  var basic=!!student && c.basicIds.indexOf(student.id)!==-1;
  var a=basic?c.basicA:c.poolA, b=basic?c.basicB:c.poolB;
  var sid=student?student.id:0;
  var ia=(day+sid*missionStride(a.length))%a.length;
  var ib=(day+sid*missionStride(b.length)+Math.floor(b.length/2))%b.length;
  return {missions:[a[ia], b[ib]], hint:basic?MISSION_HINT_BASIC:MISSION_HINT_DEFAULT};
}
function gcd(x,y){return y?gcd(y,x%y):x;}
// 목록 길이와 서로소인 간격 -> 학생 번호가 1씩 늘 때 목록 위치가 이만큼 건너뛰고, 모든 항목이 고르게 쓰임
function missionStride(len){
  var s=Math.max(1,Math.round(len*0.38));
  while(gcd(s,len)!==1)s++;
  return s;
}

// ===== 연속 보너스 =====
// 미션 2개를 모두 완료한 수업일이 연속으로 STREAK_BONUS_EVERY일 쌓일 때마다(3, 6, 9일째...) 보너스 점수.
// 주말과 관리자가 지정한 쉬는 날은 건너뛰어서 이어 계산한다. (본인 기록 myMissionDays 기준)
var STREAK_BONUS_EVERY = 3;
var STREAK_BONUS_POINTS = 1;
var myMissionDays = {}; // {날짜: 그날 미션 2개를 모두 완료했는지}
function isSchoolDay(s){
  var w=new Date(s+'T00:00:00').getDay();
  return w!==0&&w!==6&&missionConfig.holidays.indexOf(s)===-1;
}
function prevSchoolDay(s){
  var d=new Date(s+'T00:00:00');
  for(var i=0;i<400;i++){d.setDate(d.getDate()-1);var t=dateToStr(d);if(isSchoolDay(t))return t;}
  return null;
}
function countPrevStreak(from){
  var n=0,cur=from;
  for(;;){var p=prevSchoolDay(cur);if(!p||!myMissionDays[p])break;n++;cur=p;}
  return n;
}
function computeMissionStreak(){
  var done=!!(currentData.mission1&&currentData.mission2);
  var before=countPrevStreak(getTodayString());
  var n=done?before+1:0;
  return {before:before,n:n,bonus:(n>0&&n%STREAK_BONUS_EVERY===0)?STREAK_BONUS_POINTS:0};
}

// 관리자 '미션 관리' 탭에서 저장한 목록 (Firestore settings/missions). 없거나 읽기 실패하면 위 기본 목록 사용.
var DEFAULT_MISSION_CONFIG = {poolA:MISSION_POOL_A,poolB:MISSION_POOL_B,basicA:MISSION_POOL_BASIC_A,basicB:MISSION_POOL_BASIC_B,basicIds:BASIC_MISSION_STUDENT_IDS,holidays:[]};
var MISSION_LIST_KEYS = ['poolA','poolB','basicA','basicB'];
function cloneMissionConfig(c){return JSON.parse(JSON.stringify(c));}
function normalizeMissionConfig(raw){
  var cfg=cloneMissionConfig(DEFAULT_MISSION_CONFIG);
  if(!raw)return cfg;
  MISSION_LIST_KEYS.forEach(function(k){
    if(!Array.isArray(raw[k]))return;
    var list=raw[k].filter(function(m){return m&&typeof m.text==='string'&&m.text.trim();})
      .map(function(m){return {icon:(typeof m.icon==='string'&&m.icon.trim())?m.icon.trim():'⭐',text:m.text.trim()};});
    if(list.length)cfg[k]=list;
  });
  if(Array.isArray(raw.basicIds)){
    cfg.basicIds=raw.basicIds.filter(function(n){return Number.isInteger(n)&&n>=1&&n<=STUDENTS.length;});
  }
  if(Array.isArray(raw.holidays)){
    cfg.holidays=raw.holidays.filter(function(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);});
  }
  return cfg;
}
var missionConfig=cloneMissionConfig(DEFAULT_MISSION_CONFIG);
function listenMissionConfig(){
  db.collection('settings').doc('missions').onSnapshot(function(snap){
    missionConfig=normalizeMissionConfig(snap.exists?snap.data():null);
    if(currentStudent&&pages.student.classList.contains('active'))updateStudentUI();
  },function(err){console.error('미션 설정 읽기 오류:',err);});
}

// ===== Utilities =====
function getTodayString() {
  var n=new Date(); return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,'0')+"-"+String(n.getDate()).padStart(2,'0');
}
function getFormattedDate() {
  var n=new Date(),d=['일','월','화','수','목','금','토'];
  return n.getFullYear()+"년 "+(n.getMonth()+1)+"월 "+n.getDate()+"일 ("+d[n.getDay()]+")";
}
function getDocId(name) { return name+"_"+getTodayString(); }
function formatDateKR(dateStr) {
  var p=dateStr.split('-'); return p[0]+"년 "+parseInt(p[1])+"월 "+parseInt(p[2])+"일";
}
function getMonday(d) {
  var dt=new Date(d); var day=dt.getDay(); var diff=dt.getDate()-day+(day===0?-6:1);
  dt.setDate(diff); return dt;
}
function dateToStr(d) {
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,'0')+"-"+String(d.getDate()).padStart(2,'0');
}
function getCurrentMonthStartDate() {
  var n=new Date(); return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,'0')+"-01";
}

// ===== DOM =====
var pages={home:document.getElementById('home-page'),student:document.getElementById('student-page'),admin:document.getElementById('admin-page')};
var el={};
['today-date','student-date','admin-date','student-grid','student-name-title','student-number-badge',
 'homework-check','duty-check','homework-status','duty-status','homework-card','duty-card',
 'presentation-count','presentation-minus','presentation-plus','today-points','bonus-hint','admin-btn','back-btn-student','back-btn-admin',
 'password-modal','admin-password','password-error','modal-cancel','modal-confirm',
 'student-pin-modal','student-pin-title','student-pin-subtitle','student-pin-input','student-pin-error','student-pin-cancel','student-pin-confirm',
 'student-pin-setup-modal','student-pin-setup-title','student-pin-new','student-pin-confirm-input','student-pin-setup-error','student-pin-setup-cancel','student-pin-setup-confirm',
 'tab-today','tab-points','tab-history','tab-custom','tab-pins',
 'content-today','content-points','content-history','content-custom','content-pins',
 'today-table-body','points-table-body','stat-homework','stat-duty','stat-presentation','stat-praise','stat-attitude','stat-custom',
 'loading-overlay','reset-points-btn','reset-modal','reset-cancel','reset-confirm',
 'reset-date-display','search-history-btn','history-summary','history-period-text',
 'hist-stat-homework','hist-stat-duty','hist-stat-presentation','hist-stat-praise','hist-stat-attitude','hist-stat-custom',
 'history-table-wrapper','history-table-body','history-empty',
 'filter-date','filter-week-date','filter-month','filter-start','filter-end','week-range-hint',
 'custom-student-grid','custom-logs-list',
 'custom-modal','custom-modal-title','modal-custom-reason','modal-custom-point','custom-modal-cancel','custom-modal-confirm',
 'mission-with-a','mission-with-select-a','mission-with-b','mission-with-select-b',
 'mission-streak','mission-holidays',
 'mission-confirm-btn','teacher-confirm-modal','tc-mission-list','tc-password','tc-error','tc-cancel','tc-confirm',
 'mission-editors','mission-basic-ids','mission-basic-names','mission-save','mission-reset-default',
 'mission-hint','mission-snack','mission-card-a','mission-icon-a','mission-text-a','mission-status-a','mission-check-a',
 'mission-card-b','mission-icon-b','mission-text-b','mission-status-b','mission-check-b','stat-mission','hist-stat-mission',
 'reset-date-input', 'cumulative-points', 'cumulative-label', 'pins-table-body'
].forEach(function(id){
  var camel=id.replace(/-([a-z])/g,function(m,c){return c.toUpperCase();});
  el[camel]=document.getElementById(id);
});

// ===== State =====
var currentStudent=null, currentData={homework:false,duty:false,presentations:0,praise:0,attitude:0,customScore:0,customLogs:[]};
var unsubscribeSnapshot=null, unsubscribeCumulative=null, homeUnsubscribes=[];
var adminUnsubscribes={today:null, points:null, custom:null};
var lastResetDate=null; // date string of last reset, null=no reset
var currentPeriod='daily';
var targetCustomStudent=null; // 모달용 타겟 학생 이름

// ===== Navigation =====
function showPage(name){
  Object.keys(pages).forEach(function(k){pages[k].classList.remove('active');});
  pages[name].classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// ===== Toast =====
function showToast(msg){
  var t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},2500);
}

// ===== Mini Confetti =====
function miniConfetti(){
  var colors=['#FFD700','#FF9800','#66BB6A','#42A5F5','#EF5350','#AB47BC'];
  for(var i=0;i<15;i++){(function(){
    var p=document.createElement('div');p.className='confetti-piece';
    p.style.left=(40+Math.random()*20)+'vw';p.style.top='40vh';
    p.style.background=colors[Math.floor(Math.random()*colors.length)];
    p.style.borderRadius=Math.random()>0.5?'50%':'2px';
    p.style.width=(6+Math.random()*8)+'px';p.style.height=(6+Math.random()*8)+'px';
    document.body.appendChild(p);
    var a=(Math.random()-0.5)*120,dist=100+Math.random()*200,dur=600+Math.random()*800;
    p.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},
      {transform:'translate('+(Math.sin(a)*dist)+'px,'+(-dist+Math.random()*100)+'px) rotate('+(360+Math.random()*360)+'deg)',opacity:0}
    ],{duration:dur,easing:'cubic-bezier(0,0,0.2,1)'});
    setTimeout(function(){p.remove();},dur);
  })();}
}

function showLoading(s){el.loadingOverlay.classList.toggle('active',s);}

// ===== Init =====
function initDates(){
  var f=getFormattedDate();
  el.todayDate.textContent=f; el.studentDate.textContent=f; el.adminDate.textContent=f;
  el.filterDate.value=getTodayString();
  el.filterWeekDate.value=getTodayString();
  el.filterMonth.value=getTodayString().substring(0,7);
  el.filterStart.value=getTodayString();
  el.filterEnd.value=getTodayString();
  updateWeekHint();
}

function renderStudentGrid(){
  el.studentGrid.innerHTML='';
  STUDENTS.forEach(function(s){
    var c=document.createElement('div');c.className='student-card';c.id='student-card-'+s.id;
    c.innerHTML='<div class="number">'+s.id+'</div><div class="name">'+s.name+'</div>'+
      '<div class="status-dots"><div class="status-dot" id="dot-hw-'+s.id+'" title="숙제"></div>'+
      '<div class="status-dot" id="dot-duty-'+s.id+'" title="1인1역"></div>'+
      '<div class="status-dot" id="dot-pres-'+s.id+'" title="발표"></div></div>';
    c.addEventListener('click',function(){handleStudentClick(s);});
    el.studentGrid.appendChild(c);
  });
}

var pendingStudent = null;
var pendingPin = null;

function handleStudentClick(student) {
  showLoading(true);
  db.collection('studentPins').doc(student.name).get().then(function(doc){
    showLoading(false);
    pendingStudent = student;
    if(doc.exists && doc.data().pin) {
      pendingPin = doc.data().pin;
      el.studentPinInput.value = '';
      el.studentPinError.classList.remove('show');
      el.studentPinModal.classList.add('active');
      setTimeout(function(){el.studentPinInput.focus();}, 100);
    } else {
      el.studentPinNew.value = '';
      el.studentPinConfirmInput.value = '';
      el.studentPinSetupError.classList.remove('show');
      el.studentPinSetupModal.classList.add('active');
      setTimeout(function(){el.studentPinNew.focus();}, 100);
    }
  }).catch(function(err){
    console.error("Error fetching PIN:", err);
    showLoading(false);
    showToast('❌ 데이터를 불러오는데 실패했습니다.');
  });
}

el.studentPinCancel.addEventListener('click', function(){
  el.studentPinModal.classList.remove('active');
  pendingStudent = null;
  pendingPin = null;
});

el.studentPinConfirm.addEventListener('click', function(){
  var input = el.studentPinInput.value;
  if(input === pendingPin || input === ADMIN_PASSWORD) {
    el.studentPinModal.classList.remove('active');
    openStudentPage(pendingStudent);
  } else {
    el.studentPinError.classList.add('show');
    el.studentPinInput.value = '';
    el.studentPinInput.focus();
  }
});
el.studentPinInput.addEventListener('keydown',function(e){if(e.key==='Enter')el.studentPinConfirm.click();});

el.studentPinSetupCancel.addEventListener('click', function(){
  el.studentPinSetupModal.classList.remove('active');
  pendingStudent = null;
});

el.studentPinSetupConfirm.addEventListener('click', function(){
  var p1 = el.studentPinNew.value;
  var p2 = el.studentPinConfirmInput.value;
  if(p1.length !== 4) {
    el.studentPinSetupError.textContent = '비밀번호 4자리를 입력해주세요.';
    el.studentPinSetupError.classList.add('show');
    return;
  }
  if(p1 !== p2) {
    el.studentPinSetupError.textContent = '비밀번호가 일치하지 않습니다.';
    el.studentPinSetupError.classList.add('show');
    return;
  }
  
  showLoading(true);
  db.collection('studentPins').doc(pendingStudent.name).set({
    pin: p1,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(){
    showLoading(false);
    el.studentPinSetupModal.classList.remove('active');
    showToast('🔑 비밀번호가 설정되었습니다.');
    openStudentPage(pendingStudent);
  }).catch(function(err){
    console.error("Error setting PIN:", err);
    showLoading(false);
    showToast('❌ 비밀번호 설정에 실패했습니다.');
  });
});

function updateHomeDots(sid,data){
  var hw=document.getElementById('dot-hw-'+sid),du=document.getElementById('dot-duty-'+sid),pr=document.getElementById('dot-pres-'+sid);
  if(hw){if(data.homework)hw.classList.add('done');else hw.classList.remove('done');}
  if(du){if(data.duty)du.classList.add('done');else du.classList.remove('done');}
  if(pr){if((data.presentations||0)>0)pr.classList.add('done');else pr.classList.remove('done');}
}

function listenHomeData(){
  homeUnsubscribes.forEach(function(u){u();});homeUnsubscribes=[];
  STUDENTS.forEach(function(s){
    var unsub=db.collection('checklist').doc(getDocId(s.name)).onSnapshot(function(snap){
      var d=snap.exists?snap.data():{homework:false,duty:false,presentations:0};
      updateHomeDots(s.id,d);
    });
    homeUnsubscribes.push(unsub);
  });
}

// ===== Student Page =====
function buildMissionWithOptions(student){
  ['A','B'].forEach(function(k){
    var sel=el['missionWithSelect'+k];sel.innerHTML='';
    var none=document.createElement('option');none.value='';none.textContent='(선택 안 함)';sel.appendChild(none);
    STUDENTS.forEach(function(s){
      if(s.id===student.id)return;
      var o=document.createElement('option');o.value=s.name;o.textContent=s.name;sel.appendChild(o);
    });
  });
}

function openStudentPage(student){
  currentStudent=student;
  buildMissionWithOptions(student);
  myMissionDays={};
  el.studentNameTitle.textContent=student.name;
  el.studentNumberBadge.textContent=student.id+'번';
  showPage('student');
  if(unsubscribeSnapshot)unsubscribeSnapshot();
  unsubscribeSnapshot=db.collection('checklist').doc(getDocId(student.name)).onSnapshot(function(snap){
    currentData=snap.exists?snap.data():{homework:false,duty:false,presentations:0,praise:0,attitude:0,customScore:0,customLogs:[]};
    updateStudentUI();
  });
  startCumulativeListener(student);
}

function startCumulativeListener(student) {
  if(unsubscribeCumulative) { unsubscribeCumulative(); unsubscribeCumulative = null; }
  
  var startOfCurrentMonth = getCurrentMonthStartDate();
  var currentMonth = new Date().getMonth() + 1;
  if(el.cumulativeLabel) el.cumulativeLabel.textContent = currentMonth + '월 누적 현황';
  
  var query = db.collection('checklist').where('name', '==', student.name);
  
  unsubscribeCumulative = query.onSnapshot(function(snap){
    var md={};
    var map={};
    STUDENTS.forEach(function(s){map[s.name]={id:s.id,name:s.name,hw:0,du:0,pr:0,praise:0,att:0,cust:0,mi:0,sb:0};});
    
    snap.forEach(function(doc){
      var d=doc.data();
      if(!d.name||!map[d.name])return;
      if(d.date)md[d.date]=!!(d.mission1&&d.mission2);
      if(d.date && d.date < startOfCurrentMonth)return;
      if(d.homework)map[d.name].hw++;
      if(d.duty)map[d.name].du++;
      map[d.name].pr+=(d.presentations||0);
      map[d.name].praise+=(d.praise||0);
      map[d.name].att+=(d.attitude||0);
      map[d.name].cust+=(d.customScore||0);
      map[d.name].mi+=(d.mission1?1:0)+(d.mission2?1:0);
      map[d.name].sb+=(d.streakBonus||0);
    });
    
    var s=map[student.name]; var bonus=Math.floor(s.pr/3);
    var myTotal=s.hw+s.du+bonus+s.praise+s.att+s.cust+s.mi+s.sb;
    el.cumulativePoints.textContent = myTotal + '점';
    myMissionDays=md;
    if(currentStudent===student)updateStudentUI();
  }, function(err){
    console.error("Cumulative listener error:", err);
  });
}

function updateStudentUI(){
  el.homeworkCheck.checked=currentData.homework||false;
  el.dutyCheck.checked=currentData.duty||false;
  el.homeworkStatus.textContent=currentData.homework?'완료! 👍':'미완료';
  el.homeworkStatus.className='card-status'+(currentData.homework?' done':'');
  el.homeworkCard.classList.toggle('checked',!!currentData.homework);
  el.dutyStatus.textContent=currentData.duty?'완료! 👍':'미완료';
  el.dutyStatus.className='card-status'+(currentData.duty?' done':'');
  el.dutyCard.classList.toggle('checked',!!currentData.duty);
  var pres=currentData.presentations||0;
  el.presentationCount.textContent=pres+'회';
  var bonus=Math.floor(pres/3);
  var remaining=3-(pres%3);
  if(pres>0&&pres%3===0){
    el.bonusHint.textContent='🌟 보너스 획득! 다음까지 3회 더!';
    el.bonusHint.className='bonus-hint achieved';
  } else {
    el.bonusHint.textContent='다음 보너스까지 '+remaining+'회';
    el.bonusHint.className='bonus-hint'+(remaining===1?' close':'');
  }
  var praise=currentData.praise||0;
  var att=currentData.attitude||0;
  var cust=currentData.customScore||0;
  var tm=getTodayMissions(currentStudent);
  el.missionHint.textContent=tm.hint;
  [['A',tm.missions[0],!!currentData.mission1],['B',tm.missions[1],!!currentData.mission2]].forEach(function(m){
    el['missionIcon'+m[0]].textContent=m[1].icon;
    el['missionText'+m[0]].textContent=m[1].text;
    el['missionCheck'+m[0]].checked=m[2];
    el['missionStatus'+m[0]].textContent=m[2]?'완료! 👍':'미완료';
    el['missionStatus'+m[0]].className='card-status'+(m[2]?' done':'');
    el['missionCard'+m[0]].classList.toggle('checked',m[2]);
  });
  [['A','mission1With',!!currentData.mission1],['B','mission2With',!!currentData.mission2]].forEach(function(m){
    el['missionWith'+m[0]].style.display=m[2]?'block':'none';
    el['missionWithSelect'+m[0]].value=currentData[m[1]]||'';
    el['missionWithSelect'+m[0]].disabled=!!currentData.snackGiven;
  });
  var mis=(currentData.mission1?1:0)+(currentData.mission2?1:0);
  if(mis===2&&currentData.snackGiven){el.missionSnack.textContent='🍪 오늘 간식을 받았어요! 내일도 도전해 봐요 💛';el.missionSnack.className='mission-snack given';}
  else if(mis===2){el.missionSnack.textContent='🎉 미션 2개 완료! 선생님께 오면 간식을 받을 수 있어요 🍪';el.missionSnack.className='mission-snack ready';}
  else{el.missionSnack.textContent='미션 2개를 모두 하면 선생님께 와서 간식을 받을 수 있어요 🍪';el.missionSnack.className='mission-snack';}
  el.missionConfirmBtn.style.display=(mis===2&&!currentData.snackGiven)?'block':'none';
  // 선생님이 확인한 뒤에는 미션 체크를 바꿀 수 없게 잠금 (관리자 화면에서 지급 취소하면 다시 풀림)
  el.missionCheckA.disabled=el.missionCheckB.disabled=!!currentData.snackGiven;
  var st=computeMissionStreak(),E=STREAK_BONUS_EVERY,streakMsg;
  if(st.n>0){streakMsg='🔥 미션 2개 '+st.n+'일 연속 달성!'+(st.bonus?' 🎁 보너스 +'+st.bonus+'점':' ('+(E-st.n%E)+'일 더 이어가면 보너스 🎁)');}
  else if(st.before>0){var nx=st.before+1;streakMsg='🔥 지금 '+st.before+'일 연속! 오늘도 2개 하면 '+nx+'일째'+(nx%E===0?' 🎁 보너스 점수!':'');}
  else{streakMsg='미션 2개를 연속으로 하면 '+E+'일째마다 보너스 '+STREAK_BONUS_POINTS+'점! 🎁';}
  el.missionStreak.textContent=streakMsg;
  var pts=0;if(currentData.homework)pts++;if(currentData.duty)pts++;pts+=bonus;pts+=praise;pts+=att;pts+=cust;pts+=mis;var sbn=currentData.streakBonus||0;pts+=sbn;
  el.todayPoints.textContent=pts+'점'+(pts!==0?' ('+(bonus>0?'발표보너스 '+bonus+'점 ':'')+(praise!==0?'칭찬 '+praise+'점 ':'')+(att!==0?'태도 '+att+'점 ':'')+(cust!==0?'자유 '+cust+'점 ':'')+(mis!==0?'미션 '+mis+'점 ':'')+(sbn!==0?'연속보너스 '+sbn+'점 ':'')+')':'');
}

function saveStudentData(){
  if(!currentStudent)return;
  var st=computeMissionStreak();
  db.collection('checklist').doc(getDocId(currentStudent.name)).set({
    name:currentStudent.name,studentId:currentStudent.id,date:getTodayString(),
    homework:currentData.homework||false,duty:currentData.duty||false,
    presentations:currentData.presentations||0,
    praise:currentData.praise||0,
    attitude:currentData.attitude||0,
    customScore:currentData.customScore||0,
    customLogs:currentData.customLogs||[],
    mission1:!!currentData.mission1,
    mission2:!!currentData.mission2,
    snackGiven:!!currentData.snackGiven,
    mission1With:currentData.mission1With||'',
    mission2With:currentData.mission2With||'',
    missionStreak:st.n,
    streakBonus:st.bonus,
    missionTexts:getTodayMissions(currentStudent).missions.map(function(m){return m.text;})
  }).catch(function(e){console.error(e);showToast('❌ 저장 오류');});
}

// ===== Event Listeners =====
el.homeworkCheck.addEventListener('change',function(){
  currentData.homework=el.homeworkCheck.checked;saveStudentData();
  if(currentData.homework){showToast('📚 숙제 완료! 대단해요! 🎉');miniConfetti();}
});
el.dutyCheck.addEventListener('change',function(){
  currentData.duty=el.dutyCheck.checked;saveStudentData();
  if(currentData.duty){showToast('🧹 1인 1역 완료! 멋져요! ✨');miniConfetti();}
});
function bindMissionCheck(input,field,withField){
  input.addEventListener('change',function(){
    currentData[field]=input.checked;
    if(!input.checked)currentData[withField]='';
    saveStudentData();
    if(input.checked){showToast('🤝 미션 완료! 따뜻한 마음이 전해졌어요 💛');miniConfetti();}
  });
}
function openTeacherConfirm(){
  if(!currentStudent)return;
  el.tcMissionList.innerHTML='';
  getTodayMissions(currentStudent).missions.forEach(function(m,i){
    var w=currentData[i===0?'mission1With':'mission2With'];
    var li=document.createElement('li');li.textContent=m.icon+' '+m.text+' — 함께한 친구: '+(w||'선택 안 함');el.tcMissionList.appendChild(li);
  });
  el.tcPassword.value='';el.tcError.classList.remove('show');
  el.teacherConfirmModal.classList.add('active');
  setTimeout(function(){el.tcPassword.focus();},100);
}
function closeTeacherConfirm(){el.teacherConfirmModal.classList.remove('active');}
function submitTeacherConfirm(){
  if(el.tcPassword.value!==ADMIN_PASSWORD){
    el.tcError.classList.add('show');el.tcPassword.value='';
    el.tcPassword.style.animation='shake 0.5s ease';
    setTimeout(function(){el.tcPassword.style.animation='';},500);
    return;
  }
  if(!currentStudent||!currentData.mission1||!currentData.mission2){closeTeacherConfirm();return;}
  db.collection('checklist').doc(getDocId(currentStudent.name)).set({
    name:currentStudent.name,studentId:currentStudent.id,date:getTodayString(),snackGiven:true
  },{merge:true})
  .then(function(){closeTeacherConfirm();showToast('🍪 선생님 확인 완료! 간식을 받아가세요');miniConfetti();})
  .catch(function(e){console.error(e);showToast('❌ 저장 오류');});
}
el.missionConfirmBtn.addEventListener('click',openTeacherConfirm);
el.tcCancel.addEventListener('click',closeTeacherConfirm);
el.tcConfirm.addEventListener('click',submitTeacherConfirm);
el.tcPassword.addEventListener('keydown',function(e){if(e.key==='Enter')submitTeacherConfirm();});
el.teacherConfirmModal.addEventListener('click',function(e){if(e.target===el.teacherConfirmModal)closeTeacherConfirm();});

bindMissionCheck(el.missionCheckA,'mission1','mission1With');
bindMissionCheck(el.missionCheckB,'mission2','mission2With');
['A','B'].forEach(function(k,i){
  var f=i===0?'mission1With':'mission2With';
  el['missionWithSelect'+k].addEventListener('change',function(){
    currentData[f]=el['missionWithSelect'+k].value;saveStudentData();
  });
});
el.presentationPlus.addEventListener('click',function(){
  currentData.presentations=(currentData.presentations||0)+1;saveStudentData();
  showToast('🎤 발표 '+currentData.presentations+'회! 잘했어요!');
  if(currentData.presentations%3===0){var c=currentData.presentations;
    setTimeout(function(){showToast('🌟 발표 '+c+'회 달성! 보너스 포인트! 🌟');miniConfetti();},2800);}
  el.presentationPlus.style.transform='scale(1.2) rotate(90deg)';
  setTimeout(function(){el.presentationPlus.style.transform='';},300);
});
el.presentationMinus.addEventListener('click',function(){
  if((currentData.presentations||0)<=0)return;
  currentData.presentations=(currentData.presentations||0)-1;saveStudentData();
  showToast('🎤 발표 '+currentData.presentations+'회로 수정했어요');
});

el.backBtnStudent.addEventListener('click',function(){
  if(unsubscribeSnapshot)unsubscribeSnapshot();
  if(unsubscribeCumulative){unsubscribeCumulative(); unsubscribeCumulative=null;}
  showPage('home');
});
el.backBtnAdmin.addEventListener('click',function(){showPage('home');});

// ===== Admin Auth =====
el.adminBtn.addEventListener('click',function(){
  el.passwordModal.classList.add('active');el.adminPassword.value='';
  el.passwordError.classList.remove('show');
  setTimeout(function(){el.adminPassword.focus();},100);
});
el.modalCancel.addEventListener('click',function(){el.passwordModal.classList.remove('active');});
el.modalConfirm.addEventListener('click',checkPassword);
el.adminPassword.addEventListener('keydown',function(e){if(e.key==='Enter')checkPassword();});
function checkPassword(){
  if(el.adminPassword.value===ADMIN_PASSWORD){el.passwordModal.classList.remove('active');openAdminPage();}
  else{el.passwordError.classList.add('show');el.adminPassword.value='';
    el.adminPassword.style.animation='shake 0.5s ease';
    setTimeout(function(){el.adminPassword.style.animation='';},500);}
}
el.passwordModal.addEventListener('click',function(e){if(e.target===el.passwordModal)el.passwordModal.classList.remove('active');});

// ===== Tab Switching (4 tabs) =====
var tabs=['today','points','history','custom','pins','missions'];
tabs.forEach(function(t){
  document.getElementById('tab-'+t).addEventListener('click',function(){switchTab(t);});
});
function switchTab(tab){
  tabs.forEach(function(t){
    document.getElementById('tab-'+t).classList.toggle('active',t===tab);
    document.getElementById('content-'+t).classList.toggle('active',t===tab);
  });
  if(tab==='today'){showLoading(true);loadTodayStatus().then(function(){showLoading(false);}).catch(function(){showLoading(false);});}
  else if(tab==='custom'){showLoading(true);loadCustomTab().then(function(){showLoading(false);}).catch(function(){showLoading(false);});}
  else if(tab==='pins'){showLoading(true);loadPinsTab().then(function(){showLoading(false);}).catch(function(){showLoading(false);});}
  else if(tab==='missions'){loadMissionsTab();}
}

// ===== Admin Page =====
function openAdminPage(){
  showPage('admin');showLoading(true);
  Promise.all([loadTodayStatus(),loadCumulativePoints()]).then(function(){showLoading(false);})
  .catch(function(e){console.error(e);showToast('❌ 데이터 로드 오류');showLoading(false);});
}

// ===== Last Reset =====
function listenLastReset(){
  db.collection('resets').orderBy('timestamp','desc').limit(1).onSnapshot(function(snap){
    var prevResetDate = lastResetDate;
    if(!snap.empty){
      var d=snap.docs[0].data();
      lastResetDate=d.date;
      if(el.resetDateDisplay) el.resetDateDisplay.textContent=formatDateKR(d.date)+' 이후';
    } else {
      lastResetDate=null;
      if(el.resetDateDisplay) el.resetDateDisplay.textContent='전체 기간';
    }
    if(currentStudent && prevResetDate !== lastResetDate) {
      startCumulativeListener(currentStudent);
    }
  });
}

// ===== Today Status =====
function loadTodayStatus(){
  return new Promise(function(resolve, reject){
    var today=getTodayString();
    if(adminUnsubscribes.today) adminUnsubscribes.today();
    
    adminUnsubscribes.today = db.collection('checklist').where('date', '==', today).onSnapshot(function(snap){
      var map={};
      snap.forEach(function(doc){ map[doc.data().name] = doc.data(); });
      
      var tHw=0,tDu=0,tPr=0,tPraise=0,tAtt=0,tCust=0,tMi=0,rows=[];
      STUDENTS.forEach(function(s){
        var d=map[s.name] || {homework:false,duty:false,presentations:0,praise:0,attitude:0,customScore:0};
        if(d.homework)tHw++;if(d.duty)tDu++;tPr+=(d.presentations||0);tPraise+=(d.praise||0);tAtt+=(d.attitude||0);tCust+=(d.customScore||0);
        var mi=(d.mission1?1:0)+(d.mission2?1:0);tMi+=mi;
        rows.push({id:s.id,name:s.name,homework:!!d.homework,duty:!!d.duty,presentations:d.presentations||0,praise:d.praise||0,attitude:d.attitude||0,customScore:d.customScore||0,mission:mi,snack:!!d.snackGiven,streak:d.missionStreak||0,sbonus:d.streakBonus||0});
      });
      
      rows.sort(function(a,b){return a.id-b.id;});
      el.statHomework.textContent=tHw;el.statDuty.textContent=tDu;el.statPresentation.textContent=tPr;el.statPraise.textContent=tPraise;
      el.statAttitude.textContent=tAtt;el.statCustom.textContent=tCust;el.statMission.textContent=tMi;
      el.todayTableBody.innerHTML=rows.map(function(r){
        return '<tr><td>'+r.id+'</td><td><strong>'+r.name+'</strong></td>'+
          '<td>'+(r.homework?'<span class="check-mark">✔</span>':'<span class="cross-mark">—</span>')+'</td>'+
          '<td>'+(r.duty?'<span class="check-mark">✔</span>':'<span class="cross-mark">—</span>')+'</td>'+
          '<td><div class="admin-pres-ctrl">'+
            '<button class="admin-pres-btn" data-name="'+r.name+'" data-delta="-1">−</button>'+
            '<span class="admin-pres-val">'+r.presentations+'</span>'+
            '<button class="admin-pres-btn" data-name="'+r.name+'" data-delta="1">+</button>'+
          '</div></td>'+
          '<td><div class="admin-pres-ctrl">'+
            '<button class="admin-praise-btn" data-name="'+r.name+'" data-delta="-1">−</button>'+
            '<span class="admin-praise-val">'+r.praise+'</span>'+
            '<button class="admin-praise-btn" data-name="'+r.name+'" data-delta="1">+</button>'+
          '</div></td>'+
          '<td><div class="admin-pres-ctrl">'+
            '<button class="admin-attitude-btn" data-name="'+r.name+'" data-delta="-1">−</button>'+
            '<span class="admin-attitude-val">'+r.attitude+'</span>'+
            '<button class="admin-attitude-btn" data-name="'+r.name+'" data-delta="1">+</button>'+
          '</div></td>'+
          '<td><strong>'+r.customScore+'</strong></td>'+
          '<td><strong>'+r.mission+'</strong>'+(r.sbonus?' <small>🎁+'+r.sbonus+'</small>':'')+(r.streak>=2?' <small>🔥'+r.streak+'일</small>':'')+'</td>'+
          '<td>'+(r.mission>=2?'<button class="admin-snack-btn'+(r.snack?' given':'')+'" data-name="'+r.name+'" data-given="'+(r.snack?1:0)+'">'+(r.snack?'✔ 지급됨':'🍪 주기')+'</button>':'<span class="cross-mark">—</span>')+'</td></tr>';
      }).join('');
      resolve();
    }, reject);
  });
}

// ===== Cumulative Points (since last reset) =====
function loadCumulativePoints(){
  return new Promise(function(resolve, reject){
    if(adminUnsubscribes.points) adminUnsubscribes.points();
    
    adminUnsubscribes.points = db.collection('checklist').onSnapshot(function(snap){
      var map={};
      STUDENTS.forEach(function(s){map[s.name]={id:s.id,name:s.name,hw:0,du:0,pr:0,praise:0,att:0,cust:0,mi:0,sb:0};});
      snap.forEach(function(doc){
        var d=doc.data();
        if(!d.name||!map[d.name])return;
        // Only count records after last reset
        if(lastResetDate && d.date && d.date<lastResetDate)return;
        if(d.homework)map[d.name].hw++;
        if(d.duty)map[d.name].du++;
        map[d.name].pr+=(d.presentations||0);
        map[d.name].praise+=(d.praise||0);
        map[d.name].att+=(d.attitude||0);
        map[d.name].cust+=(d.customScore||0);
      map[d.name].mi+=(d.mission1?1:0)+(d.mission2?1:0);
      map[d.name].sb+=(d.streakBonus||0);
      });
      renderPointsTable(map,el.pointsTableBody);
      resolve();
    }, reject);
  });
}

// ===== Shared: render points table =====
function renderPointsTable(map,tbody){
  var arr=[];
  Object.keys(map).forEach(function(name){
    var s=map[name]; var bonus=Math.floor(s.pr/3);
    arr.push({id:s.id,name:name,hw:s.hw,du:s.du,pr:s.pr,bonus:bonus,praise:s.praise,att:s.att,cust:s.cust,mi:s.mi,sb:s.sb,total:s.hw+s.du+bonus+s.praise+s.att+s.cust+s.mi+s.sb});
  });
  arr.sort(function(a,b){return b.total!==a.total?b.total-a.total:a.id-b.id;});
  tbody.innerHTML=arr.map(function(r,i){
    var rank=i+1,rc='';
    if(rank===1)rc='gold';else if(rank===2)rc='silver';else if(rank===3)rc='bronze';
    var badge=rc?'<span class="rank-badge '+rc+'">'+rank+'</span>':rank;
    return '<tr><td>'+badge+'</td><td><strong>'+r.name+'</strong></td>'+
      '<td>'+r.hw+'점</td><td>'+r.du+'점</td>'+
      '<td>'+r.bonus+'점 <small style="color:#999">('+r.pr+'회)</small></td>'+
      '<td>'+r.praise+'점</td>'+
      '<td>'+r.att+'점</td>'+
      '<td>'+r.cust+'점</td>'+
      '<td>'+(r.mi+r.sb)+'점'+(r.sb?' <small style="color:#999">(🔥연속 +'+r.sb+')</small>':'')+'</td>'+
      '<td><span class="total-points">'+r.total+'</span></td></tr>';
  }).join('');
}

// ===== Reset Points =====
el.resetPointsBtn.addEventListener('click',function(){
  el.resetDateInput.value=getTodayString();
  el.resetModal.classList.add('active');
});
el.resetCancel.addEventListener('click',function(){el.resetModal.classList.remove('active');});
el.resetModal.addEventListener('click',function(e){if(e.target===el.resetModal)el.resetModal.classList.remove('active');});
el.resetConfirm.addEventListener('click',function(){
  var selectedDate=el.resetDateInput.value;
  if(!selectedDate){ showToast('📅 날짜를 선택해주세요'); return; }
  
  el.resetModal.classList.remove('active');showLoading(true);
  db.collection('resets').add({date:selectedDate,timestamp:firebase.firestore.FieldValue.serverTimestamp()})
  .then(function(){
    lastResetDate=selectedDate;
    el.resetDateDisplay.textContent=formatDateKR(selectedDate)+' 이후';
    return loadCumulativePoints();
  }).then(function(){
    showLoading(false);showToast('✅ 포인트 누적 기준일이 변경되었습니다');
  }).catch(function(e){console.error(e);showLoading(false);showToast('❌ 초기화 오류');});
});

// ===== Admin: Snack Check (미션 2개 완료 간식 지급) =====
el.todayTableBody.addEventListener('click',function(e){
  var btn=e.target.closest('.admin-snack-btn');
  if(!btn)return;
  var name=btn.dataset.name;
  var give=btn.dataset.given!=='1';
  var today=getTodayString();
  var studentId=STUDENTS.find(function(s){return s.name===name;}).id;
  db.collection('checklist').doc(name+'_'+today).set({
    name:name,studentId:studentId,date:today,snackGiven:give
  },{merge:true})
  .then(function(){showToast(give?'🍪 '+name+' 간식 지급 완료':'↩️ '+name+' 간식 지급을 취소했어요');})
  .catch(function(e){console.error(e);showToast('❌ 수정 오류');});
});

// ===== Admin: Direct Presentation Edit =====
el.todayTableBody.addEventListener('click',function(e){
  var btn=e.target.closest('.admin-pres-btn');
  if(!btn)return;
  var name=btn.dataset.name;
  var delta=parseInt(btn.dataset.delta);
  var valSpan=btn.parentElement.querySelector('.admin-pres-val');
  var cur=parseInt(valSpan.textContent)||0;
  var newVal=cur+delta;
  if(newVal<0){showToast('📊 0회 이하로 줄일 수 없어요');return;}
  var today=getTodayString();
  var studentId = STUDENTS.find(function(s){return s.name===name;}).id;
  db.collection('checklist').doc(name+'_'+today).set({
    name: name,
    studentId: studentId,
    date: today,
    presentations: newVal
  }, {merge:true})
  .then(function(){showToast('✏️ '+name+' 발표 '+newVal+'회로 수정했어요');})
  .catch(function(e){console.error(e);showToast('❌ 수정 오류');});
});

// ===== Admin: Direct Praise Edit =====
el.todayTableBody.addEventListener('click',function(e){
  var btn=e.target.closest('.admin-praise-btn');
  if(!btn)return;
  var name=btn.dataset.name;
  var delta=parseInt(btn.dataset.delta);
  var valSpan=btn.parentElement.querySelector('.admin-praise-val');
  var cur=parseInt(valSpan.textContent)||0;
  var newVal=cur+delta;
  if(newVal<0){showToast('💌 0점 이하로 줄일 수 없어요');return;}
  var today=getTodayString();
  var studentId = STUDENTS.find(function(s){return s.name===name;}).id;
  db.collection('checklist').doc(name+'_'+today).set({
    name: name,
    studentId: studentId,
    date: today,
    praise: newVal
  }, {merge:true})
  .then(function(){showToast('💌 '+name+' 칭찬쪽지 '+newVal+'점으로 수정했어요');})
  .catch(function(e){console.error(e);showToast('❌ 수정 오류');});
});

// ===== Admin: Direct Attitude Edit =====
el.todayTableBody.addEventListener('click',function(e){
  var btn=e.target.closest('.admin-attitude-btn');
  if(!btn)return;
  var name=btn.dataset.name;
  var delta=parseInt(btn.dataset.delta);
  var valSpan=btn.parentElement.querySelector('.admin-attitude-val');
  var cur=parseInt(valSpan.textContent)||0;
  var newVal=cur+delta;
  var today=getTodayString();
  var studentId = STUDENTS.find(function(s){return s.name===name;}).id;
  db.collection('checklist').doc(name+'_'+today).set({
    name: name,
    studentId: studentId,
    date: today,
    attitude: newVal
  }, {merge:true})
  .then(function(){showToast('⭐ '+name+' 수업태도 '+newVal+'점으로 수정했어요');})
  .catch(function(e){console.error(e);showToast('❌ 수정 오류');});
});

// ===== History Filter =====
var filterSections={daily:'filter-daily',weekly:'filter-weekly',monthly:'filter-monthly',custom:'filter-custom'};
document.querySelectorAll('.filter-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    currentPeriod=btn.dataset.period;
    document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    Object.keys(filterSections).forEach(function(k){
      document.getElementById(filterSections[k]).classList.toggle('hidden',k!==currentPeriod);
    });
  });
});

el.filterWeekDate.addEventListener('change',updateWeekHint);
function updateWeekHint(){
  var val=el.filterWeekDate.value;
  if(!val)return;
  var mon=getMonday(val);var sun=new Date(mon);sun.setDate(sun.getDate()+6);
  el.weekRangeHint.textContent=formatDateKR(dateToStr(mon))+' ~ '+formatDateKR(dateToStr(sun));
}

el.searchHistoryBtn.addEventListener('click',function(){
  var range=getDateRange();
  if(!range){showToast('📅 날짜를 올바르게 선택해주세요');return;}
  showLoading(true);
  loadHistoryData(range.start,range.end,range.label).then(function(){showLoading(false);})
  .catch(function(e){console.error(e);showLoading(false);showToast('❌ 조회 오류');});
});

function getDateRange(){
  if(currentPeriod==='daily'){
    var d=el.filterDate.value; if(!d)return null;
    return {start:d,end:d,label:formatDateKR(d)};
  } else if(currentPeriod==='weekly'){
    var wd=el.filterWeekDate.value; if(!wd)return null;
    var mon=getMonday(wd);var sun=new Date(mon);sun.setDate(sun.getDate()+6);
    return {start:dateToStr(mon),end:dateToStr(sun),label:formatDateKR(dateToStr(mon))+' ~ '+formatDateKR(dateToStr(sun))};
  } else if(currentPeriod==='monthly'){
    var m=el.filterMonth.value; if(!m)return null;
    var first=m+'-01';var lastDay=new Date(parseInt(m.split('-')[0]),parseInt(m.split('-')[1]),0);
    return {start:first,end:dateToStr(lastDay),label:parseInt(m.split('-')[0])+'년 '+parseInt(m.split('-')[1])+'월'};
  } else {
    var s=el.filterStart.value,e=el.filterEnd.value; if(!s||!e||s>e)return null;
    return {start:s,end:e,label:formatDateKR(s)+' ~ '+formatDateKR(e)};
  }
}

function loadHistoryData(startDate,endDate,label){
  return db.collection('checklist').get().then(function(snap){
    var map={};var tHw=0,tDu=0,tPr=0,tPraise=0,tAtt=0,tCust=0,tMi=0;
    STUDENTS.forEach(function(s){map[s.name]={id:s.id,name:s.name,hw:0,du:0,pr:0,praise:0,att:0,cust:0,mi:0,sb:0};});
    snap.forEach(function(doc){
      var d=doc.data();
      if(!d.name||!map[d.name]||!d.date)return;
      if(d.date>=startDate && d.date<=endDate){
        if(d.homework){map[d.name].hw++;tHw++;}
        if(d.duty){map[d.name].du++;tDu++;}
        var p=d.presentations||0;map[d.name].pr+=p;tPr+=p;
        var pr=d.praise||0;map[d.name].praise+=pr;tPraise+=pr;
        var at=d.attitude||0;map[d.name].att+=at;tAtt+=at;
        var cu=d.customScore||0;map[d.name].cust+=cu;tCust+=cu;
        var mm=(d.mission1?1:0)+(d.mission2?1:0);map[d.name].mi+=mm;tMi+=mm;map[d.name].sb+=(d.streakBonus||0);
      }
    });
    // Show results
    el.historyPeriodText.textContent='📅 '+label;
    el.histStatHomework.textContent=tHw;el.histStatDuty.textContent=tDu;el.histStatPresentation.textContent=tPr;el.histStatPraise.textContent=tPraise;
    el.histStatAttitude.textContent=tAtt;el.histStatCustom.textContent=tCust;el.histStatMission.textContent=tMi;
    el.historySummary.classList.remove('hidden');
    el.historyTableWrapper.style.display='block';
    el.historyEmpty.style.display='none';
    renderPointsTable(map,el.historyTableBody);
  });
}

// ===== Admin: Custom Tab =====
function loadCustomTab(){
  return new Promise(function(resolve, reject){
    // 1. Render student grid (only once)
    if(el.customStudentGrid.children.length === 0) {
      el.customStudentGrid.innerHTML=STUDENTS.map(function(s){
        return '<div class="custom-student-card" data-name="'+s.name+'"><div class="name">'+s.id+'. '+s.name+'</div></div>';
      }).join('');
    }
    
    // 2. Load recent logs real-time (current calendar month)
    var startOfCurrentMonth = getCurrentMonthStartDate();
    var currentMonth = new Date().getMonth() + 1;
    var titleEl = document.getElementById('custom-logs-title');
    if(titleEl) titleEl.textContent = '최근 기록 (' + currentMonth + '월)';
    
    if(adminUnsubscribes.custom) adminUnsubscribes.custom();
    
    adminUnsubscribes.custom = db.collection('checklist').where('date','>=',startOfCurrentMonth).onSnapshot(function(snap){
      var allLogs=[];
      snap.forEach(function(doc){
        var d=doc.data();
        if(d.customLogs){
          d.customLogs.forEach(function(l){
            allLogs.push({name:d.name,reason:l.reason,point:l.point,time:l.time,date:d.date});
          });
        }
      });
      allLogs.sort(function(a,b){return b.time-a.time;});
      if(allLogs.length===0){
        el.customLogsList.innerHTML='<li><span style="color:#999;">이번 달 기록이 없습니다.</span></li>';
      } else {
        el.customLogsList.innerHTML=allLogs.map(function(l){
          var dateObj = new Date(l.time);
          var dateStr = (dateObj.getMonth()+1) + '/' + dateObj.getDate();
          var timeStr = dateObj.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
          var sign=l.point>0?'+':'';
          var cname=l.point>0?'pos':'neg';
          return '<li><span><strong>'+l.name+'</strong> - '+l.reason+' <small>('+dateStr+' '+timeStr+')</small></span><span class="log-point '+cname+'">'+sign+l.point+'점 <button class="delete-log-btn" data-name="'+l.name+'" data-time="'+l.time+'" data-point="'+l.point+'" data-date="'+l.date+'" title="기록 삭제">❌</button></span></li>';
        }).join('');
      }
      resolve();
    }, reject);
  });
}

el.customStudentGrid.addEventListener('click',function(e){
  var card=e.target.closest('.custom-student-card');
  if(!card)return;
  targetCustomStudent=card.dataset.name;
  el.customModalTitle.textContent='🎯 자유항목 점수 부여 - ' + targetCustomStudent;
  el.modalCustomReason.value='';
  el.modalCustomPoint.value=1;
  el.customModal.classList.add('active');
  setTimeout(function(){el.modalCustomReason.focus();},100);
});

el.customModalCancel.addEventListener('click',function(){
  el.customModal.classList.remove('active');
});
el.customModal.addEventListener('click',function(e){
  if(e.target===el.customModal) el.customModal.classList.remove('active');
});

el.customModalConfirm.addEventListener('click',function(){
  if(!targetCustomStudent) return;
  var name=targetCustomStudent;
  var reason=el.modalCustomReason.value.trim()||'자유항목';
  var delta=parseInt(el.modalCustomPoint.value)||0;
  if(delta===0) { showToast('⚠️ 0점은 부여할 수 없어요'); return; }
  
  el.customModal.classList.remove('active');
  var today=getTodayString();
  showLoading(true);
  
  var docRef=db.collection('checklist').doc(name+'_'+today);
  db.runTransaction(function(transaction){
    return transaction.get(docRef).then(function(sfDoc){
      if(!sfDoc.exists){
        transaction.set(docRef,{name:name,studentId:STUDENTS.find(s=>s.name===name).id,date:today,customScore:delta,customLogs:[{reason:reason,point:delta,time:Date.now()}]});
      }else{
        var d=sfDoc.data();
        var curScore=d.customScore||0;
        var newScore=curScore+delta;
        var logs=d.customLogs||[];
        logs.push({reason:reason,point:delta,time:Date.now()});
        transaction.update(docRef,{customScore:newScore,customLogs:logs});
      }
    });
  }).then(function(){
    showLoading(false);
    showToast('🎯 '+name+' '+delta+'점 기록 완료!');
  }).catch(function(e){
    console.error(e);
    showLoading(false);
    showToast('❌ 기록 실패');
  });
});

el.customLogsList.addEventListener('click', function(e) {
  var btn = e.target.closest('.delete-log-btn');
  if(!btn) return;
  var name = btn.dataset.name;
  var time = parseInt(btn.dataset.time);
  var point = parseInt(btn.dataset.point);
  var logDate = btn.dataset.date;
  
  if(!confirm('이 기록을 삭제하시겠습니까? (점수도 되돌려집니다)')) return;
  
  showLoading(true);
  var docRef = db.collection('checklist').doc(name+'_'+logDate);
  db.runTransaction(function(transaction){
    return transaction.get(docRef).then(function(sfDoc){
      if(!sfDoc.exists) return;
      var d = sfDoc.data();
      var logs = d.customLogs || [];
      var newLogs = logs.filter(function(l) { return l.time !== time; });
      if(logs.length === newLogs.length) return; // not found
      
      var curScore = d.customScore || 0;
      var newScore = curScore - point; // subtract the points that were added
      
      transaction.update(docRef, {customScore: newScore, customLogs: newLogs});
    });
  }).then(function(){
    showLoading(false);
    showToast('🗑️ 기록이 삭제되었습니다.');
  }).catch(function(e){
    console.error(e);
    showLoading(false);
    showToast('❌ 삭제 실패');
  });
});

// ===== Admin: Pins Tab =====
function loadPinsTab(){
  return new Promise(function(resolve, reject){
    db.collection('studentPins').get().then(function(snap){
      var map={};
      snap.forEach(function(doc){ map[doc.id] = doc.data(); });
      
      var rows = STUDENTS.map(function(s){
        var hasPin = map[s.name] && map[s.name].pin;
        var statusBadge = hasPin ? '<span class="pin-status-badge set">설정됨</span>' : '<span class="pin-status-badge unset">미설정</span>';
        var resetBtn = hasPin ? '<button class="pin-reset-btn" data-name="'+s.name+'">초기화</button>' : '<button class="pin-reset-btn" disabled>초기화</button>';
        return '<tr><td>'+s.id+'</td><td><strong>'+s.name+'</strong></td><td>'+statusBadge+'</td><td>'+resetBtn+'</td></tr>';
      });
      el.pinsTableBody.innerHTML = rows.join('');
      resolve();
    }).catch(reject);
  });
}

el.pinsTableBody.addEventListener('click', function(e){
  var btn = e.target.closest('.pin-reset-btn');
  if(!btn || btn.disabled) return;
  var name = btn.dataset.name;
  
  if(!confirm(name + ' 학생의 비밀번호를 초기화하시겠습니까? 초기화 후 학생이 다시 접속하여 비밀번호를 설정할 수 있습니다.')) return;
  
  showLoading(true);
  db.collection('studentPins').doc(name).delete().then(function(){
    showLoading(false);
    showToast('🔑 ' + name + ' 학생의 비밀번호가 초기화되었습니다.');
    loadPinsTab();
  }).catch(function(err){
    console.error("Error resetting PIN:", err);
    showLoading(false);
    showToast('❌ 초기화에 실패했습니다.');
  });
});

// ===== Admin: Missions Tab (미션 관리) =====
var MISSION_LIST_DEFS=[
  {key:'poolA',title:'일반 ① 마음 표현',desc:'모든 학생에게 하루 첫 번째 미션으로 나와요.'},
  {key:'poolB',title:'일반 ② 함께하기·도와주기',desc:'모든 학생에게 하루 두 번째 미션으로 나와요.'},
  {key:'basicA',title:'쉬운 단계 ① 행동',desc:'아래 지정한 학생에게 첫 번째 미션으로 나와요. 부담 없는 행동 위주로 적어주세요.'},
  {key:'basicB',title:'쉬운 단계 ② 한 마디 말하기',desc:'아래 지정한 학생에게 두 번째 미션으로 나와요. 말하기 미션을 적어주세요.'}
];
var missionDraft=null;

function loadMissionsTab(){
  missionDraft=cloneMissionConfig(missionConfig);
  renderMissionEditor();
}

function parseStudentIds(str){
  var ids=[];
  (str||'').split(/[\s,]+/).forEach(function(t){
    var n=parseInt(t,10);
    if(Number.isInteger(n)&&n>=1&&n<=STUDENTS.length&&ids.indexOf(n)===-1)ids.push(n);
  });
  return ids.sort(function(a,b){return a-b;});
}

function updateMissionBasicNames(){
  el.missionBasicNames.textContent=missionDraft.basicIds.map(function(id){
    var s=STUDENTS.find(function(x){return x.id===id;});return id+'번 '+(s?s.name:'');
  }).join(', ')||'지정된 학생이 없어요';
}

function renderMissionEditor(){
  var box=el.missionEditors;box.innerHTML='';
  MISSION_LIST_DEFS.forEach(function(def){
    var list=missionDraft[def.key];
    var sec=document.createElement('div');sec.className='mission-edit-section';
    var h=document.createElement('h4');h.textContent=def.title+' ('+list.length+'개)';sec.appendChild(h);
    var p=document.createElement('p');p.className='mission-edit-desc';p.textContent=def.desc;sec.appendChild(p);
    list.forEach(function(item,i){
      var row=document.createElement('div');row.className='mission-edit-row';
      var ic=document.createElement('input');ic.className='mission-edit-icon';ic.value=item.icon;ic.maxLength=4;ic.setAttribute('aria-label','아이콘');
      ic.addEventListener('input',function(){item.icon=ic.value;});
      var tx=document.createElement('input');tx.className='mission-edit-text';tx.value=item.text;tx.maxLength=80;tx.setAttribute('aria-label','미션 문구');
      tx.addEventListener('input',function(){item.text=tx.value;});
      var del=document.createElement('button');del.className='mission-edit-del';del.textContent='✕';del.title='삭제';
      del.addEventListener('click',function(){list.splice(i,1);renderMissionEditor();});
      row.appendChild(ic);row.appendChild(tx);row.appendChild(del);sec.appendChild(row);
    });
    var add=document.createElement('button');add.className='mission-edit-add';add.textContent='+ 미션 추가';
    add.addEventListener('click',function(){
      list.push({icon:'⭐',text:''});renderMissionEditor();
      var rows=box.querySelectorAll('.mission-edit-section')[MISSION_LIST_DEFS.indexOf(def)].querySelectorAll('.mission-edit-text');
      if(rows.length)rows[rows.length-1].focus();
    });
    sec.appendChild(add);
    box.appendChild(sec);
  });
  el.missionBasicIds.value=missionDraft.basicIds.join(', ');
  updateMissionBasicNames();
  el.missionHolidays.value=(missionDraft.holidays||[]).join(', ');
}

el.missionBasicIds.addEventListener('input',function(){
  missionDraft.basicIds=parseStudentIds(el.missionBasicIds.value);updateMissionBasicNames();
});

el.missionHolidays.addEventListener('input',function(){
  var found=el.missionHolidays.value.match(/\d{4}-\d{2}-\d{2}/g)||[];
  missionDraft.holidays=found.filter(function(s,i){return found.indexOf(s)===i;}).sort();
});

el.missionResetDefault.addEventListener('click',function(){
  if(!confirm('기본 미션 목록으로 되돌릴까요?\n(저장을 눌러야 실제로 적용돼요)'))return;
  var hol=missionDraft.holidays||[];missionDraft=cloneMissionConfig(DEFAULT_MISSION_CONFIG);missionDraft.holidays=hol;renderMissionEditor();
  showToast('↩️ 기본 목록을 불러왔어요. 저장을 눌러야 적용돼요');
});

el.missionSave.addEventListener('click',function(){
  var cfg=cloneMissionConfig(missionDraft);
  for(var i=0;i<MISSION_LIST_DEFS.length;i++){
    var def=MISSION_LIST_DEFS[i];
    cfg[def.key]=cfg[def.key].filter(function(m){return m.text&&m.text.trim();}).map(function(m){
      return {icon:(m.icon&&m.icon.trim())||'⭐',text:m.text.trim()};
    });
    if(!cfg[def.key].length){showToast('❌ "'+def.title+'" 목록에 미션이 1개 이상 있어야 해요');return;}
  }
  showLoading(true);
  db.collection('settings').doc('missions').set(cfg)
  .then(function(){
    showLoading(false);showToast('✅ 미션 목록을 저장했어요');
    missionDraft=cloneMissionConfig(normalizeMissionConfig(cfg));renderMissionEditor();
  })
  .catch(function(e){console.error(e);showLoading(false);showToast('❌ 저장 오류 (Firestore 규칙을 확인해 주세요)');});
});

// ===== Shake animation =====
var ss=document.createElement('style');
ss.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
document.head.appendChild(ss);

// ===== Init =====
initDates();renderStudentGrid();listenHomeData();listenLastReset();listenMissionConfig();
