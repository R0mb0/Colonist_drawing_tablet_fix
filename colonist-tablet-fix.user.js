// ==UserScript==
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

    // Function to translate pointer events to mouse events
    function translateEvent(event) {
        // We only want to intervene if the input is explicitly from a pen/tablet.
        // This prevents double-clicking issues if you switch back to a real mouse.
        if (event.pointerType !== 'pen') return;

        // Map the pointer event to the corresponding mouse event
        let mouseEventType = '';
        if (event.type === 'pointerdown') mouseEventType = 'mousedown';
        if (event.type === 'pointerup') mouseEventType = 'mouseup';
        
        // Note: pointermove is usually handled well by browsers, but we map it just in case
        if (event.type === 'pointermove') mouseEventType = 'mousemove';

        if (mouseEventType) {
            // Create a synthetic mouse event mimicking the exact pen coordinates
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

            // Dispatch the synthetic event to the exact same target (the game canvas)
            event.target.dispatchEvent(simulatedEvent);
        }
    }

    // Attach listeners during the capture phase (true) to intercept the event 
    // before the game's engine potentially stops it.
    document.addEventListener('pointerdown', translateEvent, true);
    document.addEventListener('pointerup', translateEvent, true);
    // document.addEventListener('pointermove', translateEvent, true); // Uncomment if drag&drop isn't working
})();
