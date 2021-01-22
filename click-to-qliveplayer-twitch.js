// ==UserScript==
// @name         Click to QLivePlayer - Twitch
// @version      0.3.0
// @description  Open QLivePlayer instead when click on Twitch
// @author       Chinory
// @homepage     https://github.com/Chinory/tampermonkey-scripts/wiki/Click-to-QLivePlayer
// @downloadURL  https://raw.githubusercontent.com/Chinory/tampermonkey-scripts/main/click-to-qliveplayer-twitch.js
// @match        *://www.twitch.tv/*
// @grant        unsafeWindow

// ==/UserScript==
"use strict";

var window = unsafeWindow;

window.qlp_blacklist = [
  "/directory",
  "/downloads",
  "/search",
  "/store",
  "/turbo",
];

window.qlp_rewrite = function qlp_rewrite(url) {
  var l = new URL(url, this.location.href);
  if (l.hostname === "www.twitch.tv") {
    var s = l.pathname;
    var m = /^\/[^\/]+$/.exec(s);
    if (m && !this.qlp_blacklist.includes(m[0])) {
      return "qliveplayer://" + l.host + s;
    }
  }
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
