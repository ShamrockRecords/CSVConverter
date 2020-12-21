function ParseToDate(dateStriing) {
    var s = dateStriing ;
    var a = s.split(/[^0-9]/);
    return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5],a[6] );
}

function millisecToTime(millisec, separator) {
    if (millisec < 0) {
        return "" ;
    }

    var ms = millisec % 1000 ;
    var totalSeconds = Math.floor(millisec / 1000) ;
    var s = totalSeconds % 60 ;
    var m = Math.floor(totalSeconds / 60) % 60 ;
    var h = Math.floor(totalSeconds / (60 * 60)) ;

    return ('00' + h).slice(-2) + ":" + ('00' + m).slice(-2) + ":" + ('00' + s).slice(-2) + separator + ('000' + ms).slice(-3) ;
}

// CSV -> Array
function convert(fileContent) {
    var lines = new Array() ;
    var rawLines = fileContent.split('\n') ;

    var ignoreCamma = false ;
    var element = "" ;
    var elements = new Array() ;

    for (var i=0; i<rawLines.length; i++) {
        var rawLine = rawLines[i] ;

        if (rawLine == "") {
            continue ;
        }
        
        if (rawLine.startsWith("#")) {
            continue ;
        }

        for (var x=0; x<rawLine.length; x++) {
            var c = rawLine[x] ;

            if (c == '"') {
                ignoreCamma = !ignoreCamma ;
            } else if (c == ',' && !ignoreCamma) {
                elements.push(element) ;
                element = "" ;
            } else {
                element += c ;
            }
        }

        if (!ignoreCamma) {
            elements.push(element) ;
            lines.push(elements) ;

            element = "" ;
            elements = new Array() ;
        } else {
            element += '\n' ;
        }
     }

    return lines ;
}