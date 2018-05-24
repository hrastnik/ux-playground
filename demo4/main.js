/**
 *  Transition
 */

function elementPositionDelta(el1, el2) {
  var box1 = el1.getBoundingClientRect();
  var box2 = el2.getBoundingClientRect();
  return {
    x: box2.left - box1.left,
    y: box2.top - box1.top
  };
}

document.addEventListener("DOMContentLoaded", function() {
  new Trauma([
    {
      from: /page/,
      to: /page/,
      // Shared element tranistion
      start: (replace, insert, oldScene) => {
        // Grab the reference to the element in the old scene
        this.oldImage = oldScene.querySelector("img");

        // Animate old scene content away
        var content = oldScene.querySelectorAll(":not(img)");
        TweenMax.staggerTo(
          content,
          0.5,
          {
            x: window.innerWidth + "px",
            ease: Power3.easeIn
          },
          0.2,
          insert // Once we're done, insert the new scene behind the old one
        );
      },
      finish: (done, newScene, oldScene) => {
        // Grab the reference to the element in the new scene
        var newImage = newScene.querySelector("img");

        // Calculate the difference in position
        var d = elementPositionDelta(this.oldImage, newImage);
        // Translate the old image to the new position
        TweenMax.to(this.oldImage, 0.8, {
          x: d.x,
          y: d.y,
          ease: Power3.easeInOut,
          onComplete: fade
        });
        // Fade out the old scene to reveal the new one
        function fade(params) {
          TweenMax.to(oldScene, 0.3, {
            opacity: 0,
            onComplete: done // call done in the end
          });
        }
      }
    },
    {
      from: /^\/$|index/,
      to: /page/,
      start: (replace, insert, oldScene) => {
        insert();
      },
      finish: (done, newScene, oldScene) => {
        var bodyStyle = document.body.style;
        var originalBodyOverflow = bodyStyle.overflow;
        bodyStyle.overflow = "hidden";
        TweenMax.to(oldScene, 1, { x: "-100%", ease: Power3.easeIn });
        TweenMax.from(newScene, 1, {
          x: "100%",
          ease: Power3.easeIn,
          onComplete: function() {
            bodyStyle.overflow = originalBodyOverflow;
            done();
          }
        });
      }
    },
    {
      from: /.*/,
      start: (replace, insertNext, oldScene) => {
        TweenMax.to(oldScene, 0.5, { opacity: 0, onComplete: replace });
      },
      finish: (done, newScene, oldScene) => {
        TweenMax.from(newScene, 0.5, { opacity: 0, onComplete: done });
      }
    }
  ]);
});
