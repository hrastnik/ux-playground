/**
 * JS Transition
 */
// document.addEventListener("DOMContentLoaded", function() {
//   new hTransition({
//     startTransition: function(anchorElement, done) {
//       TweenMax.to(document.body, 1, { opacity: 0, onComplete: done });
//     },
//     endTransition: function(newDocument, done) {
//       TweenMax.fromTo(
//         newDocument.body,
//         1,
//         { opacity: 0 },
//         { opacity: 1, onComplete: done }
//       );
//     }
//   });
// });

/**
 *  Transition
 */
document.addEventListener("DOMContentLoaded", function() {
  new hTransition({
    // Define how the active page will leave
    // we need to call done() when the animations are over
    // Calling done() removes the #active-scene element and replaces it
    // with the contents of the #active-scene element from the new page.
    startTransition: function(anchorElement, done) {
      var path = window.location.pathname;
      var scene = document.querySelector("#active-scene");

      var isHomepage = path === "/" || path.indexOf("index") !== -1;
      var isPage1 = path.indexOf("page1") !== -1;
      var isPage2 = path.indexOf("page2") !== -1;

      switch (true) {
        case isHomepage: {
          TweenMax.to(scene, 1, { height: 0, onComplete: done });
          break;
        }
        case isPage1: {
          TweenMax.to(scene, 1, { scale: 0, onComplete: done });
          break;
        }
        case isPage2: {
          TweenMax.to(scene, 1, { x: "-100%", onComplete: done });
          break;
        }
        default:
          console.log("boom");
          done();
      }
    },
    // Define how the next page will enter
    // We need to call done() when the animations are over
    endTransition: function(newDocument, done) {
      var path = window.location.pathname;

      switch (true) {
        case path.indexOf("page1") !== -1: {
          TweenMax.fromTo(
            document.body,
            1,
            { opacity: 0 },
            { opacity: 1, onComplete: done }
          );
          break;
        }
        case path.indexOf("page2") !== -1: {
          TweenMax.fromTo(
            document.body,
            1,
            { opacity: 0, rotation: 360 },
            { opacity: 1, rotation: 0, onComplete: done }
          );
          break;
        }
        default: {
          TweenMax.from(document.body, 1, { x: "-100%", onComplete: done });
        }
      }
    }
  });
});
