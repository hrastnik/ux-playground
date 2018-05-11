(function() {
  document.elementsFromPoint =
    document.elementsFromPoint || document.msElementsFromPoint;

  document.addEventListener("DOMContentLoaded", function() {
    /* Change selector to match single word whose color you want to change */
    var words = document.querySelectorAll(".menu li");

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    function handleScroll() {
      for (var i = 0; i < words.length; i++) {
        var wordElement = words[i];
        var box = wordElement.getBoundingClientRect();

        var centerX = box.left + box.width / 2;
        var centerY = box.top + box.height / 2;
        var backgroundElements = document.elementsFromPoint(centerX, centerY);

        var textColor = "#000000";
        for (var j = 0; j < backgroundElements.length; j++) {
          var classList = backgroundElements[j].classList;

          if (classList.contains("background-light")) {
            textColor = "#365149";
          } else if (classList.contains("background-dark")) {
            textColor = "#c9fafa";
          }
          /* Add more "else if"s for more colors */
        }

        TweenMax.to(wordElement, 0.5, { color: textColor });
      }
    }
  });
})();
