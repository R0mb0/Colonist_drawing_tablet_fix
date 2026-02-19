<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    </head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">

  <h1 align="center">🎲 Colonist.io Drawing Tablet Fix 🖊️</h1>

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
// @name         Colonist.io Drawing Tablet Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes drawing tablet (pen) input on Colonist.io by translating pointer events to mouse events.
// @author       R0mb0
// @match        *://colonist.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colonist.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function translateEvent(event) {
        if (event.pointerType !== 'pen') return;

        let mouseEventType = '';
        if (event.type === 'pointerdown') mouseEventType = 'mousedown';
        if (event.type === 'pointerup') mouseEventType = 'mouseup';
        if (event.type === 'pointermove') mouseEventType = 'mousemove';

        if (mouseEventType) {
            const simulatedEvent = new MouseEvent(mouseEventType, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: event.clientX,
                clientY: event.clientY,
                screenX: event.screenX,
                screenY: event.screenY,
                button: event.button,
                buttons: event.buttons
            });

            event.target.dispatchEvent(simulatedEvent);
        }
    }

    document.addEventListener('pointerdown', translateEvent, true);
    document.addEventListener('pointerup', translateEvent, true);
    // document.addEventListener('pointermove', translateEvent, true); // Uncomment if drag&drop isn't working
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
