// Дом: рисунок, улучшения, ремонт, материалы. Вкладка «🏠 Дом».
const MATN={wood:'Доски',brick:'Кирпич',glass:'Стекло',stone:'Камень',metal:'Металл'},MATP={wood:4,brick:8,glass:12,stone:15,metal:25},MATI={wood:'🪵',brick:'🧱',glass:'🪟',stone:'🪨',metal:'⚙️'};
// l — названия уровней, m — материал для каждого уровня, c — базовая цена (монеты = c·ур²)
const HU=[
{k:'wall',n:'Стены',l:['Гнилые доски','Новые доски','Кирпич','Камень'],m:['','wood','brick','stone'],c:50},
{k:'roof',n:'Крыша',l:['Дырявая','Доски','Черепица','Медный лист'],m:['','wood','brick','metal'],c:50},
{k:'win',n:'Окна',l:['Заколочены','Рамы','Стеклопакеты'],m:['','wood','glass'],c:40},
{k:'door',n:'Дверь',l:['Старая','Дубовая','Резная'],m:['','wood','wood'],c:30},
{k:'fence',n:'Забор и ворота',l:['Нет','Забор','Деревянные ворота','Кованые ворота'],m:['','wood','wood','metal'],c:60},
{k:'garden',n:'Сад',l:['Бурьян','Грядки','Клумбы и яблони'],m:['','wood','stone'],c:45},
{k:'fount',n:'Фонтан',l:['Нет','Малый фонтан','Большой с подсветкой'],m:['','stone','stone'],c:120},
{k:'lamp',n:'Фонари',l:['Нет','Керосиновые','Электрические'],m:['','metal','glass'],c:70}];
const hu=k=>S.hs.u[k]||0;
const comfort=()=>S.hs?HU.reduce((a,u)=>a+hu(u.k),0)*(S.hs.hp<30?.5:1):0;
const hName=()=>{const c=HU.reduce((a,u)=>a+hu(u.k),0);return c<3?'Старый дом':c<8?'Обжитой дом':c<14?'Хороший дом':'Усадьба'};
const hRep=()=>{const m=100-S.hs.hp;return{c:m<.5?0:Math.ceil(m*1.2),t:HU[0].m[hu('wall')]||'wood',n:Math.ceil(m/10)}};
function houseWear(){const h=S.hs,dm=(Date.now()-h.t)/60000;if(dm<.2)return;h.t=Date.now();h.hp=Math.max(0,h.hp-Math.min(dm,720)/(15+hu('wall')*8))}
function hAct(a){const[k,x,y]=a.split(','),h=S.hs;
if(k=='buy'){const n=+y,c=MATP[x]*n;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;h.mat[x]+=n}
else if(k=='up'){const u=HU.find(q=>q.k==x),l=hu(x)+1,m=u.m[l],n=2+3*l,c=u.c*l*l;if(S.c<c)return say('Не хватает монет 🪙');if(h.mat[m]<n)return say('Не хватает материала: '+MATN[m]);S.c-=c;h.mat[m]-=n;h.u[x]=l;h.hp=Math.min(100,h.hp+8);say('Улучшено: '+u.n+' — '+u.l[l])}
else if(k=='rep'){const r=hRep();if(!r.c)return;if(S.c<r.c)return say('Не хватает монет 🪙');if(h.mat[r.t]<r.n)return say('Для ремонта нужно: '+MATN[r.t]+' ×'+r.n);S.c-=r.c;h.mat[r.t]-=r.n;h.hp=100;say('Дом отремонтирован 🔨')}
else if(k=='rec'){let n=0;S.inv=S.inv.filter(v=>{const f=F[v.i];if(f.t!=-1)return 1;h.mat[f.n=='Консервная банка'||f.n=='Ржавый якорь'?'metal':'wood']++;n++;return 0});say(n?'Мусор переработан: '+n+' шт. → материалы ♻️':'В рюкзаке нет мусора')}
sv();upd2()}
function houseTab(){houseWear();const h=S.hs,r=hRep(),cm=comfort();
$('#pn').innerHTML=`<h3>${hName()}</h3><canvas id="hc" width="160" height="90" style="width:100%;image-rendering:pixelated;border:3px solid var(--ln)"></canvas>
<div id="hst"></div><p class="mu">Уют: ${cm.toFixed(0)} → удача на рыбалке +${(cm*.8).toFixed(1)}%. Чем крепче стены, тем медленнее дом ветшает.</p>
<button class="wide" data-h="rep">🔨 РЕМОНТ ${r.c?r.c+'🪙 + '+MATI[r.t]+'×'+r.n:'(не нужен)'}</button>
<h3>Материалы</h3>`+Object.keys(MATN).map(m=>`<div class="rw"><span>${MATI[m]} ${MATN[m]}: <b>${h.mat[m]}</b></span><span style="flex:none"><button data-h="buy,${m},1">+1 · ${MATP[m]}🪙</button> <button data-h="buy,${m},5">+5</button></span></div>`).join('')+`<button class="wide g" data-h="rec">♻️ ПЕРЕРАБОТАТЬ МУСОР В МАТЕРИАЛЫ</button><h3>Улучшения</h3>`+HU.map(u=>{const l=hu(u.k),b=l+1<u.l.length?`<button data-h="up,${u.k}">${fm(u.c*(l+1)*(l+1))}🪙 ${MATI[u.m[l+1]]}×${2+3*(l+1)}</button>`:'<b>MAX</b>';return `<div class="rw"><span><b>${u.n}</b>: ${u.l[l]}</span>${b}</div>`}).join('');
$('#pn').querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>hAct(b.dataset.h));houseStat()}
function houseStat(){const e=$('#hst');if(e)e.innerHTML='Прочность: <b>'+Math.ceil(S.hs.hp)+'/100</b>'+bar(S.hs.hp/100)}
function houseDraw(t){const cv=$('#hc');if(!cv)return;const Y=cv.getContext('2d'),hp=S.hs.hp,U=hu;Y.imageSmoothingEnabled=false;
const Q=(c,x,y,w,h)=>{Y.fillStyle=c;Y.fillRect(x|0,y|0,w|0,h|0)};
Q('#9bd6fa',0,0,160,58);Q('#bfe8fc',0,40,160,18);const cx=(t/1800)%200-20;Q('#fff',cx,10,18,4);Q('#fff',cx+4,7,10,4);Q('#5fae5f',0,58,160,32);Q('#4f9a52',0,58,160,2);
// стены
const wl=U('wall');Q(['#6a4a2a','#b88a54','#b5523a','#9a9aa0'][wl],48,40,64,30);
if(wl==0){for(let i=0;i<10;i++)Q('#4a2a12',48+i*6,40,1,30);Q('#1a0e05',56,56,3,5);Q('#1a0e05',98,48,4,3)}
if(wl==1)for(let i=0;i<10;i++)Q('#9a6a38',48+i*6,40,1,30);
if(wl==2)for(let y=0;y<30;y+=4){Q('#8a3a28',48,40+y,64,1);for(let x=(y/4%2)*4;x<64;x+=8)Q('#8a3a28',48+x,41+y,1,3)}
if(wl==3)for(let y=0;y<30;y+=6){Q('#7a7a80',48,40+y,64,1);for(let x=(y/6%2)*5;x<64;x+=10)Q('#7a7a80',48+x,41+y,1,5)}
if(hp<50){Q('#2a2a2a',70,42,1,5);Q('#2a2a2a',71,47,1,4);Q('#2a2a2a',104,58,1,6);Q('#2a2a2a',60,64,5,1)}
if(hp<25){Q('#9bd6fa',52,62,4,4);Q('#9bd6fa',100,42,5,4);Q('#ddd',50,41,6,1)}
// крыша
const rc=['#5a4a3a','#8a5a2a','#c0503a','#3aa890'][U('roof')];for(let i=0;i<18;i++){const w=18+i*2.3;Q(rc,80-w,22+i,w*2,1)}
if(U('roof')==0){Q('#9bd6fa',66,28,4,3);Q('#9bd6fa',92,33,5,3)}if(U('roof')>=2)for(let i=0;i<18;i+=3)Q('rgba(0,0,0,.18)',40,22+i,80,1);
Q('#8a4a3a',100,16,7,14);if(hp>0)for(let i=0;i<4;i++){Y.globalAlpha=.5-i*.1;Q('#ddd',102+Math.sin(t/500+i)*2+i,12-i*4,5,4)}Y.globalAlpha=1;
// окна и дверь
[56,94].forEach(x=>{const w=U('win');if(w==0){Q('#3a2a1a',x,48,12,10);Q('#8a6a3a',x-1,50,14,2);Q('#8a6a3a',x-1,54,14,2)}else if(w==1){Q('#5a3a1a',x-1,47,14,12);Q('#1a2a3a',x,48,12,10)}else{Q('#fff',x-1,47,14,12);Q('#8ad0f0',x,48,12,10);Q('#fff',x+2,49,3,2);Q('#fff',x+5,48,1,10)}});
const d=U('door');Q(['#5a4a3a','#7a4a1a','#9a5a22'][d],74,52,12,18);if(d==0)Q('#1a0e05',77,60,3,4);if(d==2){Q('#6a3a10',76,54,3,6);Q('#6a3a10',81,54,3,6);Q('#6a3a10',76,62,8,5)}Q('#f0c030',83,61,2,2);
// забор и ворота
const f=U('fence');if(f>=1){for(let x=6;x<150;x+=5){if(x>62&&x<96)continue;Q('#d8c8a0',x,68,3,11);Q('#d8c8a0',x,67,1,1)}Q('#b8a880',6,71,56,1);Q('#b8a880',98,71,52,1)}
if(f==2){Q('#a87a3a',66,67,28,12);Q('#8a5a2a',66,70,28,1);Q('#8a5a2a',66,75,28,1);Q('#8a5a2a',72,67,1,12);Q('#8a5a2a',87,67,1,12)}
if(f==3){Q('#222',63,60,4,20);Q('#222',93,60,4,20);Q('#f0c030',63,58,4,2);Q('#f0c030',93,58,4,2);for(let i=0;i<7;i++)Q('#222',68+i*4,64,1,15);Q('#222',68,66,24,1);Q('#222',68,74,24,1)}
// сад
const gd=U('garden');if(gd==0){[14,22,120,134].forEach(x=>Q('#3a6a2a',x,82,2,5))}
if(gd>=1){Q('#6a4a2a',14,80,28,7);Q('#6a4a2a',118,80,28,7);for(let i=0;i<6;i++){Q('#4aba3a',16+i*4,78,1,3);Q('#4aba3a',120+i*4,78,1,3)}}
if(gd==2){['#f06090','#f0e060','#fff','#a070f0'].forEach((c,i)=>{Q(c,16+i*6,77,2,2);Q(c,122+i*6,77,2,2)});Q('#6a4a2a',142,56,3,12);Q('#3aa83a',136,46,15,12);Q('#d33',138,50,2,2);Q('#d33',146,53,2,2)}
// фонтан
const fo=U('fount');if(fo>=1){const w=fo==1?20:32,x=80-w/2;Q('#9a9aa0',x,82,w,5);Q('#4ab0f0',x+2,81,w-4,2);if(fo==2){Q('#9a9aa0',74,77,12,3);Q('#4ab0f0',75,76,10,1)}
const hj=fo==1?6:12;Q('#bfe8ff',80,81-hj+Math.sin(t/200),1,hj);for(let i=0;i<4;i++)Q('#bfe8ff',77+i*2+(i%2),79-hj/2+Math.abs(Math.sin(t/150+i))*3,1,1);
if(fo==2){Y.globalAlpha=.25;Q('#40e0ff',x,76,w,12);Y.globalAlpha=1}}
// фонари
const lp=U('lamp');if(lp>=1)[44,116].forEach(x=>{Q('#333',x,58,2,18);Q(lp==1?'#f0c060':'#fff7c0',x-1,54,4,4);Y.globalAlpha=lp==1?.2:.35;Q('#ffe08a',x-4,51,10,10);Y.globalAlpha=1})}
