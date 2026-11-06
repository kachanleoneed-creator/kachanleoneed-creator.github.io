/* Service location map.
   Address: г. Москва, 1-я Магистральная ул., д. 4, стр. 1
   Marker: polygon centroid of OSM way 217668276 (building=industrial,
   addr:housenumber=4 с1, addr:street=1-я Магистральная улица).
   Cross-check: Nominatim 55.7685128, 37.5346690 (same way, ~3 m).
   Wide frame: zoom 12 keeps this point centered and includes Москва-Сити.
   Москва-Сити label: Nominatim commercial place 55.7489657, 37.5387342
   (2026-11-06). Esri Canvas Dark Gray tiles at zoom 12 show the district
   and the river but do not print that name, so the label is placed only
   at that verified point. Zoom stays inside Esri's 0–16 range; the tour
   uses 16 (close) and 12 (district). */
var EH_SVC = (function () {
  var LAT = '55.76850345';
  var LON = '37.53463488';
  var ADDRESS = 'г. Москва, 1-я Магистральная ул., д. 4, стр. 1';
  var HOURS = 'Пн–Сб 10:00–19:00';
  function goLink(tariff) {
    var url = 'https://3.redirect.appmetrica.yandex.com/route?end-lat=' + LAT + '&end-lon=' + LON;
    if (tariff) url += '&tariffClass=' + tariff;
    return url + '&lang=ru&ref=electrohub&appmetrica_tracking_id=25395763362139037';
  }
  return {
    lat: LAT,
    lon: LON,
    address: ADDRESS,
    hours: HOURS,
    osmWay: 217668276,
    nominatim: ['55.7685128', '37.5346690'],
    zoomNear: 16,
    zoomFar: 12,
    city: { name: 'Москва-Сити', lat: '55.7489657', lon: '37.5387342' },
    links: {
      twogis: 'https://2gis.ru/moscow/directions/points/%7C' + LON + '%2C' + LAT,
      delivery: goLink('express'),
      go: goLink('')
    }
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = EH_SVC;

(function () {
  if (typeof document === 'undefined') return;
  var root = document.querySelector('.eh-loc');
  var mapEl = document.getElementById('eh-svc-map');
  var fallback = document.getElementById('eh-map-fallback');
  var pauseBtn = document.getElementById('eh-map-pause');
  if (!root || !mapEl) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncReduce() { root.classList.toggle('eh-reduce', reduce.matches); }
  syncReduce();
  if (reduce.addEventListener) reduce.addEventListener('change', syncReduce);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        root.classList.toggle('is-off', !entry.isIntersecting);
      });
      syncPlay();
    }, { threshold: 0.05 });
    io.observe(root);
  }
  document.addEventListener('visibilitychange', function () {
    root.classList.toggle('eh-hold', document.hidden);
    syncPlay();
  });

  function showFallback() {
    if (fallback) fallback.hidden = false;
    mapEl.classList.add('is-fallback');
  }
  if (!window.L) { showFallback(); return; }

  var lat = +EH_SVC.lat;
  var lon = +EH_SVC.lon;
  var map = L.map(mapEl, {
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    attributionControl: true,
    zoomSnap: 1,
    zoomAnimation: true,
    fadeAnimation: true,
    minZoom: EH_SVC.zoomFar,
    maxZoom: EH_SVC.zoomNear
  }).setView([lat, lon], EH_SVC.zoomNear);
  map.attributionControl.setPrefix(false);
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();

  var base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    minZoom: EH_SVC.zoomFar,
    maxZoom: EH_SVC.zoomNear,
    attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, GIS User Community'
  }).addTo(map);
  var baseOk = 0;
  base.on('tileload', function () { baseOk += 1; if (fallback) fallback.hidden = true; });
  base.on('tileerror', function () { if (baseOk === 0) showFallback(); });
  setTimeout(function () { if (baseOk === 0) showFallback(); }, 8000);

  var logo = document.querySelector('img.logo');
  var logoSrc = logo && logo.src ? logo.src : '';
  var plate = logoSrc
    ? '<img alt="Electro HUB" src="' + logoSrc + '">'
    : '<span class="eh-pin__miss">Electro HUB</span>';
  L.marker([lat, lon], {
    icon: L.divIcon({
      className: 'eh-pin-wrap',
      html: '<div class="eh-pin"><div class="eh-pin__plate">' + plate + '</div><span class="eh-pin__stem"></span><span class="eh-pin__dot"><i></i></span></div>',
      iconSize: [156, 64],
      iconAnchor: [78, 62]
    }),
    keyboard: false,
    interactive: false,
    title: 'Electro HUB, ' + EH_SVC.address,
    alt: 'Electro HUB'
  }).addTo(map);

  L.marker([+EH_SVC.city.lat, +EH_SVC.city.lon], {
    icon: L.divIcon({
      className: 'eh-city-wrap',
      html: '<span class="eh-city">' + EH_SVC.city.name + '</span>',
      iconSize: [118, 22],
      iconAnchor: [59, 36]
    }),
    keyboard: false,
    interactive: false
  }).addTo(map);

  var playing = true;
  var phase = 'out';
  var timer = null;
  var running = false;
  function canPlay() {
    return playing && !reduce.matches && !document.hidden && !root.classList.contains('is-off');
  }
  function stopMotion() {
    running = false;
    if (timer) { clearTimeout(timer); timer = null; }
    if (map.stop) map.stop();
  }
  function step() {
    if (!canPlay()) { stopMotion(); return; }
    running = true;
    var target = phase === 'out' ? EH_SVC.zoomFar : EH_SVC.zoomNear;
    map.flyTo([lat, lon], target, { duration: 8, easeLinearity: 0.25 });
    timer = setTimeout(function () {
      if (!canPlay()) { stopMotion(); return; }
      phase = phase === 'out' ? 'in' : 'out';
      step();
    }, 9500);
  }
  function syncPlay() {
    if (!canPlay()) { stopMotion(); return; }
    if (running) return;
    step();
  }
  if (reduce.addEventListener) reduce.addEventListener('change', function () {
    syncReduce();
    if (reduce.matches) {
      stopMotion();
      map.setView([lat, lon], EH_SVC.zoomNear, { animate: false });
    } else syncPlay();
  });
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      playing = !playing;
      pauseBtn.setAttribute('aria-pressed', playing ? 'false' : 'true');
      pauseBtn.textContent = playing ? 'Пауза' : 'Обзор';
      if (playing) syncPlay();
      else stopMotion();
    });
  }
  map.whenReady(function () {
    setTimeout(function () { map.invalidateSize(); syncPlay(); }, 80);
  });
  window.addEventListener('resize', function () { map.invalidateSize(); });
})();
