// Stolen from:
// https://codepen.io/tornography/pen/qaBOLJ

function countdown(options) {

  if (!options) {
    alert("countdown: options cannot be blank");
    return;
  }

  if (!options.containerId) {
    alert("countdown: options.containerId cannot be blank");
    return;
  }

  if (!options.soiTimestamp) {
    alert("countdown: options.soiTimestamp cannot be blank");
    return;
  }

  if (!options.targetTime) {
    alert("countdown: options.targetTime cannot be blank");
    return;
  }

  var currentTime = new Date(options.soiTimestamp * 1000);
  var targetTime = new Date(options.targetTime * 1000);

  console.log(currentTime);
  console.log(targetTime);

  var container = document.getElementById(options.containerId);
  if (!container) {
    alert("countdown: Could not find the container" + container);
  }


  container.innerHTML = getClockHtml();

}

function getClockHtml(label) {
  var html = "";

  function replaceAll(src, orig, replace) {
    var reg = new RegExp(orig, "gi");
    var res = src.replace(reg, replace);
    return res;
  }

  function generateLinkage(label, classbit1) {
    var html = "";
    var classbit2 = classbit1 + 1;

    for (var i = 0; i < 10; i++) {
      html += '  	[data-#label^="#i"] .digit-#classbit1 [class*="#i"],\r\n';
      html += '  	[data-#label$="#i"] .digit-#classbit2 [class*="#i"],\r\n';

      html = replaceAll(html, "#label", label);

      html = replaceAll(html, "#i", i);
      html = replaceAll(html, "#classbit1", classbit1);
      html = replaceAll(html, "#classbit2", classbit2);
    }
    return html;
  }

  function drawFace(str) {
    var digitWidth = 52;
    var dotWidth = 20;
    var html = "";
    var digitCount = 0;
    var dotCount = 0;

    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);

      var offset = (digitCount * digitWidth) + (dotCount * dotWidth);


      if (ch === ":") {
         html += '    <g class="dots">';
         html += '      <circle id="dot" cx="#offset" cy="24" r="4" />';
         html += '      <circle id="dot" cx="#offset" cy="62" r="4" />';
         html += '    </g>';
        dotCount++;
      } else {
        html += '    <g class="digit digit-#digit">';
        html += getDigitGuts(offset, "");
        html += '    </g>';
        digitCount++;
      }
      html = replaceAll(html, "#offset", offset +dotWidth/2);
      html = replaceAll(html, "#digit", ch);
    }
    return html;
  }

  function getDigitGuts(offset, fill) {
    var html = "";

    var data = [{
        class: "12347890",
        points: [48, 38, 44, 42, 40, 38, 40, 10, 44, 6, 48, 10, 48, 38]
      },
      {
        class: "23567890",
        points: [38, 0, 42, 4, 38, 8, 10, 8, 6, 4, 10, 0, 38, 0]
      },
      {
        class: "456890",
        points: [8, 38, 4, 42, 0, 38, 0, 10, 4, 6, 8, 10, 8, 38]
      },
      {
        class: "2345689",
        points: [38, 40, 42, 44, 38, 48, 10, 48, 6, 44, 10, 40, 38, 40]
      },
      {
        class: "2356890",
        points: [38, 80, 42, 84, 38, 88, 10, 88, 6, 84, 10, 80, 38, 80]
      },
      {
        class: "2680",
        points: [8, 78, 4, 82, 0, 78, 0, 50, 4, 46, 8, 50, 8, 78, ]
      },
      {
        class: "134567890",
        points: [48, 78, 44, 82, 40, 78, 40, 50, 44, 46, 48, 50, 48, 78]
      },
    ];

    for (var i = 0; i < data.length; i++) {
      var d = data[i];

      var isChange = true;
      var points = d.points.map(point => {
        var ret = isChange ? point + offset : point;
        isChange = !isChange;
        return ret;
      });

      line = '      <polygon class="#class" points="#points" fill="#fill" />';
      line = replaceAll(line, "#fill", fill);
      line = replaceAll(line, "#class", d.class);
      line = replaceAll(line, "#points", points.join(" "));

      html += line;
    }

    return html;
  }



  html += '  <svg id="clock" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 552 88" class="dots-on" data-day="43" data-hour="11" data-minute="28" data-second="43">';
  html += '    <title>Digital clock – time set via data attributes</title>';
  html += '    <style>';
  html += '      .dots,';
  html += '  	.digit {';
  html += '  		fill: rgba(0,0,0,0.05);';
  html += '  	}';
  html += '  	.dots-on .dots {';
  html += '  		fill: black;';
  html += '  	}';
  html += '';

  html += generateLinkage("day", 1);
  html += generateLinkage("hour", 3);
  html += generateLinkage("minute", 5);
  html += generateLinkage("second", 7);

  var initialPoint = 48;
  html += '  	[data-second$="DUMMY_LINE"] .digit-DUMMY_LINE [class*="DUMMY_LINE"] { fill: black; }';
  html += '';
  html += '    </style>';

  html += drawFace("12:34:56:78");
  html += '  </svg>';
  return html;
}
