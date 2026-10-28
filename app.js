(() => {
  const $ = s => document.querySelector(s);

  // menu mobilne
  const ham = $('.ham'), panel = $('#panel');
  const zamknij = () => { panel.classList.remove('otw'); ham.setAttribute('aria-expanded', 'false'); };
  ham.addEventListener('click', () => {
    const otw = panel.classList.toggle('otw');
    ham.setAttribute('aria-expanded', otw ? 'true' : 'false');
  });
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', zamknij));

  // dolny pasek dopiero po przewinięciu za przyciski hero
  const mob = $('#mob'), cta = $('.hero-cta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      mob.classList.toggle('widac', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(cta);
  }

  // kafel oferty ustawia temat formularza
  const temat = $('#temat');
  document.querySelectorAll('[data-temat]').forEach(k => k.addEventListener('click', () => {
    const t = k.dataset.temat;
    [...temat.options].forEach(o => { if (o.text === t) temat.value = o.value; });
  }));

  // lightbox
  const lb = $('#lb'), lbImg = $('#lbImg'), lbOpis = $('#lbOpis');
  const pokaz = (src, alt, opis) => {
    lbImg.src = src; lbImg.alt = alt; lbOpis.textContent = opis || '';
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
  };
  document.querySelectorAll('.g button').forEach(b => b.addEventListener('click', () => {
    const img = b.querySelector('img'), cap = b.parentElement.querySelector('figcaption');
    pokaz(img.currentSrc || img.src, img.alt, cap ? cap.querySelector('b').textContent : '');
  }));
  document.querySelectorAll('.ref').forEach(b => b.addEventListener('click', () => {
    const img = b.querySelector('img');
    pokaz(img.currentSrc || img.src, img.alt, b.querySelector('span').textContent);
  }));
  $('.lb-x').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  // formularz (wersja pokazowa: podsumowanie + mailto)
  const form = $('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const ok = d.kto.trim() && d.kontakt.trim();
    $('#formBlad').hidden = !!ok;
    if (!ok) return;
    const tresc = [
      'Temat: ' + d.temat,
      'Kto: ' + d.kto,
      'Kontakt: ' + d.kontakt,
      d.gdzie ? 'Miejscowość: ' + d.gdzie : '',
      d.m2 ? 'Powierzchnia: ' + d.m2 + ' m2' : '',
      '',
      d.tresc || ''
    ].filter((l, i) => l !== '' || i === 5).join('\n');
    $('#formMail').href = 'mailto:biuro@disztung.com?subject=' + encodeURIComponent('Zapytanie: ' + d.temat) + '&body=' + encodeURIComponent(tresc);
    $('#formOk').hidden = false;
  });
})();
