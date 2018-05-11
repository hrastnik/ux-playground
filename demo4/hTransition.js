var hTransition = (function() {
  function replaceElement(DOMElement, newDOMElement) {
    DOMElement.parentNode.replaceChild(newDOMElement, DOMElement);
  }

  function hTransition(options) {
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.handleReadyStateChange = this.handleReadyStateChange.bind(this);
    this.tryRunEndTransition = this.tryRunEndTransition.bind(this);
    this.onStartTransitionDone = this.onStartTransitionDone.bind(this);
    this.bindToAnchors = this.bindToAnchors.bind(this);

    this.activeDocument = document;
    this.startTransitionDone = false;
    this.requestDone = false;

    this.startTransition = options.startTransition;
    this.endTransition = options.endTransition;

    this.bindToAnchors();

    window.addEventListener("popstate", this.handlePopState);
  }

  hTransition.prototype.bindToAnchors = function() {
    // debugger;
    var anchorElements = document.querySelectorAll("a");
    console.log("Binding to elements: ", anchorElements);
    for (var i = 0; i < anchorElements.length; i++) {
      var anchorElement = anchorElements[i];
      anchorElement.addEventListener(
        "click",
        this.handleAnchorClick.bind(null, anchorElement)
      );
    }
  };

  hTransition.prototype.handleAnchorClick = function(anchorElement, event) {
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

    this.startTransition(this.activeDocument, this.onStartTransitionDone);
  };

  hTransition.prototype.handlePopState = function(event) {
    var href = event.srcElement.location.href;
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

    this.startTransition(this.activeDocument, this.onStartTransitionDone);
  };

  hTransition.prototype.onStartTransitionDone = function() {
    this.startTransitionDone = true;
    this.tryRunEndTransition();
  };

  hTransition.prototype.tryRunEndTransition = function() {
    var canRunTransition = this.requestDone && this.startTransitionDone;
    if (!canRunTransition) return;

    window.history.pushState(null, "", this.nextURL);

    var activeScene = this.activeDocument.querySelector("#active-scene");
    var activeHead = this.activeDocument.head;

    var nextScene = this.nextDocument.querySelector("#active-scene");
    var nextHead = this.nextDocument.head;

    this.replaceHeadWithoutReplacingUnion(activeHead, nextHead);
    replaceElement(activeScene, nextScene);

    this.bindToAnchors();

    this.endTransition(this.activeDocument);

    // Reset everything
    this.nextDocument = undefined;
    this.requestDone = false;
    this.startTransitionDone = false;
    this.nextURL = undefined;
  };

  hTransition.prototype.handleReadyStateChange = function(request) {
    if (request.readyState === XMLHttpRequest.DONE) {
      var body = request.responseText;
      var parser = new DOMParser();

      this.nextDocument = parser.parseFromString(body, "text/html");
      this.requestDone = true;
      this.tryRunEndTransition();
    }
  };

  hTransition.prototype.replaceHeadWithoutReplacingUnion = function(
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

  return hTransition;
})();
