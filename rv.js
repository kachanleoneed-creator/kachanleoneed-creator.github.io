(function(){var t=document.querySelector('.rvt');if(!t)return;
function step(d){var c=t.querySelector('.rvc');if(!c)return;var w=c.getBoundingClientRect().width+16;
 if(d>0&&t.scrollLeft+t.clientWidth>=t.scrollWidth-4)t.scrollTo({left:0});else t.scrollBy({left:d*w})}
var pv=document.querySelector('.rvpv'),nx=document.querySelector('.rvnx');if(pv)pv.onclick=function(){step(-1)};if(nx)nx.onclick=function(){step(1)};
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var hold=false,vis=false,last=0;
['mouseenter','touchstart','focusin'].forEach(function(e){t.addEventListener(e,function(){hold=true;last=Date.now()},{passive:true})});
['mouseleave','touchend','focusout'].forEach(function(e){t.addEventListener(e,function(){hold=false;last=Date.now()},{passive:true})});
new IntersectionObserver(function(es){vis=es[0].isIntersecting},{threshold:.3}).observe(t);
setInterval(function(){if(vis&&!hold&&!document.hidden&&Date.now()-last>6000)step(1)},4500)})();
