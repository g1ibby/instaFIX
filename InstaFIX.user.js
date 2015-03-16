// ==UserScript==
// @name         InstaFIX
// @namespace    http://github.com/wss-world/
// @version      0.1
// @description  full count followers
// @author       Sergei Wariburs
// @match        https://instagram.com/*
// @require      https://code.jquery.com/jquery-2.1.3.min.js
// @grant        none
// ==/UserScript==

$(function(){
    console.log("I'm running with jQuery!");

    waitForKeyElements (
            "body > div.root > div > div > div > div.mbInfo > div > ul > li:nth-child(2) > span > span.sCount"
            , CallbackFunction
    );
    
    function CallbackFunction (jNode) {
        console.log('CallbackFunction');
        var count = jNode.attr("title");
        jNode.html(count);
    }
    
    
    function waitForKeyElements (
    selectorTxt,    
    actionFunction, 
    bWaitOnce,      
    iframeSelector  
    ) {
    var targetNodes, btargetsFound;
 
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);
 
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;
 
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }
 
    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];
 
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
})

