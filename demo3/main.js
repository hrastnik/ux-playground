(function() {
  document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

  function handleDOMContentLoaded() {
    const elements = document.querySelectorAll(".image-reveal");
    var allAnimations = [];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      const doorWrap = element.querySelector(".image-reveal__inner");
      const doorL = element.querySelector(".image-reveal__door--left");
      const doorR = element.querySelector(".image-reveal__door--right");
      const doorT = element.querySelector(".image-reveal__door--top");
      const doorB = element.querySelector(".image-reveal__door--bottom");

      const height = element.clientHeight;
      const width = element.clientWidth;

      const offsetX = height / 2;
      const offsetY = width / 2;
      const duration = 0.75;
      const ease = Quad.easeInOut;

      const animations = [
        TweenMax.to(doorWrap, duration, {
          rotation: 90,
          ease: ease,
          paused: true
        }),
        TweenMax.to(doorL, duration, { x: -offsetX, ease: ease, paused: true }),
        TweenMax.to(doorR, duration, { x: offsetX, ease: ease, paused: true }),
        TweenMax.to(doorT, duration, { y: -offsetY, ease: ease, paused: true }),
        TweenMax.to(doorB, duration, { y: offsetY, ease: ease, paused: true })
      ];
      allAnimations.push(animations);

      element.addEventListener("mouseover", function() {
        handleMouseOver(animations);
      });
      element.addEventListener("mouseout", function() {
        handleMouseOut(animations);
      });
    }

    window.addEventListener("resize", function() {
      handleResize(allAnimations);
    });
  }

  function closestClass(element, className) {
    while (element.classList.contains(className) === false) {
      element = element.parentElement;
    }
    return element;
  }

  function handleResize(allAnimations) {
    for (var i = 0; i < allAnimations.length; i++) {
      console.log(i);

      var animations = allAnimations[i];

      const element = closestClass(animations[0].target, "image-reveal");

      const height = element.clientHeight;
      const width = element.clientWidth;

      const offsetX = height / 2;
      const offsetY = width / 2;
      const duration = 0.75;
      const ease = Quad.easeInOut;

      for (var j = 0; j < animations[j].length; j++) animations[j].reset();

      animations[1] = TweenMax.to(animations[1].target, 0.75, {
        x: -offsetX,
        ease: ease,
        paused: true
      });
      animations[2] = TweenMax.to(animations[2].target, 0.75, {
        x: offsetX,
        ease: ease,
        paused: true
      });
      animations[3] = TweenMax.to(animations[3].target, 0.75, {
        y: -offsetY,
        ease: ease,
        paused: true
      });
      animations[4] = TweenMax.to(animations[4].target, 0.75, {
        y: offsetY,
        ease: ease,
        paused: true
      });
    }
  }

  function handleMouseOut(animations) {
    for (let i = 0; i < animations.length; i++) {
      animations[i].reverse();
    }
  }

  function handleMouseOver(animations) {
    for (let i = 0; i < animations.length; i++) {
      animations[i].play();
    }
  }
})();
