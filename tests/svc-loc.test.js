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

assert.ok(svc.roads.length >= 5);
let bent = 0;
svc.roads.forEach(function (road) {
  assert.ok(road.pts.length >= 2, road.id);
  assert.ok(road.osm, road.id);
  const start = hav(road.pts[0], here);
  const end = hav(road.pts[road.pts.length - 1], here);
  assert.ok(end < start, road.id + ' should travel toward the service, ' + start + ' -> ' + end);
  road.pts.forEach(function (p, i) {
    assert.ok(hav(p, here) < 1200, road.id + ' point far from the building');
    if (i) assert.notDeepStrictEqual(p, road.pts[i - 1]);
  });
  if (road.pts.length >= 3 && crossTrack(road.pts) > 12) bent += 1;
});
assert.ok(bent >= 2, 'expected bent real-road polylines, got ' + bent);
const access = svc.roads.find(function (r) { return r.id === 'svc'; });
const accessEnd = hav(access.pts[access.pts.length - 1], here);
assert.ok(accessEnd < 40 && accessEnd > 8, 'access road should stop beside the building, not on a ray into it: ' + accessEnd);

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
assert.ok(css.includes('.eh-loc.is-off .eh-impulse'));
assert.ok(css.includes('animation-play-state:paused'));
assert.ok(css.includes('@keyframes eh-flow'));
assert.ok(css.includes('@keyframes eh-pulse'));
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
console.log('access end m', accessEnd.toFixed(1), 'bent roads', bent);
