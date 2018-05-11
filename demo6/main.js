(function() {
  function linMap(x, x1, x2, y1, y2) {
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
  }

  var background;
  var fontSizeElement;

  function fontSize(vw) {
    switch (true) {
      case vw < 320:
        return 32;
      case vw < 768: {
        let x = linMap(vw, 320, 768, 0, 1);
        x = x * x;
        return linMap(x, 0, 1, 32, 68);
      }
      case vw < 1600: {
        let x = linMap(vw, 768, 1600, 0, 2.5 * Math.PI);
        x = Math.sin(x);
        return linMap(x, 0, 1, 68, 82);
      }
      default:
        return linMap(vw, 1600, 2048, 82, 92);
    }
  }

  function handleResize() {
    const newFontSize = fontSize(window.innerWidth);
    fontSizeElement.textContent = newFontSize.toFixed(3);

    document.documentElement.style.fontSize = newFontSize + "px";
  }

  document.addEventListener("DOMContentLoaded", function() {
    background = document.body.style;
    fontSizeElement = document.querySelector("#font-size");

    window.addEventListener("resize", handleResize);
    handleResize();
  });
})();
