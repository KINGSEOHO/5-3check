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
var ADMIN_PASSWORD = "1234";

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

// ===== DOM =====
var pages={home:document.getElementById('home-page'),student:document.getElementById('student-page'),admin:document.getElementById('admin-page')};
var el={};
['today-date','student-date','admin-date','student-grid','student-name-title','student-number-badge',
 'homework-check','duty-check','homework-status','duty-status','homework-card','duty-card',
 'presentation-count','presentation-minus','presentation-plus','today-points','bonus-hint','admin-btn','back-btn-student','back-btn-admin',
 'password-modal','admin-password','password-error','modal-cancel','modal-confirm',
 'tab-today','tab-points','tab-history','tab-custom','content-today','content-points','content-history','content-custom',
 'today-table-body','points-table-body','stat-homework','stat-duty','stat-presentation','stat-praise','stat-attitude','stat-custom',
 'loading-overlay','reset-points-btn','reset-modal','reset-cancel','reset-confirm',
 'reset-date-display','search-history-btn','history-summary','history-period-text',
 'hist-stat-homework','hist-stat-duty','hist-stat-presentation','hist-stat-praise','hist-stat-attitude','hist-stat-custom',
 'history-table-wrapper','history-table-body','history-empty',
 'filter-date','filter-week-date','filter-month','filter-start','filter-end','week-range-hint',
 'custom-reason','custom-student-grid','custom-logs-list'
].forEach(function(id){
  var camel=id.replace(/-([a-z])/g,function(m,c){return c.toUpperCase();});
  el[camel]=document.getElementById(id);
});

// ===== State =====
var currentStudent=null, currentData={homework:false,duty:false,presentations:0,praise:0,attitude:0,customScore:0,customLogs:[]};
var unsubscribeSnapshot=null, homeUnsubscribes=[];
var adminUnsubscribes={today:null, points:null, custom:null};
var lastResetDate=null; // date string of last reset, null=no reset
var currentPeriod='daily';

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
    c.addEventListener('click',function(){openStudentPage(s);});
    el.studentGrid.appendChild(c);
  });
}

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
function openStudentPage(student){
  currentStudent=student;
  el.studentNameTitle.textContent=student.name;
  el.studentNumberBadge.textContent=student.id+'번';
  showPage('student');
  if(unsubscribeSnapshot)unsubscribeSnapshot();
  unsubscribeSnapshot=db.collection('checklist').doc(getDocId(student.name)).onSnapshot(function(snap){
    currentData=snap.exists?snap.data():{homework:false,duty:false,presentations:0,praise:0,attitude:0,customScore:0,customLogs:[]};
    updateStudentUI();
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
  var pts=0;if(currentData.homework)pts++;if(currentData.duty)pts++;pts+=bonus;pts+=praise;pts+=att;pts+=cust;
  el.todayPoints.textContent=pts+'점'+(pts!==0?' ('+(bonus>0?'발표보너스 '+bonus+'점 ':'')+(praise!==0?'칭찬 '+praise+'점 ':'')+(att!==0?'태도 '+att+'점 ':'')+(cust!==0?'자유 '+cust+'점 ':'')+')':'');
}

function saveStudentData(){
  if(!currentStudent)return;
  db.collection('checklist').doc(getDocId(currentStudent.name)).set({
    name:currentStudent.name,studentId:currentStudent.id,date:getTodayString(),
    homework:currentData.homework||false,duty:currentData.duty||false,
    presentations:currentData.presentations||0,
    praise:currentData.praise||0,
    attitude:currentData.attitude||0,
    customScore:currentData.customScore||0,
    customLogs:currentData.customLogs||[]
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

el.backBtnStudent.addEventListener('click',function(){if(unsubscribeSnapshot)unsubscribeSnapshot();showPage('home');});
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
var tabs=['today','points','history','custom'];
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
}

// ===== Admin Page =====
function openAdminPage(){
  showPage('admin');showLoading(true);
  loadLastReset().then(function(){
    return Promise.all([loadTodayStatus(),loadCumulativePoints()]);
  }).then(function(){showLoading(false);})
  .catch(function(e){console.error(e);showToast('❌ 데이터 로드 오류');showLoading(false);});
}

// ===== Last Reset =====
function loadLastReset(){
  return db.collection('resets').orderBy('timestamp','desc').limit(1).get().then(function(snap){
    if(!snap.empty){
      var d=snap.docs[0].data();
      lastResetDate=d.date;
      el.resetDateDisplay.textContent=formatDateKR(d.date)+' 이후';
    } else {
      lastResetDate=null;
      el.resetDateDisplay.textContent='전체 기간';
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
      
      var tHw=0,tDu=0,tPr=0,tPraise=0,tAtt=0,tCust=0,rows=[];
      STUDENTS.forEach(function(s){
        var d=map[s.name] || {homework:false,duty:false,presentations:0,praise:0,attitude:0,customScore:0};
        if(d.homework)tHw++;if(d.duty)tDu++;tPr+=(d.presentations||0);tPraise+=(d.praise||0);tAtt+=(d.attitude||0);tCust+=(d.customScore||0);
        rows.push({id:s.id,name:s.name,homework:!!d.homework,duty:!!d.duty,presentations:d.presentations||0,praise:d.praise||0,attitude:d.attitude||0,customScore:d.customScore||0});
      });
      
      rows.sort(function(a,b){return a.id-b.id;});
      el.statHomework.textContent=tHw;el.statDuty.textContent=tDu;el.statPresentation.textContent=tPr;el.statPraise.textContent=tPraise;
      el.statAttitude.textContent=tAtt;el.statCustom.textContent=tCust;
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
          '<td><strong>'+r.customScore+'</strong></td></tr>';
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
      STUDENTS.forEach(function(s){map[s.name]={id:s.id,name:s.name,hw:0,du:0,pr:0,praise:0,att:0,cust:0};});
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
    arr.push({id:s.id,name:name,hw:s.hw,du:s.du,pr:s.pr,bonus:bonus,praise:s.praise,att:s.att,cust:s.cust,total:s.hw+s.du+bonus+s.praise+s.att+s.cust});
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
      '<td><span class="total-points">'+r.total+'</span></td></tr>';
  }).join('');
}

// ===== Reset Points =====
el.resetPointsBtn.addEventListener('click',function(){el.resetModal.classList.add('active');});
el.resetCancel.addEventListener('click',function(){el.resetModal.classList.remove('active');});
el.resetModal.addEventListener('click',function(e){if(e.target===el.resetModal)el.resetModal.classList.remove('active');});
el.resetConfirm.addEventListener('click',function(){
  el.resetModal.classList.remove('active');showLoading(true);
  var today=getTodayString();
  db.collection('resets').add({date:today,timestamp:firebase.firestore.FieldValue.serverTimestamp()})
  .then(function(){
    lastResetDate=today;
    el.resetDateDisplay.textContent=formatDateKR(today)+' 이후';
    return loadCumulativePoints();
  }).then(function(){
    showLoading(false);showToast('✅ 포인트가 초기화되었습니다');
  }).catch(function(e){console.error(e);showLoading(false);showToast('❌ 초기화 오류');});
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
  db.collection('checklist').doc(name+'_'+today).set({presentations:newVal},{merge:true})
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
  db.collection('checklist').doc(name+'_'+today).set({praise:newVal},{merge:true})
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
  db.collection('checklist').doc(name+'_'+today).set({attitude:newVal},{merge:true})
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
    var map={};var tHw=0,tDu=0,tPr=0,tPraise=0,tAtt=0,tCust=0;
    STUDENTS.forEach(function(s){map[s.name]={id:s.id,name:s.name,hw:0,du:0,pr:0,praise:0,att:0,cust:0};});
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
      }
    });
    // Show results
    el.historyPeriodText.textContent='📅 '+label;
    el.histStatHomework.textContent=tHw;el.histStatDuty.textContent=tDu;el.histStatPresentation.textContent=tPr;el.histStatPraise.textContent=tPraise;
    el.histStatAttitude.textContent=tAtt;el.histStatCustom.textContent=tCust;
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
    if(el.customStudentGrid.innerHTML.trim() === '') {
      el.customStudentGrid.innerHTML=STUDENTS.map(function(s){
        return '<div class="custom-student-card"><div class="name">'+s.id+'. '+s.name+'</div>'+
          '<div class="custom-ctrl">'+
            '<button class="custom-btn minus" data-name="'+s.name+'" data-delta="-1">−</button>'+
            '<button class="custom-btn plus" data-name="'+s.name+'" data-delta="1">+</button>'+
          '</div></div>';
      }).join('');
    }
    
    // 2. Load recent logs real-time
    var today=getTodayString();
    if(adminUnsubscribes.custom) adminUnsubscribes.custom();
    
    adminUnsubscribes.custom = db.collection('checklist').where('date','==',today).onSnapshot(function(snap){
      var allLogs=[];
      snap.forEach(function(doc){
        var d=doc.data();
        if(d.customLogs){
          d.customLogs.forEach(function(l){
            allLogs.push({name:d.name,reason:l.reason,point:l.point,time:l.time});
          });
        }
      });
      allLogs.sort(function(a,b){return b.time-a.time;});
      if(allLogs.length===0){
        el.customLogsList.innerHTML='<li><span style="color:#999;">오늘의 기록이 없습니다.</span></li>';
      } else {
        el.customLogsList.innerHTML=allLogs.map(function(l){
          var timeStr=new Date(l.time).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
          var sign=l.point>0?'+':'';
          var cname=l.point>0?'pos':'neg';
          return '<li><span><strong>'+l.name+'</strong> - '+l.reason+' <small>('+timeStr+')</small></span><span class="log-point '+cname+'">'+sign+l.point+'점</span></li>';
        }).join('');
      }
      resolve();
    }, reject);
  });
}

el.customStudentGrid.addEventListener('click',function(e){
  var btn=e.target.closest('.custom-btn');
  if(!btn)return;
  var name=btn.dataset.name;
  var delta=parseInt(btn.dataset.delta);
  var reason=el.customReason.value.trim()||'자유항목';
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

// ===== Shake animation =====
var ss=document.createElement('style');
ss.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
document.head.appendChild(ss);

// ===== Init =====
initDates();renderStudentGrid();listenHomeData();
