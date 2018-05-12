document.addEventListener("DOMContentLoaded", function() {
  const compass = document.getElementById("compass");
  const box = compass.getBoundingClientRect();
  const compassX = box.x + box.width / 2;
  const compassY = box.y + box.height / 2;

  const rad2deg = 57.2957795;
  var K = 0;
  var tween;

  function onMouseMove() {
    // Calculating mouseAngle this way makes the angle be 0 at the top
    // and increase clockwise
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const dx = compassX - clientX;
    const dy = clientY - compassY;
    const mouseAngle = Math.atan2(dx, dy) * rad2deg + 180;

    const boxAngleNoMod = tween === undefined ? 0 : tween.vars.css.rotation;
    const boxAngle = (boxAngleNoMod % 360 + 360) % 360; // Fix JS broken mod

    // Detect when mouse moves from 0 -> 360 or 360 -> 0
    const angleDiff = mouseAngle - boxAngle;

    // Clockwise or counter clockwise
    if (angleDiff < -180) K++;
    else if (angleDiff > 180) K--;

    const target = mouseAngle + K * 360;
    tween = TweenMax.to(compass, 0.6, { rotation: target });
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onMouseMove);
});
