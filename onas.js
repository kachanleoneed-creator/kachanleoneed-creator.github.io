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
(function () {
  var fig = document.querySelector('.onas-portrait');
  var video = fig && fig.querySelector('video');
  var photo = fig && fig.querySelector('img');
  if (!fig || !video || !photo) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var started = false;
  var failed = false;
  function showPhoto() {
    fig.classList.remove('is-play');
    fig.classList.add('is-done');
    video.pause();
    setTimeout(function () {
      video.removeAttribute('src');
      video.load();
    }, 500);
  }
  function fail() {
    if (failed) return;
    failed = true;
    showPhoto();
  }
  function begin() {
    if (started) return;
    started = true;
    var slow = setTimeout(fail, 3500);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.addEventListener('error', fail);
    video.addEventListener('ended', function () { clearTimeout(slow); showPhoto(); });
    video.addEventListener('canplay', function () {
      if (failed) return;
      clearTimeout(slow);
      var play = video.play();
      if (play && play.then) play.then(function () { fig.classList.add('is-play'); }).catch(fail);
      else fig.classList.add('is-play');
    }, { once: true });
    video.src = 'media/founder-welcome.mp4';
    video.load();
  }
  if (!('IntersectionObserver' in window)) { begin(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !started) begin();
      else if (!entry.isIntersecting && started && !fig.classList.contains('is-done')) video.pause();
      else if (entry.isIntersecting && started && !fig.classList.contains('is-done') && !failed) {
        var play = video.play();
        if (play && play.catch) play.catch(fail);
      }
    });
  }, { threshold: 0.45 });
  io.observe(fig);
})();
