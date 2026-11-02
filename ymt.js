(function(){
var MAP={s1:{k:'s1',n:'S1',t:'снегоуборщик S1',ic:'media/r30/snow.webp.svg',p:'+290 000 ₽',b:'А зимой я могу и так'},
mower:{k:'mow',n:'газонокосилка',t:'газонокосилка',ic:'media/r30/mower.webp.svg',p:'+290 000 ₽',b:'А летом я кошу газон'},
blower:{k:'blow',n:'ветродувка',t:'ветродувка',ic:'media/r31/blower.webp.svg',p:'+220 000 ₽',b:'А осенью сдуваю листья'}};
var B=document.body,cur=null,h1=document.querySelector('.pp h1')||document.querySelector('h1'),bc=document.querySelector('.bc .wrap'),
cont=document.querySelector('.ycont'),opis=document.getElementById('opisanie'),home=cont&&cont.parentNode,homeNext=cont&&cont.nextSibling,bcx;
function key(m){for(var x in MAP)if(MAP[x].k===m)return x}
function theme(m,push){
 if(m===cur)return;B.classList.add('ymx');
 setTimeout(function(){
  ['s1','mower','blower'].forEach(function(x){B.classList.toggle('ym-'+x,x===m)});B.classList.toggle('ym',!!m);
  h1.innerHTML=m?'Yarbo Core <span class="ymn">+ '+MAP[m].n+'</span>':'Yarbo Core';
  if(bcx){bcx.remove();bcx=null}
  if(m&&bc){bcx=document.createElement('span');bcx.className='ybcx';bcx.innerHTML=' <span>›</span> <b>'+MAP[m].t+'</b>';bc.appendChild(bcx)}
  if(cont){if(m&&opis)opis.parentNode.insertBefore(cont,opis);else if(home)home.insertBefore(cont,homeNext)}
  var u=new URL(location.href);if(m)u.searchParams.set('m',m);else u.searchParams.delete('m');history.replaceState(null,'',u);
  cur=m;B.classList.remove('ymx');
 },220)}
// confirm sheet
var sh=document.createElement('div');sh.className='ymsh';sh.innerHTML='<label><input type="checkbox"/><span></span></label><button type="button" aria-label="Закрыть">×</button>';B.appendChild(sh);
var shm=null,cb=sh.querySelector('input');
window.ymOffer=function(m){m=MAP[m]?m:key(m);if(!m||m===cur)return;shm=m;cb.checked=false;
 sh.querySelector('span').textContent='Беру Core + '+MAP[m].n+' ('+MAP[m].p+') — показать страницу под модуль';sh.classList.add('on')};
cb.onchange=function(){if(!cb.checked||!shm)return;var m=shm;if(window.ysbSet){var st=window.ysbState&&window.ysbState().sel;if(!st||!st[MAP[m].k]){window.ymOffer=null;window.ysbSet(MAP[m].k,true);window.ymOffer=off}}theme(m);setTimeout(function(){sh.classList.remove('on')},500)};
var off=window.ymOffer;
sh.querySelector('button').onclick=function(){sh.classList.remove('on')};
document.addEventListener('ysb',function(e){if(cur&&!e.detail[MAP[cur].k])theme(null)});
// shelf
var sf=document.createElement('div');sf.className='ymshelf';sf.setAttribute('aria-label','Модули Yarbo');
['s1','mower','blower'].forEach(function(m){var b=document.createElement('button');b.type='button';b.dataset.m=m;b.title='Core + '+MAP[m].n;b.innerHTML='<img src="'+MAP[m].ic+'" alt=""/><em>'+MAP[m].b+'</em>';b.onclick=function(){window.ymOffer(m)};sf.appendChild(b)});
B.appendChild(sf);
var bub=+(sessionStorage.getItem('ymb')||0);
setInterval(function(){if(cur||bub>=3||document.hidden)return;var w=B.classList.contains('w'),m=w?'s1':(Math.random()<.5?'mower':'blower');
 var b=sf.querySelector('[data-m='+m+']');if(!sf.classList.contains('vis'))return;b.classList.add('hop');bub++;sessionStorage.setItem('ymb',bub);setTimeout(function(){b.classList.remove('hop')},4200)},22000);
// hint strips
var HS=[['#opisanie .lxh2, .lxs .lxh2','s1','Этот же Core зимой чистит снег — с модулем S1.'],['.lxs:nth-of-type(2) .lxh2','mower','Летом Core становится газонокосилкой — меняется только модуль.'],['section.light .sh','blower','Листопад? Core с модулем ветродувки сдувает листья.']];
var shown=+(sessionStorage.getItem('yms')||0),lastY=-1e9;
HS.forEach(function(x){var el=document.querySelector(x[0]);if(!el)return;var d=document.createElement('div');d.className='ymhint';d.dataset.m=x[1];
 d.innerHTML='<img src="'+MAP[x[1]].ic+'" alt=""/><span>'+x[2]+'</span><button type="button">Примерить</button>';d.querySelector('button').onclick=function(){window.ymOffer(x[1])};
 el.parentNode.insertBefore(d,el);
 new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting||cur||d.classList.contains('on'))return;var y=scrollY;
  if(shown>=3||Math.abs(y-lastY)<innerHeight*2.5)return;shown++;sessionStorage.setItem('yms',shown);lastY=y;d.classList.add('on')})},{threshold:.6}).observe(d)});
// shelf visibility: hide over builder & first screen
var ys=document.getElementById('ysb');
addEventListener('scroll',function(){var r=ys?ys.getBoundingClientRect():{bottom:0};sf.classList.toggle('vis',!cur&&r.bottom<0)},{passive:true});
var q=new URLSearchParams(location.search).get('m');if(MAP[q]){setTimeout(function(){if(window.ysbSet){window.ymOffer=null;var st=window.ysbState().sel;if(!st[MAP[q].k])window.ysbSet(MAP[q].k,true);window.ymOffer=off}theme(q)},300)}
})();
