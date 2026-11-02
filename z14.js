(function(){var d=document,f=d.querySelector('.zfab');if(!f)return;var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,bd=d.body;
var hero=d.querySelector('.zhero')||d.querySelector('.hero'),hid=[d.getElementById('zdemo'),d.querySelector('.foot')].filter(Boolean);
function vis(e){var r=e.getBoundingClientRect();return r.top<innerHeight-40&&r.bottom>0}
var ly=scrollY,t,on=false;
function up(){var home=!d.querySelector('.z11'),ok=!home||bd.classList.contains('w');var past=hero?hero.getBoundingClientRect().bottom<innerHeight*.35:scrollY>400;
var show=ok&&past&&!hid.some(vis);if(show!==on){on=show;f.classList.toggle('on',show)}
var y=scrollY;if(Math.abs(y-ly)>6){f.classList.toggle('min',y>ly&&y>200);ly=y;clearTimeout(t);t=setTimeout(function(){f.classList.remove('min')},1200)}}
d.addEventListener('scroll',up,{passive:true,capture:true});addEventListener('resize',up);setInterval(up,400);up();
var R=d.querySelectorAll('.z14r');if(rm||!('IntersectionObserver'in window))R.forEach(function(e){e.classList.add('in')});else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.3});R.forEach(function(e){io.observe(e)})}
})();
