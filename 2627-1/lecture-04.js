/* Offline classroom illustration of whole and partial report. No data is collected. */
(() => {
  const grid = document.getElementById('letter-grid');
  if (!grid) return;
  const cells = [...grid.children];
  const cue = document.getElementById('letter-cue');
  const buttons = [...document.querySelectorAll('[data-memory-demo]')];
  // Thời gian hiện chữ (ms) đặt ở data-exposure trong noi-dung-buoi-04.py. Sperling dùng 50 ms;
  // trên máy chiếu cần lâu hơn để cả lớp kịp thấy chữ.
  const exposure = Number(grid.dataset.exposure) || 300, prepare = Number(grid.dataset.prepare) || 1000;
  // Nút “Xem lại bảng” hiện lại bảng vừa chiếu để lớp tự chấm; chỉ bật khi một lượt đã xong.
  const reveal = document.querySelector('[data-memory-reveal]');
  let timers = [], generation = 0, last = null;
  const clear = () => {
    generation++;
    timers.forEach(clearTimeout); timers = [];
    cells.forEach(c => { c.textContent = '·'; c.classList.remove('cued'); });
    buttons.forEach(b => b.disabled = false);
    last = null;
    if (reveal) reveal.disabled = true;
    cue.textContent = 'Sẵn sàng';
  };
  buttons.forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    clear();
    const run = generation;
    buttons.forEach(b => b.disabled = true);
    const alphabet = 'BCDFGHJKLMNPQRSTVXZ';
    const pool = [...alphabet];
    for (let i=pool.length-1; i>0; i--) {
      const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]];
    }
    const row = Math.floor(Math.random()*3);
    cue.textContent = 'Nhìn vào giữa bảng';
    timers.push(setTimeout(() => {
      if (run !== generation) return;
      // Populate on a frame boundary, then request removal after the exposure.
      // This is a classroom illustration, not a calibrated tachistoscope.
      requestAnimationFrame(() => {
        if (run !== generation) return;
        cells.forEach((c, i) => { c.textContent = pool[i]; });
        timers.push(setTimeout(() => {
          if (run !== generation) return;
          cells.forEach(c => { c.textContent = '·'; });
          const mode = button.dataset.memoryDemo;
          timers.push(setTimeout(() => {
            if (run !== generation) return;
            if (mode === 'all') cue.textContent = 'Nhớ lại cả bảng';
            else {
              cue.textContent = `Nhớ lại hàng ${row+1} (từ trên xuống)`;
              cells.slice(row*4,row*4+4).forEach(c => c.classList.add('cued'));
            }
            buttons.forEach(b => b.disabled = false);
            last = pool.slice(0, 12);
            if (reveal) reveal.disabled = false;
          }, mode === 'all' ? 0 : Number(mode)));
        }, exposure));
      });
    }, prepare));
  }));
  if (reveal) reveal.addEventListener('click', event => {
    event.stopPropagation();
    if (!last) return;
    cells.forEach((c, i) => { c.textContent = last[i]; });
    cue.textContent = 'Bảng vừa hiện: đối chiếu với chữ đã ghi';
  });
  Reveal.on('slidechanged', clear);
})();
