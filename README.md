<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    </head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">

  <h1 align="center">🎲 Colonist.io Drawing Tablet Fix 🖊️</h1>
  
<div align="center">
    
![demo.gif](https://github.com/R0mb0/Colonist_drawing_tablet_fix/blob/main/Demo/Demo.gif?raw=true)

</div>

<p> The GIF above is just a quick demonstration to show the script in action. I'm not an expert player, so please ignore my terrible moves and strategy! 😅 </p>

<div align="center">

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1a4abe616c964f738a32483c2913e183)](https://app.codacy.com/gh/R0mb0/Colonist_tablet_fix/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/Colonist_tablet_fix)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/Colonist_tablet_fix)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

</div>

  <p>
      A lightweight <strong>Tampermonkey Userscript</strong> designed to restore full playability on 
      <a href="https://colonist.io" target="_blank">Colonist.io</a> for users playing with a drawing tablet 
      (e.g., Ugee, Wacom, Huion).
  </p>

  <hr>

  <h2>🔴 The Problem</h2>
  <p>
      When entering a match in Colonist, the game renders the board inside an HTML5 <code>&lt;canvas&gt;</code> element. 
      While standard UI buttons recognize pen taps, the game canvas often ignores them because drawing tablet drivers 
      (via Windows Ink) send <code>PointerEvents</code> instead of standard <code>MouseEvents</code>. This results in 
      being able to move the cursor, but being completely unable to click or interact with the board.
  </p>

  <h2>🟢 The Solution</h2>
  <p>
      This script acts as a middleware. It listens for interactions from a pen (<code>pointerdown</code>, <code>pointerup</code>) 
      and dynamically translates them into synthetic <code>mousedown</code> and <code>mouseup</code> events, fooling the 
      game engine into thinking a standard mouse is being used.
  </p>

  <h2>💻 The Code</h2>
  <p>You can copy the code directly from this box without having to search for the file in the repository:</p>
  
  <pre style="background-color: #282c34; color: #abb2bf; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', Courier, monospace;"><code>// ==UserScript==
// ==UserScript==
// @name         Colonist.io Drawing Tablet Fix v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Spoofs pen pointer events as mouse pointer events to fix tablet input on Colonist.io.
// @author       R0mb0
// @match        *://colonist.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function spoofPenAsMouse(event) {
        // Intervene ONLY if the input is from a pen and is a legitimate, physical event (isTrusted).
        // Bypassing this check would result in an infinite loop caused by our own dispatched synthetic events.
        if (event.pointerType === 'pen' && event.isTrusted) {
            
            // 1. Immediately halt the original pen event. 
            // This prevents the browser from translating it into a 'touchstart' event and stops the PixiJS engine from processing the native pen input.
            event.stopImmediatePropagation();
            if (event.type !== 'pointermove') {
                event.preventDefault(); // Prevent unexpected native browser behaviors (e.g., scrolling, panning)
            }

            // 2. Construct a synthetic PointerEvent identical to the original, but spoofed as a mouse.
            const simulatedEvent = new PointerEvent(event.type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: event.clientX,
                clientY: event.clientY,
                screenX: event.screenX,
                screenY: event.screenY,
                movementX: event.movementX,
                movementY: event.movementY,
                // Ensure mouse buttons are simulated correctly (left click mapping)
                button: event.type === 'pointermove' ? -1 : 0,
                buttons: event.type === 'pointerdown' ? 1 : (event.type === 'pointermove' && event.buttons ? 1 : 0),
                pointerId: 1, // Standard pointerId for the primary mouse
                pointerType: 'mouse', 
                isPrimary: true
            });

            // 3. Dispatch the synthetic event to the original target (the game canvas).
            event.target.dispatchEvent(simulatedEvent);
        }
    }

    // Use the capture phase (true) to intercept events BEFORE the game's event listeners can process them.
    document.addEventListener('pointerdown', spoofPenAsMouse, true);
    document.addEventListener('pointerup', spoofPenAsMouse, true);
    document.addEventListener('pointermove', spoofPenAsMouse, true); 
})();</code></pre>

  <h2>🛠️ Installation Instructions</h2>
  <ol>
      <li>Install a userscript manager browser extension like 
          <a href="https://www.tampermonkey.net/" target="_blank">Tampermonkey</a> or Violentmonkey.
      </li>
      <li>Create a new script in the extension dashboard.</li>
      <li>Copy the entire JavaScript code from the dark box above.</li>
      <li>Paste it into the new script window in Tampermonkey.</li>
      <li>Save the script (Ctrl+S or Cmd+S).</li>
      <li>Refresh your Colonist.io page and enjoy playing with your tablet!</li>
  </ol>

  <h2>🤝 Contributing</h2>
  <p>
      Feel free to open an issue or submit a pull request if you notice bugs, especially regarding drag-and-drop actions 
      which might require further event mapping.
  </p>

</body>
</html>

<div align="center">

## Dedicated with love to Lucia ❤️

</div>

<a href="https://github.com/R0mb0/Crafted_with_AI">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/CraftedWithAIDark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAILight.svg">
    <img alt="Not made by AI" src="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAIDefault.svg">
  </picture>
</a>
