(function () {
  var buttons = document.querySelectorAll('.onas-copy');
  if (!buttons.length) return;
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var label = btn.getAttribute('data-label') || btn.textContent;
      function done() {
        btn.textContent = 'Скопировано';
        btn.setAttribute('aria-label', 'Скопировано');
        setTimeout(function () {
          btn.textContent = 'Скопировать';
          btn.setAttribute('aria-label', label);
        }, 1600);
      }
      function fallback() {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        area.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  });
})();
