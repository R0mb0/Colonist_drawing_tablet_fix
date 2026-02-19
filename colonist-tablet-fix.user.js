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
})();
