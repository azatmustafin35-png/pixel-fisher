// Дома (5 типов, все старые и требуют ремонта), улучшения и материалы. Вкладка «🏠 Дом».
const MATN={wood:'Доски',brick:'Кирпич',glass:'Стекло',stone:'Камень',metal:'Металл'},MATP={wood:4,brick:8,glass:12,stone:15,metal:25},MATI={wood:'🪵',brick:'🧱',glass:'🪟',stone:'🪨',metal:'⚙️'};
const HT=[{n:'Старая хижина',p:0,hp:55,lk:0},{n:'Дом с мансардой',p:1500,hp:40,lk:2},{n:'Каменный особняк',p:6000,hp:35,lk:5},{n:'Старинная усадьба',p:20000,hp:30,lk:8},{n:'Заброшенный замок',p:70000,hp:25,lk:12},{n:'Дом на дереве',p:3500,hp:45,lk:3},{n:'Вилла у воды',p:35000,hp:32,lk:9},{n:'Маяк-резиденция',p:60000,hp:28,lk:10},{n:'Королевский дворец',p:200000,hp:22,lk:14}];
// l — названия уровней, m — материал, c — базовая цена (монеты = c·ур²·множитель дома)
const HU=[
{k:'wall',n:'Стены',l:['Гнилые доски','Новые доски','Кирпич','Камень'],m:['','wood','brick','stone'],c:50},
{k:'roof',n:'Крыша',l:['Дырявая','Доски','Черепица','Медный лист'],m:['','wood','brick','metal'],c:50},
{k:'win',n:'Окна',l:['Заколочены','Рамы','Стеклопакеты'],m:['','wood','glass'],c:40},
{k:'door',n:'Дверь',l:['Старая','Дубовая','Резная'],m:['','wood','wood'],c:30},
{k:'fence',n:'Забор и ворота',l:['Нет','Забор','Деревянные ворота','Кованые ворота'],m:['','wood','wood','metal'],c:60},
{k:'garden',n:'Сад',l:['Бурьян','Грядки','Клумбы и яблони'],m:['','wood','stone'],c:45},
{k:'fount',n:'Фонтан',l:['Нет','Малый фонтан','Большой с подсветкой'],m:['','stone','stone'],c:120},
{k:'lamp',n:'Фонари',l:['Нет','Керосиновые','Электрические'],m:['','metal','glass'],c:70}];
const hu=k=>S.hs.u[k]||0,hm=()=>1+S.ht*.8;
const comfort=()=>S.hl?(HT[S.ht].lk+HU.reduce((a,u)=>a+hu(u.k),0))*(S.hs.hp<30?.5:1)+(typeof rankInfo=='function'?rankInfo().l*.15:0):0;
const hName=()=>HT[S.ht].n;
const hRep=()=>{const m=100-S.hs.hp;return{c:m<.5?0:Math.ceil(m*1.8*hm()),t:HU[0].m[hu('wall')]||'wood',n:Math.ceil(m/10*hm())}};
function houseInit(){if(!S.hl){const o=S.hs||{hp:55,t:Date.now(),u:{},mat:{}};S.mat=Object.assign({wood:0,brick:0,glass:0,stone:0,metal:0},o.mat||{});S.hl={0:{hp:o.hp,t:o.t||Date.now(),u:o.u||{}}};S.ht=0}
S.mat=S.mat||{wood:0,brick:0,glass:0,stone:0,metal:0};S.hs=S.hl[S.ht]}
function houseWear(){const h=S.hs,dm=(Date.now()-h.t)/60000;if(dm<.2)return;h.t=Date.now();h.hp=Math.max(0,h.hp-Math.min(dm,720)/(15+hu('wall')*8))}
function hAct(a){const[k,x,y]=a.split(','),h=S.hs,M=S.mat;
if(k=='hk'){hk=x;return upd2()}
if(k=='buy'){const n=+y,c=MATP[x]*n;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;M[x]+=n}
else if(k=='up'){const u=HU.find(q=>q.k==x),l=hu(x)+1,m=u.m[l],n=Math.ceil((2+3*l)*hm()),c=Math.round(u.c*l*l*hm());if(S.c<c)return say('Не хватает монет 🪙');if(M[m]<n)return say('Не хватает материала: '+MATN[m]+' ×'+n);S.c-=c;M[m]-=n;h.u[x]=l;h.hp=Math.min(100,h.hp+8);say('Улучшено: '+u.n+' — '+u.l[l])}
else if(k=='rep'){const r=hRep();if(!r.c)return;if(S.c<r.c)return say('Не хватает монет 🪙');if(M[r.t]<r.n)return say('Для ремонта нужно: '+MATN[r.t]+' ×'+r.n);S.c-=r.c;M[r.t]-=r.n;h.hp=100;say('Дом отремонтирован 🔨')}
else if(k=='ht'){const i=+x;if(!S.hl[i]){if(S.c<HT[i].p)return say('Не хватает монет 🪙');S.c-=HT[i].p;S.hl[i]={hp:HT[i].hp,t:Date.now(),u:i>=1?{wall:1,roof:1,win:1,door:i>=2?1:0}:{}};say('Куплен: '+HT[i].n+' (старый, нужен ремонт!)')}S.ht=i;S.hs=S.hl[i]}
else if(k=='rec'){let n=0;S.inv=S.inv.filter(v=>{const f=F[v.i];if(f.t!=-1)return 1;M[f.n=='Консервная банка'||f.n=='Ржавый якорь'?'metal':'wood']++;n++;return 0});say(n?'Мусор переработан: '+n+' шт. → материалы ♻️':'В рюкзаке нет мусора')}
sv();upd2()}
let hk='main';
function houseTab(){houseWear();const h=S.hs,r=hRep(),cm=comfort(),M=S.mat;
let t='<div class="pill">'+[['main','🏠 Дом'],['up','🔨 Улучшения'],['homes','🏘 Дома'],['mats','🪵 Материалы']].map(a=>`<button class="g ${hk==a[0]?'on':''}" data-h="hk,${a[0]}">${a[1]}</button>`).join('')+'</div>';
if(hk=='main')t+=`<h3>${hName()}</h3><canvas id="hc" width="160" height="90" style="width:100%;image-rendering:pixelated;border:3px solid var(--ln)"></canvas><div id="hst"></div><p class="mu">Удача от дома и звания: +${(cm*.8).toFixed(1)}%. Дом стареет: чем он целее, тем выше удача.</p><button class="wide" data-h="rep">🔨 РЕМОНТ ${r.c?r.c+'🪙 + '+MATI[r.t]+'×'+r.n:'(не нужен)'}</button>`;
else if(hk=='up')t+=HU.map(u=>{const l=hu(u.k),b=l+1<u.l.length?`<button data-h="up,${u.k}">${fm(Math.round(u.c*(l+1)*(l+1)*hm()))}🪙 ${MATI[u.m[l+1]]}×${Math.ceil((2+3*(l+1))*hm())}</button>`:'<b>MAX</b>';return `<div class="rw"><span><b>${u.n}</b>: ${u.l[l]}</span>${b}</div>`}).join('');
else if(hk=='homes')t+='<p class="mu">Новые дома тоже старые: после покупки их нужно чинить.</p>'+HT.map((q,i)=>{const o=S.hl[i];return `<div class="rw"><span><b>${q.n}</b><br><small>удача +${q.lk} · ${o?'прочность '+Math.ceil(o.hp)+'%':'старый, нужен ремонт'}</small></span>${S.ht==i?'<b>ЖИВЁШЬ</b>':`<button data-h="ht,${i}">${o?'ПЕРЕЕХАТЬ':fm(q.p)+'🪙'}</button>`}</div>`}).join('');
else t+=Object.keys(MATN).map(m=>`<div class="rw"><span>${MATI[m]} ${MATN[m]}: <b>${M[m]}</b></span><span style="flex:none"><button data-h="buy,${m},1">+1 · ${MATP[m]}🪙</button> <button data-h="buy,${m},5">+5</button></span></div>`).join('')+'<button class="wide g" data-h="rec">♻️ ПЕРЕРАБОТАТЬ МУСОР В МАТЕРИАЛЫ</button>';
$('#pn').innerHTML=t;$('#pn').querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>hAct(b.dataset.h));houseStat()}
function houseStat(){const e=$('#hst');if(e)e.innerHTML='Прочность: <b>'+Math.ceil(S.hs.hp)+'/100</b>'+bar(S.hs.hp/100)}
// ---- рисование ----
const WC=['#6a4a2a','#b88a54','#b5523a','#9a9aa0'],RFC=['#5a4a3a','#8a5a2a','#c0503a','#3aa890'];
function wallP(Q,x,y,w,h,l,hp){Q(WC[l],x,y,w,h);if(l==0){for(let i=0;i<w;i+=6)Q('#4a2a12',x+i,y,1,h);Q('#1a0e05',x+8,y+h*.5,3,5)}else if(l==1)for(let i=0;i<w;i+=6)Q('#9a6a38',x+i,y,1,h);
else if(l==2)for(let j=0;j<h;j+=4){Q('#8a3a28',x,y+j,w,1);for(let i=(j/4%2)*4;i<w;i+=8)Q('#8a3a28',x+i,y+j+1,1,3)}else for(let j=0;j<h;j+=6){Q('#7a7a80',x,y+j,w,1);for(let i=(j/6%2)*5;i<w;i+=10)Q('#7a7a80',x+i,y+j+1,1,5)}
if(hp<50){Q('#2a2a2a',x+w*.4,y+2,1,5);Q('#2a2a2a',x+w*.8,y+h-8,1,6)}if(hp<25)Q('#9bd6fa',x+4,y+h-8,4,4)}
function roofP(Q,cx,top,h0,h1,rows,l){for(let i=0;i<rows;i++){const w=h0+(h1-h0)*i/rows;Q(RFC[l],cx-w,top+i,w*2,1);if(l>=2&&i%3==2)Q('rgba(0,0,0,.2)',cx-w,top+i,w*2,1)}if(l==0){Q('#9bd6fa',cx-14,top+rows*.3,4,3);Q('#9bd6fa',cx+12,top+rows*.6,5,3)}}
function winP(Q,x,y,w,h,l){if(l==0){Q('#3a2a1a',x,y,w,h);Q('#8a6a3a',x-1,y+2,w+2,2);Q('#8a6a3a',x-1,y+h-4,w+2,2)}else if(l==1){Q('#5a3a1a',x-1,y-1,w+2,h+2);Q('#1a2a3a',x,y,w,h)}else{Q('#fff',x-1,y-1,w+2,h+2);Q('#8ad0f0',x,y,w,h);Q('#fff',x+2,y+1,3,2);Q('#fff',x+(w>>1),y,1,h)}}
function doorP(Q,x,y,w,h,l){Q(['#5a4a3a','#7a4a1a','#9a5a22'][l],x,y,w,h);if(l==0)Q('#1a0e05',x+3,y+8,3,4);if(l==2){Q('#6a3a10',x+2,y+2,3,6);Q('#6a3a10',x+7,y+2,3,6)}Q('#f0c030',x+w-3,y+h/2,2,2)}
function smoke(Q,Y,t,x,y){for(let i=0;i<4;i++){Y.globalAlpha=.5-i*.1;Q('#ddd',x+Math.sin(t/500+i)*2+i,y-i*4,5,4)}Y.globalAlpha=1}
const HD=[
(Q,Y,t,U,hp)=>{wallP(Q,48,40,64,30,U('wall'),hp);roofP(Q,80,22,18,58,18,U('roof'));Q('#8a4a3a',100,16,7,14);if(hp>0)smoke(Q,Y,t,102,12);winP(Q,56,48,12,10,U('win'));winP(Q,94,48,12,10,U('win'));doorP(Q,74,52,12,18,U('door'))},
(Q,Y,t,U,hp)=>{wallP(Q,36,46,88,26,U('wall'),hp);wallP(Q,52,32,56,14,U('wall'),hp);roofP(Q,80,18,14,40,14,U('roof'));roofP(Q,80,44,46,50,3,U('roof'));winP(Q,44,54,12,10,U('win'));winP(Q,104,54,12,10,U('win'));winP(Q,60,35,10,8,U('win'));winP(Q,90,35,10,8,U('win'));winP(Q,76,35,8,8,U('win'));doorP(Q,74,54,12,18,U('door'));Q('#a87a3a',68,70,24,3);Q('#8a5a2a',66,72,28,2)},
(Q,Y,t,U,hp)=>{wallP(Q,34,34,92,38,U('wall'),hp);roofP(Q,80,22,38,58,12,U('roof'));Q('#8a4a3a',46,16,6,10);Q('#8a4a3a',108,16,6,10);if(hp>0)smoke(Q,Y,t,48,12);[62,95].forEach(x=>Q('#f0ece0',x,38,3,34));[[42,40],[58,40],[102,40],[116,40],[42,56],[58,56],[102,56],[116,56]].forEach(a=>winP(Q,a[0],a[1],8,9,U('win')));Q('#d8d0c0',62,50,36,2);for(let i=0;i<9;i++)Q('#d8d0c0',63+i*4,46,1,4);doorP(Q,74,54,12,18,U('door'))},
(Q,Y,t,U,hp)=>{wallP(Q,44,38,72,32,U('wall'),hp);wallP(Q,18,48,26,22,U('wall'),hp);wallP(Q,116,24,20,46,U('wall'),hp);roofP(Q,80,22,30,48,16,U('roof'));roofP(Q,31,40,8,16,8,U('roof'));roofP(Q,126,10,2,14,14,U('roof'));Q('#f0c030',126,6,1,5);
[[52,46],[66,46],[92,46],[104,46],[24,54],[122,32],[122,46]].forEach(a=>winP(Q,a[0],a[1],8,9,U('win')));doorP(Q,74,52,12,18,U('door'));Q('#6a6a70',72,50,16,2)},
(Q,Y,t,U,hp)=>{const wl=Math.max(U('wall'),3);wallP(Q,56,30,48,40,wl,hp);wallP(Q,32,22,22,48,wl,hp);wallP(Q,106,22,22,48,wl,hp);
for(let i=0;i<6;i++){Q(WC[wl],57+i*8,26,5,4)}[[32,10],[106,10]].forEach(a=>{roofP(Q,a[0]+11,a[1],2,13,12,U('roof'));Q('#d33',a[0]+11,a[1]-8,6+Math.sin(t/300)*1,4);Q('#444',a[0]+11,a[1]-8,1,9)});
Q('#222',72,48,16,22);Q('#222',70,46,20,3);for(let i=0;i<4;i++)Q('#555',74+i*4,48,1,22);[[38,34],[112,34],[38,50],[112,50]].forEach(a=>Q('#1a2a3a',a[0],a[1],3,8));Q(U('win')>1?'#8ad0f0':'#1a2a3a',76,36,8,8)}];
HD.push(
(Q,Y,t,U,hp)=>{Q('#6a4a2a',72,38,14,34);Q('#5a3a1a',74,38,2,34);Q('#4a8a3a',40,8,80,30);Q('#3aa83a',48,4,64,14);Q('#2f8a3a',54,22,52,14);Q('#8a5a2b',50,40,60,3);Q('#6e4620',52,43,56,2);wallP(Q,58,26,44,14,U('wall'),hp);roofP(Q,80,16,12,32,10,U('roof'));winP(Q,64,30,8,7,U('win'));winP(Q,88,30,8,7,U('win'));doorP(Q,78,31,6,9,U('door'));Q('#8a5a2b',64,43,2,26);Q('#8a5a2b',70,43,2,26);for(let i=0;i<6;i++)Q('#a8763a',64,46+i*4,8,1)},
(Q,Y,t,U,hp)=>{wallP(Q,28,40,104,28,U('wall'),hp);Q('#e8e8e0',24,35,112,5);Q('#cfcfc8',24,40,112,1);Q('#8a8a90',52,29,56,6);Q('#cfcfc8',52,29,56,1);[36,60,92,114].forEach(x=>winP(Q,x,46,14,14,Math.max(U('win'),1)));doorP(Q,74,52,12,16,U('door'));Y.globalAlpha=.9;Q('#4ab0f0',100,70,44,6);Y.globalAlpha=1;Q('#e8e8e0',98,69,48,1);Q('#e8e8e0',98,76,48,1)},
(Q,Y,t,U,hp)=>{wallP(Q,40,54,80,16,U('wall'),hp);roofP(Q,80,46,40,44,8,U('roof'));Q('#f4f4f4',68,12,24,44);for(let i=0;i<4;i++)Q('#c83a3a',68,16+i*10,24,5);Q('#333',64,10,32,3);Q('#ffe06a',72,4,16,7);Q('#ffffaa',76,6,8,3);Y.globalAlpha=.25;Q('#ffe08a',50,3,60,9);Y.globalAlpha=1;Q('#c83a3a',72,0,16,4);winP(Q,74,28,12,8,U('win'));doorP(Q,76,56,10,14,U('door'));winP(Q,48,58,10,8,U('win'));winP(Q,102,58,10,8,U('win'))},
(Q,Y,t,U,hp)=>{const wl=Math.max(U('wall'),2);wallP(Q,56,30,48,40,wl,hp);wallP(Q,22,42,34,28,wl,hp);wallP(Q,104,42,34,28,wl,hp);roofP(Q,80,16,4,34,14,U('roof'));roofP(Q,39,34,2,20,8,U('roof'));roofP(Q,121,34,2,20,8,U('roof'));Q('#f0c030',78,6,4,10);Q('#f0c030',76,10,8,2);Q('#d33',80,2,6+Math.sin(t/300),3);Q('#444',80,2,1,12);[[28,46],[44,46],[112,46],[128,46],[62,36],[92,36],[62,50],[92,50]].forEach(a=>winP(Q,a[0],a[1],8,9,U('win')));doorP(Q,74,52,14,18,U('door'));[60,98].forEach(x=>Q('#f0ece0',x,40,3,30));Q('#f0c030',56,28,48,2)});
function houseDraw(t){const cv=$('#hc');if(!cv)return;const Y=cv.getContext('2d'),hp=S.hs.hp,U=hu;Y.imageSmoothingEnabled=false;
const Q=(c,x,y,w,h)=>{Y.fillStyle=c;Y.fillRect(x|0,y|0,w|0,h|0)};
Q('#9bd6fa',0,0,160,58);Q('#bfe8fc',0,40,160,18);const cx=(t/1800)%200-20;Q('#fff',cx,10,18,4);Q('#fff',cx+4,7,10,4);Q('#5fae5f',0,58,160,32);Q('#4f9a52',0,58,160,2);
HD[S.ht](Q,Y,t,U,hp);
const f=U('fence');if(f>=1){for(let x=6;x<150;x+=5){if(x>62&&x<96)continue;Q('#d8c8a0',x,68,3,11);Q('#d8c8a0',x,67,1,1)}Q('#b8a880',6,71,56,1);Q('#b8a880',98,71,52,1)}
if(f==2){Q('#a87a3a',66,67,28,12);Q('#8a5a2a',66,70,28,1);Q('#8a5a2a',66,75,28,1);Q('#8a5a2a',72,67,1,12);Q('#8a5a2a',87,67,1,12)}
if(f==3){Q('#222',63,60,4,20);Q('#222',93,60,4,20);Q('#f0c030',63,58,4,2);Q('#f0c030',93,58,4,2);for(let i=0;i<7;i++)Q('#222',68+i*4,64,1,15);Q('#222',68,66,24,1);Q('#222',68,74,24,1)}
const gd=U('garden');if(gd==0){[14,22,120,134].forEach(x=>Q('#3a6a2a',x,82,2,5))}
if(gd>=1){Q('#6a4a2a',14,80,28,7);Q('#6a4a2a',118,80,28,7);for(let i=0;i<6;i++){Q('#4aba3a',16+i*4,78,1,3);Q('#4aba3a',120+i*4,78,1,3)}}
if(gd==2){['#f06090','#f0e060','#fff','#a070f0'].forEach((c,i)=>{Q(c,16+i*6,77,2,2);Q(c,122+i*6,77,2,2)});Q('#6a4a2a',146,60,3,12);Q('#3aa83a',140,50,15,12);Q('#d33',142,54,2,2);Q('#d33',150,57,2,2)}
const fo=U('fount');if(fo>=1){const w=fo==1?20:32,x=80-w/2;Q('#9a9aa0',x,82,w,5);Q('#4ab0f0',x+2,81,w-4,2);if(fo==2){Q('#9a9aa0',74,77,12,3);Q('#4ab0f0',75,76,10,1)}
const hj=fo==1?6:12;Q('#bfe8ff',80,81-hj+Math.sin(t/200),1,hj);for(let i=0;i<4;i++)Q('#bfe8ff',77+i*2+(i%2),79-hj/2+Math.abs(Math.sin(t/150+i))*3,1,1);if(fo==2){Y.globalAlpha=.25;Q('#40e0ff',x,76,w,12);Y.globalAlpha=1}}
const lp=U('lamp');if(lp>=1)[44,116].forEach(x=>{Q('#333',x,58,2,18);Q(lp==1?'#f0c060':'#fff7c0',x-1,54,4,4);Y.globalAlpha=lp==1?.2:.35;Q('#ffe08a',x-4,51,10,10);Y.globalAlpha=1});}
