function ParseToDate(dateStriing) {
    var s = dateStriing ;
    var a = s.split(/[^0-9]/);

    if (a.length < 7) {
        return null ;
    } else {
        return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5],a[6] );
    }
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

function generateResult(listener) {
    var version = 2 ;

    if (form.version.value == 0) {
        // v1かv2の自動判別
        for (var i=0; i<lines.length && i<10; i++) {
            var elements = lines[i] ;

            if (elements.length < 3) {
                version = 1 ;
                break ;
            }

            if (elements[1] != "") {
                var time = ParseToDate(elements[1]) ;
                                
                if (time == null) {
                    version = 1 ;
                    break ;
                } 
            }
        }
    } else if (form.version.value == 1) {
        version = 1 ;
    } else if (form.version.value == 2) {
        version = 2 ;
    }

    document.getElementById("detectedVersion").innerText = "読み込んだファイルはバージョン" + version + "です。" ;

    var replacingDots = form.replacingDots.checked ;
    var dividing = form.dividing.checked ;

    var result = "" ;
    var firstElement = true ;
    var offsetTime = "" ;
    var num = 1 ;

    for (var i=0; i<lines.length; i++) {
        var elements = lines[i] ;
        var nextElements = null ;
        
        if (i+1 < lines.length) {
            nextElements = lines[i+1] ;
        }

        if (firstElement == true) {
            offsetTime = ParseToDate(elements[0]) ;
            firstElement = false ;
        }

        var beginTime = ParseToDate(elements[0]) ;
        var endTime = 0 ;
        var content = "" ;

        if (version == 1) {
            // v1
            endTime = nextElements != null ? ParseToDate(nextElements[0]) : 0 ;
            content = elements[1] ;
        } else {
            // v2
            if (elements[1] != "") {
                endTime = ParseToDate(elements[1]) ;

                if (endTime < beginTime) {
                    endTime = 0 ;
                }
            }
        
            if (endTime == 0)
                endTime = nextElements != null ? ParseToDate(nextElements[0]) : 0 ;
            }

            content = elements[2] ;
        }

        if (content.length == 0) {
            continue ;
        }

        var timeOfChar = 60000 / 300 ; // average

        if (endTime != 0) {
            timeOfChar = (endTime - beginTime) / content.length ;
        
            if (timeOfChar > 60000 / 300) { // if over average, reset to average.
                timeOfChar = 60000 / 300 ;   
            }
        }
        
        var countPerLine = Number(form.lineCount.value) ;
        var currnetIndex = 0 ;
        var currentOffset = 0 ;
        var segmenter = new TinySegmenter();
        var segs ;
        
        if (endTime != 0) {
            segs = segmenter.segment(content); 
        } else {
            segs = new Array();
            segs.push(content);
        }

        var tempContent = "";

        for (var s=0; s<=segs.length; s++) {
            
            if (s < segs.length) {
                var remainContent = "" ;

                for (var t=s; t<segs.length; t++) {
                    remainContent += segs[t] ;
                }

                if (remainContent.length < 6) {
                    tempContent += remainContent ;
                    s = segs.length ;
                } else {
                    tempContent += segs[s] ;
                }    
            }

            if (tempContent.endsWith("。") || tempContent.length > countPerLine || s == segs.length) {
                if (dividing) {
                    if (tempContent.length > countPerLine / 2) {
                        tempContent = tempContent.slice(0, countPerLine / 2) + "\n" + tempContent.slice(countPerLine / 2) ;
                    }
                }
                                        
                tempContent = tempContent.trim();

                if (replacingDots) {
                    tempContent = tempContent.replace("、", " ") ;
                    tempContent = tempContent.replace("、", " ") ;
                    tempContent = tempContent.replace("。", "") ;
                }

                if (tempContent.length != 0 && tempContent != "、" && tempContent != "。") {
                    var tempBeginTime = currnetIndex * timeOfChar ;   
                    var tempEndTime = tempBeginTime + (timeOfChar * tempContent.length) ;

                    tempBeginTime = Math.floor(tempBeginTime) ;
                    tempEndTime = Math.floor(tempEndTime) ;

                    var tempBeginTimeF = millisecToTime(Number((beginTime - offsetTime).toString()) + Number(form.offsetTime.value) + tempBeginTime, ".") ;
                    var tempEndTimeF = millisecToTime(Number((beginTime - offsetTime).toString()) + Number(form.offsetTime.value) + tempEndTime, ".") ;

                    if (tempBeginTimeF != "" && tempEndTimeF != "") {
                        result += listener(num, tempBeginTimeF, tempEndTimeF, tempContent) ;
                        num++ ;
                    }
                }

                currnetIndex += tempContent.length ;
                tempContent = "";
            }
        }
    }

    form.output.textContent = result ;
}