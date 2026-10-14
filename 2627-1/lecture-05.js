/* Offline classroom demo for Lecture 5: flash one string, hide it, then let the class write it down.
   No data is collected. Display duration is set by data-exposure (ms). */
(() => {
  const panel = document.querySelector('.flash-demo');
  if (!panel) return;
  const screen = panel.querySelector('.flash-screen');
  const status = panel.querySelector('.flash-status');
  const buttons = [...panel.querySelectorAll('[data-flash]')];
  const reveal = panel.querySelector('[data-flash-reveal]');
  const exposure = Number(panel.dataset.exposure) || 5000;
  let timer = null, last = null;
  const reset = () => {
    clearTimeout(timer); timer = null; last = null;
    screen.textContent = '· · ·';
    status.textContent = 'Sẵn sàng';
    buttons.forEach(b => b.disabled = false);
    reveal.disabled = true;
  };
  buttons.forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    reset();
    last = button.dataset.flash;
    buttons.forEach(b => b.disabled = true);
    screen.textContent = last;
    status.textContent = 'Nhìn kỹ';
    timer = setTimeout(() => {
      screen.textContent = '· · ·';
      status.textContent = 'Viết lại dãy vừa thấy';
      buttons.forEach(b => b.disabled = false);
      reveal.disabled = false;
      timer = null;
    }, exposure);
  }));
  reveal.addEventListener('click', event => {
    event.stopPropagation();
    if (last) { screen.textContent = last; status.textContent = 'Tự chấm'; }
  });
  reset();
  if (window.Reveal) Reveal.on('slidechanged', reset);
})();
