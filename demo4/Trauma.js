var Trauma = (function() {
  function replaceElement(DOMElement, newDOMElement) {
    DOMElement.parentNode.replaceChild(newDOMElement, DOMElement);
  }

  function doesRouteMatch(href, stringRegexOrFunction) {
    if (typeof stringRegexOrFunction === "string") {
      return href.indexOf(stringRegexOrFunction) !== -1;
    } else if (
      typeof stringRegexOrFunction === "object" &&
      stringRegexOrFunction.test === RegExp.prototype.test
    ) {
      return stringRegexOrFunction.test(href);
    } else if (typeof stringRegexOrFunction === "function") {
      return stringRegexOrFunction(href);
    }
    return false;
  }

  function Trauma(config) {
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.handleReadyStateChange = this.handleReadyStateChange.bind(this);
    this.tryRunEndTransition = this.tryRunEndTransition.bind(this);
    this.bindToAnchors = this.bindToAnchors.bind(this);
    this.replace = this.replace.bind(this);
    this.insertNext = this.insertNext.bind(this);
    this.finalize = this.finalize.bind(this);

    this.startTransitionDone = false;
    this.requestDone = false;

    this.config = config;

    this.bindToAnchors();

    window.addEventListener("popstate", this.handlePopState);
  }

  Trauma.prototype.bindToAnchors = function() {
    // TODO: Check if <a> has target blank, or download prop
    var anchorElements = document.querySelectorAll("a");

    for (var i = 0; i < anchorElements.length; i++) {
      var anchorElement = anchorElements[i];
      anchorElement.addEventListener(
        "click",
        this.handleAnchorClick.bind(null, anchorElement)
      );
    }
  };

  Trauma.prototype.handleAnchorClick = function(anchorElement, event) {
    // TODO: Check if link has _blank or download attributes
    this.activeDocument = document;

    var href = anchorElement.getAttribute("href");
    if (href == null) return;

    event.preventDefault();

    this.nextURL = href;

    var request = new XMLHttpRequest();
    request.addEventListener(
      "readystatechange",
      this.handleReadyStateChange.bind(null, request)
    );
    request.open("GET", href, true);
    request.send();

    for (var config of this.config) {
      if (doesRouteMatch(window.location.pathname, config.from) === false)
        continue;
      if (
        config.to != null &&
        doesRouteMatch(this.nextURL, config.to) === false
      )
        continue;

      this.finish = config.finish;
      this.start = config.start;

      this.start(
        this.replace,
        this.insertNext,
        document.querySelector("#active-scene") // TODO: Add ability to customize scene classname
      );
      break;
    }
  };

  Trauma.prototype.handlePopState = function(event) {
    this.activeDocument = document;

    var href = this.nextURL || "";
    this.nextURL = event.srcElement.location.href;
    if (href == null) return;

    event.preventDefault();

    var request = new XMLHttpRequest();
    request.addEventListener(
      "readystatechange",
      this.handleReadyStateChange.bind(null, request)
    );
    request.open("GET", this.nextURL, true);
    request.send();

    for (var config of this.config) {
      if (doesRouteMatch(href, config.from) === false) continue;
      if (
        config.to != null &&
        doesRouteMatch(this.nextURL, config.to) === false
      )
        continue;

      this.finish = config.finish;
      this.start = config.start;
      break;
    }

    this.start(
      this.replace,
      this.insertNext,
      document.querySelector("#active-scene")
    );
  };

  Trauma.prototype.replace = function() {
    this.startTransitionDone = true;
    this.shouldReplaceScene = true;
    this.tryRunEndTransition();
  };

  Trauma.prototype.insertNext = function() {
    this.startTransitionDone = true;
    this.shouldReplaceScene = false;
    this.tryRunEndTransition();
  };

  Trauma.prototype.tryRunEndTransition = function() {
    var canRunTransition = this.requestDone && this.startTransitionDone;
    if (!canRunTransition) return;

    window.history.pushState(null, "", this.nextURL);

    var activeHead = this.activeDocument.head;
    var nextHead = this.nextDocument.head;
    this.replaceHeadWithoutReplacingUnion(activeHead, nextHead);

    this.oldScene = this.activeDocument.querySelector("#active-scene");
    this.newScene = this.nextDocument.querySelector("#active-scene");

    if (this.shouldReplaceScene) {
      replaceElement(this.oldScene, this.newScene);
    } else {
      this.oldScene.style.position = "absolute";
      this.oldScene.style.top = "0";
      this.oldScene.insertAdjacentElement("beforeBegin", this.newScene);
    }

    this.finish(this.finalize, this.newScene, this.oldScene);
  };

  Trauma.prototype.finalize = function() {
    if (this.shouldReplaceScene === false) {
      this.oldScene.parentElement.removeChild(this.oldScene);
    }

    this.bindToAnchors();

    // Reset everything
    this.requestDone = false;
    this.startTransitionDone = false;
    this.activeDocument = undefined;
    this.nextDocument = undefined;
    // this.nextURL = undefined;
    this.newScene = undefined;
    this.oldScene = undefined;
  };

  Trauma.prototype.handleReadyStateChange = function(request) {
    if (request.readyState === XMLHttpRequest.DONE) {
      // TODO: Check if response is valid HTML
      var body = request.responseText;
      var parser = new DOMParser();

      this.nextDocument = parser.parseFromString(body, "text/html");
      this.requestDone = true;
      this.tryRunEndTransition();
    }
  };

  Trauma.prototype.replaceHeadWithoutReplacingUnion = function(
    oldHead,
    newHead
  ) {
    var oldTags = oldHead.children;
    var newTags = newHead.children;
    var oldTagsToRemove = [];
    var newTagsToRemove = [];

    for (var i = 0; i < oldTags.length; i++) {
      var oldTag = oldTags[i];

      var oldTagIdentifier = oldTag.outerHTML;
      var foundInNewHead = false;
      for (var j = 0; j < newTags.length; j++) {
        var newTag = newTags[j];
        var newTagIdentifier = newTag.outerHTML;

        if (newTagIdentifier === oldTagIdentifier) {
          foundInNewHead = true;
          break;
        }
      }

      if (foundInNewHead) newTagsToRemove.push(newTag);
      else oldTagsToRemove.push(oldTag);
    }

    for (var i = 0; i < newTagsToRemove.length; i++) {
      newHead.removeChild(newTagsToRemove[i]);
    }

    for (var i = 0; i < oldTagsToRemove.length; i++) {
      oldHead.removeChild(oldTagsToRemove[i]);
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < newHead.children.length; i++) {
      fragment.appendChild(newHead.children[i]);
    }
    oldHead.appendChild(fragment);
  };

  return Trauma;
})();
