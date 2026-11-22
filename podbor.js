/* Electro HUB — Подбор. Логика перенесена 1:1 с electro-hub.ru/podbor (quiz.js) + анимированные шаги и живой превью.
   Расширение: добавьте вопрос в QUESTIONS (k, q, hint, opts) и, при необходимости, правило в RULES. */
(function(){
var root=document.getElementById('pz');if(!root)return;
var IMG=window.PZ_IMG||{};
var PRODUCTS=[
 {id:'roboup-2se',slug:'roboup-raccoon-2se',brand:'RoboUP',name:'Raccoon 2SE',price:74900,area:600,nav:'vision',kind:'mower'},
 {id:'hookii-x2-le',slug:'hookii-neomow-x2-le',brand:'Hookii',name:'Neomow X2 LE',price:209900,area:1500,nav:'lidar',kind:'mower'},
 {id:'hookii-x2-se',slug:'hookii-neomow-x2-se',brand:'Hookii',name:'Neomow X2 SE',price:229900,area:3000,nav:'lidar',kind:'mower'},
 {id:'hookii-x2',slug:'hookii-neomow-x2',brand:'Hookii',name:'Neomow X2',price:244900,area:4000,nav:'lidar',kind:'mower'},
 {id:'hookii-x2-pro',slug:'hookii-neomow-x2-pro',brand:'Hookii',name:'Neomow X2 PRO',price:269900,area:6000,nav:'lidar',kind:'mower'},
 {id:'lymow-one-plus',slug:'lymow-one-plus',brand:'LyMow',name:'One Plus',price:359900,area:5000,nav:'rtk',kind:'mower'},
 {id:'yarbo-mower',slug:'yarbo-core',brand:'Yarbo',name:'Core',price:590000,area:10000,nav:'rtk',kind:'mower'},
 {id:'yarbo-snow',slug:'yarbo-snow-blower',brand:'Yarbo',name:'Snow Blower',price:880000,area:5000,nav:'rtk',kind:'snow'}];
var QUESTIONS=[
 {k:'task',q:'Что нужно роботу?',hint:'Один сезон или оба — от этого зависит модель.',opts:[['lawn','Газон','Косить траву','🌿'],['snow','Снег','Чистить дорожки и площадки зимой','❄'],['both','Газон и снег','Два сезона на одном участке','◐']]},
 {k:'area',q:'Какая площадь участка?',hint:'Прикиньте на глаз. Точную цифру уточним по фото.',opts:[['s','До 6 соток','Около 600 м²'],['m','6–20 соток','600–2000 м²'],['l','20–40 соток','2000–4000 м²'],['xl','Больше 40 соток','От 4000 м²']]},
 {k:'terrain',q:'Какой рельеф?',hint:'От этого зависит шасси: колёса или гусеницы.',opts:[['flat','Ровный','Почти без перепадов'],['mixed','Смешанный','Клумбы, холмики, узкие проходы'],['slope','Есть склоны','Сильный привод или гусеницы']]},
 {k:'nav',q:'Как роботу ориентироваться?',hint:'Если не уверены — берите последний пункт.',opts:[['easy','Просто запустить','Без провода, минимум возни'],['lidar','3D LiDAR и AI-Vision','Сам видит участок'],['rtk','RTK-точность','Курс на склоне и под деревьями'],['any','Пока не знаю','Ориентир — площадь и рельеф']]},
 {k:'budget',q:'Какой бюджет комфортен?',hint:'Ориентир. Точную цену скажем по модели.',opts:[['eco','До 150 000 ₽','Вход в категорию'],['mid','150–300 000 ₽','Большинство участков'],['high','300–500 000 ₽','Запас по навигации'],['prem','От 500 000 ₽','Yarbo и крупные территории']]}];
window.EH_PODBOR={QUESTIONS:QUESTIONS,PRODUCTS:PRODUCTS};
function byId(id){for(var i=0;i<PRODUCTS.length;i++)if(PRODUCTS[i].id===id)return PRODUCTS[i];}
function conflict(a){if((a.terrain==='slope'||a.area==='xl')&&a.budget==='eco')return true;if(a.task==='snow'&&(a.budget==='eco'||a.budget==='mid'))return true;if(a.task==='both'&&(a.budget==='eco'||a.budget==='mid')&&a.terrain==='slope')return true;return false}
function uniq(pool,n){var o=[],s={};pool.forEach(function(p){if(!p||o.length>=n)return;var k=p.kind==='snow'?p.id:(p.brand+(p.brand==='Hookii'?'-x2':p.id));if(!s[k]){s[k]=1;o.push(p)}});return o}
function mowers(a){var need={s:600,m:2000,l:4000,xl:8000}[a.area]||2000;var pool=PRODUCTS.filter(function(p){return p.kind==='mower'&&p.area>=need*0.7});
 var r={eco:[0,150000],mid:[150000,300000],high:[300000,500000],prem:[500000,1e9]}[a.budget];if(r)pool=pool.filter(function(p){return p.price>=r[0]&&p.price<r[1]});
 if(a.terrain==='slope'){var sl=PRODUCTS.filter(function(p){return p.kind==='mower'&&(p.id==='lymow-one-plus'||p.id.indexOf('yarbo')===0)});pool=sl.concat(pool.filter(function(p){return sl.indexOf(p)<0}))}
 if(a.nav==='lidar'||a.nav==='rtk')pool.sort(function(x,y){return(y.nav===a.nav)-(x.nav===a.nav)});else if(a.nav==='easy')pool.sort(function(x,y){return x.price-y.price});
 if(!pool.length){pool=need<=800?[PRODUCTS[0]]:need<=2500?[byId('hookii-x2-le')]:need<=4000?[byId('hookii-x2')]:[byId('hookii-x2-pro'),byId('lymow-one-plus')]}return pool}
function nearest(a){var sn=byId('yarbo-snow'),ym=byId('yarbo-mower'),ly=byId('lymow-one-plus'),hp=byId('hookii-x2-pro');
 if(a.task==='snow')return[sn];if(a.task==='both')return(a.budget==='eco'||a.budget==='mid')?[sn]:[sn,ym];
 if(a.terrain==='slope'||a.area==='xl')return a.budget==='eco'?[ly||hp]:[ly,ym];return mowers(a)}
function recommend(a){var c=conflict(a),t=a.task||'lawn',pool;
 if(c)pool=nearest(a);else if(t==='snow')pool=[byId('yarbo-snow')];
 else if(t==='both'){pool=[byId('yarbo-snow')];if(a.budget==='prem'||a.budget==='high')pool.push(byId('yarbo-mower'));else{var m=uniq(mowers(a),1);pool.push(m[0]||byId('yarbo-mower'))}}
 else pool=mowers(a);return{conflict:c,items:uniq(pool,2)}}
var a={},step=0,N=QUESTIONS.length;
function fp(n){return n<5000?'Цену уточняйте':n.toLocaleString('ru-RU')+' ₽'}
function label(k){var q=QUESTIONS.filter(function(x){return x.k===k})[0];var o=q&&q.opts.filter(function(x){return x[0]===a[k]})[0];return o?o[1]:''}
function card(p,big){return '<a class="pzr'+(big?' big':'')+'" href="p-'+p.slug+'.html"><span class="pzi" style="background-image:url(\''+(IMG[p.slug]||'')+'\')"></span><span><small>'+p.brand+'</small><b>'+p.name+'</b><em>'+fp(p.price)+'</em></span></a>'}
function preview(){var r=recommend(a),done=QUESTIONS.filter(function(q){return a[q.k]}).length;
 document.getElementById('pzprev').innerHTML='<div class="pzbar"><i style="width:'+(done/N*100)+'%"></i></div><p class="pzlbl">'+(done?'Подходит сейчас · ответов '+done+' из '+N:'Начните — результат будет меняться с каждым ответом')+'</p>'+(done?r.items.map(function(p){return card(p)}).join(''):'')+
 '<div class="pztags">'+QUESTIONS.map(function(q){return a[q.k]?'<span>'+label(q.k)+'</span>':''}).join('')+'</div>'}
function render(dir){var st=document.getElementById('pzstep');st.className='pzstep out'+(dir<0?' back':'');setTimeout(function(){
 if(step>=N){var r=recommend(a);st.innerHTML='<span class="kick">Результат</span><h2>'+(r.conflict?'Под такие условия честнее так':'Вам подойдёт')+'</h2>'+(r.conflict?'<p class="pzwarn">Бюджет и задача расходятся — показываем ближайшее, что реально закроет участок.</p>':'')+'<div class="pzres">'+r.items.map(function(p){return card(p,1)}).join('')+'</div><div class="pzcta"><a class="btn-tg" href="https://t.me/ElectroHUB_consult_bot" target="_blank" rel="noopener"><svg class="bm-i" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><circle cx="14" cy="14" r="12.4" fill="none" stroke="#fff" stroke-width="2"/><path fill="#fff" d="M19.9 8.6 17.9 18.7c-.15.7-.6.85-1.2.5l-3.2-2.4-1.55 1.5c-.17.17-.32.32-.66.32l.24-3.3 6-5.4c.26-.23-.06-.36-.4-.13l-7.4 4.66-3.2-1c-.7-.22-.7-.7.15-1.03l12.5-4.8c.58-.21 1.1.14.92 1.03z"/></svg><span>Отправить фото в Telegram</span></a><a class="btn-max" href="https://max.ru/id770500837792_2_bot" target="_blank" rel="noopener"><svg class="bm-i" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><rect x="1.2" y="1.2" width="25.6" height="25.6" rx="7.5" fill="none" stroke="#fff" stroke-width="2.2"/><g transform="translate(6.6 6.6) scale(.148)"><path fill="#fff" fill-rule="evenodd" d="M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z"/></g></svg><span>Написать в MAX</span></a><button class="btn ghost" data-pz-reset>Пройти заново</button></div>'}
 else{var q=QUESTIONS[step];st.innerHTML='<span class="kick">Шаг '+(step+1)+' из '+N+'</span><h2>'+q.q+'</h2><p class="lead">'+q.hint+'</p><div class="pzopts">'+q.opts.map(function(o,i){return '<button style="animation-delay:'+(i*60)+'ms" class="pzo'+(a[q.k]===o[0]?' on':'')+'" data-v="'+o[0]+'">'+(o[3]?'<i>'+o[3]+'</i>':'')+'<b>'+o[1]+'</b><small>'+o[2]+'</small></button>'}).join('')+'</div>'+(step?'<button class="btn ghost" data-pz-back>← Назад</button>':'')}
 document.querySelectorAll('#pzdots i').forEach(function(d,j){d.className=j<step?'ok':j===step?'cur':''});
 st.className='pzstep in'},220);preview()}
root.addEventListener('click',function(e){var o=e.target.closest('.pzo');if(o){a[QUESTIONS[step].k]=o.dataset.v;o.classList.add('on');preview();setTimeout(function(){step++;render(1)},260);return}
 if(e.target.closest('[data-pz-back]')){step--;render(-1)}if(e.target.closest('[data-pz-reset]')){a={};step=0;render(-1)}});
document.getElementById('pzdots').innerHTML=QUESTIONS.map(function(){return'<i></i>'}).join('')+'<i></i>';
render(1);
})();
