// ==UserScript==
// @name         Click to QLivePlayer - BiliBili
// @version      0.3.0
// @description  Open QLivePlayer instead when click on BiliBili
// @author       Chinory
// @homepage     https://github.com/Chinory/tampermonkey-scripts/wiki/Click-to-QLivePlayer
// @downloadURL  https://raw.githubusercontent.com/Chinory/tampermonkey-scripts/main/click-to-qliveplayer-bilibili.js
// @match        *://*.bilibili.com/*
// @grant        unsafeWindow

// ==/UserScript==
"use strict";

var window = unsafeWindow;

window.qlp_rewrite = function qlp_rewrite(url) {
  var l = new URL(url, this.location.href);
  var n = l.hostname;
  if (n === "www.bilibili.com") {
    var s = l.pathname;
    if (s.slice(0, 7) !== "/video/"
     && s.slice(0, 14) !== "/bangumi/play/") return;
    var p = l.searchParams.get("p");
    if (p) s = s + "?p=" + p;
  } else if (n === "live.bilibili.com") {
    if (!/^\/\d+$/.test((s = l.pathname))) return;
  } else {
    return;
  }
  return "qliveplayer://" + l.host + s;
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
  if (a) {
    var url = a.href;
    var u = this.qlp_rewrite(url);
    if (u && this.qlp_rawopen(u, "_self")) {
      console.log("[QLivePlayer][href]", url);
      return e.preventDefault();
    }
  }
}, true);

console.log("[QLivePlayer] Hook loaded.");
