(function(){var d=document,B=d.body,K='ehFrz';try{if(sessionStorage.getItem(K))return}catch(e){}
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,t0=Date.now(),done=false,el;
function busy(){var a=d.activeElement;return /cart\.html$/.test(location.pathname)||d.querySelector('.mnu.on,.nbs.on,.drawer.on,.shade.on,#cmpm.on')||(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))}
function depth(){var h=d.documentElement.scrollHeight-innerHeight;return h>0?scrollY/h:0}
function show(){done=true;try{sessionStorage.setItem(K,1)}catch(e){}
el=d.createElement('div');el.className='zfz';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','zfzh');
var fl='';if(!rm)for(var i=0;i<14;i++)fl+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;animation-delay:'+(-Math.random()*6).toFixed(1)+'s;animation-duration:'+(5+Math.random()*4).toFixed(1)+'s">❄</i>';
el.innerHTML='<div class="zfz-c"><div class="zfz-f">'+fl+'</div><div class="zfz-sun" aria-hidden="true"><svg viewBox="0 0 64 64"><g stroke="#FFC23D" stroke-width="3.5" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6"/></g><circle cx="32" cy="32" r="12" fill="#FFC23D"/></svg></div><h3 id="zfzh">Замёрзли?</h3><p>Летом Yarbo косит газон — посмотрите летнюю версию сайта.</p><div class="zfz-b"><button class="zfz-s" type="button">☀ Вернуться в лето</button><button class="zfz-w" type="button">❄ Остаться в зиме</button></div></div>';
B.appendChild(el);requestAnimationFrame(function(){el.classList.add('on')});
function close(){el.classList.remove('on');d.removeEventListener('keydown',kd);setTimeout(function(){el.remove()},rm?0:450)}
function kd(e){if(e.key==='Escape')close()}d.addEventListener('keydown',kd);
el.addEventListener('click',function(e){if(e.target===el)close()});el.querySelector('.zfz-w').onclick=close;
el.querySelector('.zfz-s').onclick=function(){if(rm){window.ehSeason&&ehSeason('s');close();return}
var w=d.createElement('div');w.className='zfz-warm';B.appendChild(w);requestAnimationFrame(function(){w.classList.add('on')});el.classList.add('melt');
setTimeout(function(){window.ehSeason&&ehSeason('s');close();setTimeout(function(){w.classList.add('out');setTimeout(function(){w.remove()},800)},150)},650)};
setTimeout(function(){var b=el.querySelector('.zfz-s');b&&b.focus({preventScroll:true})},50)}
function tick(){if(done)return;if(!B.classList.contains('w'))return;if((Date.now()-t0>75000||depth()>.7)&&!busy())show()}
setInterval(tick,1500);d.addEventListener('scroll',tick,{passive:true,capture:true});window.ehFreezeTest=function(){t0=0;tick()}})();
