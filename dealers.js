(function () {
  var form = document.getElementById('dl-form');
  if (!form) return;
  var notes = {
    '': 'Выберите формат: от него зависят договор и цены в кабинете.',
    drop: 'Дропшипинг: вы находите клиента, мы продаём и отгружаем. Доход — 10% от розничной цены (9%, если клиент платит безналом). Нужен статус самозанятого или ИП.',
    opt: 'Опт: покупаете технику по оптовой цене и продаёте сами. Нужен ИП или ООО.'
  };
  var allow = { drop: ['self', 'ip'], opt: ['ip', 'ooo'] };
  var status = form.querySelector('[name=eh_lstatus]');
  var note = document.getElementById('eh-dtype-note');
  var selfHint = document.getElementById('eh-self-hint');
  var nameLabel = form.querySelector('.eh-name-label');
  var company = form.querySelector('[name=eh_company]');
  var inn = form.querySelector('[name=eh_inn]');
  var rs = form.querySelector('[name=eh_rs]');
  function box(name) {
    var el = form.querySelector('[name=' + name + ']');
    return el ? el.closest('label') : null;
  }
  function show(el, on) { if (el) el.hidden = !on; }
  function format() {
    var picked = form.querySelector('[name=eh_dtype]:checked');
    return picked ? picked.value : '';
  }
  function paint() {
    var kind = format();
    var allowed = allow[kind];
    Array.prototype.forEach.call(status.options, function (option) {
      if (!option.value) return;
      var ok = !allowed || allowed.indexOf(option.value) !== -1;
      option.hidden = !ok;
      option.disabled = !ok;
    });
    if (status.value && status.options[status.selectedIndex].disabled) status.value = '';
    var current = status.value;
    show(box('eh_company'), current !== 'self');
    show(box('eh_kpp'), current === 'ooo');
    show(box('eh_ogrn'), current !== 'self');
    if (company) company.required = false;
    if (nameLabel) {
      nameLabel.textContent = current === 'self' ? 'ФИО' : (current === 'ip' ? 'ФИО предпринимателя' : (current === 'ooo' ? 'Подписант (ФИО)' : 'Имя и фамилия'));
    }
    var companyLabel = company && company.closest('label');
    if (companyLabel) {
      var title = companyLabel.querySelector('.eh-co-label');
      if (title) title.textContent = current === 'ip' ? 'Название ИП (можно не заполнять)' : 'Название организации';
    }
    if (inn) inn.placeholder = current === 'ooo' ? '10 цифр' : (current ? '12 цифр' : '12 цифр у ИП и самозанятого, 10 у ООО');
    var rsLabel = rs && rs.closest('label');
    if (rsLabel) {
      var rsTitle = rsLabel.querySelector('.eh-rs-label');
      if (rsTitle) rsTitle.textContent = current === 'self' ? 'Счёт или карта для выплат' : 'Р/с';
    }
    show(selfHint, kind === 'drop' && current === 'self');
    if (note) note.textContent = notes[kind] || notes[''];
  }
  var innCheck = document.getElementById('eh-inn-check');
  var innTypo = 'В ИНН, похоже, опечатка: не сходится контрольная цифра. Сверьте с документами или приложением «Мой налог».';
  function innSum(n) {
    function c(w) { var s = 0; for (var i = 0; i < w.length; i++) s += w[i] * +n[i]; return s % 11 % 10; }
    if (n.length === 10) return c([2, 4, 10, 3, 5, 9, 4, 6, 8]) === +n[9];
    if (n.length === 12) return c([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === +n[10] && c([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === +n[11];
    return false;
  }
  function checkInn() {
    if (!inn || !innCheck) return;
    var n = inn.value.replace(/\s/g, '');
    var bad = /^\d{10}$|^\d{12}$/.test(n) && !innSum(n);
    innCheck.hidden = !bad;
    innCheck.textContent = bad ? innTypo : '';
  }
  form.addEventListener('change', paint);
  form.addEventListener('input', checkInn);
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  paint();
})();
