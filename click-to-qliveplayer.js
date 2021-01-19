// ==UserScript==
// @name         Click to QLivePlayer
// @version      0.1.0
// @description  Open QLivePlayer instead when click on video link in BiliBili
// @author       Chinory
// @homepage     https://github.com/Chinory/tampermonkey-scripts/wiki/click-to-qliveplayer.js
// @match        *://*.bilibili.com/*
// @grant        unsafeWindow

// ==/UserScript==
'use strict'

window.addEventListener('click', function (e) {
  var a = e.target.closest('a')
  if (a == null) return
  var l = new URL(a.href)
  var s = l.pathname
  var p
  switch (l.hostname) {
    case 'www.bilibili.com': {
      if (s.slice(0, 7) !== '/video/' &&
          s.slice(0, 14) !== '/bangumi/play/') return
      p = (p = l.searchParams.get('p')) ? '?p=' + p : ''
      break
    }
    case 'live.bilibili.com': {
      if (!/^\/\d+$/.test(s)) return
      p = ''
      break
    }
    default:
      return
  }
  this.open('qliveplayer://' + l.host + s + p, '_self')
  return e.preventDefault()
}, true)
