// ==UserScript==
// @name         Click to QLivePlayer - Douyu
// @version      0.3.0
// @description  Open QLivePlayer instead when click on Douyu
// @author       Chinory
// @homepage     https://github.com/Chinory/tampermonkey-scripts/wiki/Click-to-QLivePlayer
// @downloadURL  https://raw.githubusercontent.com/Chinory/tampermonkey-scripts/main/click-to-qliveplayer-douyu.js
// @match        *://www.douyu.com/*
// @grant        unsafeWindow

// ==/UserScript==
"use strict";

var window = unsafeWindow;

window.qlp_rewrite = function qlp_rewrite(url) {
  var l = new URL(url, this.location.href);
  if (l.hostname === "www.douyu.com") {
    var s = l.pathname;
    if (/^\/\d+$/.test(s) || /^\/topic\/[^\/]+$/.test(s)) {
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

console.log("[QLivePlayer] Hook loaded.");
