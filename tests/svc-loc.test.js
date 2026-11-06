'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const svc = require('../svc-loc.js');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'service.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'svc-loc.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'svc-loc.js'), 'utf8');

function hav(a, b) {
  const R = 6371000;
  const p1 = a[0] * Math.PI / 180;
  const p2 = b[0] * Math.PI / 180;
  const dp = (b[0] - a[0]) * Math.PI / 180;
  const dl = (b[1] - a[1]) * Math.PI / 180;
  const s = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function crossTrack(pts) {
  const lat0 = pts[0][0];
  const xy = pts.map(function (p) {
    return [(p[1] - pts[0][1]) * 111320 * Math.cos(lat0 * Math.PI / 180), (p[0] - pts[0][0]) * 111320];
  });
  const a = xy[0];
  const b = xy[xy.length - 1];
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const L = Math.hypot(vx, vy) || 1;
  let max = 0;
  xy.forEach(function (p) {
    const d = Math.abs((p[0] - a[0]) * vy - (p[1] - a[1]) * vx) / L;
    if (d > max) max = d;
  });
  return max;
}

const here = [+svc.lat, +svc.lon];
assert.strictEqual(svc.address, 'г. Москва, 1-я Магистральная ул., д. 4, стр. 1');
assert.strictEqual(svc.hours, 'Пн–Сб 10:00–19:00');
assert.strictEqual(svc.osmWay, 217668276);
assert.ok(hav(here, svc.nominatim.map(Number)) < 5, 'nominatim and centroid diverged');

assert.strictEqual(svc.zoomNear, 16);
assert.strictEqual(svc.zoomFar, 12);
assert.strictEqual(svc.city.name, 'Москва-Сити');
const city = [+svc.city.lat, +svc.city.lon];
const cityDist = hav(here, city);
assert.ok(cityDist > 1500 && cityDist < 3500, 'Moscow-City distance ' + cityDist);
const mpp = 156543.03392 * Math.cos(here[0] * Math.PI / 180) / Math.pow(2, svc.zoomFar);
assert.ok(150 * mpp > cityDist, 'zoom 12 keeps Moscow-City inside a 300px-tall map');
assert.ok(!js.includes('L.polyline'), 'road trails must not be drawn');
assert.ok(!/eh-impulse|eh-road-base|eh-flow/.test(js + css));
assert.ok(js.includes('dragging: false'));
assert.ok(js.includes('touchZoom: false'));
assert.ok(js.includes('doubleClickZoom: false'));
assert.ok(js.includes('scrollWheelZoom: false'));
assert.ok(js.includes('boxZoom: false'));
assert.ok(js.includes('keyboard: false'));
assert.ok(js.includes('zoomControl: false'));
assert.ok(js.includes('flyTo'));
assert.ok(css.includes('touch-action:pan-y'));
assert.ok(css.includes('pointer-events:none'));

assert.strictEqual(svc.links.twogis, 'https://2gis.ru/moscow/directions/points/%7C37.53463488%2C55.76850345');
assert.strictEqual(svc.links.delivery, 'https://3.redirect.appmetrica.yandex.com/route?end-lat=55.76850345&end-lon=37.53463488&tariffClass=express&lang=ru&ref=electrohub&appmetrica_tracking_id=25395763362139037');
assert.strictEqual(svc.links.go, 'https://3.redirect.appmetrica.yandex.com/route?end-lat=55.76850345&end-lon=37.53463488&lang=ru&ref=electrohub&appmetrica_tracking_id=25395763362139037');
Object.keys(svc.links).forEach(function (key) {
  const url = svc.links[key];
  assert.ok(!/start-lat|start-lon/.test(url), key + ' must not invent an origin');
  assert.ok(url.includes('55.76850345') && url.includes('37.53463488'), key);
  assert.ok(!/electro-drive|975-77-16|997-14-44|inbox\.ru/.test(url));
  assert.ok(!/^https:\/\/(taxi\.yandex\.ru|dostavka\.yandex\.ru|go\.yandex|yandex\.ru\/maps)\/?$/.test(url));
});
assert.ok(!svc.links.go.includes('tariffClass'));
assert.ok(svc.links.delivery.includes('tariffClass=express'));

const decoded = html.replace(/&amp;/g, '&');
assert.ok(decoded.includes(svc.links.twogis));
assert.ok(decoded.includes(svc.links.delivery));
assert.ok(decoded.includes(svc.links.go));
assert.strictEqual((html.match(/class="eh-act /g) || []).length, 3);
assert.ok(html.includes('>2ГИС<'));
assert.ok(html.includes('>Яндекс Доставка<'));
assert.ok(html.includes('>Яндекс Go<'));
assert.ok(html.includes('tel:+79771221280'));
assert.ok(html.includes('hello@electro-hub.ru'));
assert.ok(html.includes('https://t.me/electrohubnews'));
assert.ok(html.includes('https://max.ru/electrohubnews'));
assert.ok(!html.includes('вл4с7'));
assert.ok(!/electro-drive|975-77-16|997-14-44|inbox\.ru/i.test(html));
assert.ok(html.includes('id="location"'));
assert.ok(html.includes('svc-loc.css'));
assert.ok(html.includes('svc-loc.js'));
assert.ok(html.includes('leaflet.js'));
assert.ok(js.includes("querySelector('img.logo')"));
assert.ok(!/invented|placeholder-logo|secret shop/i.test(js));
assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(css.includes('animation-play-state:paused'));
assert.ok(css.includes('@keyframes eh-pulse'));
assert.ok(!html.includes('Свечение на улицах'));
assert.ok(!html.includes('eh-note'));
assert.ok(html.includes('media/brands/2gis.png'));
assert.ok(html.includes('media/brands/yandex-delivery.svg'));
assert.ok(html.includes('media/brands/yandex-go.png'));
assert.ok(html.includes('id="eh-map-pause"'));
assert.ok(js.includes('Москва-Сити') || html.includes('Москва-Сити') || js.includes("city.name"));
['Esri', 'HERE', 'Garmin', 'FAO', 'NOAA', 'USGS', 'OpenStreetMap'].forEach(function (credit) {
  assert.ok(js.includes(credit), 'missing attribution credit ' + credit);
});
assert.ok(fs.existsSync(path.join(root, 'media/brands/2gis.png')));
assert.ok(fs.existsSync(path.join(root, 'media/brands/yandex-go.png')));
assert.ok(fs.existsSync(path.join(root, 'media/brands/yandex-delivery.svg')));
assert.ok(js.includes('World_Dark_Gray_Base'));
assert.ok(!js.includes('cartocdn.com'), 'CARTO tiles require an API key and watermark the map');
assert.ok(!/[?&](api[_-]?key|apikey|token)=/i.test(js));

const chunk = html.slice(html.indexOf('class="eh-loc"'), html.indexOf('id="location"') + 8000);
const loc = html.slice(html.indexOf('<section class="eh-loc"'), html.indexOf('</section>', html.indexOf('<section class="eh-loc"')) + 10);
let depth = 0;
loc.replace(/<\/?div\b[^>]*>/g, function (tag) {
  depth += tag[1] === '/' ? -1 : 1;
  assert.ok(depth >= 0, 'div underflow');
  return tag;
});
assert.strictEqual(depth, 0, 'location block divs are unbalanced: ' + depth);

console.log('svc-loc tests passed');
console.log('moscow-city m', cityDist.toFixed(0));
