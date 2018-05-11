document.addEventListener("DOMContentLoaded", function() {
  new hTransition({
    startTransition: function(activeDocument, done) {
      var tr = document.querySelector("#transitioner");
      TweenMax.to(tr, 1, { bottom: 0, onComplete: done });
    },
    endTransition: function(newDocument, done) {
      var tr = document.querySelector("#transitioner");
      TweenMax.to(tr, 1, { bottom: "100%", onComplete: done });
    }
  });
});
