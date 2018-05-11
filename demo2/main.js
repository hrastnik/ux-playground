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
  }

  var lastX = 0;
  function onMouseMove(event) {
    var distToEdge = window.innerWidth - event.clientX;

    // This is to prevent unnecessary animations when outside of range
    if (lastX > 400 && distToEdge > 400) return;
    else if (lastX < 300 && distToEdge < 300) return;
    lastX = distToEdge;

    var opacity = linearMap(distToEdge, 400, 300, 0, 1);
    var translateX = linearMap(opacity, 0, 1, 100, 0);
    TweenMax.to(menu, 0.3, { x: translateX + "%", opacity: opacity });

    if (distToEdge < 300) {
      TweenMax.staggerTo(".menu li", 0.3, { x: "0%", opacity: 1 }, 0.08);
    } else if (distToEdge > 400) {
      TweenMax.staggerTo(".menu li", 0.3, { x: "100%", opacity: 0 }, 0.08);
    }
  }
})();
