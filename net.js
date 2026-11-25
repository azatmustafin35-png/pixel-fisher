// Чат и рынок игроков. NET_URL пустой → демо-режим (виртуальные игроки на этом телефоне).
// Для настоящего мультиплеера запусти server.py на сервере с HTTPS и впиши его адрес, например:
// const NET_URL='https://my-fisher.onrender.com';
const NET_URL='';
let mk='buy',NETD=null,mktL=[],reqL=[],netLast=0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function me(){let T=null;try{T=Telegram.WebApp.initDataUnsafe.user}catch(e){}if(!S.uid)S.uid=T?'t'+T.id:'u'+Math.random().toString(36).slice(2,9);return{id:S.uid,name:(T&&T.first_name)||'Рыбак '+S.uid.slice(-3)}}
function netInit(){me()}
async function netCall(path,body){if(!NET_URL)return demoCall(path,body);
try{const r=await fetch(NET_URL+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return await r.json()}catch(e){return{err:'Нет связи с сервером'}}}
function demoInit(){const nm=['Ерофей','Алёна','Capitan_Vova','Сибиряк','Лена_Байкал','Дед Мазай'],D=NETD={id:100,chat:[],mk:[],rq:[],inbox:[]};
const pk=()=>{let f;do f=F[Math.random()*F.length|0];while(f.t<0||f.t>4);return f};
for(let k=0;k<7;k++){const f=pk();D.mk.push({id:D.id++,uid:'bot',name:nm[k%6],i:f.id,w:+(f.w0+Math.random()*(f.w1-f.w0)).toFixed(2),price:Math.round(f.p*(.8+Math.random()*1.2))})}
for(let k=0;k<3;k++){const f=pk();D.rq.push({id:D.id++,uid:'bot',name:nm[(k+2)%6],i:f.id,price:Math.round(f.p*(1.5+Math.random()))})}
['Всем привет! Кто на Байкале?','Поймал осётра, продаю на рынке','Кому нужна нельма — заплачу дорого'].forEach((x,k)=>D.chat.push({id:D.id++,name:nm[k],text:x}))}
function demoCall(p,b){if(!NETD)demoInit();const D=NETD,u=p.split('?')[0],find=l=>D[l].findIndex(x=>x.id==(b&&b.id));
if(u=='/api/chat'){if(b){D.chat.push({id:D.id++,name:b.name,text:b.text});return{ok:1}}return{list:D.chat.slice(-40)}}
if(u=='/api/market'){if(b){const id=D.id++;D.mk.push({id,...b});setTimeout(()=>{const k=D.mk.findIndex(x=>x.id==id);if(k>=0){D.mk.splice(k,1);D.inbox.push({kind:'coins',n:Math.floor(b.price*.95)})}},20000+Math.random()*30000);return{ok:1,id}}return{list:D.mk}}
if(u=='/api/market/buy'||u=='/api/market/cancel'){const k=find('mk');if(k<0)return{err:'Лот уже продан'};return{ok:1,item:D.mk.splice(k,1)[0]}}
if(u=='/api/req'){if(b){const id=D.id++;D.rq.push({id,...b});setTimeout(()=>{const k=D.rq.findIndex(x=>x.id==id);if(k>=0){D.rq.splice(k,1);const f=F[b.i];D.inbox.push({kind:'fish',i:b.i,w:+(f.w0+Math.random()*(f.w1-f.w0)).toFixed(2)})}},25000+Math.random()*30000);return{ok:1,id}}return{list:D.rq}}
if(u=='/api/req/fill'||u=='/api/req/cancel'){const k=find('rq');if(k<0)return{err:'Запрос уже закрыт'};return{ok:1,price:D.rq.splice(k,1)[0].price}}
if(u=='/api/inbox'){const r=D.inbox;D.inbox=[];return{items:r}}return{err:'?'}}
async function chatRefresh(){const r=await netCall('/api/chat');if(!r.list)return;const e=$('#cl');if(e){e.innerHTML=r.list.map(m=>'<div><b>'+esc(m.name)+':</b> '+esc(m.text)+'</div>').join('')||'<small>Пока тихо…</small>';e.scrollTop=e.scrollHeight}}
function chatTab(){const r=rankInfo();$('#pn').innerHTML=`<h3>💬 Общий чат</h3><p class="mu">${NET_URL?'':'Демо-режим: сервер не подключён, собеседники виртуальные. '}Ты: ${esc(me().name)} · ${r.n}</p><div id="cl" style="height:220px;overflow:auto;border:2px solid var(--ln);padding:6px;font-size:12px"></div><div class="ch" style="margin-top:6px;flex-wrap:nowrap"><input id="cin" maxlength="200" placeholder="Сообщение…" style="flex:1;min-width:0;padding:8px;font:inherit;border:3px solid var(--ln);background:var(--pn);color:var(--ink)"><button id="csd">➤</button></div>`;
$('#csd').onclick=async()=>{const i=$('#cin'),t=i.value.trim();if(!t)return;i.value='';const r=await netCall('/api/chat',{uid:me().id,name:me().name+' ['+rankInfo().n+']',text:t.slice(0,200)});if(r.err)say(r.err);chatRefresh()};chatRefresh()}
async function mktRefresh(){const[a,b]=await Promise.all([netCall('/api/market'),netCall('/api/req')]);if(a.err)say(a.err);mktL=a.list||[];reqL=b.list||[];mktDraw()}
function mktTab(){$('#pn').innerHTML='<div class="tbs" id="mks">'+[['buy','Купить'],['sell','Продать'],['req','Запросы'],['mine','Мои']].map(a=>`<button class="g ${mk==a[0]?'on':''}" data-m="${a[0]}">${a[1]}</button>`).join('')+'</div><p class="mu">'+(NET_URL?'':'Демо-режим: сервер не подключён, лоты виртуальные. ')+'Комиссия рынка 5%.</p><div id="mkb"></div>';
$('#mks').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mk=b.dataset.m;mktTab()});mktRefresh()}
const fishOK=i=>F[i].t>=0&&F[i].t<5;
function mktDraw(){const B=$('#mkb');if(!B)return;const id=me().id;let h='';
if(mk=='buy')h=(mktL.filter(x=>x.uid!=id).map(x=>`<div class="rw">${im(x.i,32)}<span>${F[x.i].n} · ${x.w} кг<br><small>${esc(x.name)}</small></span><button data-k="buy" data-id="${x.id}">${fm(x.price)}🪙</button></div>`).join('')||'<p class="mu">Лотов пока нет.</p>');
if(mk=='sell')h='<p class="mu">Выбери рыбу из рюкзака и назначь цену:</p>'+(S.inv.map((v,j)=>fishOK(v.i)?`<div class="rw">${im(v.i,32)}<span>${F[v.i].n} · ${v.w} кг<br><input id="sp${j}" type="number" min="1" value="${v.p*2}" style="width:90px;padding:4px;font:inherit;border:2px solid var(--ln);background:var(--pn);color:var(--ink)"> 🪙</span><button data-k="sell" data-id="${j}">ВЫСТАВИТЬ</button></div>`:'').join('')||'<p class="mu">В рюкзаке нет рыбы.</p>');
if(mk=='req')h='<h3>Хочу купить</h3><div class="ch" style="flex-wrap:nowrap"><select id="rq_i" style="flex:1;min-width:0;padding:6px;font:inherit;background:var(--pn);color:var(--ink);border:2px solid var(--ln)">'+F.filter(f=>fishOK(f.id)).map(f=>`<option value="${f.id}">${f.n}</option>`).join('')+'</select><input id="rq_p" type="number" min="1" placeholder="цена" style="width:80px;padding:6px;font:inherit;background:var(--pn);color:var(--ink);border:2px solid var(--ln)"></div><button class="wide" data-k="rnew">ОПУБЛИКОВАТЬ ЗАПРОС</button><p class="mu">Деньги замораживаются, пока запрос не выполнят или ты его не отменишь.</p><h3>Запросы игроков</h3>'
+(reqL.filter(x=>x.uid!=id).map(x=>{const has=S.inv.some(v=>v.i==x.i);return `<div class="rw">${im(x.i,32)}<span>${F[x.i].n}<br><small>${esc(x.name)} платит ${fm(x.price)}🪙</small></span>${has?`<button data-k="fill" data-id="${x.id}">ОТДАТЬ</button>`:'<small>нет рыбы</small>'}</div>`}).join('')||'<p class="mu">Запросов пока нет.</p>');
if(mk=='mine')h='<h3>Мои лоты</h3>'+(mktL.filter(x=>x.uid==id).map(x=>`<div class="rw">${im(x.i,32)}<span>${F[x.i].n} · ${x.w} кг<br><small>${fm(x.price)}🪙</small></span><button class="g" data-k="mcan" data-id="${x.id}">СНЯТЬ</button></div>`).join('')||'<p class="mu">Нет лотов.</p>')+'<h3>Мои запросы</h3>'+(reqL.filter(x=>x.uid==id).map(x=>`<div class="rw">${im(x.i,32)}<span>${F[x.i].n}<br><small>плачу ${fm(x.price)}🪙</small></span><button class="g" data-k="rcan" data-id="${x.id}">ОТМЕНИТЬ</button></div>`).join('')||'<p class="mu">Нет запросов.</p>');
B.innerHTML=h;B.onclick=e=>{const b=e.target.closest('[data-k]');if(b)mAct(b.dataset.k,+b.dataset.id)}}
async function mAct(k,x){const u=me(),done=r=>{sv();hdr();mktRefresh()};let r;
if(k=='buy'){const it=mktL.find(q=>q.id==x);if(!it)return;if(S.c<it.price)return say('Не хватает монет 🪙');r=await netCall('/api/market/buy',{id:x,uid:u.id});if(r.ok){S.c-=it.price;S.inv.push({i:it.i,w:it.w,p:Math.round(F[it.i].p*.8)});say('Куплено: '+F[it.i].n+' 🎣')}else say(r.err)}
else if(k=='sell'){const it=S.inv[x],p=Math.round(+($('#sp'+x)||{}).value);if(!it||!(p>=1&&p<=1e7))return say('Укажи цену от 1 до 10 000 000');r=await netCall('/api/market',{uid:u.id,name:u.name,i:it.i,w:it.w,price:p});if(r.ok){S.inv.splice(x,1);say('Лот выставлен: '+fm(p)+'🪙')}else say(r.err)}
else if(k=='mcan'){r=await netCall('/api/market/cancel',{id:x,uid:u.id});if(r.ok){S.inv.push({i:r.item.i,w:r.item.w,p:Math.round(F[r.item.i].p*.8)});say('Лот снят, рыба вернулась в рюкзак')}else say(r.err)}
else if(k=='rnew'){const i=+$('#rq_i').value,p=Math.round(+$('#rq_p').value);if(!(p>=1&&p<=1e7))return say('Укажи цену от 1 до 10 000 000');if(S.c<p)return say('Не хватает монет 🪙');r=await netCall('/api/req',{uid:u.id,name:u.name,i,price:p});if(r.ok){S.c-=p;say('Запрос опубликован, деньги заморожены')}else say(r.err)}
else if(k=='rcan'){r=await netCall('/api/req/cancel',{id:x,uid:u.id});if(r.ok){S.c+=r.price;say('Запрос отменён, деньги вернулись')}else say(r.err)}
else if(k=='fill'){const q=reqL.find(z=>z.id==x);if(!q)return;const js=S.inv.map((v,j)=>[v,j]).filter(a=>a[0].i==q.i).sort((a,b)=>a[0].w-b[0].w);if(!js.length)return;r=await netCall('/api/req/fill',{id:x,uid:u.id,w:js[0][0].w});if(r.ok){S.inv.splice(js[0][1],1);S.c+=r.price;say('Запрос выполнен: +'+fm(r.price)+'🪙')}else say(r.err)}
done()}
async function netTick(ts){if(ts-netLast<12000)return;netLast=ts;const r=await netCall('/api/inbox?uid='+encodeURIComponent(me().id));if(r.items&&r.items.length){r.items.forEach(it=>{if(it.kind=='coins'){S.c+=it.n;say('Рынок: продан твой лот, +'+fm(it.n)+'🪙')}else if(it.kind=='fish'){S.inv.push({i:it.i,w:it.w,p:Math.round(F[it.i].p*.8)});say('Тебе принесли рыбу по запросу: '+F[it.i].n+' 🐟')}});sv();hdr()}
if(tab=='chat')chatRefresh();else if(tab=='mkt')mktRefresh()}
