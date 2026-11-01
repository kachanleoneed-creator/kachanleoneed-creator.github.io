
(function(){
var w=document.getElementById('eh-cw');if(!w)return;
var fab=document.getElementById('eh-cw-fab'),card=document.getElementById('eh-cw-card'),x=document.getElementById('eh-cw-x');
function set(o){card.hidden=!o;fab.setAttribute('aria-expanded',o?'true':'false');w.setAttribute('data-open',o?'1':'0');}
fab.addEventListener('click',function(e){e.stopPropagation();set(card.hidden);});
x.addEventListener('click',function(){set(false);fab.focus();});
card.addEventListener('click',function(e){e.stopPropagation();});
document.addEventListener('click',function(){if(!card.hidden)set(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!card.hidden){set(false);fab.focus();}});
})();
