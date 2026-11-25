// Пруд: разведение пойманной рыбы, корм, фильтры, пассивный доход. Вкладка «🐟 Пруд».
const FEED=[{n:'Комбикорм',p:2,m:1},{n:'Гранулы+',p:6,m:1.6},{n:'Витаминный микс',p:15,m:2.4}];
const POND_SZ=[4,8,14,22,35],POND_SZP=[0,150,500,1500,5000];
const FILT=[{n:'Без фильтра',d:1,p:0},{n:'Сетка',d:.7,p:80},{n:'Биофильтр',d:.45,p:300},{n:'УФ-стерилизатор',d:.25,p:1000},{n:'Аэратор + УФ',d:.1,p:3500}];
const AUTO=[{n:'Нет',k:0,p:0},{n:'Торговый договор (авто-продажа, комиссия 15%)',k:.85,p:400},{n:'Оптовик (комиссия 8%)',k:.92,p:1500}];
const GROW=[12,20,30,45,60]; // минут до полного роста по редкости
const CAP=()=>POND_SZ[S.pd.lv.size];
const pmax=f=>F[f.i].w1*1.25,ripe=f=>f.w>=pmax(f)*.9;
const pval=f=>{const q=F[f.i],r=(f.w-q.w0)/Math.max(.01,pmax(f)-q.w0);return Math.max(1,Math.round(q.p*(.5+1.1*Math.min(1.3,r))))};
const cleanCost=()=>Math.ceil(10+S.pd.fish.length*3);
function modInit(){houseInit();S.pd=S.pd||{t:Date.now(),q:100,lv:{size:0,filter:0,auto:0},feed:[10,0,0],fs:0,fish:[]};worldInit();netInit();houseWear();pondTick()}
function pondTick(){const p=S.pd,now=Date.now();let dm=Math.min((now-p.t)/60000,720);if(dm<1/6)return;p.t=now;
const n=Math.ceil(dm),st=dm/n;let sold=0,earn=0;
for(let k=0;k<n;k++){const fc=p.fish.length,need=fc/10*st;let mul=0;
 p.q=Math.max(0,p.q-.15*fc*FILT[p.lv.filter].d*st);
 if(fc&&p.feed[p.fs]>=need){p.feed[p.fs]-=need;mul=FEED[p.fs].m}
 const qf=p.q<25?.3:p.q<60?.7:1;
 p.fish.forEach(f=>{const q=F[f.i];f.w=Math.min(pmax(f),f.w+(pmax(f)-q.w0)/GROW[q.t]*mul*qf*st)});
 if(p.q>50&&mul&&p.fish.length<CAP()){const cnt={};p.fish.forEach(f=>cnt[f.i]=(cnt[f.i]||0)+1);
  for(const i in cnt)if(cnt[i]>=2&&Math.random()<.04*st&&p.fish.length<CAP())p.fish.push({i:+i,w:F[i].w0})}
 if(p.q<10&&p.fish.length&&Math.random()<.2*st)p.fish.splice(Math.random()*p.fish.length|0,1);
 if(p.lv.auto)p.fish=p.fish.filter(f=>{if(!ripe(f))return 1;earn+=Math.round(pval(f)*AUTO[p.lv.auto].k);sold++;return 0})}
if(earn){S.c+=earn;say('🐟 Пруд продал '+sold+' рыб: +'+fm(earn)+'🪙')}sv()}
function pondStat(){const p=S.pd,rp=p.fish.filter(ripe).length;
return `🐟 В пруду: <b>${p.fish.length}/${CAP()}</b> · готово к продаже: <b>${rp}</b><br>💧 Чистота воды ${Math.round(p.q)}%${bar(p.q/100)}🍽 Корм (${FEED[p.fs].n}): <b>${Math.floor(p.feed[p.fs])}</b>`}
function pAct(a){const[k,x,y]=a.split(','),p=S.pd,i=+x;
if(k=='fs')p.fs=i;
else if(k=='bf'){const c=FEED[i].p*+y;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.feed[i]+=+y}
else if(k=='cl'){const c=cleanCost();if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.q=100;say('Пруд почищен 🧽')}
else if(k=='up'){const l=p.lv.size+1,c=POND_SZP[l];if(l>4||S.c<c)return say(l>4?'Максимум':'Не хватает монет 🪙');S.c-=c;p.lv.size=l;say('Пруд расширен до '+POND_SZ[l]+' рыб')}
else if(k=='ft'){const l=p.lv.filter+1,c=FILT[l]&&FILT[l].p;if(!c||S.c<c)return say(c?'Не хватает монет 🪙':'Максимум');S.c-=c;p.lv.filter=l;say('Установлено: '+FILT[l].n)}
else if(k=='au'){const l=p.lv.auto+1,c=AUTO[l]&&AUTO[l].p;if(!c||S.c<c)return say(c?'Не хватает монет 🪙':'Максимум');S.c-=c;p.lv.auto=l;say('Подключено: '+AUTO[l].n)}
else if(k=='st'){if(p.fish.length>=CAP())return say('В пруду нет места — расширь его');const its=S.inv.filter(v=>v.i==i).sort((a,b)=>a.w-b.w);if(!its.length)return;S.inv.splice(S.inv.indexOf(its[0]),1);p.fish.push({i,w:its[0].w});say('Рыба посажена в пруд 🐟')}
else if(k=='sr'||k=='sa'){let e=0,n=0;p.fish=p.fish.filter(f=>{if((k=='sa'||f.i==i)&&ripe(f)){e+=pval(f);n++;return 0}return 1});S.c+=e;say(n?'Продано '+n+' рыб: +'+fm(e)+'🪙':'Выросших рыб пока нет')}
sv();upd2()}
function pondTab(){pondTick();const p=S.pd,gr={};p.fish.forEach(f=>{const a=gr[f.i]=gr[f.i]||{n:0,w:0,r:0};a.n++;a.w+=f.w;a.r+=ripe(f)?1:0});
const bk={};S.inv.forEach(v=>{if(F[v.i].t>=0&&F[v.i].t<5)bk[v.i]=(bk[v.i]||0)+1});
const nl=p.lv.size+1<POND_SZ.length,nf=p.lv.filter+1<FILT.length,na=p.lv.auto+1<AUTO.length;
$('#pn').innerHTML=`<h3>Рыбный пруд</h3><canvas id="pc" width="160" height="90" style="width:100%;image-rendering:pixelated;border:3px solid var(--ln)"></canvas><div id="pst">${pondStat()}</div>
<p class="mu">Посади пойманную рыбу: она растёт на корме, а двух рыб одного вида — размножается. Выросшую продавай или подключи авто-продажу.</p>
<h3>Корм</h3><div class="ch">${FEED.map((f,i)=>`<button class="g ${p.fs==i?'on':''}" data-p="fs,${i}">${f.n} ×${Math.floor(p.feed[i])}</button>`).join('')}</div>
<div class="ch" style="margin-top:6px">${FEED.map((f,i)=>`<button data-p="bf,${i},10">+10 · ${f.p*10}🪙</button>`).join('')}</div>
<button class="wide g" data-p="cl">🧽 ПОЧИСТИТЬ ПРУД · ${cleanCost()}🪙</button>
<h3>Улучшения</h3>
<div class="rw"><span>📐 Размер: ${POND_SZ[p.lv.size]} рыб</span>${nl?`<button data-p="up">${fm(POND_SZP[p.lv.size+1])}🪙</button>`:'<b>MAX</b>'}</div>
<div class="rw"><span>🔧 Фильтр: ${FILT[p.lv.filter].n}</span>${nf?`<button data-p="ft">${FILT[p.lv.filter+1].n} ${fm(FILT[p.lv.filter+1].p)}🪙</button>`:'<b>MAX</b>'}</div>
<div class="rw"><span>🤝 Торговля: ${AUTO[p.lv.auto].n}</span>${na?`<button data-p="au">${fm(AUTO[p.lv.auto+1].p)}🪙</button>`:'<b>MAX</b>'}</div>
<h3>Рыбы в пруду</h3>`+(Object.keys(gr).map(i=>`<div class="rw">${im(i,32)}<span>${F[i].n} ×${gr[i].n}<br><small>ср. вес ${(gr[i].w/gr[i].n).toFixed(1)} кг · готово ${gr[i].r}</small></span>${gr[i].r?`<button data-p="sr,${i}">Продать</button>`:''}</div>`).join('')||'<p class="mu">Пруд пуст.</p>')
+(p.fish.some(ripe)?'<button class="wide" data-p="sa">💰 ПРОДАТЬ ВСЕХ ВЫРОСШИХ</button>':'')
+'<h3>Посадить из рюкзака</h3>'+(Object.keys(bk).map(i=>`<div class="rw">${im(i,32)}<span>${F[i].n} ×${bk[i]}</span><button data-p="st,${i}">В ПРУД</button></div>`).join('')||'<p class="mu">В рюкзаке нет рыбы (мусор в пруд не посадить).</p>');
$('#pn').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pAct(b.dataset.p))}
function pondDraw(t){const cv=$('#pc');if(!cv)return;const Y=cv.getContext('2d'),p=S.pd;Y.imageSmoothingEnabled=false;
const Q=(c,x,y,w,h)=>{Y.fillStyle=c;Y.fillRect(x|0,y|0,w|0,h|0)};
Q('#9bd6fa',0,0,160,20);Q('#5fae5f',0,16,160,8);Q(p.q>60?'#2c82d0':p.q>25?'#4a8a6a':'#6a6a3a',6,24,148,62);
Y.globalAlpha=.25;Q('#001a40',6,56,148,30);Y.globalAlpha=1;
Q('#7a5a3a',0,22,6,68);Q('#7a5a3a',154,22,6,68);Q('#7a5a3a',0,86,160,4);Q('#c8b078',6,82,148,4);
Q('#888',20,8,12,10);Q('#c83a3a',18,6,16,3);if(p.feed[p.fs]>=1&&p.fish.length)for(let i=0;i<3;i++)Q('#c8a060',24+i*3,20+((t/150+i*5)%20),1,1);
if(p.lv.filter>0){Q('#444',130,6,18,12);Q('#2a2a2a',132,8,14,4);Q('#3af',134,13,3,2);Q('#555',138,18,3,8)}
if(p.lv.filter>=4)for(let i=0;i<8;i++)Q('#cfeeff',100+(i%2)*3,82-((t/60+i*14)%58),1+i%2,1+i%2);
p.fish.forEach((f,j)=>{const sp=spr(f.i),sc=.5+Math.min(1.3,f.w/pmax(f))*.9,x=10+((j*47)%120)+Math.sin(t/900+j*1.7)*10,y=30+((j*29)%44)+Math.sin(t/700+j)*3;Y.drawImage(sp,x|0,y|0,Math.floor(sp.width*sc),Math.floor(sp.height*sc))})}
function modLoop(ts){if(tab=='house')houseDraw(ts);else if(tab=='pond')pondDraw(ts);netTick(ts);
if(ts-(modLoop.l||0)>4000){modLoop.l=ts;pondTick();houseWear();const a=$('#pst');if(a&&tab=='pond')a.innerHTML=pondStat();if(tab=='house')houseStat()}}
