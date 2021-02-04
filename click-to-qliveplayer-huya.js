// ==UserScript==
// @name         Click to QLivePlayer - Huya
// @version      0.3.1
// @description  Open QLivePlayer instead when click on Huya
// @author       Chinory
// @homepage     https://github.com/Chinory/tampermonkey-scripts/wiki/Click-to-QLivePlayer
// @downloadURL  https://raw.githubusercontent.com/Chinory/tampermonkey-scripts/main/click-to-qliveplayer-huya.js
// @match        *://www.huya.com/*
// @grant        unsafeWindow

// ==/UserScript==
"use strict";

var window = unsafeWindow;

window.qlp_rewrite = function qlp_rewrite(url) {
  var l = new URL(url, this.location.href);
  if (l.hostname === "www.huya.com") {
    var s = l.pathname;
    if (/^\/[^\/][^\/]+$/.test(s)) {
      return "qliveplayer://" + l.host + s;
    }
  }
};

window.qlp_rawopen = window.open;

window.open = function qlp_open(url) {
  var u = this.qlp_rewrite(url);
  if (u) {
    var w = this.qlp_rawopen(u, "_self");
    if (w) {
      console.log("[QLivePlayer][open]", url);
      return w;
    }
  }
  return this.qlp_rawopen.apply(this, arguments);
};

window.addEventListener("click", function qlp_href(e) {
  var a = e.target.closest("a")
  if (a && a.href) {
    var u = this.qlp_rewrite(a.href);
    if (u && this.qlp_rawopen(u, "_self")) {
      console.log("[QLivePlayer][href]", a.href);
      return e.preventDefault();
    }
  }
}, true);


console.log("[QLivePlayer] Hook loaded.");
