/* Hai hoạt động trên lớp của Buổi 9, chạy offline, không thu dữ liệu.
   1) .listen-demo: đọc một câu tiếng nước ngoài bằng giọng có sẵn, lớp đoán số từ (mở đầu cho Saffran và cs. 1996). */
(() => {
  const stop = e => e.stopPropagation();

  // Nghe một câu tiếng nước ngoài: chọn giọng có sẵn trên máy, đáp án tự đổi theo câu được đọc.
  const LISTEN = [
    { lang: 'hu', name: 'tiếng Hungary', text: 'Szeretem a forró kávét reggel.', gloss: '“Tôi thích cà phê nóng vào buổi sáng.”' },
    { lang: 'fi', name: 'tiếng Phần Lan', text: 'Juon kuumaa kahvia joka aamu.', gloss: '“Sáng nào tôi cũng uống cà phê nóng.”' },
    { lang: 'tr', name: 'tiếng Thổ Nhĩ Kỳ', text: 'Her sabah sıcak kahve içerim.', gloss: '“Sáng nào tôi cũng uống cà phê nóng.”' },
    { lang: 'pl', name: 'tiếng Ba Lan', text: 'Każdego ranka piję gorącą kawę.', gloss: '“Sáng nào tôi cũng uống cà phê nóng.”' },
  ];
  document.querySelectorAll('.listen-demo').forEach(panel => {
    const btn = panel.querySelector('.listen-play');
    const status = panel.querySelector('.listen-status');
    const slide = panel.closest('section');
    const words = slide && slide.querySelector('.listen-words');
    const gloss = slide && slide.querySelector('.listen-gloss');
    if (!btn || !('speechSynthesis' in window)) { if (btn) btn.hidden = true; if (status) status.textContent = 'Trình duyệt này không đọc được; giảng viên đọc câu trên đáp án.'; return; }
    const pick = () => {
      const voices = speechSynthesis.getVoices();
      for (const item of LISTEN) {
        const v = voices.find(x => (x.lang || '').toLowerCase().startsWith(item.lang));
        if (v) return { item, v };
      }
      return { item: LISTEN[0], v: null };
    };
    const show = item => {
      if (!words) return;
      words.innerHTML = item.text.split(' ').map(w => '<span class="lw">' + w + '</span>').join('');
      gloss.textContent = item.name + ', ' + item.text.split(' ').length + ' từ: ' + item.gloss;
    };
    btn.addEventListener('click', e => {
      stop(e);
      speechSynthesis.cancel();
      setTimeout(() => {
        const { item, v } = pick();
        show(item);
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = v ? v.lang : item.lang; if (v) u.voice = v; u.rate = 0.95;
        status.textContent = v ? 'Đang đọc bằng giọng ' + v.name + '.' : 'Máy không có giọng nước ngoài phù hợp; giảng viên đọc câu trên đáp án.';
        speechSynthesis.speak(u);
      }, 80);
    });
    if (window.Reveal) Reveal.on('slidechanged', () => speechSynthesis.cancel());
  });

})();
