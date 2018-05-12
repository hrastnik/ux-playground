(function() {
  /**
   * Utility function to map between two intervals
   */
  function linearMap(x, x1, x2, y1, y2) {
    var y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);

    y = Math.max(y, Math.min(y1, y2));
    y = Math.min(y, Math.max(y1, y2));

    return y;
  }

  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

  var menu;
  function onDOMContentLoaded() {
    menu = document.getElementById("menu");
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchstart", onMouseMove);

    window.addEventListener("resize", onResize);
  }

  function onResize() {
    if (window.innerWidth <= 640) {
      menuWidth = window.innerWidth * 0.35;
      menuStartUncover = menuWidth * 2;
    } else {
      menuWidth = window.innerWidth * 0.1;
      if (menuWidth < 150) menuWidth = 150;
      else if (menuWidth < 150) menuWidth = 150;
      menuStartUncover = menuWidth * 1.1;
    }
  }

  var menuWidth;
  var menuStartUncover;
  onResize();

  var lastX = 0;
  function onMouseMove(event) {
    var clientX = parseInt(event.clientX || event.touches[0].clientX, 10);
    var distToEdge = window.innerWidth - event.clientX;

    // This is to prevent unnecessary animations when outside of range
    if (lastX > menuStartUncover && distToEdge > menuStartUncover) return;
    else if (lastX < menuWidth && distToEdge < menuWidth) return;
    lastX = distToEdge;

    var opacity = linearMap(distToEdge, menuStartUncover, menuWidth, 0, 1);
    var translateX = linearMap(opacity, 0, 1, 100, 0);
    TweenMax.to(menu, 0.3, { x: translateX + "%", opacity: opacity });

    if (distToEdge < menuWidth) {
      TweenMax.staggerTo(".menu li", 0.3, { x: "0%", opacity: 1 }, 0.08);
    } else if (distToEdge > menuStartUncover) {
      TweenMax.staggerTo(".menu li", 0.3, { x: "100%", opacity: 0 }, 0.08);
    }
  }
})();
