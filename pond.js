// Пруд: рыбы растут, стареют и умирают, размножаются, вода портится от тесноты. Декорации. Выведенные рыбы (🍼) стоят на 5% дороже.
const FEED=[{n:'Комбикорм',p:2,m:1},{n:'Гранулы+',p:6,m:1.6},{n:'Витаминный микс',p:15,m:2.4}];
const POND_SZ=[4,8,14,22,35,50,70,100,150,220],POND_SZP=[0,150,500,1500,5000,12000,30000,70000,150000,350000];
const FILT=[{n:'Без фильтра',d:1,p:0},{n:'Сетка',d:.7,p:80},{n:'Биофильтр',d:.45,p:300},{n:'УФ-стерилизатор',d:.25,p:1000},{n:'Аэратор + УФ',d:.1,p:3500}];
const GROW=[12,20,30,45,60],LIFE=[720,960,1200,1800,2400]; // минут до роста / до старости, по редкости
const DECOR=[{n:'Камни',p:80,k:'rock'},{n:'Водоросли',p:100,k:'weed',cl:.05},{n:'Кувшинки',p:150,k:'lily',cl:.05},{n:'Коряга',p:200,k:'log'},{n:'Ракушки',p:120,k:'shell'},{n:'Утка',p:350,k:'duck'},{n:'Мостик',p:450,k:'bridge'},{n:'Фонарики на берегу',p:700,k:'lamp'},{n:'Фонтанчик',p:600,k:'fount',cl:.05},{n:'Водолаз',p:900,k:'diver'},{n:'Затонувший корабль',p:1500,k:'ship'},{n:'Сундук с сокровищами',p:2000,k:'chest'},{n:'Подводный замок',p:2500,k:'castle'},{n:'Неоновая подсветка',p:3000,k:'neon'},{n:'Статуя дракона',p:4000,k:'dragon'}];
let pk='view';
const CAP=()=>POND_SZ[S.pd.lv.size];
const lifeOf=i=>LIFE[F[i].t]*(.8+Math.random()*.4);
const pondOK=i=>F[i].t>=0&&F[i].t<5&&F[i].w1<=150;
function newFish(i,w,b){const q=F[i];return{i,w:+w.toFixed(3),mx:+(b?q.w0+(q.w1-q.w0)*(.5+Math.random()*.5):Math.max(w,q.w1*(.9+Math.random()*.2))).toFixed(2),age:b?0:Math.random()*lifeOf(i)*.3,life:lifeOf(i),b:b?1:0}}
const pbase=f=>{const q=F[f.i];return Math.max(1,Math.round(q.p*(.25+.9*Math.min(1,f.w/f.mx))))};
const pval=f=>f.d?Math.max(1,Math.round(f.dv*.04)):f.b?Math.max(pbase(f)+1,Math.round(pbase(f)*1.05)):pbase(f);
const ready=f=>!f.d&&(f.w>=f.mx*.95||f.age>=f.life*.85);
const cleanCost=()=>Math.ceil(15+S.pd.fish.length*4.5);
function modInit(){houseInit();S.pd=S.pd||{t:Date.now(),q:100,lv:{size:0,filter:0},feed:[10,0,0],fs:0,fish:[]};S.pd.dec=S.pd.dec||{own:[],on:[]};
S.pd.fish.forEach(f=>{if(f.mx==null){f.mx=+Math.max(f.w,F[f.i].w1*1.1).toFixed(2);f.age=f.age||0;f.life=lifeOf(f.i)}});
worldInit();contentInit();content2Init();lookInit();inflate();navInit();netInit();houseWear();pondTick()}
function kill(f){f.dv=pval(f);f.d=1}
function pondTick(){const p=S.pd,now=Date.now();let dm=Math.min((now-p.t)/60000,720);if(dm<1/6)return;p.t=now;
const n=Math.ceil(dm),st=dm/n,born=[],aged=[],dirty=[],cl=1-Math.min(.3,p.dec.on.reduce((s,i)=>s+(DECOR[i].cl||0),0));
for(let k=0;k<n;k++){const live=p.fish.filter(f=>!f.d),dead=p.fish.length-live.length,fc=live.length,crowd=1+Math.max(0,fc/CAP()-.6)*5;
 p.q=Math.max(0,p.q-.03*(fc+3*dead)*crowd*FILT[p.lv.filter].d*cl*st);
 const need=fc/10*st;let mul=0;if(fc&&p.feed[p.fs]>=need){p.feed[p.fs]-=need;mul=FEED[p.fs].m}
 const qf=p.q<25?.3:p.q<60?.7:1;
 live.forEach(f=>{const q=F[f.i];f.age+=st;f.w=Math.min(f.mx,f.w+Math.max(.01,f.mx-q.w0*.1)/GROW[q.t]*mul*qf*st);
  if(f.age>f.life&&Math.random()<.03*st){kill(f);aged.push(F[f.i].n)}else if(p.q<10&&Math.random()<.004*st){kill(f);dirty.push(F[f.i].n)}});
 if(p.q>60&&mul&&p.fish.length<CAP()){const cnt={};p.fish.forEach(f=>{if(!f.d&&f.w>=f.mx*.7)cnt[f.i]=(cnt[f.i]||0)+1});
  for(const i in cnt)if(cnt[i]>=2&&Math.random()<.06*st&&p.fish.length<CAP()){p.fish.push(newFish(+i,Math.max(.003,F[i].w0*.1),1));born.push(F[i].n)}}}
const u=a=>[...new Set(a)].join(', ');
if(aged.length||dirty.length)say((aged.length?'🕯 Умерли от старости: '+u(aged)+'. ':'')+(dirty.length?'💀 Погибли из-за грязной воды: '+u(dirty)+'. ':'')+'Продай их и посади новых.');else if(born.length)say('🍼 В пруду родились мальки: '+u(born));sv()}
function pondStat(){const p=S.pd,live=p.fish.filter(f=>!f.d),dead=p.fish.length-live.length,rd=live.filter(ready),bn=live.filter(f=>f.b).length,tight=live.length/CAP()>.6;
return `🐟 Живых: <b>${live.length}/${CAP()}</b>${bn?' · 🍼 выведено: <b>'+bn+'</b>':''}${dead?' · ☠ мёртвых: <b>'+dead+'</b>':''}<br>✅ Готово к продаже: <b>${rd.length}</b> на <b>${fm(rd.reduce((s,f)=>s+pval(f),0))}🪙</b>${tight?'<br>⚠ Тесновато: вода портится быстрее':''}<br>💧 Чистота воды ${Math.round(p.q)}%${bar(p.q/100)}🍽 Корм (${FEED[p.fs].n}): <b>${Math.floor(p.feed[p.fs])}</b>`}
function decorList(){const d=S.pd.dec;return DECOR.map((x,i)=>[x,i]).sort((a,b)=>a[0].p-b[0].p).map(([x,i])=>`<div class="rw"><span><b>${x.n}</b>${x.cl?'<br><small>вода чище на '+x.cl*100+'%</small>':''}</span>${d.own.includes(i)?`<button class="${d.on.includes(i)?'':'g'}" data-x="dt,${i}">${d.on.includes(i)?'УБРАТЬ':'ПОСТАВИТЬ'}</button>`:`<button data-x="db,${i}">${fm(x.p)}🪙</button>`}</div>`).join('')}
function shopDTab(){$('#pn').innerHTML='<h3>🎨 Декорации для пруда</h3><p class="mu">Купи один раз и ставь или убирай, когда хочется.</p>'+decorList()}
function pAct(a){const[k,x,y]=a.split(','),p=S.pd,i=+x;
if(k=='pk'){pk=x;return upd2()}
if(k=='fs')p.fs=i;
else if(k=='bf'){const c=FEED[i].p*+y;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.feed[i]+=+y}
else if(k=='cl'){const c=cleanCost();if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.q=100;say('Пруд почищен 🧽')}
else if(k=='up'){const l=p.lv.size+1,c=POND_SZP[l];if(l>=POND_SZ.length||S.c<c)return say(l>=POND_SZ.length?'Максимум':'Не хватает монет 🪙');S.c-=c;p.lv.size=l;say('Пруд расширен до '+POND_SZ[l]+' рыб')}
else if(k=='ft'){const l=p.lv.filter+1,c=FILT[l]&&FILT[l].p;if(!c||S.c<c)return say(c?'Не хватает монет 🪙':'Максимум');S.c-=c;p.lv.filter=l;say('Установлено: '+FILT[l].n)}
else if(k=='st'){if(p.fish.length>=CAP())return say('В пруду нет места — расширь его или продай мёртвых');const its=S.inv.filter(v=>v.i==i).sort((a,b)=>a.w-b.w);if(!its.length)return;S.inv.splice(S.inv.indexOf(its[0]),1);p.fish.push(newFish(i,its[0].w,0));say('Рыба посажена в пруд 🐟')}
else if(k=='sr'||k=='sa'||k=='sd'){let e=0,n=0;p.fish=p.fish.filter(f=>{const hit=k=='sd'?f.d:(ready(f)&&(k=='sa'||(f.i==i&&!!f.b==(y=='1'))));if(hit){e+=pval(f);n++;return 0}return 1});S.c+=e;say(n?'Продано '+n+' рыб: +'+fm(e)+'🪙':'Подходящих рыб пока нет')}
else if(k=='db'){const c=DECOR[i].p;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.dec.own.push(i);p.dec.on.push(i);say('Куплено и поставлено: '+DECOR[i].n+' 🎨')}
else if(k=='dt'){const d=p.dec;if(d.on.includes(i))d.on=d.on.filter(z=>z!=i);else d.on.push(i)}
sv();upd2()}
function pondTab(){pondTick();const p=S.pd,live=p.fish.filter(f=>!f.d),rd=live.filter(ready),rdV=rd.reduce((s,f)=>s+pval(f),0),totV=p.fish.reduce((s,f)=>s+pval(f),0);
let h='<div class="pill">'+[['view','🏞 Пруд'],['fish','🐟 Рыбы'],['care','🍽 Уход'],['up','⬆ Улучшения'],['dec','🎨 Декор']].map(a=>`<button class="g ${pk==a[0]?'on':''}" data-p="pk,${a[0]}">${a[1]}</button>`).join('')+'</div>';
const sellAll=rd.length?`<button class="wide" data-p="sa">💰 ПРОДАТЬ ГОТОВЫХ · ${fm(rdV)}🪙</button>`:'';
if(pk=='view')h+=`<canvas id="pc" width="160" height="90" style="width:100%;image-rendering:pixelated;border:3px solid var(--ln)"></canvas><div id="pst">${pondStat()}</div><p class="mu">🍼 — рыбы, рождённые в твоём пруду, стоят на 5% дороже. Рыбы стареют и умирают (чаще от старости, реже от грязной воды), а когда в пруду тесно, вода портится быстрее.</p>`+sellAll;
else if(pk=='fish'){const gr={};p.fish.forEach(f=>{const key=f.i+(f.b?'b':'')+(f.d?'d':''),a=gr[key]=gr[key]||{i:f.i,b:f.b?1:0,d:f.d?1:0,n:0,w:0,r:0,v:0,rv:0,left:1e9};a.n++;a.w+=f.w;a.v+=pval(f);a.left=Math.min(a.left,f.life-f.age);if(ready(f)){a.r++;a.rv+=pval(f)}});
 h+=`<p class="mu">Всего в пруду на <b>${fm(totV)}🪙</b>, готовых к продаже на <b>${fm(rdV)}🪙</b>. Продаются полностью выросшие и старые рыбы.</p>`+sellAll+(Object.values(gr).sort((a,b)=>a.d-b.d).map(a=>a.d?`<div class="rw"><span style="flex:none;filter:grayscale(1);opacity:.6">${im(a.i,34)}</span><span><b>☠ ${F[a.i].n}</b> ×${a.n}<br><small>мёртвые · ~${fm(a.v/a.n)}🪙/шт (4% от прежней цены)</small></span><button class="g" data-p="sd">Продать · ${fm(a.v)}🪙</button></div>`
 :`<div class="rw"><span style="position:relative;flex:none">${im(a.i,34)}${a.b?'<span style="position:absolute;right:-6px;top:-8px;font-size:13px">🍼</span>':''}</span><span><b>${F[a.i].n}</b> ×${a.n}${a.b?' · выведены тобой':''}<br><small>ср. вес ${(a.w/a.n).toFixed(2)} кг · ~${fm(a.v/a.n)}🪙/шт · готово ${a.r}${a.left<240?' · старость через ~'+Math.max(0,Math.round(a.left/60*10)/10)+' ч':''}</small></span>${a.r?`<button data-p="sr,${a.i},${a.b}">Продать ${a.r} шт · ${fm(a.rv)}🪙</button>`:`<small>растёт…<br>всего ${fm(a.v)}🪙</small>`}</div>`).join('')||'<p class="mu">Пруд пуст.</p>');
 const bk={};S.inv.forEach(v=>{if(pondOK(v.i))bk[v.i]=(bk[v.i]||0)+1});
 h+='<h3>Посадить из рюкзака</h3>'+(Object.keys(bk).map(i=>`<div class="rw">${im(i,32)}<span>${F[i].n} ×${bk[i]}</span><button data-p="st,${i}">В ПРУД</button></div>`).join('')||'<p class="mu">В рюкзаке нет подходящей рыбы (мусор, клады, мифические и огромные рыбы в пруд не посадить).</p>')}
else if(pk=='care')h+=`<div id="pst">${pondStat()}</div><h3>Корм</h3><div class="ch">${FEED.map((f,i)=>`<button class="g ${p.fs==i?'on':''}" data-p="fs,${i}">${f.n} ×${Math.floor(p.feed[i])}</button>`).join('')}</div><p class="mu">Чем лучше корм, тем быстрее растут рыбы: ×${FEED.map(f=>f.m).join(' / ×')}.</p><div class="ch">${FEED.map((f,i)=>`<button data-p="bf,${i},10">+10 · ${f.p*10}🪙</button>`).join('')}</div><button class="wide g" data-p="cl">🧽 ПОЧИСТИТЬ ПРУД · ${cleanCost()}🪙</button>`;
else if(pk=='up'){const nl=p.lv.size+1<POND_SZ.length,nf=p.lv.filter+1<FILT.length;
 h+=`<div class="rw"><span>📐 Размер: <b>${POND_SZ[p.lv.size]}</b> рыб</span>${nl?`<button data-p="up">${POND_SZ[p.lv.size+1]} рыб · ${fm(POND_SZP[p.lv.size+1])}🪙</button>`:'<b>MAX</b>'}</div><div class="rw"><span>🔧 Фильтр: <b>${FILT[p.lv.filter].n}</b><br><small>чем лучше фильтр, тем реже нужно чистить пруд</small></span>${nf?`<button data-p="ft">${FILT[p.lv.filter+1].n} · ${fm(FILT[p.lv.filter+1].p)}🪙</button>`:'<b>MAX</b>'}</div>`}
else h+='<p class="mu">Декорации можно ставить и убирать. Водоросли, кувшинки и фонтанчик ещё и очищают воду.</p>'+decorList();
$('#pn').innerHTML=h;$('#pn').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pAct(b.dataset.p));bindX()}
function decoDraw(Y,Q,t,k){
if(k=='rock'){Q('#7a7a80',20,78,12,6);Q('#8a8a92',24,75,8,5);Q('#6a6a72',34,80,8,4)}
else if(k=='weed')for(let i=0;i<6;i++)Q('#2f9a4a',50+i*5+Math.sin(t/400+i),66-(i%3)*3,2,18-(i%3)*3);
else if(k=='lily'){Q('#2f9a4a',70,24,10,2);Q('#f070b0',74,22,3,2);Q('#2f9a4a',90,25,8,2);Q('#fff',93,23,2,2)}
else if(k=='log'){Q('#6a4a2a',110,72,30,5);Q('#5a3a1a',114,70,6,3);Q('#6a4a2a',130,66,3,7)}
else if(k=='shell'){Q('#f0d8e0',100,80,4,3);Q('#e8c8d0',106,81,3,2);Q('#fff0f4',60,81,4,3)}
else if(k=='duck'){const x=40+((t/40)%70);Q('#f0e060',x,21,8,4);Q('#f0e060',x+6,19,3,3);Q('#f08a1a',x+9,20,2,1)}
else if(k=='bridge'){Q('#a8763a',60,14,40,1);Q('#8a5a2b',60,17,40,3);Q('#6a4a2a',62,20,2,5);Q('#6a4a2a',96,20,2,5)}
else if(k=='lamp')[10,148].forEach(x=>{Q('#333',x,8,1,12);Q('#ffe08a',x-1,6,3,3);Y.globalAlpha=.25;Q('#ffe08a',x-4,3,9,9);Y.globalAlpha=1});
else if(k=='fount'){Q('#9a9aa0',76,18,10,3);Q('#bfe8ff',80,10+Math.sin(t/200),1,8);Q('#bfe8ff',77,13,1,3);Q('#bfe8ff',84,13,1,3)}
else if(k=='diver'){const x=30+Math.sin(t/900)*8;Q('#222',x,60,5,8);Q('#f0c030',x+1,57,3,3);Q('#8ad0f0',x+4,58,2,2);Q('#cfeeff',x+6,54-((t/80)%12),1,1)}
else if(k=='ship'){Q('#5a3a1a',100,70,32,10);Q('#4a2a10',104,74,24,6);Q('#6a4a2a',114,56,2,16);Q('#d8d0c0',116,58,8,8)}
else if(k=='chest'){Q('#8a5a2a',44,76,12,8);Q('#f0c030',44,76,12,2);Q('#f0c030',49,78,2,3);if((t/400|0)%2)Q('#fff',58,74,2,2)}
else if(k=='castle'){Q('#9a9aa0',62,66,20,18);Q('#9a9aa0',60,62,4,6);Q('#9a9aa0',80,62,4,6);Q('#222',68,74,6,10)}
else if(k=='neon'){Y.globalAlpha=.18;Q(['#40e0ff','#ff40c0','#40ff80'][(t/1500|0)%3],6,24,148,62);Y.globalAlpha=1}
else if(k=='dragon'){Q('#6a8a6a',128,8,12,10);Q('#6a8a6a',126,4,4,6);Q('#d33',127,5,1,1);Q('#6a8a6a',136,4,6,3)}}
function pondDraw(t){const cv=$('#pc');if(!cv)return;const Y=cv.getContext('2d'),p=S.pd;Y.imageSmoothingEnabled=false;
const Q=(c,x,y,w,h)=>{Y.fillStyle=c;Y.fillRect(x|0,y|0,w|0,h|0)};
Q('#9bd6fa',0,0,160,20);Q('#5fae5f',0,16,160,8);Q(p.q>60?'#2c82d0':p.q>25?'#4a8a6a':'#6a6a3a',6,24,148,62);
Y.globalAlpha=.25;Q('#001a40',6,56,148,30);Y.globalAlpha=1;
Q('#7a5a3a',0,22,6,68);Q('#7a5a3a',154,22,6,68);Q('#7a5a3a',0,86,160,4);Q('#c8b078',6,82,148,4);
Q('#888',20,8,12,10);Q('#c83a3a',18,6,16,3);if(p.feed[p.fs]>=1&&p.fish.some(f=>!f.d))for(let i=0;i<3;i++)Q('#c8a060',24+i*3,20+((t/150+i*5)%20),1,1);
if(p.lv.filter>0){Q('#444',130,6,18,12);Q('#2a2a2a',132,8,14,4);Q('#3af',134,13,3,2);Q('#555',138,18,3,8)}
if(p.lv.filter>=4)for(let i=0;i<8;i++)Q('#cfeeff',100+(i%2)*3,82-((t/60+i*14)%58),1+i%2,1+i%2);
p.dec.on.forEach(i=>decoDraw(Y,Q,t,DECOR[i].k));
p.fish.slice(0,60).forEach((f,j)=>{const sp=spr(f.i),sc=.5+Math.min(1.3,f.w/f.mx)*.9,w=Math.floor(sp.width*sc),h=Math.floor(sp.height*sc);
 if(f.d){const x=10+((j*47)%120),y=24;Y.save();Y.globalAlpha=.7;Y.translate(x,y+h);Y.scale(1,-1);Y.drawImage(sp,0,0,w,h);Y.restore();return}
 const x=10+((j*47)%120)+Math.sin(t/900+j*1.7)*10,y=30+((j*29)%44)+Math.sin(t/700+j)*3;Y.drawImage(sp,x|0,y|0,w,h);
 if(f.b){const hy=y-5,c='#ff6b9a';Q(c,x+1,hy,2,1);Q(c,x+4,hy,2,1);Q(c,x,hy+1,7,1);Q(c,x+1,hy+2,5,1);Q(c,x+2,hy+3,3,1)}})}
function modLoop(ts){if(tab=='house')houseDraw(ts);else if(tab=='pond'&&pk=='view')pondDraw(ts);netTick(ts);
if(ts-(modLoop.l||0)>4000){modLoop.l=ts;pondTick();houseWear();const a=$('#pst');if(a&&tab=='pond')a.innerHTML=pondStat();if(tab=='house')houseStat()}}
