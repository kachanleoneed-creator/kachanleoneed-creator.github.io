/* r30 Собери свой Yarbo */
(function(){
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var sec=$('#ysb');if(!sec)return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var MOD={s1:{n:'S1',c:'S1 ✓',p:290000,k:'yarbo-mod-s1',full:'Модуль снегоуборщика Yarbo S1',i:'media/r30/snow.webp.svg'},
 mow:{n:'Косилка',c:'Косилка ✓',p:290000,k:'yarbo-m1-pro',full:'Модуль газонокосилки Yarbo (M1 Pro)',i:'media/r30/mower.webp.svg'},
 trim:{n:'Триммер',c:'Триммер ✓',p:150000,k:'yarbo-mod-trimmer',full:'Триммер Yarbo для модуля газонокосилки',i:'media/r30/mower.webp.svg'},
 blow:{n:'Ветродувка',c:'Ветродувка ✓',p:220000,k:'yarbo-mod-blower',full:'Модуль ветродувки Yarbo',i:'media/r30/blower.webp.svg'}};
var ORD=['s1','mow','trim','blow'],sel={},removed={},shown=0;
function fm(n){return Math.round(n).toLocaleString('ru-RU')+' ₽'}
function base(){var p=$('#pprice');var v=p?parseInt(p.textContent.replace(/\D/g,''),10):0;return v||590000}
function total(){var t=base();ORD.forEach(function(m){if(sel[m])t+=MOD[m].p});return t}
/* ---- sticky bar (desktop .sbar + mobile .nbx from nb.js) ---- */
var sb=$('.sbar');
function setupBar(){d.body.classList.add('ysbx');var bt=sb&&$('.btn.red',sb);if(bt)bt.onclick=function(e){e.preventDefault();var m=$('button.main');if(m)m.click();
  ORD.forEach(function(k){if(sel[k]&&window.addCart){var x=MOD[k];addCart({k:x.k,n:x.full,i:x.i,p:x.p})}})};
 var pp=$('#pprice');if(pp)new MutationObserver(function(){setTimeout(function(){render(false)},0)}).observe(pp,{childList:true,characterData:true,subtree:true});
 new MutationObserver(function(){if(!$('.nbx .ysc'))render(false)}).observe(d.body,{childList:true});}
var cur=null,raf=0;
function roll(to){var els=$$('.nbx-p,.sbar .wrap>b');if(cur===null||!els.length){cur=to;els.forEach(function(e){e.textContent=fm(to)});return}
 var from=cur,t0=performance.now(),dur=RM?0:800;cancelAnimationFrame(raf);cur=to;
 els.forEach(function(el){el.classList.remove('roll');void el.offsetWidth;if(!RM&&from!==to)el.classList.add('roll')});
 (function st(t){var k=dur?Math.min(1,(t-t0)/dur):1;k=1-Math.pow(1-k,3);var v=fm(from+(to-from)*k);els.forEach(function(el){el.textContent=v});if(k<1)raf=requestAnimationFrame(st)})(t0)}
function render(anim){setTimeout(function(){document.dispatchEvent(new CustomEvent('ysb',{detail:sel}))});
 $$('[data-ymod]').forEach(function(b){b.classList.toggle('on',!!sel[b.dataset.ymod])});
 var on=ORD.filter(function(k){return sel[k]}),ch=on.map(function(k){return'<button class="ych" type="button" data-rm="'+k+'" aria-label="Убрать '+MOD[k].n+'">'+MOD[k].c+'<i>×</i></button>'}).join(''),
 bd=on.length?'Core'+on.map(function(k){return' + '+fm(MOD[k].p)}).join(''):'Yarbo Core';
 $$('.nbx,.sbar').forEach(function(bar){var c=$('.ysc',bar);if(!c){c=d.createElement('div');c.className='ysc';bar.appendChild(c)}c.innerHTML=on.length?'<span class="ych ycb">Core '+fm(base())+' +</span>'+ch:'';
  var l=$('.nbx-l,.wrap',bar),y=$('.ybd',bar);if(l&&!y){y=d.createElement('small');y.className='ybd';var p=$('.nbx-p,.wrap>b',bar);p.parentNode.insertBefore(y,p)}if(y)y.textContent=bd;
  var s=$('.nbx-r span,.btn.red span',bar);if(s)s.textContent=on.length?'В корзину: Core + '+on.map(function(k){return MOD[k].n}).join(' + '):'В корзину'});
 d.body.classList.toggle('ysbchips',on.length>0);roll(total());
}
function set(m,v,user){if(user&&v&&window.ymOffer)setTimeout(function(){window.ymOffer(m)},400);if(v&&m==='trim'&&!sel.mow)return;sel[m]=v;if(!v){removed[m]=1;if(m==='mow'){sel.trim=false}}else if(user)removed[m]=0;render(true)}
d.addEventListener('click',function(e){var t=e.target.closest('[data-rm]');if(t){set(t.dataset.rm,false,1);return}
 t=e.target.closest('[data-ymod]');if(t){var m=t.dataset.ymod,v=!sel[m];if(m==='trim'&&v&&!sel.mow){set('mow',true,1)}set(m,v,1);if(m==='trim'&&v)snapTrim();return}
 t=e.target.closest('[data-yflip]');if(t&&window.ehSeason){ehSeason(t.dataset.yflip,1);sec.scrollIntoView({behavior:RM?'auto':'smooth'})}});
/* ---- scrolly ---- */
var st=$('.ystage',sec),turn=$('.yturn',sec),I={core:$('.yi-core',sec),snow:$('.yi-snow',sec),mower:$('.yi-mower',sec),blower:$('.yi-blower',sec)},
 seam=$('.yseam',sec),trim=$('.ytrim',sec),caps=$$('.yc',sec),hs=$$('.yhs',sec),cv=$('.yleaf',sec),cx=cv.getContext('2d');
function W(){return d.body.classList.contains('w')}
function cl(x){return x<0?0:x>1?1:x}function seg(p,a,b){return cl((p-a)/(b-a))}
function ease(k){return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2}
var clicked={};
function click(m,key){if(clicked[key])return;clicked[key]=1;
 seam.classList.remove('on');void seam.offsetWidth;seam.classList.add('on');st.classList.remove('yflash');void st.offsetWidth;st.classList.add('yflash');
 try{if(navigator.vibrate)navigator.vibrate(35)}catch(e){}
 if(m&&!removed[m]&&!sel[m])set(m,true,0)}
function snapTrim(){trim.classList.remove('ghost','snap');void trim.offsetWidth;trim.classList.add('on','snap');
 seam.classList.remove('on');void seam.offsetWidth;seam.classList.add('on');try{if(navigator.vibrate)navigator.vibrate([20,40,20])}catch(e){}
 var r=trim.getBoundingClientRect(),s=st.getBoundingClientRect();for(var i=0;i<18;i++){var g=d.createElement('i');g.className='ygr';
  g.style.left=(r.left-s.left+r.width*(.55+Math.random()*.4))+'px';g.style.top=(r.bottom-s.top-8)+'px';g.style.setProperty('--dx',(Math.random()*120-30)+'px');g.style.setProperty('--dy',(-40-Math.random()*70)+'px');g.style.setProperty('--r',(Math.random()*540)+'deg');st.appendChild(g);setTimeout(function(x){x.remove()}.bind(null,g),950)}}
function showImg(el,o,y,clip){el.style.opacity=o;el.style.transform='translate3d(0,'+y+'%,0)';el.style.clipPath=clip||'none'}
var P=0,lv=[],lastT=0,leafOn=0,sweep=0;
function frame(){var r=sec.getBoundingClientRect(),h=sec.offsetHeight-innerHeight;P=cl(-r.top/Math.max(1,h));st.style.setProperty('--p',P.toFixed(4));
 var w=W(),p=P,c=1;
 // turn
 var tA=w?[.12,.42]:[.07,.22],k=ease(seg(p,tA[0],tA[1]));
 var z0=innerWidth<861?1.38:1.12,k0=ease(seg(p,0,tA[1]));turn.style.transform='translate3d('+(innerWidth<861?14*(1-k0):6*(1-k0))+'%,0,0) rotateY('+(-16+38*k)+'deg) rotateX('+(4-4*k)+'deg) scale('+(z0-(z0-1)*k0+.05*Math.sin(k*Math.PI))+')';
 if(r.top<innerHeight*.5&&r.bottom>innerHeight*.5)d.body.classList.add('nbX');
 hs.forEach(function(e,i){var a=tA[0]+(tA[1]-tA[0])*(.15+.25*i);e.classList.toggle('on',p>a&&p<(w?.5:.27))});
 var cA=w?[.45,.62]:[.24,.33],dk=seg(p,cA[0],cA[1]),de=1-Math.pow(1-dk,3);
 st.style.setProperty('--w',w?ease(seg(p,.42,.56)).toFixed(3):0);st.style.setProperty('--s',w?0:ease(seg(p,.2,.3)).toFixed(3));
 var aut=w?0:ease(seg(p,.46,.56));st.style.setProperty('--a',aut.toFixed(3));
 var M=w?I.snow:I.mower;(w?I.mower:I.snow).style.opacity=0;
 if(dk<=0){showImg(I.core,1,0);showImg(M,0,-40)}
 else if(dk<1){showImg(I.core,1,0);showImg(M,Math.min(1,dk*2),-48*(1-de),'inset(0 0 0 46%)');}
 else{showImg(I.core,0,0);showImg(M,1,0);click(w?'s1':'mow',w?'s1':'mow')}
 if(dk<1)clicked[w?'s1':'mow']=0;
 // summer: blower swap
 if(!w){var bA=[.6,.72],bk=seg(p,bA[0],bA[1]),be=1-Math.pow(1-bk,3);
  if(bk>0){showImg(I.mower,1-bk,-30*bk);showImg(I.blower,Math.min(1,bk*2),-48*(1-be),bk<1?'inset(0 0 0 44%)':'none');if(bk>=1){I.mower.style.opacity=0;click('blow','blow')}else clicked.blow=0}
  else showImg(I.blower,0,-40);
  trim.style.display=(p>.33&&p<.6)?'':'none';if(!(p>.33&&p<.6)){}else if(!sel.trim){trim.classList.add('ghost');trim.classList.remove('on')}else{trim.classList.remove('ghost');trim.classList.add('on')}
  leafOn=p>.47&&p<.97?1:0;sweep=p>.72?1:0}
 else{showImg(I.blower,0,-40);trim.style.display='none';leafOn=0;sweep=0}
 // captions
 var cs=w?(p<.14?1:p<.48?2:3):(p<.09?1:p<.25?2:p<.4?3:p<.47?4:5);
 caps.forEach(function(e){var on=+e.dataset.c===cs&&!(e.classList.contains('yw')&&!w)&&!(e.classList.contains('ys')&&w);e.classList.toggle('on',on)});
}
/* leaves */
var CL=['#d9822b','#c4501f','#e8b23a','#a63d1c','#f0a030'];
function rs(){var r=st.getBoundingClientRect(),dp=Math.min(2,devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;cx.setTransform(dp,0,0,dp,0,0)}
function leaves(t){var dt=Math.min(50,t-(lastT||t))/1000;lastT=t;var Wd=cv.width/(Math.min(2,devicePixelRatio||1)),Hd=cv.height/(Math.min(2,devicePixelRatio||1));
 cx.clearRect(0,0,Wd,Hd);var max=Wd<600?34:60;
 if(leafOn&&!sweep&&lv.length<max&&Math.random()<.5)lv.push({x:Math.random()*Wd,y:-20,vx:(Math.random()-.5)*20,vy:30+Math.random()*40,r:Math.random()*6,vr:(Math.random()-.5)*3,s:6+Math.random()*7,c:CL[Math.random()*5|0],g:0});
 lv=lv.filter(function(l){if(!leafOn){return false}
  if(sweep){l.vx+=600*dt;l.vy-=30*dt;l.vr*=1.02}else{l.vx+=Math.sin(t/600+l.r)*10*dt}
  l.x+=l.vx*dt;l.y+=l.vy*dt;l.r+=l.vr*dt;var gy=Hd*.82-l.s;if(l.y>gy&&!sweep){l.y=gy;l.vy=0;l.vx*=.9;l.vr*=.8}
  cx.save();cx.translate(l.x,l.y);cx.rotate(l.r);cx.fillStyle=l.c;cx.beginPath();cx.ellipse(0,0,l.s,l.s*.5,0,0,7);cx.fill();cx.strokeStyle='rgba(80,30,0,.5)';cx.lineWidth=1;cx.beginPath();cx.moveTo(-l.s,0);cx.lineTo(l.s,0);cx.stroke();cx.restore();
  return l.x<Wd+40});
 requestAnimationFrame(leaves)}
function setH(){sec.style.setProperty('--yh',W()?'420vh':'640vh')}
setupBar();render(false);
if(!RM){setH();rs();addEventListener('resize',rs);var tk=0;addEventListener('scroll',function(){if(!tk){tk=1;requestAnimationFrame(function(){tk=0;frame()})}},{passive:true});frame();requestAnimationFrame(leaves);
 var lw=W();new MutationObserver(function(){if(W()===lw)return;lw=W();setH();clicked={};frame()}).observe(d.body,{attributes:true,attributeFilter:['class']});}
window.ysbSet=function(m,v){set(m,v,1)};window.ysbState=function(){return{sel:sel,P:P}};
})();
