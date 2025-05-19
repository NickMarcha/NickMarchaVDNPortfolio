import {atom, getDefaultStore} from 'jotai';

export const DebugModeEnabledAtom = atom(false);

//global function to enable debug mode in developer console
export function goDebugMode() {
    const old = getDefaultStore().get(DebugModeEnabledAtom)
    getDefaultStore().set(DebugModeEnabledAtom, !old)

    console.warn("Debug mode " + (!old ? "enabled" : "disabled") + ".");
    return "Debug mode " + (!old ? "enabled" : "disabled") + ".";
}

export function attachDebugMode(window: Window) {
    /* if( process.env.REACT_APP_ALLOW_DEBUG_MODE !== "true"){
         return;
     }*/

    if ("goDebug" in window) {
        return;
    }

    console.log("Attaching debug mode to window")

    // @ts-ignore
    window["goDebug"] = goDebugMode;

    /* //keyboard shortcuts to enable or disable debug mode if react in developer mode
     if (process.env.NODE_ENV === 'development') {
         window.addEventListener('keydown', (e) => {
             if (e.ctrlKey && e.key === 'F12') {
                 goFullInky();
             }
         });
     }
 */
}