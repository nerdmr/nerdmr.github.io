var sections = document.getElementsByClassName("incremental-fade");
var paras = document.getElementsByClassName("para");
var lightboxes = document.getElementsByClassName("lightbox");

window.addEventListener("scroll", scrollListener);
var FIRST_PASS=true;
var FIXED = false;
function scrollListener() {
	var d= document.documentElement.scrollTop || document.body.scrollTop;
	var bottomThreshold = .15 * window.innerHeight;
	
	// deal with affix
	var leftCol = document.getElementById("left-col");
	
	var topPlusHeight = leftCol.offsetTop + leftCol.offsetHeight;
	var winBottom = d + window.innerHeight;

	
	if (FIXED) {
		if (leftCol.offsetHeight > winBottom) {
			leftCol.classList.remove('fix-bottom');
			FIXED = false;
		}
	}
	else {
		if (topPlusHeight < winBottom) {
			leftCol.classList.add('fix-bottom');
			FIXED = true;
		}
	}
	
	
	
	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		var a = section.getBoundingClientRect().top + d;
		var b = d + window.innerHeight;
		// 150
		// 680
		if (a < b - bottomThreshold && a + section.offsetHeight > b - window.innerHeight) {
			section.classList.add('show');
			section.classList.add('y');
		}
		else if (a > b && FIRST_PASS) {
			section.classList.remove('show');
		}
		else if (a < b - bottomThreshold && FIRST_PASS) {
			section.classList.remove('show');
		}
	}
	FIRST_PASS = false;
	
	/*
	if(scrollHandling.allow) {
		paras.each(function(i) {
			var start = $(this).data("para-start");
			var stop = $(this).data("para-stop");
			
			if (!start) {
				var startPer = $(this).data("para-start-percent");
				// convert to pixels
				var totalHeight = $(document).height() - $(window).height();
				start = startPer / 100 * totalHeight;
			}
			
			if (!stop) {
				var stopPer = $(this).data("para-stop-percent");
				// convert to pixels
				var totalHeight = $(document).height() - $(window).height();
				stop = stopPer / 100 * totalHeight;
			}
			
			var delta = stop - start;
			var imgEle = $(this).children("img");
			var childHeight = imgEle.height();
			var thisHeight = $(this).outerHeight();
			
			var fullBottom = thisHeight - childHeight;
			
			if (d > start && d <= stop) {
				var diff = d - start;
				var y = (diff / delta) * fullBottom;
				//console.log(y);
				imgEle.css("top",y + "px");
			}
			// full bottom is top: paraHeight - childHeight
			
			// at 'stop' bottom of paraHeight should be aligned
		});
        scrollHandling.allow = false;
        setTimeout(scrollHandling.reallow, scrollHandling.delay);
    }
	*/
	
}

scrollListener();

/*
$(function() {
	sections.each(function(i) {
		a = $(this).offset().top;
		b = $(window).scrollTop() + $(window).height();

		if (a > b) {
			$(this).removeClass('show');
		}
		
	});
	
lightboxes.each(function(i) {
		var lb = $(this);
		$(this).next().click(function() {
			$(lb).toggleClass('show');
		});
	});
});
*/

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  //var angleInRadians = ((angleInDegrees-90) * Math.PI / 180.0);
	var angleInRadians = angleInDegrees;
  return {
    x: centerX + Math.round((radius * Math.cos(angleInRadians))),
    y: centerY + Math.round((radius * Math.sin(angleInRadians)))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

	//var start = startAngle;
	//var end = endAngle;
	
    var largeArcFlag = endAngle - startAngle <= (Math.PI) ? "0" : "1";

    var d = [
        "M",115, 115,
        "L", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
} 

var doc = new jsPDF();
function MakePDF() {
	

	// We'll make our own renderer to skip this editor
	var specialElementHandlers = {
		'#editor': function(element, renderer){
			return true;
		}
	};

	// All units are in the set measurement for the document
	// This can be changed to "pt" (points), "mm" (Default), "cm", "in"
	doc.fromHTML('right', 15, 15, {
		'width': 170, 
		'elementHandlers': specialElementHandlers
	});
}

function demoFromHTML(id) {
        var pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        source = $(id);

        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        };
        margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                
            }, margins
        );
		pdf.save('Test.pdf');
    }