// Донат: покупка монет и VIP. Игрок нажимает «Купить» → открывается чат с продавцом в Телеграме (с готовым текстом заказа).
// Продавец присылает реквизиты, после оплаты даёт игроку КОД. Код вводится в игре и проверяется сервером (server.py), поэтому подделать его нельзя.
const DONATE_TG='';   // ← впиши свой Telegram без @, например: const DONATE_TG='my_fish_shop';
const PACKS=[{k:'c250',n:'250 000 монет',rub:80,coins:250000},{k:'c500',n:'500 000 монет',rub:149,coins:500000},{k:'c1000',n:'1 000 000 монет',rub:299,coins:1000000},{k:'vip',n:'VIP: 1 000 000 монет + 20% удачи на 2 дня',rub:499,coins:1000000,vipDays:2}];
const vipLeft=()=>Math.max(0,(S.vip||0)-Date.now()),vipLuck=()=>vipLeft()>0?.2:0;
const vipText=()=>{const m=Math.floor(vipLeft()/60000);return Math.floor(m/1440)+' д '+Math.floor(m%1440/60)+' ч '+m%60+' мин'};
function donateRows(){return '<p class="mu">Как купить: нажми «Купить» — откроется чат с продавцом, он пришлёт реквизиты. После оплаты продавец даст тебе код, введи его ниже.</p>'+(vipLeft()>0?'<p><b>👑 VIP активен ещё '+vipText()+' (+20% удачи)</b></p>':'')
+PACKS.map(p=>row('<span style="font-size:28px">'+(p.vipDays?'👑':'💰')+'</span>',p.n,p.vipDays?'удача +20% ровно 2 суток после активации':'',`<button data-x="dn,${p.k}">${p.rub} ₽</button>`)).join('')
+'<h3>Есть код?</h3><div class="ch" style="flex-wrap:nowrap"><input id="rcode" maxlength="24" placeholder="FISH-XXXX-XXXX" style="flex:1;min-width:0;padding:8px;font:inherit;border:3px solid var(--ln);background:var(--pn);color:var(--ink);text-transform:uppercase"><button data-x="rd">ПОЛУЧИТЬ</button></div>'}
function donateBuy(k){const p=PACKS.find(x=>x.k==k),txt='Хочу купить в «Пиксельный Рыбак»: '+p.n+' за '+p.rub+' ₽.\nМой ID в игре: '+me().id+' ('+me().name+')';
if(!DONATE_TG)return popup('💎','Продавец не указан','Впиши свой Telegram в файле donate.js: const DONATE_TG=\'твой_username\'.');
const url='https://t.me/'+DONATE_TG+'?text='+encodeURIComponent(txt);try{Telegram.WebApp.openTelegramLink(url)}catch(e){window.open(url,'_blank')}
try{navigator.clipboard.writeText(txt)}catch(e){}say('Открываю чат с продавцом. Текст заказа скопирован на случай, если он не вставится сам.')}
async function redeemCode(){const el=$('#rcode'),code=(el&&el.value||'').trim().toUpperCase();if(!code)return say('Введи код');
if(!NET_URL)return popup('🔌','Нужен сервер','Коды проверяет сервер. Пока он не подключён (NET_URL в net.js), выдача по коду не работает.');
const r=await netCall('/api/redeem',{uid:me().id,code});if(!r.ok)return say(r.err||'Код не подошёл');
const p=PACKS.find(x=>x.k==r.pack);if(!p)return say('Неизвестный набор, напиши продавцу');S.c+=p.coins;if(p.vipDays)S.vip=Math.max(Date.now(),S.vip||0)+p.vipDays*864e5;
nlog('Получено по коду: '+p.n);sv();hdr();popup(p.vipDays?'👑':'💰','Готово!','Начислено: '+p.n+(p.vipDays?'. VIP действует ровно '+p.vipDays+' суток.':'.'));render()}
