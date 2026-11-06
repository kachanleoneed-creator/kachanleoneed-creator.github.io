'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'history.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'onas.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'onas.js'), 'utf8');
const mp4 = path.join(root, 'media/founder-welcome.mp4');

const probe = execFileSync('ffprobe', [
  '-hide_banner', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', mp4
], { encoding: 'utf8' }).trim().split(/\s+/).filter(Boolean);
assert.deepStrictEqual(probe, ['video'], 'clip must contain only a video stream, got ' + probe.join(','));
assert.ok(html.includes('media/founder-leonid.jpg'));
assert.ok(html.includes('class="onas-hello"'));
assert.ok(html.includes('muted'));
assert.ok(html.includes('playsinline'));
assert.ok(!/onas-hello[^>]*loop/.test(html));
assert.ok(!/controls/.test(html.split('onas-hello')[1].slice(0, 200)));
assert.ok(js.includes('media/founder-welcome.mp4'));
assert.ok(js.includes('prefers-reduced-motion'));
assert.ok(js.includes("video.muted = true"));
assert.ok(!/unmute|volume/.test(js));
assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(css.includes('.onas-portrait.is-done video'));
assert.ok(html.includes('322774600524394'));
assert.ok(html.includes('1-я Магистральная, 12'));
console.log('founder-welcome tests passed');
