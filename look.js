// Образ: персонаж, причёски, шляпы, одежда и обувь (платные, от 300🪙). Вкладка «👕 Образ».
const SKIN=['#f2c9a0','#fbe0cc','#e8b088','#c98c5c','#a0693e','#6e4326'];
const HAIRC=[['Каштановые','#5a3a20',0],['Чёрные','#1e1a1a',0],['Русые','#b8905a',0],['Рыжие','#c8561e',300],['Блонд','#e8d078',300],['Седые','#cfcfd4',500],['Синие','#2a6ae8',700],['Розовые','#ff6ab8',700],['Зелёные','#3ac85a',800]];
const HAIRS=[['Короткая',0],['Лысый',0],['Ёжик',300],['Длинные',500],['Хвост',500],['Ирокез',700],['Афро',800],['Кудри',700],['Пучок',600]];
const HATS=[['Без шляпы',0,'#000'],['Кепка',300,'#2a6ab8'],['Панама',400,'#e8d8a0'],['Бейсболка назад',350,'#d33'],['Бини',450,'#3a8a4a'],['Ковбойская шляпа',700,'#a0693e'],['Ушанка',600,'#8a6a4a'],['Шляпа рыбака',500,'#6a8a4a'],['Капитанская фуражка',1800,'#fff'],['Цилиндр',1500,'#222'],['Пиратская треуголка',2500,'#222'],['Сомбреро',2000,'#e8c030'],['Шлем викинга',3000,'#aab'],['Корона',6000,'#f0c030']];
// имя, цена, вид, цвет, цвет 2, длина рукава
const TOPS=[['Футболка',0,'tee','#d9473a','',3],['Майка',300,'tank','#3a8ad8','',0],['Тельняшка',450,'stripe','#f0f0f0','#2a4a9a',3],['Рубашка в клетку',700,'plaid','#c83a3a','#7a1a1a',8],['Гавайская рубашка',650,'hawaii','#2aa8c8','#ff6ab8',3],['Худи',800,'hood','#7a7a88','#5a5a68',9],['Куртка рыбака',900,'jacket','#f0c030','#c89a10',9],['Жилет рыбака',1000,'vest','#e8e0c8','#6a8a4a',3],['Олимпийка Adidas',1200,'track','#1a2a5a','#ffffff',9],['Смокинг',3000,'suit','#111','#fff',9],['Доспехи',4500,'armor','#aab','#778',5],['Золотая куртка',8000,'gold','#f0c030','#fff0a0',9]];
// имя, цена, вид (p штаны, s шорты), цвет, узор
const BOTS=[['Старые штаны',0,'p','#6a5a3a',''],['Джинсы',300,'p','#3a5a9a','seam'],['Шорты',300,'s','#c8a860',''],['Бермуды',450,'s','#3a8a5a','pocket'],['Штаны Adidas',900,'p','#1a2a5a','adidas'],['Камуфляж',700,'p','#5a6a3a','camo'],['Комбинезон',800,'p','#3a6ac8','bib'],['Шорты в цветочек',600,'s','#2aa8c8','dots'],['Брюки со стрелками',1200,'p','#222','crease'],['Золотые штаны',6000,'p','#f0c030','shine']];
const SHOES=[['Сапоги',0,'boot','#4a3320'],['Кроссовки',400,'sn','#f0f0f0'],['Босиком',300,'bare',''],['Зелёные резиновые',350,'boot','#2a8a3a'],['Ласты',800,'fin','#2aa8d8'],['Золотые кроссовки',4000,'sn','#f0c030']];
const LCAT=[['skin','Кожа',SKIN.map((c,i)=>[c,0])],['hs','Причёска',HAIRS],['hc','Цвет волос',HAIRC.map(h=>[h[0],h[2]])],['hat','Шляпа',HATS],['top','Верх',TOPS],['bot','Низ',BOTS],['sh','Обувь',SHOES]];
function lookInit(){S.look=Object.assign({skin:0,hs:0,hc:0,hat:0,top:0,bot:0,sh:0},S.look||{});S.lo=S.lo||{};LCAT.forEach(c=>{S.lo[c[0]]=S.lo[c[0]]||[0]})}
function manDraw(Q,ox,dy,pz,K){if(!S.look)lookInit();K=K||S.look;const P=(c,x,y,w,h)=>Q(c,x+ox,y+dy,w,h),sk=SKIN[K.skin],B=BOTS[K.bot],T=TOPS[K.top],SH=SHOES[K.sh],hc=HAIRC[K.hc][1],tc=T[3],t2=T[4],len=B[2]=='s'?5:10;
// штаны и шорты
P(B[3],26,39,4,len);P(B[3],32,39,4,len);P(B[3],26,39,10,2);if(B[2]=='s'){P(sk,26,44,4,5);P(sk,32,44,4,5)}
if(B[4]=='adidas')[26,28,33,35].forEach(x=>P('#fff',x,40,1,len-1));
if(B[4]=='camo')for(let i=0;i<8;i++)P(i%2?'#3a4a2a':'#8a7a4a',26+(i*3)%10,40+(i*2)%(len-1),2,2);
if(B[4]=='dots')for(let i=0;i<7;i++)P(['#f0e060','#ff6ab8','#fff'][i%3],26+(i*3)%10,40+(i*2)%4,1,1);
if(B[4]=='seam'){P('#2a4a7a',29,40,1,len);P('#2a4a7a',32,40,1,len);P('#e8c060',26,40,4,1)}
if(B[4]=='pocket'){P('#2a6a3a',27,41,2,2);P('#2a6a3a',33,41,2,2)}
if(B[4]=='crease'){P('#555',28,40,1,len);P('#555',33,40,1,len)}
if(B[4]=='shine'){P('#fff0a0',27,40,1,len);P('#fff0a0',34,40,1,len)}
if(B[4]=='bib'){P(B[3],28,32,6,7);P('#f0c030',28,32,1,1);P('#f0c030',33,32,1,1)}
// обувь
if(SH[2]=='boot'){P(SH[3],25,46,5,4);P(SH[3],31,46,5,4);P('#00000033',25,46,5,1);P('#00000033',31,46,5,1)}
else if(SH[2]=='sn'){P(SH[3],25,47,6,3);P(SH[3],31,47,6,3);P('#222',25,49,6,1);P('#222',31,49,6,1);P('#888',27,47,2,1);P('#888',33,47,2,1)}
else if(SH[2]=='bare'){P(sk,26,48,5,2);P(sk,32,48,5,2)}else{P(SH[3],21,48,9,2);P(SH[3],32,48,9,2);P('#0a6a8a',21,49,9,1);P('#0a6a8a',32,49,9,1)}
// капюшон худи — за головой
if(T[2]=='hood')P(tc,25,23,12,6);
// торс
P(tc,26,28,10,11);
if(T[2]=='tank'){P(sk,26,28,3,3);P(sk,33,28,3,3)}
if(T[2]=='stripe')for(let j=1;j<11;j+=3)P(t2,26,28+j,10,1);
if(T[2]=='plaid'){for(let i=0;i<10;i+=3)P(t2,26+i,28,1,11);for(let j=2;j<11;j+=4)P(t2,26,28+j,10,1)}
if(T[2]=='hawaii')[[27,30],[31,33],[34,36],[28,35],[33,30]].forEach(a=>{P(t2,a[0],a[1],2,2);P('#f0e060',a[0],a[1],1,1)});
if(T[2]=='hood'){P(t2,28,35,6,3);P('#fff',30,29,1,3);P('#fff',32,29,1,3)}
if(T[2]=='jacket'){P(t2,28,28,6,1);P(t2,31,28,1,11);P(t2,27,35,3,2);P(t2,33,35,3,2)}
if(T[2]=='vest'){P(t2,26,28,3,11);P(t2,33,28,3,11);P('#4a6a3a',27,34,2,2);P('#4a6a3a',33,34,2,2)}
if(T[2]=='track'){P(t2,31,28,1,11);P(t2,26,28,1,5);P(t2,35,28,1,5)}
if(T[2]=='suit'){P(t2,30,28,2,6);P(t2,29,28,1,3);P(t2,32,28,1,3);P('#c0202a',30,29,2,5)}
if(T[2]=='armor'){P(t2,26,28,10,1);P(t2,26,38,10,1);P(t2,30,28,1,11);[[27,30],[34,30],[27,36],[34,36]].forEach(a=>P('#eee',a[0],a[1],1,1))}
if(T[2]=='gold')P(t2,27,29,2,8);
// руки
const arm=(x,y,w,h,d)=>{P(sk,x,y,w,h);const n=T[5];if(!n)return;if(d=='d')P(tc,x,y,w,Math.min(h,n));else if(d=='u')P(tc,x,y+h-Math.min(h,n),w,Math.min(h,n));else if(d=='r')P(tc,x,y,Math.min(w,n),h);else P(tc,x+w-Math.min(w,n),y,Math.min(w,n),h)};
if(pz==0){arm(24,29,2,9,'d');arm(36,33,4,2,'r');if(T[2]=='track')P('#fff',24,29,1,9)}
else if(pz==1){arm(23,19,2,9,'u');arm(37,19,2,9,'u')}
else if(pz==2){arm(24,23,2,6,'u');arm(36,23,2,6,'u');P(sk,25,22,2,2);P(sk,35,22,2,2)}
else{arm(21,30,5,2,'l');arm(36,30,5,2,'r')}
// голова
P(sk,29,27,4,2);P(sk,27,19,8,8);P(sk,26,22,1,2);P(sk,35,22,1,2);
P('#fff',29,22,2,2);P('#fff',32,22,2,2);P('#222',30,23,1,1);P('#222',33,23,1,1);P('#00000022',31,24,1,2);
if(pz==1){P('#b22',30,25,3,2);P('#fff',30,25,3,1)}else P('#8a3a3a',30,25,3,1);
if(pz==3)P('#8fd0f7',36,21,1,2);
// причёска
const hs=K.hs;
if(hs==0){P(hc,27,19,8,3);P(hc,26,21,1,3);P(hc,35,21,1,3)}
else if(hs==2)P(hc,27,19,8,2);
else if(hs==3){P(hc,27,19,8,3);P(hc,26,21,2,9);P(hc,34,21,2,9)}
else if(hs==4){P(hc,27,19,8,3);P(hc,26,21,1,3);P(hc,35,21,2,2);P(hc,36,23,2,5)}
else if(hs==5){P(hc,30,14,2,7);P(hc,29,17,4,3);P(hc,27,20,8,1)}
else if(hs==6){P(hc,25,16,12,8);P(hc,26,15,10,2)}
else if(hs==7){P(hc,26,18,10,4);[[27,17],[30,16],[33,17]].forEach(a=>P(hc,a[0],a[1],2,2))}
else if(hs==8){P(hc,27,19,8,3);P(hc,26,21,1,3);P(hc,35,21,1,3);P(hc,30,16,3,3)}
// шляпа
const h=K.hat,c=HATS[h][2];
if(h==1){P(c,26,17,10,4);P(c,34,20,4,1);P('#fff',30,17,2,1)}
else if(h==2){P(c,24,19,14,2);P(c,27,15,8,4);P('#8a6a3a',27,18,8,1)}
else if(h==3){P(c,26,17,10,4);P(c,24,20,4,1)}
else if(h==4){P(c,26,16,10,5);P('#e8e8e8',26,19,10,2);P('#e8e8e8',30,14,2,2)}
else if(h==5){P(c,23,19,16,2);P(c,27,14,8,5);P('#6a4a2a',27,18,8,1);P(c,22,18,2,1);P(c,38,18,2,1)}
else if(h==6){P(c,26,16,10,4);P('#d8c8a8',25,19,2,6);P('#d8c8a8',35,19,2,6)}
else if(h==7){P(c,25,17,12,3);P(c,24,20,14,1);P('#4a6a3a',25,19,12,1)}
else if(h==8){P('#fff',26,16,10,3);P('#1a2a5a',26,19,10,1);P('#111',27,20,8,1);P('#f0c030',30,17,2,2)}
else if(h==9){P('#222',27,10,8,9);P('#222',24,19,14,1);P('#a22',27,17,8,1)}
else if(h==10){P('#222',24,17,14,3);P('#222',26,14,10,3);P('#f0f0f0',30,16,2,2);P('#c8a030',24,19,14,1)}
else if(h==11){P(c,20,19,22,2);P(c,28,12,6,7);P('#d33',20,20,22,1);P('#2a8a4a',28,16,6,1)}
else if(h==12){P(c,27,16,8,4);P('#f0ecd8',24,13,2,5);P('#f0ecd8',36,13,2,5);P('#f0ecd8',23,12,1,2);P('#f0ecd8',38,12,1,2)}
else if(h==13){P(c,27,16,8,3);P(c,27,14,1,2);P(c,31,13,2,3);P(c,34,14,1,2);P('#d33',31,17,1,1)}}
const LIMG={};
function lookImg(cat,i,big){const key=cat+i+(big?'b':'')+JSON.stringify(S.look);if(LIMG[key])return LIMG[key];const c=document.createElement('canvas');c.width=30;c.height=46;const g2=c.getContext('2d'),Q=(col,x,y,w,h)=>{g2.fillStyle=col;g2.fillRect((x-16)|0,(y-8)|0,w|0,h|0)};
Q('#bfe8fc',16,8,30,36);Q('#8a5a2b',16,50,30,2);const K=Object.assign({},S.look);if(cat)K[cat]=i;manDraw(Q,0,0,0,K);return LIMG[key]=c.toDataURL()}
let lkc='hat';
const lkPrice=(c,i)=>LCAT.find(a=>a[0]==c)[2][i][c=='hc'?1:(c=='skin'?1:1)];
function lookTab(){const cat=LCAT.find(a=>a[0]==lkc);
let h='<h3>👕 Образ</h3><div style="text-align:center"><img class="px" style="width:150px;border:3px solid var(--ln)" src="'+lookImg(null,0)+'"></div><div class="pill" style="margin-top:8px;flex-wrap:wrap">'+LCAT.map(a=>`<button class="g ${lkc==a[0]?'on':''}" data-x="lc,${a[0]}">${a[1]}</button>`).join('')+'</div>';
h+=cat[2].map((it,i)=>{const pr=it[1],own=pr==0||S.lo[lkc].includes(i),on=S.look[lkc]==i,sw=lkc=='skin'?`<span style="display:inline-block;width:40px;height:40px;background:${it[0]};border:2px solid var(--ln)"></span>`:`<img class="px" style="width:48px" src="${lookImg(lkc,i)}">`;
return `<div class="rw">${sw}<span><b>${lkc=='skin'?'Тон '+(i+1):it[0]}</b>${pr&&!own?'<br><small>'+fm(pr)+'🪙</small>':''}</span>${on?'<b>НАДЕТО</b>':`<button class="${own?'g':''}" data-x="lk,${lkc},${i}">${own?'НАДЕТЬ':fm(pr)+'🪙'}</button>`}</div>`}).join('');
$('#pn').innerHTML=h;bindX()}
function lookAct(a){const[k,c,i]=a.split(',');if(k=='lc'){lkc=c;return render()}
const it=LCAT.find(x=>x[0]==c)[2][+i],pr=it[1];if(!(pr==0||S.lo[c].includes(+i))){if(S.c<pr)return say('Не хватает монет 🪙');S.c-=pr;S.lo[c].push(+i);say('Куплено: '+it[0]+' 👕')}S.look[c]=+i;sv();hdr();render()}
