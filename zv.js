(function(){var d=document,V=d.querySelectorAll('.zvl video');if(!V.length)return;var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
V.forEach(function(v){var s=+v.dataset.s,e=+v.dataset.e;v.addEventListener('timeupdate',function(){if(v.currentTime>=e-.05||v.currentTime<s-.5)v.currentTime=s});
function ld(){if(!v.src){v.src=v.dataset.src+'#t='+s;v.load();v.addEventListener('loadedmetadata',function(){v.currentTime=s},{once:true})}}
if(rm){v.parentNode.classList.add('rm');v.addEventListener('click',function(){ld();v.paused?v.play():v.pause()});return}
if(!('IntersectionObserver'in window)){ld();v.play();return}
new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){ld();var p=v.play();p&&p.catch(function(){})}else v.pause()})},{threshold:.25,rootMargin:'200px 0px'}).observe(v)});
d.addEventListener('visibilitychange',function(){if(d.hidden)V.forEach(function(v){v.pause()})})})();
