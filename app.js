(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return n.toLocaleString('ru-RU')+' ₽'};
/* season */
function setS(s){document.body.classList.toggle('w',s==='w');try{localStorage.setItem('ehs',s)}catch(e){}
 $$('[data-cat-season]').forEach(function(){});if(window.applyF)applyF();}
setS(localStorage.getItem('ehs')||(new URLSearchParams(location.search).get('s'))||'s');
$$('.season .bs').forEach(function(b){b.onclick=function(){setS('s')}});
$$('.season .bw').forEach(function(b){b.onclick=function(){setS('w')}});
/* menu */
var bg=$('.burger');if(bg)bg.onclick=function(){$('.nav').classList.toggle('on')};
/* toast */
function toast(t){var e=$('.toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},2200)}
/* cart */
function get(){try{return JSON.parse(localStorage.getItem('ehcart'))||[]}catch(e){return[]}}
function put(c){localStorage.setItem('ehcart',JSON.stringify(c));render()}
window.addCart=function(it){var c=get(),f=c.filter(function(x){return x.k===it.k})[0];if(f)f.q++;else{it.q=1;c.push(it)}put(c);toast('Добавлено в корзину: '+it.n)};
function render(){var c=get(),n=0,s=0;c.forEach(function(x){n+=x.q;s+=x.q*x.p});
 $$('.cnt').forEach(function(e){e.textContent=n;e.style.display=n?'grid':'none'});
 var h=c.length?c.map(function(x,i){return '<div class="ci"><div class="t" style="background-image:url(\''+x.i+'\')"></div><div style="flex:1"><b style="font-size:14px">'+x.n+'</b><div class="mut" style="font-size:12px">'+(x.o||'')+'</div><div style="font-weight:700">'+(x.p?fmt(x.p):'цена по запросу')+'</div></div><div class="q"><button data-i="'+i+'" data-d="-1">−</button>'+x.q+'<button data-i="'+i+'" data-d="1">+</button></div></div>'}).join(''):'<p class="mut" style="padding:30px 0">Корзина пуста. <a href="catalog.html" style="text-decoration:underline">В каталог →</a></p>';
 ['#cartls','#cartpage'].forEach(function(id){var l=$(id);if(!l)return;l.innerHTML=h;$$('button',l).forEach(function(b){b.onclick=function(){var c=get(),i=+b.dataset.i;c[i].q+=+b.dataset.d;if(c[i].q<1)c.splice(i,1);put(c)}})});
 $$('.ctot').forEach(function(e){e.textContent=fmt(s)})}
function openC(o){$('.drawer').classList.toggle('on',o);$('.shade').classList.toggle('on',o)}
$$('.opencart').forEach(function(b){b.onclick=function(e){e.preventDefault();openC(true)}});
$('.shade').onclick=function(){openC(false)};$('.drawer .x').onclick=function(){openC(false)};
$$('[data-add]').forEach(function(b){b.onclick=function(e){e.preventDefault();var d=JSON.parse(b.dataset.add);if(window.curOpt&&b.classList.contains('main'))d=curOpt();addCart(d);b.classList.add('ok')}});
render();window.addEventListener('storage',render);
/* order form */
var of=$('#orderf');if(of)of.onsubmit=function(e){e.preventDefault();if(!get().length){toast('Корзина пуста');return}localStorage.removeItem('ehcart');render();of.innerHTML='<h3>Спасибо! Это демо — заказ никуда не отправлен.</h3><p class="mut">На боевом сайте менеджер перезвонит в течение 15 минут (9:00–21:00).</p>'};
/* emilia */
var em=$('.emi .e');if(em)em.onclick=function(){$('.emi').classList.toggle('on')};
/* catalog filters */
var grid=$('#cgrid');if(grid){var st={b:'all',s:'auto',t:new URLSearchParams(location.search).get('t')||'all'};
 var qb=new URLSearchParams(location.search).get('b');if(qb)st.b=qb;
 window.applyF=function(){var ss=st.s==='auto'?(document.body.classList.contains('w')?'winter':'summer'):st.s,n=0;
  $$('.pc',grid).forEach(function(c){var ok=(st.b==='all'||c.dataset.b===st.b)&&(ss==='all'||c.dataset.s===ss||c.dataset.s==='both'||c.dataset.t==='acc')&&(st.t==='all'||c.dataset.t===st.t);c.style.display=ok?'':'none';if(ok)n++});
  $('#cn').textContent=n;$$('.chip[data-f]').forEach(function(ch){var v=st[ch.dataset.f];ch.classList.toggle('on',v===ch.dataset.v||(ch.dataset.f==='s'&&st.s==='auto'&&ch.dataset.v===ss))})};
 $$('.chip[data-f]').forEach(function(ch){ch.onclick=function(){st[ch.dataset.f]=ch.dataset.v;applyF()}});applyF();}
/* product */
var po=$('#popts');if(po){var base=+po.dataset.base,info=JSON.parse(po.dataset.info);
 window.curOpt=function(){var add=0,names=[];$$('input:checked',po).forEach(function(i){add+=+i.dataset.p;if(+i.dataset.p||i.type==='checkbox')names.push(i.dataset.n)});
  return{k:info.k+'|'+names.join(','),n:info.n,i:info.i,p:base?base+add:0,o:names.join(' · ')}};
 function upd(){var o=curOpt();$('#pprice').textContent=base?fmt(o.p):'Цена по запросу'}
 $$('input',po).forEach(function(i){i.onchange=upd});upd();}
var gal=$('.gal');if(gal){$$('.thumbs button',gal).forEach(function(b){b.onclick=function(){$$('.thumbs button',gal).forEach(function(x){x.classList.remove('on')});b.classList.add('on');var m=$('.main',gal);
 if(b.dataset.v){m.innerHTML='<video autoplay muted loop playsinline controls></video>';loadV(b.dataset.v,function(u){$('video',m).src=u})}else{m.innerHTML='';m.style.backgroundImage='url(\''+b.dataset.i+'\')'}}})}
var VC={};window.V=function(k,d){fetch(d).then(function(r){return r.blob()}).then(function(bl){VC[k]=URL.createObjectURL(bl);(VC['_'+k]||[]).forEach(function(f){f(VC[k])})})};
window.loadV=function(k,cb){if(VC[k]&&typeof VC[k]==='string'){cb(VC[k]);return}(VC['_'+k]=VC['_'+k]||[]).push(cb);if(!VC['s'+k]){VC['s'+k]=1;var s=document.createElement('script');s.src='v/'+k+'.js';document.body.appendChild(s)}};
$$('video[data-v]').forEach(function(v){loadV(v.dataset.v,function(u){v.src=u})});
/* delivery */
var dc=$('#dcity');if(dc){function d(){var o=dc.options[dc.selectedIndex],w=+($('#dw')&&$('#dw').value||1);$('#dres').innerHTML='<b>'+o.dataset.c+' ₽</b> · '+o.dataset.d+' <span class="ex">пример тарифа</span>'}dc.onchange=d;d()}
/* card check */
var cc=$('#cardf');if(cc)cc.onsubmit=function(e){e.preventDefault();var v=$('#cardn').value.trim(),L={'090':['Бронза','2 года','скидка на расходники'],'007':['Серебро','2 года','зимнее хранение по клубной цене'],'042':['Золото','3 года','предложение на следующего робота'],'888':['Золото','3 года','новинки первыми']}[v];
 $('#cardr').innerHTML=L?'<div class="card" style="margin-top:16px"><span class="tag">Карта № '+v+'</span><h3 style="margin-top:10px">Уровень: '+L[0]+'</h3><p>Гарантия: '+L[1]+' · Открыто: '+L[2]+'</p></div>':'<p class="mut" style="margin-top:12px">Карта не найдена. Тестовые: 090 · 007 · 042 · 888</p>'};
/* quiz */
var qz=$('#quiz');if(qz){var ans={},steps=$$('.qs',qz),i=0;function show(){steps.forEach(function(s,j){s.style.display=j===i?'':'none'})}show();
 $$('.qs .chip',qz).forEach(function(c){c.onclick=function(){ans[c.parentNode.parentNode.dataset.k]=c.dataset.v;i++;if(i>=steps.length-1){res()}show()}});
 function res(){var r;if(ans.season==='snow'||ans.season==='both')r=['yarbo-core','Yarbo Core + модуль снегоуборщика'];else if(ans.relief==='slope')r=['lymow-one-plus','Lymow One Plus'];else if(ans.area==='s')r=['roboup-raccoon-2se','RoboUP Raccoon 2SE'];else if(ans.area==='xl')r=['yarbo-m1-pro','Yarbo M1 Pro'];else r=['hookii-neomow-x2','Hookii Neomow X2'];
  $('#qres').innerHTML='<span class="tag">Наш выбор</span><h2 style="margin:12px 0">'+r[1]+'</h2><div class="btns"><a class="btn red" href="p-'+r[0]+'.html">Смотреть модель</a><a class="btn ghost" href="check.html">Проверить участок</a></div>'}
 $('#qback')&&($('#qback').onclick=function(){i=0;ans={};show()});}
/* forms demo */
$$('form.demo-f').forEach(function(f){f.onsubmit=function(e){e.preventDefault();f.innerHTML='<p style="padding:20px 0"><b>Заявка принята (демо).</b> На боевом сайте она уйдёт менеджеру.</p>'}});
/* map */
if($('#map')&&window.L){var m=L.map('map').setView([55.75,37.0],16);
 var sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Esri World Imagery'}).addTo(m);
 var osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'});
 L.control.layers({'Спутник':sat,'Схема':osm}).addTo(m);
 var pts=[],poly=null,mk=[];function area(){if(pts.length<3)return 0;var R=6378137,a=0;for(var i=0;i<pts.length;i++){var p1=pts[i],p2=pts[(i+1)%pts.length];a+=(p2.lng-p1.lng)*Math.PI/180*(2+Math.sin(p1.lat*Math.PI/180)+Math.sin(p2.lat*Math.PI/180))}return Math.abs(a*R*R/2)}
 function draw(){if(poly)m.removeLayer(poly);poly=L.polygon(pts,{color:'#C41E3A',weight:3,fillOpacity:.25}).addTo(m);var a=Math.round(area());$('#marea').textContent=a?a.toLocaleString('ru-RU')+' м² · '+(a/100).toFixed(1)+' сот.':'—';
  var rec=a===0?'Поставьте минимум 3 точки':a<600?'RoboUP Raccoon 2SE':a<2500?'Hookii Neomow X2 / L':a<4000?'Lymow One Plus или Yarbo M1 Pro':'Yarbo — свяжемся для выезда';$('#mrec').textContent=rec}
 m.on('click',function(e){pts.push(e.latlng);mk.push(L.circleMarker(e.latlng,{radius:5,color:'#fff',fillColor:'#C41E3A',fillOpacity:1}).addTo(m));draw()});
 $('#mclr').onclick=function(){pts=[];mk.forEach(function(x){m.removeLayer(x)});mk=[];draw()};
 $('#mfind').onclick=function(){var q=$('#maddr').value;if(!q)return;fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q)).then(function(r){return r.json()}).then(function(j){if(j[0])m.setView([+j[0].lat,+j[0].lon],18);else toast('Адрес не найден')}).catch(function(){toast('Поиск недоступен')})};}
})();
