'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

assert.ok(js.includes("t.indexOf('В наличии')===0&&!/нет/i.test(t)"));
assert.ok(js.includes("el.classList.add('st-in')"));
assert.ok(css.includes('.st.st-in .dot,.pc .im .st.st-in .dot'));
assert.ok(css.includes('@keyframes stockdot'));
assert.ok(css.includes('prefers-reduced-motion:reduce') && css.includes('.st.st-in .dot,.pc .im .st.st-in .dot{animation:none!important'));
assert.ok(!css.includes('.st.st-in{transform'));
function mark(text) {
  var t = text.replace(/\s+/g, ' ').trim();
  return t.indexOf('В наличии') === 0 && !/нет/i.test(t);
}
assert.strictEqual(mark('В наличии'), true);
assert.strictEqual(mark('В наличии · отгрузка 1–3 раб. дня'), true);
assert.strictEqual(mark('Нет в наличии'), false);
assert.strictEqual(mark('Под заказ'), false);
assert.strictEqual(mark('Предзаказ'), false);
console.log('stock-badge tests passed');
