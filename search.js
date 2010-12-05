var searchMode = false;
var searchString = "";
var f3Count = 0;

var initializeOnDomReady = function() {
    document.addEventListener("keydown", onKeydown, true);
    document.addEventListener("keypress", onKeypress, true);
},

onKeydown = function(event) {
    if (insideInputField(event)) {
        exitSearchMode(); // even if we are not in search this is ok
        return true;
    }

    console.log("onKeydown, keyCode = " + event.keyCode);

    if (searchMode) {
        if ( event.keyCode == 27 ) { // escaping search mode
            exitSearchMode();
            console.log('exited search mode');
        }
        if (event.keyCode == 8 ) { // backspace need to adjust search string
            console.log('backspace pressed in search mode');
            if (searchString.length > 0) {
                searchString = searchString.substring(0, searchString.length - 1);
                // we need to initiate search here as backspace will trigger
                // browsers 'go back' action without calling firing onKeypress
                doSearch(searchString);
            }
            event.preventDefault();
            event.stopPropagation();  
        } else if (event.keyCode == 114 ) { // F3
            console.log("F3 pressed");
            f3Count++;
            doSearch(searchString);
            event.preventDefault();
            event.stopPropagation();  
        }
    } 
    console.log("exiting onKeydown() ");
    return true;
},
onKeypress= function(event) {

    if (insideInputField(event)) {
        exitSearchMode(); // even if we are not in search this is ok
        return true;
    }

    console.log("onKeypress, keyCode = " + event.keyCode);
    if (searchMode) {
        if ( event.keyCode == 27 ) { // escaping search mode
            exitSearchMode();
            console.log('exited search mode');
            return false;
        } 
       console.log(event.keyCode);
        if (event.keyCode > 46 ) { // don't care about modifiers
            char = String.fromCharCode(event. charCode);
            searchString += char;
            console.log(char + ' pressed');
        }
        doSearch(searchString);
        event.preventDefault();
        event.stopPropagation();
        return false;
    } else {
        if ( event.keyCode == 39) { // enter link search mode
            searchMode = true;
            searchString = "";
            console.log('entered search mode');
        }
    }
},

doSearch = function(text) {
    console.log('I am searching for: ' + searchString);
    //clear previous highlighted result
    clearSelections();

    //    elem = $("a:contains('" + text + "')");
    // do case insensetive contains
    elem = $("a").filter(function() {
        return new RegExp(text, "i").test( $(this).text() );
    });

    if (elem.length > 0) {
        index = f3Count % elem.length;
        console.log(elem[0]);
        elem[index].focus();
        // highlight the mattched bit
        if (elem[index].firstChild && elem[index].firstChild.nodeType == 3) {
            node = elem[index].firstChild;
            pat = text.toUpperCase();
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                spannode.setAttribute('style', 'background-color:blue;');
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
            }
        }
    }
},

insideInputField = function(event) {
    console.log(event.srcElement);
    if (event.srcElement && event.srcElement.nodeName.toUpperCase() == 'INPUT' ) {
        if ($(event.srcElement).attr("type").toUpperCase() == "TEXT" || 
            $(event.srcElement).attr("type").toUpperCase() == "TEXTAREA" ) {
            return true;
        }
    }
    return false;
},

clearSelections = function() {
    $("span.highlight").each(function() {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    });
},

exitSearchMode = function(){
    searchString = "";
    searchMode = false;
    f3Count = 0;
    clearSelections();
};

window.addEventListener("DOMContentLoaded", initializeOnDomReady);
