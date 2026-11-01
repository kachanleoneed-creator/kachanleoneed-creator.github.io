
;/* Electro HUB · движок Эмилии для кнопки Лены (emilia.js). Подключать ПЕРЕД emilia.js. window.EH_EMI = {api, token, ws, consent}. */
(function(){
'use strict';
var C=window.EH_EMI||{};if(!C.api)return;
var ctx,mic,proc,ws,rec,chunks=[],dest,sess,playT=0,srcs=[],tr=[],live=false,UI=null,pendingText=null;
function post(p,b,form){return fetch(C.api+p,{method:'POST',headers:form?{'X-Emilia':C.token}:{'X-Emilia':C.token,'Content-Type':'application/json'},body:form?b:JSON.stringify(b)}).then(function(r){return r.json()})}
function report(s,m){try{fetch(C.api+'clientlog',{method:'POST',keepalive:true,headers:{'X-Emilia':C.token,'Content-Type':'application/json'},body:JSON.stringify({stage:'pub:'+s,msg:String(m||'').slice(0,300)})})}catch(x){}}
var upSeq=0,upIdx=0,upT=null,upBusy=false,unloading=false,learnSent=false;
function beacon(p,fd){fd.append('tk',C.token);try{if(navigator.sendBeacon&&navigator.sendBeacon(C.api+p,fd))return true}catch(x){}try{fetch(C.api+p,{method:'POST',keepalive:true,body:fd})}catch(x){}return false}
var upPN=0;function upFlush(useBeacon){var id=sess&&sess.id;if(!id||(upBusy&&!useBeacon))return;var from=upBusy?upPN:upIdx,sq0=upBusy?upSeq+1:upSeq;if(from>=chunks.length)return;var part=chunks.slice(from),n=from+part.length,b=new Blob(part,{type:rec&&rec.mimeType||'audio/webm'});var f=new FormData();f.append('id',id);f.append('seq',String(sq0));f.append('audio',b,'a.webm');
 if(useBeacon){upIdx=n;upSeq=sq0+1;upBusy=false;if(!beacon('upload',f))report('upload-beacon-fail','seq '+sq0+' '+b.size+'b');return}
 upBusy=true;upPN=n;var sq=upSeq;post('upload',f,true).then(function(j){upBusy=false;if(j&&j.ok){if(sq===upSeq){upIdx=n;upSeq++}}else report('upload-fail','seq '+sq+' '+b.size+'b '+(j&&j.error||'?'))}).catch(function(e){upBusy=false;report('upload-fail','seq '+sq+' net '+(e&&e.message||''))})}
function sendLearn(d,end){if(learnSent||!sess||!sess.id||!tr.length)return;learnSent=true;var o={id:sess.id,transcript:tr.join('\n'),dur:d,phone:lastPhone,crm:lastCrm,end:end};if(unloading){var f=new FormData();for(var k in o)f.append(k,o[k]);beacon('learn',f)}else post('learn',o).catch(function(e){report('learn-fail',e&&e.message||'')})}
function b64(buf){var b=new Uint8Array(buf),s='',n=0x8000;for(var i=0;i<b.length;i+=n)s+=String.fromCharCode.apply(null,b.subarray(i,i+n));return btoa(s)}
function pcm(f,rate){var r=rate/24000,n=Math.floor(f.length/r),o=new Int16Array(n);for(var i=0;i<n;i++){var v=Math.max(-1,Math.min(1,f[Math.floor(i*r)]));o[i]=v<0?v*0x8000:v*0x7FFF}return o.buffer}
function play(s){var bin=atob(s),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);var p=new Int16Array(u.buffer),f=new Float32Array(p.length);for(i=0;i<p.length;i++)f[i]=p[i]/32768;
 var ab=ctx.createBuffer(1,f.length,24000);ab.getChannelData(0).set(f);var src=ctx.createBufferSource();src.buffer=ab;src.connect(ctx.destination);src.connect(dest);
 if(playT<ctx.currentTime)playT=ctx.currentTime+0.03;src.start(playT);playT+=ab.duration;srcs.push(src);src.onended=function(){srcs.splice(srcs.indexOf(src),1);if(!srcs.length&&live&&UI)UI.setState('listening')}}
function hush(){srcs.slice().forEach(function(s){try{s.stop()}catch(e){}});srcs=[];playT=0}
function done(){return new Promise(function(ok){(function w(){if(!ctx||ctx.currentTime>=playT-0.05)ok();else setTimeout(w,120)})()})}
var CONSENT_KEY='eh_emilia_consent_v1';
function consent(){if(localStorage.getItem(CONSENT_KEY))return Promise.resolve();return new Promise(function(ok,no){
 var p=document.querySelector('#emilia-voice .emv-panel')||document.getElementById('emilia-voice'),d=document.createElement('div');d.className='emv-consent';
 d.innerHTML='<div class="emv-consent-box"><p><b>Перед разговором</b></p><p>'+C.consent+'</p><label><input type="checkbox"> Согласен(на) на запись разговора и обработку персональных данных</label><div><button type="button" data-ok disabled>Начать разговор</button> <button type="button" data-no>Отмена</button></div></div>';
 p.appendChild(d);var cb=d.querySelector('input'),b=d.querySelector('[data-ok]');cb.onchange=function(){b.disabled=!cb.checked};
 b.onclick=function(){localStorage.setItem(CONSENT_KEY,new Date().toISOString());d.remove();ok()};d.querySelector('[data-no]').onclick=function(){d.remove();no(new Error('consent'))}})}
var lastPhone='',lastCrm='',lastAct=0,turns=0,wrapped=false,idleWarned=false,hardT=null,idleT=null,tOpen=0,closing=false;
function act(){lastAct=Date.now();idleWarned=false}
function on(e){var t=e.type;if(t==='input_audio_buffer.speech_started'||t.indexOf('audio.delta')>=0||t==='conversation.item.input_audio_transcription.completed')act();
 if(t==='conversation.item.input_audio_transcription.completed')turns++;
 if(t==='response.done'){act();if(!wrapped&&(Date.now()-tOpen>300000||turns>=16)){wrapped=true;ws.send(JSON.stringify({type:'conversation.item.create',item:{type:'message',role:'system',content:[{type:'input_text',text:'Системная пометка: разговор идёт уже долго. В следующей реплике мягко подведите итог, предложите оформить заказ, обратный звонок или написать в Telegram/MAX.'}]}}))}
  if(closing){done().then(stop)}}
 if(t==='response.output_audio.delta'||t==='response.audio.delta'){if(!firstAudio){firstAudio=true;var ms=Math.round(performance.now()-t0);window.EMI_TFA=ms;report('first-audio',ms+'ms')}UI.setState('speaking');play(e.delta);return}
 if(t==='input_audio_buffer.speech_started'){hush();UI.setState('listening');return}
 if(t==='input_audio_buffer.speech_stopped'){UI.setState('thinking');return}
 if(t==='conversation.item.input_audio_transcription.completed'&&e.transcript){tr.push('Клиент: '+e.transcript.trim());UI.userSaid(e.transcript.trim());return}
 if((t==='response.output_audio_transcript.done'||t==='response.audio_transcript.done')&&e.transcript){tr.push('Эмилия: '+e.transcript.trim());UI.addMessage?UI.addMessage(e.transcript.trim(),'emilia'):0;UI.caption(e.transcript.trim(),'emilia');return}
 if(t==='response.function_call_arguments.done'){tool(e);return}
 if(t==='error')report('xai-error',e.error&&e.error.message)}
function wxDirect(city){var M={0:'ясно',1:'преимущественно ясно',2:'переменная облачность',3:'пасмурно',45:'туман',48:'туман',51:'морось',53:'морось',55:'морось',61:'небольшой дождь',63:'дождь',65:'сильный дождь',71:'небольшой снег',73:'снег',75:'сильный снег',77:'снежная крупа',80:'ливень',81:'ливень',82:'сильный ливень',85:'снегопад',86:'сильный снегопад',95:'гроза'};
 return fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=ru&format=json&name='+encodeURIComponent(city)).then(function(r){return r.json()}).then(function(g){var p=g.results&&g.results[0];if(!p)return{ok:false,error:'city_not_found'};
  return fetch('https://api.open-meteo.com/v1/forecast?timezone=auto&current=temperature_2m,snowfall,weather_code&daily=snowfall_sum&forecast_days=3&latitude='+p.latitude+'&longitude='+p.longitude).then(function(r){return r.json()}).then(function(w){var c=w.current||{},t=new Date().toLocaleTimeString('ru-RU',{timeZone:w.timezone,hour:'2-digit',minute:'2-digit'}),h=parseInt(t,10);
   return{ok:true,city:p.name,region:p.admin1||'',temp_c:Math.round(c.temperature_2m),conditions:M[c.weather_code]||'без осадков',snow_now_cm:c.snowfall||0,snow_next_3_days_cm:((w.daily&&w.daily.snowfall_sum)||[]).reduce(function(a,b){return a+(b||0)},0)}})})}
function wx(post,city){return post('weather',{city:city}).then(function(r){return r&&r.ok?r:wxDirect(city)}).catch(function(){return wxDirect(city)}).catch(function(){return{ok:false}})}
function tool(e){var a={};try{a=JSON.parse(e.arguments||'{}')}catch(x){}
 if(e.name==='end_call'){report('end_call',a.reason||'');done().then(function(){stop();if(UI&&UI.close)setTimeout(UI.close,800)});return}UI.setState('thinking');
 var p=e.name==='check_address'?post('address',{query:a.query||''}):e.name==='search_kb'?post('kb',{query:a.query||''}):e.name==='get_city_weather'?wx(post,a.city||''):e.name==='request_callback'?post('callback',{id:sess.id,args:a,transcript:tr.join('\n')}):e.name==='create_order'?post('order',{id:sess.id,args:a,transcript:tr.join('\n')}):Promise.resolve({ok:false});
 p.catch(function(){return{ok:false,error:'network'}}).then(function(r){if(a.phone)lastPhone=a.phone;if(r&&r.crm_order_id)lastCrm='заказ №'+r.crm_order_id;else if(r&&r.crm_task_id)lastCrm='задача №'+r.crm_task_id;if(e.name==='create_order'&&r.ok&&UI.handoffDone)UI.handoffDone();
  ws.send(JSON.stringify({type:'conversation.item.create',item:{type:'function_call_output',call_id:e.call_id,output:JSON.stringify(r)}}));
  done().then(function(){if(ws&&ws.readyState===1)ws.send(JSON.stringify({type:'response.create'}))})})}
function sendText(t){tr.push('Клиент (текст): '+t);ws.send(JSON.stringify({type:'conversation.item.create',item:{type:'message',role:'user',content:[{type:'input_text',text:t}]}}));ws.send(JSON.stringify({type:'response.create'}))}
var pre=null;function clk(){var d=new Date(),z='';try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(x){}return{h:d.getHours(),mi:d.getMinutes(),tz:z}}

function prefetch(){if(pre&&Date.now()-pre.at<200000)return pre.p;var p=post('session',{clock:clk()});pre={at:Date.now(),p:p};p.then(function(j){if(!j||!j.ok)pre=null},function(){pre=null});return p}
function takeSession(){var p=pre&&Date.now()-pre.at<200000?pre.p:post('session',{clock:clk()});pre=null;return p}
function chime(){try{var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(660,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(990,ctx.currentTime+0.18);g.gain.setValueAtTime(0.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.06,ctx.currentTime+0.04);g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.35);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.4)}catch(x){}}
var t0=0,firstAudio=false,sendAudio=false;
function start(api){UI=api;if(live||ws)return;
 consent().then(function(){
  // в обработчике нажатия: AudioContext (iOS Safari), звук подключения
  ctx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:24000});try{ctx.resume()}catch(x){}
  dest=ctx.createMediaStreamDestination();chime();
  t0=performance.now();firstAudio=false;UI.setState('thinking');report('start',location.pathname);
  var micP=navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}}).then(function(m){mic=m;wireMic();return m},function(err){report('mic',err.name+': '+err.message);UI.say('Разрешите доступ к микрофону, чтобы я вас слышала. Пока можно написать текстом.');return null});
  takeSession().then(function(j){sess=j;if(!j||!j.ok){var er=new Error(j&&j.error);er.stage='session';throw er}
   var urls=String(C.ws||'wss://api.x.ai/v1/realtime').split(',');(function conn(i){var w=ws=new WebSocket(urls[i].trim()+'?model='+encodeURIComponent(sess.model),['xai-client-secret.'+sess.token]);var to=setTimeout(function(){if(!live&&ws===w&&urls[i+1]){report('ws-timeout',urls[i]);w.onerror=w.onclose=null;try{w.close()}catch(x){}conn(i+1)}},7000);
   ws.onopen=function(){clearTimeout(to);live=true;tOpen=Date.now();tr=[];lastPhone='';lastCrm='';act();turns=0;wrapped=false;closing=false;
    hardT=setTimeout(function(){bye('Мне пора закругляться — спасибо за разговор! Если что, пишите нам в Telegram или MAX, всегда рады помочь. Всего доброго!')},480000);
    idleT=setInterval(function(){if(!live||closing||srcs.length)return;var idle=Date.now()-lastAct;if(idle>30000&&!idleWarned){idleWarned=true;lastAct=Date.now()-15000;ws.send(JSON.stringify({type:'response.create',response:{instructions:'Человек молчит. Одной короткой тёплой фразой спросите, на связи ли он.'}}))}else if(idle>30000&&idleWarned){bye('Кажется, вы отошли — не буду занимать время. Возвращайтесь, когда будет удобно. Всего доброго!')}},3000);report('ws-open',Math.round(performance.now()-t0)+'ms');ws.send(JSON.stringify({type:'session.update',session:sess.session}));
    if(pendingText){sendText(pendingText);pendingText=null}else ws.send(JSON.stringify({type:'response.create'}))};
   ws.onmessage=function(m){try{on(JSON.parse(m.data))}catch(x){}};
   ws.onerror=function(){if(ws!==w)return;clearTimeout(to);if(!live&&urls[i+1]){report('ws-fail',urls[i]);w.onclose=null;conn(i+1);return}report('ws-error',live?'after-open':'no-open');if(!live){UI.say('Не получилось подключиться к голосу. Можно написать мне текстом или в Telegram/MAX.');UI.setState('idle')}};
   ws.onclose=function(ev){report('ws-close','code '+ev.code);stop()}})(0)})
  .catch(function(err){report(err.stage||'start',(err.name||'')+': '+(err.message||''));UI.setState('idle');UI.say('Не получилось подключиться. Можно оставить телефон — менеджер перезвонит.');if(UI.showHandoff)UI.showHandoff()});
 },function(){UI.setState('idle')})}
function bye(text){if(closing||!ws||ws.readyState!==1)return stop();closing=true;report('auto-end',text.slice(0,30));ws.send(JSON.stringify({type:'conversation.item.create',item:{type:'force_message',role:'assistant',interruptible:false,content:[{type:'output_text',text:text}]}}));setTimeout(function(){if(live)stop()},15000)}
function wireMic(){var src=ctx.createMediaStreamSource(mic);src.connect(dest);
 var mt=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].filter(function(m){return window.MediaRecorder&&MediaRecorder.isTypeSupported(m)})[0];
 try{rec=new MediaRecorder(dest.stream,mt?{mimeType:mt}:{});chunks=[];rec.ondataavailable=function(e){if(e.data.size)chunks.push(e.data)};rec.start(1000);upSeq=0;upIdx=0;upBusy=false;learnSent=false;clearInterval(upT);upT=setInterval(function(){upFlush(false)},12000)}catch(x){rec=null}
 proc=ctx.createScriptProcessor(4096,1,1);var g=ctx.createGain();g.gain.value=0;src.connect(proc);proc.connect(g);g.connect(ctx.destination);
 proc.onaudioprocess=function(e){if(ws&&ws.readyState===1)ws.send(JSON.stringify({type:'input_audio_buffer.append',audio:b64(pcm(e.inputBuffer.getChannelData(0),ctx.sampleRate))}))}}
function stop(){if(!live&&!ws)return;clearTimeout(hardT);clearInterval(idleT);if(tOpen){var d=Math.round((Date.now()-tOpen)/1000);report('session-end',d+'s ~$'+(d/60*0.08).toFixed(2)+' turns '+turns);sendLearn(d,unloading?'unload':(closing?'normal':'abnormal'));tOpen=0}clearInterval(upT);live=false;mic=mic||null;try{ws&&ws.close()}catch(x){}ws=null;try{proc&&proc.disconnect()}catch(x){}hush();if(mic)mic.getTracks().forEach(function(t){t.stop()});mic=null;
 if(rec&&rec.state!=='inactive'){if(unloading){try{rec.requestData()}catch(x){}upFlush(true);try{rec.stop()}catch(x){}}else{rec.onstop=function(){var w=0;(function fin(){if(upBusy&&w++<40)return setTimeout(fin,250);upFlush(false)})()};rec.stop()}}
 setTimeout(function(){try{ctx&&ctx.close()}catch(x){}},600);if(UI)UI.setState('idle')}
function altLinks(){var p=document.querySelector('#emilia-voice .emv-panel'),f=p&&p.querySelector('.emv-foot');if(!p||p.querySelector('.emv-alt'))return;var d=document.createElement('div');d.className='emv-alt';d.innerHTML='<a href="https://t.me/ElectroHUB_consult_bot" target="_blank" rel="noopener">Написать в Telegram</a><a href="https://max.ru/id770500837792_2_bot" target="_blank" rel="noopener">Написать в MAX</a>';if(f)f.parentNode.insertBefore(d,f);else p.appendChild(d);}
function watchOpen(){var p=document.querySelector('#emilia-voice .emv-panel');if(!p)return setTimeout(watchOpen,300);altLinks();var orb=p.querySelector('.emv-bigwrap');if(orb){orb.style.cursor='pointer';orb.addEventListener('click',function(){var m=p.querySelector('[data-emv-mic]');if(m)m.click()})}
 var fab=document.querySelector('#emilia-voice .emv-fab');if(fab){fab.addEventListener('pointerenter',function(){prefetch()},{once:true})}
 new MutationObserver(function(){var o=p.classList.contains('is-open');document.body.classList.toggle('emv-open',o);if(o&&!live)prefetch()}).observe(p,{attributes:true,attributeFilter:['class']});}
function toTop(){if(document.querySelector('.eh-totop'))return;var b=document.createElement('button');b.type='button';b.className='eh-totop';b.setAttribute('aria-label','Наверх');b.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';b.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};document.body.appendChild(b);
 var tick=false;window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){b.classList.toggle('on',window.scrollY>600);tick=false})},{passive:true})}
window.addEventListener('pagehide',function(){unloading=true;stop()});document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&live){upFlush(true);if(tOpen&&!learnSent&&tr.length){var u=unloading;unloading=true;sendLearn(Math.round((Date.now()-tOpen)/1000),'hidden');learnSent=false;unloading=u}}});document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&live){setTimeout(function(){if(document.visibilityState==='hidden')stop()},20000)}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){toTop()});else toTop();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watchOpen);else setTimeout(watchOpen,0);
window.EMILIA_CONFIG=Object.assign(window.EMILIA_CONFIG||{},{demo:false,useMic:false,privacyUrl:C.privacy||'/privacy/',
 onStart:function(api){start(api)},onStop:function(){stop()},
 onUserText:function(t,api){UI=api;if(live&&ws&&ws.readyState===1)sendText(t);else{pendingText=t;start(api)}},
 onLead:function(d){post('order',{id:'',args:{name:d.name||'',phone:d.phone||'',items:[],comment:'Передача менеджеру из кнопки Эмилии'+(d.channel?' · связь: '+d.channel:'')+(d.recommended?' · подобрано: '+d.recommended:'')},transcript:(d.transcript||[]).join?d.transcript.join('\n'):String(d.transcript||'')}).catch(function(){})}});
})();

;/* Electro HUB · Голосовой ассистент «Эмилия» · v1.0
   Подключение: <link emilia.css> + <script emilia.js>. Настройки — window.EMILIA_CONFIG до подключения скрипта.
   Голосовой движок (ASR/LLM/TTS) подключается через хуки onStart/onStop/onUserText; без них работает демо-режим. */
(function(){
'use strict';
if (window.Emilia) return;
var CFG = Object.assign({
  demo: true,                 // демо-сценарий без бэкенда
  useMic: true,               // реальная волна от микрофона (если разрешён)
  crmEndpoint: null,          // POST JSON лида, напр. 'https://www.electro-hub.ru/wp-json/eh/v1/lead'
  privacyUrl: '/privacy/',
  onStart: null, onStop: null, onUserText: null, onLead: null
}, window.EMILIA_CONFIG || {});

var I = {
  mic:'<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  kb:'<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M7 14h10"/></svg>',
  person:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  send:'<svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  wave:'<svg viewBox="0 0 24 24"><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10.5v3M21 12h0"/></svg>'
};
function orb(){return '<span class="emv-orb" aria-hidden="true"><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i></span>';}
function wave(n){var s='<span class="emv-wave" aria-hidden="true">';for(var i=0;i<n;i++)s+='<b></b>';return s+'</span>';}

var root=document.createElement('div');root.className='emv';root.id='emilia-voice';
var bars='';for(var i=0;i<34;i++)bars+='<b></b>';
root.innerHTML=
'<button type="button" class="emv-chip" data-emv-open aria-hidden="true" tabindex="-1">'+wave(4)+'Поговорите с Эмилией</button>'+
'<button type="button" class="emv-fab" data-emv-open aria-haspopup="dialog" aria-expanded="false" aria-controls="emv-panel" aria-label="Поговорите с Эмилией — голосовой ассистент Electro HUB">'+
 '<span class="emv-orbwrap">'+orb()+'<span class="emv-ring"></span><span class="emv-ring r2"></span><span class="emv-ring r3"></span></span>'+
 '<span class="emv-txt"><span class="emv-t1">Поговорите с Эмилией</span><span class="emv-t2"><span class="emv-live"></span><span class="emv-hint">Голосовой ассистент · онлайн</span></span></span>'+
 wave(6)+'<span class="emv-mic">'+I.mic+'</span></button>'+
'<section class="emv-panel emv-s-idle emv-m-voice" id="emv-panel" role="dialog" aria-modal="false" aria-label="Голосовой ассистент Эмилия">'+
 '<header class="emv-head">'+orb()+'<div class="emv-hgrow"><div class="emv-hname">Эмилия</div><div class="emv-hsub">Голосовой ассистент Electro HUB</div></div>'+
  '<span class="emv-badge"><span class="emv-live"></span>на связи</span><button type="button" class="emv-ibtn" data-emv-close aria-label="Закрыть">'+I.x+'</button></header>'+
 '<div class="emv-stage">'+
  '<div class="emv-bigwrap"><span class="emv-halo h1"></span><span class="emv-halo h2"></span><span class="emv-halo h3"></span>'+orb()+'<span class="emv-arc"></span></div>'+
  '<div class="emv-statelbl"><i></i><span data-emv-lbl>Готова к разговору</span></div>'+
  '<div class="emv-bars" aria-hidden="true">'+bars+'</div>'+
  '<div class="emv-caption" aria-live="polite" data-emv-cap><span class="emv-who">Эмилия</span>Здравствуйте! Я Эмилия. Расскажите про ваш участок — подберём робота вместе.</div>'+
 '</div>'+
 '<div class="emv-chat" data-emv-chat aria-live="polite"></div>'+
 '<div class="emv-chips" data-emv-chips><button type="button">Газон</button><button type="button">Снег и круглый год</button><button type="button">Есть склоны</button></div>'+
 '<div class="emv-handbar"><span>Удобнее с менеджером? Он свяжется в удобный вам канал</span><button type="button" data-emv-hand>Получить</button></div>'+
 '<div class="emv-ctrl"><button type="button" class="emv-cbtn" data-emv-mode aria-label="Написать текстом">'+I.kb+'</button>'+
  '<button type="button" class="emv-bigmic" data-emv-mic aria-label="Начать говорить">'+I.mic+'</button>'+
  '<button type="button" class="emv-cbtn" data-emv-hand aria-label="Позвать менеджера">'+I.person+'</button></div>'+
 '<form class="emv-input" data-emv-form><input type="text" placeholder="Напишите Эмилии…" aria-label="Сообщение для Эмилии" autocomplete="off"><button type="button" class="emv-cbtn" data-emv-mode aria-label="Вернуться к голосу" style="width:40px;height:40px">'+I.mic+'</button><button class="emv-send" aria-label="Отправить">'+I.send+'</button></form>'+
 '<p class="emv-foot">Разговор помогает подобрать технику. Начиная разговор, вы соглашаетесь с <a href="'+CFG.privacyUrl+'" target="_blank" rel="noopener">обработкой данных</a>.</p>'+
 '<div class="emv-hand" data-emv-handpanel><form data-emv-lead><h3>Передам ваш запрос менеджеру</h3><p>Он пришлёт актуальную цену, наличие и сроки по подобранным моделям и ответит на вопросы по монтажу.</p>'+
  '<div class="emv-sum" data-emv-sum></div>'+
  '<input class="emv-field" name="name" placeholder="Как к вам обращаться" autocomplete="name"><input class="emv-field" name="phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel">'+
  '<div class="emv-seg" data-emv-seg><button type="button" class="on">Звонок</button><button type="button">Telegram</button><button type="button">MAX</button></div>'+
  '<button class="emv-primary" type="submit">Получить цену и наличие</button></form>'+
  '<div class="emv-ok">'+orb()+'<h3>Спасибо! Запрос у менеджера</h3><p>Он свяжется с вами в рабочее время: ежедневно с 9:00 до 21:00 по Москве.</p><button type="button" class="emv-primary" data-emv-closehand style="background:#2a2a30;box-shadow:none">Вернуться к разговору</button></div></div>'+
'</section>';
(document.body||document.documentElement).appendChild(root);

var $=function(s){return root.querySelector(s)}, $$=function(s){return root.querySelectorAll(s)};
var fab=$('.emv-fab'), chip=$('.emv-chip'), panel=$('.emv-panel'), cap=$('[data-emv-cap]'), lbl=$('[data-emv-lbl]'), chat=$('[data-emv-chat]'), barEls=$$('.emv-bars b'), orbs=$$('.emv-orb'), hand=$('[data-emv-handpanel]');
var LBL={idle:'Готова к разговору',listening:'Слушаю',thinking:'Подбираю ответ',speaking:'Эмилия говорит'};
var state='idle', mode='voice', analyser=null, micData=null, stream=null, t0=performance.now();

function setState(s){state=s;panel.className=panel.className.replace(/emv-s-\w+/,'emv-s-'+s);lbl.textContent=LBL[s]||'';
  $('[data-emv-mic]').setAttribute('aria-label',s==='listening'?'Остановить':'Начать говорить');}
function setMode(m){mode=m;panel.className=panel.className.replace(/emv-m-\w+/,'emv-m-'+m);if(m==='text'){if(!chat.children.length&&!CFG.onUserText)botSay(BOT.greet());setTimeout(function(){$('[data-emv-form] input').focus()},50);stopMic();setState('idle');}}
function open(){panel.classList.add('is-open');fab.setAttribute('aria-expanded','true');fab.classList.add('is-hidden');chip.classList.add('is-hidden');setTimeout(function(){$('[data-emv-mic]').focus()},60);}
function close(){panel.classList.remove('is-open');fab.setAttribute('aria-expanded','false');fab.classList.remove('is-hidden');stopMic();stopDemo();setState('idle');fab.focus();}

/* caption */
var wordTimer=null;
function caption(text,who){clearInterval(wordTimer);cap.classList.toggle('user',who==='user');
  var head='<span class="emv-who">'+(who==='user'?'Вы':'Эмилия')+'</span>';
  if(who==='user'){cap.innerHTML=head+esc(text);return;}
  var ws=text.split(' ');cap.innerHTML=head+ws.map(function(w){return '<span class="w">'+esc(w)+'</span>'}).join(' ');
  var spans=cap.querySelectorAll('.w'),k=0;wordTimer=setInterval(function(){if(k>=spans.length){clearInterval(wordTimer);return;}spans[k++].classList.add('on');},210);}
function captionAll(text){caption(text,'emilia');clearInterval(wordTimer);cap.querySelectorAll('.w').forEach(function(s){s.classList.add('on')});}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* waveform */
function tick(now){var t=(now-t0)/1000,n=barEls.length,amp=0;
  var md=null;if(analyser&&state==='listening'){analyser.getByteFrequencyData(micData);md=micData;}
  for(var i=0;i<n;i++){var x=i/(n-1),env=Math.sin(Math.PI*x),h;
    if(state==='listening'){h=md?(md[2+i*2]/255):(.18+.55*Math.abs(Math.sin(t*3.1+i*.55)*Math.sin(t*1.7+i*.23))*(.6+.4*Math.sin(t*.9)));h=.08+h*env;}
    else if(state==='speaking'){var syl=.5+.5*Math.sin(t*9.5),phr=.55+.45*Math.sin(t*1.3);h=.1+env*(.25+.6*Math.abs(Math.sin(t*6+i*.42))*syl*phr);}
    else if(state==='thinking'){h=.08+.18*Math.max(0,Math.sin(t*5-i*.45));}
    else{h=.06+.05*(1+Math.sin(t*1.6+i*.35))*env;}
    barEls[i].style.height=Math.round(Math.min(1,h)*100)+'%';amp+=h;}
  amp=state==='speaking'||state==='listening'?Math.min(1,amp/n*1.6):0;
  orbs.forEach(function(o){o.style.setProperty('--amp',amp.toFixed(3))});panel.style.setProperty('--amp',amp.toFixed(3));
  requestAnimationFrame(tick);}
requestAnimationFrame(tick);

/* mic */
function startMic(){if(!CFG.useMic||!navigator.mediaDevices||analyser)return Promise.resolve();
  return navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){stream=s;var AC=window.AudioContext||window.webkitAudioContext,ac=new AC();
    analyser=ac.createAnalyser();analyser.fftSize=256;micData=new Uint8Array(analyser.frequencyBinCount);ac.createMediaStreamSource(s).connect(analyser);}).catch(function(){});}
function stopMic(){if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null;analyser=null;}}

/* ---------- DEMO VOICE SCRIPT (без бэкенда) ---------- */
var DEMO=[
 ['user','Здравствуйте. Хочу робота-газонокосилку, участок у нас за городом.'],
 ['emilia','Здравствуйте! С удовольствием помогу. Расскажите, какой примерно участок по площади и какой он — ровный или есть склоны?'],
 ['user','Соток двадцать, частично под уклоном. И зимой снег на подъездной дорожке — замучились чистить.'],
 ['emilia','Понимаю, снег — это отдельная история. Раз нужна помощь и летом, и зимой, я бы посмотрела не на отдельную косилку, а на Yarbo: один гусеничный робот, на который ставятся модули — косилка, снегоуборщик, воздуходувка для листвы. А в каком вы регионе?'],
 ['user','Подмосковье, Истринский район.'],
 ['emilia','Отлично, туда менеджер подскажет и по доставке, и по монтажу. Хотите, я передам ему ваши вводные — он пришлёт актуальную цену и наличие на Yarbo с модулями косилки и снегоуборщика?']
];
var demoTimers=[],demoIdx=0;
function stopDemo(){demoTimers.forEach(clearTimeout);demoTimers=[];}
function later(fn,ms){demoTimers.push(setTimeout(fn,ms));}
function typeUser(text,done){var i=0;setState('listening');(function step(){i+=Math.max(1,Math.round(text.length/26));caption(text.slice(0,i)+(i<text.length?'…':''),'user');if(i<text.length)later(step,110);else later(done,600);})();}
function runDemo(){stopDemo();if(demoIdx>=DEMO.length){demoIdx=0;}
  var turn=DEMO[demoIdx];
  if(turn[0]==='user'){typeUser(turn[1],function(){demoIdx++;setState('thinking');later(runDemo,1300);});}
  else{setState('speaking');caption(turn[1],'emilia');later(function(){demoIdx++;if(demoIdx<DEMO.length)runDemo();else{setState('idle');$('[data-emv-hand]').focus();}},turn[1].split(' ').length*210+900);}}

function micClick(){
  if(state==='listening'||state==='speaking'||state==='thinking'){stopDemo();stopMic();setState('idle');if(CFG.onStop)CFG.onStop();return;}
  startMic();if(CFG.onStart){setState('listening');CFG.onStart(api);}else if(CFG.demo){runDemo();}else setState('listening');}

/* ---------- TEXT FALLBACK: лёгкий локальный диалог-квалификатор (демо) ---------- */
var L={tasks:[],area:null,terrain:null,trees:null,region:null,budget:null,asked:null,rec:null};
var BOT={
 greet:function(){return 'Здравствуйте! Я Эмилия из Electro HUB. Расскажите, что хочется доверить роботу: газон, снег, листву — или всё сразу?';},
 ask:{tasks:'Что важнее всего доверить роботу — только газон или ещё снег и листву осенью?',
  area:'А какой примерно участок по площади? Можно в сотках, приблизительно.',
  terrain:'Участок ровный или есть склоны, перепады, неровности?',
  trees:'Много ли на участке деревьев, построек, узких проходов между зонами?',
  region:'Подскажите, в каком вы регионе? От этого зависит снежный сезон и выезд на монтаж.',
  budget:'И последнее: вам комфортнее оптимальное решение именно под эту задачу или с запасом возможностей на будущее?'}
};
function parse(t){var s=t.toLowerCase(),m;
 if(/сн[её]г|зим|сугроб/.test(s))add('snow');if(/лист|осен/.test(s))add('leaves');if(/газон|трав|кос/.test(s))add('lawn');if(/кругл|весь год|все сезон|всё сразу|все сразу/.test(s)){add('lawn');add('snow');add('leaves');}
 if((m=s.match(/(\d+[.,]?\d*)\s*(сот|га|гект|м2|м²|кв|квадрат|метр)/))){var v=parseFloat(m[1].replace(',','.'));L.area=/сот/.test(m[2])?v*100:/^г/.test(m[2])?v*10000:v;}
 else if(L.asked==='area'&&(m=s.match(/(\d+[.,]?\d*)/))){var v2=parseFloat(m[1].replace(',','.'));L.area=v2<100?v2*100:v2;}
 if(/крут|сильн(ый|ые)? (уклон|склон)|овраг|холм|горк/.test(s))L.terrain='steep';else if(/склон|уклон|перепад|неровн|кочк|рельеф/.test(s))L.terrain=L.terrain||'slope';else if(/ровн|плоск|гладк/.test(s))L.terrain='flat';
 if(/немного|мало|почти нет|^нет|открыт|не много/.test(s)&&(L.asked==='trees'||/дерев|постро/.test(s)))L.trees=false;else if(/дерев|сад|постро|клумб|тень|сосн|ёлк|елк|кустар|узк/.test(s))L.trees=true;
 if(L.asked==='region'&&!L.region&&s.length>1)L.region=t.trim();else if(!L.region&&(m=t.match(/(Москв\S*|Подмосков\S*|Петербург\S*|СПб|Ленинград\S*|Казан\S*|Краснодар\S*|Екатеринбург\S*|Новосибирск\S*|Сочи|[А-ЯЁ][а-яё]+ск(?:ая|ий)? област\S*)/)))L.region=m[1];
 if(/оптим|эконом|разумн|недорог|под задач/.test(s))L.budget='optimal';else if(/запас|максим|лучш|топ|премиум|будущ/.test(s))L.budget='max';else if(L.asked==='budget'&&s.length>1)L.budget='balanced';
 if(L.asked==='tasks'&&!L.tasks.length&&/тольк|газон/.test(s))add('lawn');
 function add(x){if(L.tasks.indexOf(x)<0)L.tasks.push(x);} }
function recommend(){var snow=L.tasks.indexOf('snow')>=0,leaves=L.tasks.indexOf('leaves')>=0,a=L.area||0,r={};
 if(snow||leaves){var mods=['косилка'];if(snow)mods.push('снегоуборщик');if(leaves)mods.push('воздуходувка');
  r.primary='Yarbo Core с модулями: '+mods.join(', ');r.alt=null;
  r.why='Раз задачи не только летние, логичнее один гусеничный робот на все сезоны: модули меняются без инструментов за пару минут, а карта участка хранится в самом роботе.'+(L.terrain==='steep'&&snow?' Один нюанс: по снегу допустимый уклон меньше, чем по траве, — это менеджер проверит по плану вашего участка.':'');}
 else if(L.terrain==='steep'||L.terrain==='slope'&&a>1500){r.primary='Lymow One Plus';r.alt='Yarbo Core с модулем косилки — если захотите потом добавить снег';
  r.why='У него гусеничное шасси — оно рассчитано как раз на склоны и неровный рельеф, где колёсным роботам сложнее.';}
 else if(L.trees){r.primary='Hookii Neomow';r.alt=a&&a<=600?'RoboUP Raccoon 2SE':'Lymow One Plus, если склоны окажутся круче';
  r.why='Среди деревьев и построек важна навигация: у Hookii лидар вместе с камерой, такая связка обычно увереннее чувствует себя там, где спутниковый сигнал перекрыт.';}
 else if(a&&a<=600){r.primary='RoboUP Raccoon 2SE';r.alt='Hookii Neomow — если хочется запас по площади';
  r.why='Для небольшого ровного газона это компактное и очень понятное решение, без лишнего. Наши покупатели его часто хвалят за простую настройку.';}
 else{r.primary='Hookii Neomow (линейка X2)';r.alt=L.terrain==='slope'?'Lymow One Plus':'Yarbo Core с косилкой — если интересен снег зимой';
  r.why='Для просторного газона без сложного рельефа это сбалансированный вариант: без провода, с лидаром и камерой.';}
 if(L.budget==='max'&&!snow&&!leaves)r.alt='Yarbo Core с модулем косилки — с запасом: зимой к нему можно добавить снегоуборщик';
 return r;}
function next(){var order=['tasks','area','terrain','trees','region','budget'];
 for(var i=0;i<order.length;i++){var k=order[i];if(k==='tasks'&&L.tasks.length)continue;if(k==='trees'&&(L.trees!==null||L.tasks.indexOf('snow')>=0&&L.tasks.indexOf('lawn')<0))continue;if(k!=='tasks'&&k!=='trees'&&L[k])continue;L.asked=k;return BOT.ask[k];}
 L.asked='offer';L.rec=recommend();
 return 'Спасибо, картина понятная. Я бы предложила '+L.rec.primary+'. '+L.rec.why+(L.rec.alt?' Как альтернативу можно рассмотреть: '+L.rec.alt+'.':'')+' Хотите, передам ваши вводные менеджеру — он пришлёт актуальную цену и наличие?';}
var ACK=['Поняла.','Хорошо, записала.','Ясно, спасибо.','Поняла вас.'];
function reply(t){var s=t.toLowerCase();
 if(/цен|стоит|стоимост|сколько.*(руб|денег)|прайс|скидк|дорог/.test(s)){var nq=L.asked==='offer'?'Передать ему ваш запрос?':next();return 'Цены и наличие меняются, поэтому не хочу называть цифру наугад — менеджер пришлёт актуальные по подобранным моделям. '+(L.asked==='offer'?nq:'А пока давайте точнее подберём. '+nq);}
 if(L.asked==='offer'&&/^(да|давай|хорош|ок|конечн|соглас|передай|можно)/.test(s)){setTimeout(showHand,700);return 'Отлично, открываю короткую форму — оставьте, пожалуйста, имя и телефон.';}
 if(/менеджер|человек|оператор|позвон/.test(s)){setTimeout(showHand,700);return 'Конечно, подключу менеджера. Оставьте, пожалуйста, контакт — я передам ему всё, что мы уже обсудили.';}
 parse(t);var q=next();return (L.asked==='offer'?'':ACK[Math.floor(Math.random()*ACK.length)]+' ')+q;}
function msg(text,cls){var d=document.createElement('div');d.className='emv-msg '+cls;d.textContent=text;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return d;}
function botSay(text,delay){var ty=document.createElement('div');ty.className='emv-msg e typing';ty.innerHTML='<i></i><i></i><i></i>';chat.appendChild(ty);chat.scrollTop=chat.scrollHeight;
 setTimeout(function(){ty.remove();msg(text,'e');},delay||650);}
function userSend(text){text=(text||'').trim();if(!text)return;panel.classList.add('emv-chatting');msg(text,'u');if(CFG.onUserText){CFG.onUserText(text,api);return;}botSay(reply(text),500+Math.min(1400,text.length*12));}

/* ---------- HANDOFF / CRM ---------- */
var TL={lawn:'газон',snow:'снег',leaves:'листва'},TR={flat:'ровный',slope:'есть уклоны',steep:'крутые склоны'};
function lead(){return {source:'emilia_voice',page:location.href,ts:new Date().toISOString(),tasks:L.tasks,area_m2:L.area,terrain:L.terrain,obstacles:L.trees,region:L.region,budget_comfort:L.budget,recommended:L.rec&&L.rec.primary,alternative:L.rec&&L.rec.alt,transcript:[].map.call(chat.querySelectorAll('.emv-msg:not(.typing)'),function(m){return (m.classList.contains('u')?'Клиент: ':'Эмилия: ')+m.textContent})};}
function showHand(sum){var tags=sum||[];if(!sum){L.tasks.forEach(function(t){tags.push(TL[t])});if(L.area)tags.push('≈'+(L.area>=1000?(L.area/100).toFixed(0)+' сот.':L.area+' м²'));if(L.terrain)tags.push(TR[L.terrain]);if(L.region)tags.push(L.region);if(L.rec)tags.push(L.rec.primary.split(':')[0]);}
 $('[data-emv-sum]').innerHTML=tags.map(function(t){return '<span>'+esc(t)+'</span>'}).join('');hand.classList.remove('done');hand.classList.add('is-open');setTimeout(function(){hand.querySelector('input').focus()},300);}
$('[data-emv-seg]').addEventListener('click',function(e){if(e.target.tagName!=='BUTTON')return;[].forEach.call(this.children,function(b){b.classList.toggle('on',b===e.target)});});
$('[data-emv-lead]').addEventListener('submit',function(e){e.preventDefault();var f=e.target,d=lead();d.name=f.name.value;d.phone=f.phone.value;d.channel=f.querySelector('.emv-seg .on').textContent;
 if(CFG.onLead)CFG.onLead(d);if(CFG.crmEndpoint)fetch(CFG.crmEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).catch(function(){});hand.classList.add('done');});
root.addEventListener('click',function(e){var t=e.target.closest('[data-emv-open],[data-emv-close],[data-emv-mic],[data-emv-mode],[data-emv-hand],[data-emv-closehand],[data-emv-chips] button');if(!t)return;
 if(t.hasAttribute('data-emv-open'))open();else if(t.hasAttribute('data-emv-close'))close();else if(t.hasAttribute('data-emv-mic'))micClick();
 else if(t.hasAttribute('data-emv-mode'))setMode(mode==='voice'?'text':'voice');else if(t.hasAttribute('data-emv-hand'))showHand();else if(t.hasAttribute('data-emv-closehand'))hand.classList.remove('is-open');
 else {setMode('text');setTimeout(function(){userSend(t.textContent)},chat.children.length?0:900);}});
$('[data-emv-form]').addEventListener('submit',function(e){e.preventDefault();var inp=this.querySelector('input');userSend(inp.value);inp.value='';});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('is-open')){if(hand.classList.contains('is-open'))hand.classList.remove('is-open');else close();}});
document.addEventListener('mousedown',function(e){if(panel.classList.contains('is-open')&&!root.contains(e.target)&&window.innerWidth>640)close();});
setTimeout(function(){chip.classList.add('is-hidden')},12000);

var api={open:open,close:close,setState:setState,setMode:setMode,caption:caption,captionAll:captionAll,userCaption:function(t){caption(t,'user')},
 say:function(t){if(mode==='text')botSay(t);else{setState('speaking');caption(t,'emilia');}},userSaid:function(t){if(mode==='text')msg(t,'u');else caption(t,'user');},
 addMessage:function(t,who){msg(t,who==='user'?'u':'e');},showHandoff:showHand,hideHandoff:function(){hand.classList.remove('is-open')},
 handoffDone:function(){hand.classList.add('done')},demo:runDemo,stopDemo:stopDemo,hover:function(on){fab.classList.toggle('is-hover',on!==false)},hideChip:function(){chip.classList.add('is-hidden')},showChip:function(){chip.classList.remove('is-hidden')},lead:lead,_L:L};
window.Emilia=api;
})();

;
(function(){
  function kill(){
    try{
      document.querySelectorAll(".emv-chip, button.emv-chip, [data-emv-open].emv-chip").forEach(function(el){
        el.classList.add("is-hidden");
        el.setAttribute("hidden","hidden");
        el.setAttribute("aria-hidden","true");
        el.style.setProperty("display","none","important");
        el.style.setProperty("visibility","hidden","important");
        el.style.setProperty("opacity","0","important");
        el.style.setProperty("pointer-events","none","important");
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      if (window.EMILIA && typeof window.EMILIA === "object"){
        window.EMILIA.showChip = function(){};
        window.EMILIA.hideChip = function(){};
      }
    }catch(e){}
  }
  kill();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kill);
  window.addEventListener("load", kill);
  [0,50,200,600,1200,3000,6000,12000,13000].forEach(function(ms){ setTimeout(kill, ms); });
  try{
    var mo = new MutationObserver(function(){ kill(); });
    mo.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(function(){ try{ mo.disconnect(); }catch(e){} }, 20000);
  }catch(e){}
})();
