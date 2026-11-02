(function(){var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function fm(n){return Math.round(n).toLocaleString('ru-RU')+' ₽'}
document.addEventListener('click',function(e){var b=e.target.closest('[data-add2]');if(!b)return;e.preventDefault();addCart(JSON.parse(b.dataset.add2));b.textContent='✓ В корзине — оформить';b.onclick=function(){location.href='cart.html'}});
// sticky buy bar
var sb=$('.sbar');if(sb){var main=$('button.main'),pp=$('#pprice');$('.sbar .btn.red').onclick=function(){main.click()};
 var sync=function(){$('.sbar b').textContent=pp.textContent};sync();new MutationObserver(sync).observe(pp,{childList:true,characterData:true,subtree:true});
 var sl=(location.pathname.match(/p-([a-z0-9-]+)\.html/)||[])[1];var im=sl?{getAttribute:function(){return 'media/'+sl+'.svg'}}:null;
 var w=$('.sbar .wrap');if(im){var t=document.createElement('img');t.className='sbt';t.alt='';t.src=im.getAttribute('src');w.insertBefore(t,w.firstChild)}
 var bb=$('.sbar .btn.red');bb.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"/></svg><span>В корзину</span>';
 new IntersectionObserver(function(en){var on=!en[0].isIntersecting;sb.classList.toggle('on',on);document.body.classList.toggle('sbon',on)}).observe(main)}
// media tabs
$$('.mtabs button').forEach(function(t){t.onclick=function(){$$('.mtabs button').forEach(function(x){x.classList.remove('on')});t.classList.add('on');var th=$$('.thumbs button')[+t.dataset.t];if(th)th.click();var c=$('.gcap');if(c)c.textContent=t.dataset.c}});
// delivery: where to
var dw=$('#dwhere');if(dw){var calc=function(){var v=dw.value.toLowerCase(),r;
 if(!v.trim())r=null;else if(/самовывоз|магистраль/.test(v))r=['сегодня–завтра',0];else if(/москв|мо\b|подмоск|химки|мытищ|балаших|одинцов|красногорск|люберц|подольск|королёв|королев|истр|домодедов|пушкин/.test(v))r=['1–2 дня',2500];else if(/петербург|спб|питер/.test(v))r=['3–5 дней',4900];else r=['4–10 дней',6900];
 var o=$('#dwres');if(!r){o.innerHTML='';return}o.innerHTML='<b>'+r[0]+'</b> · '+(r[1]?fm(r[1]):'бесплатно')+' <span class="ex">пример тарифа</span><br>Привезём и покажем, как всё работает.';
 try{localStorage.setItem('ehdel',JSON.stringify({a:dw.value,t:r[0],c:r[1]}))}catch(e){}};dw.oninput=calc;try{var d=JSON.parse(localStorage.getItem('ehdel'));if(d){dw.value=d.a;calc()}}catch(e){}}
// catalog compare + filter cards
var cmp=[];function drawCmp(){var bar=$('.cmpbar');if(!bar)return;bar.classList.toggle('on',cmp.length>0);$('.cmpbar span').textContent='Сравнение: '+cmp.length+' из 3';$$('[data-cmp]').forEach(function(c){c.checked=cmp.indexOf(c.dataset.cmp)>=0})}
document.addEventListener('change',function(e){var c=e.target;if(!c.matches('[data-cmp]'))return;var k=c.dataset.cmp,i=cmp.indexOf(k);if(c.checked){if(cmp.length>=3){c.checked=false;toast&&window.toast?toast('Можно сравнить до 3 моделей'):alert('Можно сравнить до 3 моделей');return}cmp.push(k)}else if(i>=0)cmp.splice(i,1);drawCmp()});
var cb=$('.cmpbar .btn.red');if(cb)cb.onclick=function(){var D=window.CMPD||{},h='<table><tr><th></th>'+cmp.map(function(k){return'<th>'+D[k].n+'</th>'}).join('')+'</tr>';[['Цена','p'],['Площадь','a'],['Сезон','s'],['Навигация','nav'],['Склоны','sl']].forEach(function(r){h+='<tr><td>'+r[0]+'</td>'+cmp.map(function(k){return'<td>'+D[k][r[1]]+'</td>'}).join('')+'</tr>'});h+='<tr><td></td>'+cmp.map(function(k){return'<td><a class="btn red sm" href="p-'+k+'.html">Выбрать</a></td>'}).join('')+'</tr></table>';$('#cmpm .cmpt').innerHTML=h;$('#cmpm').classList.add('on')};
var cx=$('#cmpm .x');if(cx)cx.onclick=function(){$('#cmpm').classList.remove('on')};var cc=$('.cmpbar .clr');if(cc)cc.onclick=function(){cmp=[];drawCmp()};
var ff={a:0,s:'',sl:0};function af(){$$('.pc[data-t="robot"]').forEach(function(p){var ok=(!ff.a||+p.dataset.a>=ff.a)&&(!ff.s||p.dataset.s===ff.s||(ff.s!=='both'&&p.dataset.s==='both'))&&(!ff.sl||p.dataset.sl==='1');p.classList.toggle('fhide',!ok)})}
$$('[data-fa]').forEach(function(b){b.onclick=function(){var g=b.dataset.fa,v=b.dataset.v;$$('[data-fa="'+g+'"]').forEach(function(x){x.classList.toggle('on',x===b&&!(ff[g]==v))});ff[g]=(ff[g]==v)?(g==='s'?'':0):(g==='s'?v:+v);af()}});
// checkout
var co=$('#cof');if(co){var ship=2500,pay='rf';function tot(){var c=[];try{c=JSON.parse(localStorage.getItem('ehcart'))||[]}catch(e){}var s=c.reduce(function(a,x){return a+(x.p||0)*(x.q||1)},0);$('#csub').textContent=fm(s);$('#cship').textContent=ship?fm(ship):'бесплатно';$('#cgt').textContent=fm(s+ship);$('#cempty').style.display=c.length?'none':'block';return c}
 $$('[name=dl]').forEach(function(r){r.onchange=function(){ship=+r.dataset.c;$('#caddr').style.display=r.value==='pick'?'none':'block';tot()}});
 $$('[name=pm]').forEach(function(r){r.onchange=function(){pay=r.value;$('#cinn').style.display=pay==='inv'?'block':'none'}});
 try{var d=JSON.parse(localStorage.getItem('ehdel'));if(d){$('#caddr input').value=d.a}}catch(e){}
 setInterval(tot,800);tot();
 co.onsubmit=function(e){e.preventDefault();var c=tot();if(!c.length){alert('Корзина пуста');return}co.innerHTML='<h3>Спасибо! Заказ принят (демо)</h3><p>Менеджер позвонит и согласует время доставки и настройки.</p><p class="mut">Демо-версия: заказ никуда не отправлен, оплата не списывается.</p>'};
 var mb=function(u){return function(){var c=tot(),t='Здравствуйте! Хочу оформить заказ: '+c.map(function(x){return x.n+' ×'+(x.q||1)}).join(', ')+'. Итого '+$('#cgt').textContent;try{navigator.clipboard.writeText(t)}catch(e){}window.open(u,'_blank')}};
 $('#cotg').onclick=mb('https://t.me/ElectroHUB_consult_bot');$('#comx').onclick=mb('https://max.ru/id770500837792_2_bot')}
})();
(function(){var o=window.addCart;if(!o)return;window.addCart=function(it){o(it);if(!/cart\.html/.test(location.pathname)){var d=document.querySelector('.drawer'),s=document.querySelector('.shade');if(d){d.classList.add('on');s.classList.add('on')}}}})();
