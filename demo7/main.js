document.addEventListener("DOMContentLoaded", function() {
  initSmoothScroll(1000);
});

function initSmoothScroll(scrollDuration) {
  const links = document.querySelectorAll(".smooth-scroll");

  Array.prototype.forEach.call(links, function(link) {
    link.addEventListener("click", handleSmoothScroll);
  });

  function handleSmoothScroll(event) {
    event.preventDefault();
    const selector = this.getAttribute("href");
    const target = document.querySelector(selector);

    const startScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    const endScroll = target.offsetTop;

    const startTime = Date.now();
    const endTime = startTime + scrollDuration;

    requestAnimationFrame(animate);

    function animate() {
      const normalized = linearMap(Date.now(), startTime, endTime, 0, 1);
      const eased = easeInOutQuad(normalized);
      const newScroll = linearMap(eased, 0, 1, startScroll, endScroll);

      document.documentElement.scrollTop = document.body.scrollTop = newScroll;

      if (newScroll !== endScroll) {
        requestAnimationFrame(animate);
      }
    }
  }

  function linearMap(x, x1, x2, y1, y2) {
    var y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);

    y = Math.max(y, Math.min(y1, y2));
    y = Math.min(y, Math.max(y1, y2));

    return y;
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}
