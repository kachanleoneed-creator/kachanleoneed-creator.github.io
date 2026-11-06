/* Service location map.
   Address: г. Москва, 1-я Магистральная ул., д. 4, стр. 1
   Marker: polygon centroid of OSM way 217668276 (building=industrial,
   addr:housenumber=4 с1, addr:street=1-я Магистральная улица),
   computed from the way nodes on 2026-11-06.
   Cross-check: Nominatim 55.7685128, 37.5346690 (same way, ~3 m).
   2GIS directions for this address resolved 37.534635,55.768503
   and a public 2GIS firm pin at the same building is 55.768673, 37.534333.
   Roads: OpenStreetMap way geometries, API 0.6 map
   bbox 37.5295,55.7658,37.5405,55.7712, retrieved 2026-11-06.
   Each line is oriented toward the service and stops on the roadway.
   The glow is decorative. It is not a navigation route. */
var EH_SVC = (function () {
  var LAT = '55.76850345';
  var LON = '37.53463488';
  var ADDRESS = 'г. Москва, 1-я Магистральная ул., д. 4, стр. 1';
  var HOURS = 'Пн–Сб 10:00–19:00';
  var roads = [
    { id: 'svc', osm: '126638957', name: 'подъезд к дому 4 с1', weight: 3, dur: '2.7s',
      pts: [[55.7667772,37.5349152],[55.7668126,37.5350529],[55.7668394,37.5351632],[55.7670421,37.5352967],[55.7671006,37.5353020],[55.7672368,37.5352883],[55.7674819,37.5352563],[55.7677715,37.5351348],[55.7680317,37.5349932],[55.7681531,37.5348854],[55.7682299,37.5348416],[55.7682163,37.5346083],[55.7682766,37.5344473]] },
    { id: 'mag-se', osm: '761267022+23624714', name: '1-я Магистральная улица', weight: 2.2, dur: '3.6s',
      pts: [[55.7661935,37.5347649],[55.7664364,37.5348320],[55.7666746,37.5348913],[55.7667772,37.5349152]] },
    { id: 'mag-w', osm: '23624714', name: '1-я Магистральная улица', weight: 2.2, dur: '4.4s',
      pts: [[55.7681113,37.5290326],[55.7678022,37.5302503],[55.7676113,37.5309912],[55.7674685,37.5315694],[55.7673911,37.5319215],[55.7673489,37.5321135],[55.7672471,37.5325992],[55.7670718,37.5335990],[55.7669787,37.5341842],[55.7669598,37.5343310],[55.7669333,37.5345350],[55.7669156,37.5346712],[55.7668952,37.5347518],[55.7668526,37.5348451],[55.7667772,37.5349152]] },
    { id: 'zv-e', osm: '28053291+492156233', name: 'Звенигородское шоссе', weight: 2.4, dur: '3.3s',
      pts: [[55.7662047,37.5387719],[55.7664843,37.5362613],[55.7666665,37.5347360]] },
    { id: 'zv-w', osm: '1547429359', name: 'Звенигородское шоссе', weight: 2.4, dur: '3.9s',
      pts: [[55.7669159,37.5325979],[55.7668006,37.5335576],[55.7667875,37.5336726],[55.7666665,37.5347360]] },
    { id: 'tup', osm: '39224714', name: '1-й Магистральный тупик', weight: 2, dur: '4.8s',
      pts: [[55.7666259,37.5281809],[55.7666473,37.5286040],[55.7666605,37.5290188],[55.7666630,37.5292094],[55.7666641,37.5292910],[55.7666600,37.5295937],[55.7666244,37.5309077],[55.7666053,37.5312054],[55.7665574,37.5317231],[55.7664441,37.5326218],[55.7662920,37.5338280],[55.7662461,37.5341918],[55.7662311,37.5343111],[55.7662199,37.5344042],[55.7662082,37.5345261],[55.7661935,37.5347649]] }
  ];
  function goLink(tariff) {
    var url = 'https://3.redirect.appmetrica.yandex.com/route?end-lat=' + LAT + '&end-lon=' + LON;
    if (tariff) url += '&tariffClass=' + tariff;
    return url + '&lang=ru&ref=electrohub&appmetrica_tracking_id=25395763362139037';
  }
  var links = {
    twogis: 'https://2gis.ru/moscow/directions/points/%7C' + LON + '%2C' + LAT,
    delivery: goLink('express'),
    go: goLink('')
  };
  return {
    lat: LAT,
    lon: LON,
    address: ADDRESS,
    hours: HOURS,
    osmWay: 217668276,
    nominatim: ['55.7685128', '37.5346690'],
    roads: roads,
    links: links
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = EH_SVC;

(function () {
  if (typeof document === 'undefined') return;
  var root = document.querySelector('.eh-loc');
  var mapEl = document.getElementById('eh-svc-map');
  var fallback = document.getElementById('eh-map-fallback');
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
    }, { threshold: 0.05 });
    io.observe(root);
  }

  function showFallback() {
    if (fallback) fallback.hidden = false;
    mapEl.classList.add('is-fallback');
  }

  if (!window.L) { showFallback(); return; }

  var lat = +EH_SVC.lat;
  var lon = +EH_SVC.lon;
  var map = L.map(mapEl, {
    scrollWheelZoom: false,
    attributionControl: true,
    zoomControl: true,
    minZoom: 14,
    maxZoom: 16
  }).setView([lat, lon], 16);
  map.attributionControl.setPrefix(false);

  /* Public Esri Canvas Dark Gray raster. No token. Street labels are in the tiles. */
  var base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, GIS User Community'
  }).addTo(map);
  var baseOk = 0;
  base.on('tileload', function () { baseOk += 1; if (fallback) fallback.hidden = true; });
  base.on('tileerror', function () { if (baseOk === 0) showFallback(); });
  setTimeout(function () { if (baseOk === 0) showFallback(); }, 8000);

  map.on('focus', function () { map.scrollWheelZoom.enable(); });
  map.on('blur', function () { map.scrollWheelZoom.disable(); });

  EH_SVC.roads.forEach(function (road) {
    L.polyline(road.pts, {
      interactive: false,
      className: 'eh-road-base eh-road-base--' + road.id,
      weight: road.weight + 1.5,
      color: '#8d1a32',
      opacity: 0.55,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    L.polyline(road.pts, {
      interactive: false,
      className: 'eh-impulse eh-impulse--' + road.id,
      weight: road.weight,
      color: '#ff4b6a',
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
  });

  var logo = document.querySelector('img.logo');
  var logoSrc = logo && logo.src ? logo.src : '';
  var plate = logoSrc
    ? '<img alt="Electro HUB" src="' + logoSrc + '">'
    : '<span class="eh-pin__miss">Electro HUB</span>';
  var icon = L.divIcon({
    className: 'eh-pin-wrap',
    html: '<div class="eh-pin"><div class="eh-pin__plate">' + plate + '</div><span class="eh-pin__stem"></span><span class="eh-pin__dot"><i></i></span></div>',
    iconSize: [156, 64],
    iconAnchor: [78, 62],
    popupAnchor: [0, -66]
  });
  var marker = L.marker([lat, lon], {
    icon: icon,
    keyboard: true,
    title: 'Electro HUB, ' + EH_SVC.address,
    alt: 'Electro HUB'
  }).addTo(map);
  marker.bindPopup(
    '<strong>Electro HUB</strong><br>' + EH_SVC.address + '<br>' + EH_SVC.hours,
    { autoPan: false }
  );
  if (window.matchMedia('(min-width: 900px)').matches) marker.openPopup();

  map.whenReady(function () {
    setTimeout(function () { map.invalidateSize(); }, 60);
  });
  window.addEventListener('resize', function () { map.invalidateSize(); });
})();
