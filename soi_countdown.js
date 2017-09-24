// Stolen from:
// https://codepen.io/tornography/pen/qaBOLJ

function countdown(options) {

  if (!options) {
    alert("countdown: options cannot be blank");
    return;
  }

  options.dimColor = options.dimColor || "gray";

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

  if (!options.useDays === undefined) {
    alert("countdown: options.useDays cannot be undefined");
    return;
  }

  var container = document.getElementById(options.containerId);
  if (!container) {
    alert("countdown: Could not find the container:" + container);
    return;
  }

  var startingSoiTime = new Date(options.soiTimestamp * 1000).getTime();
  var targetSoiTime = new Date(options.targetTime * 1000).getTime();
  var localTimeAtStart = new Date().getTime();

  container.innerHTML = getClockHtml();

  function timer() {

    function dateMeasure(ms) {
      function pad(i) {
        return (i < 10) ? "0" + i : i;
      }

      var d, h, m, s;
      s = Math.floor(ms / 1000);
      m = Math.floor(s / 60);
      s = s % 60;
      h = Math.floor(m / 60);
      m = m % 60;
      d = Math.floor(h / 24);
      h = h % 24;

      return {
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s)
      };
    };

    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - localTimeAtStart;

    var currentSoiTime = startingSoiTime + elapsedTime;
    var timeLeft = targetSoiTime - currentSoiTime;
    var svgElement = document.getElementById("countdown-timer");

    if (timeLeft > 0) {
      var times = dateMeasure(timeLeft);

      svgElement.setAttribute('data-day', times.day);
      svgElement.setAttribute('data-hour', times.hours);
      svgElement.setAttribute('data-minute', times.minutes);
      svgElement.setAttribute('data-second', times.seconds);
    } else {
      svgElement.setAttribute('data-day', "00");
      svgElement.setAttribute('data-hour', "00");
      svgElement.setAttribute('data-minute', "00");
      svgElement.setAttribute('data-second', "00");
    }
    try {
      svgElement.classList.toggle('dots-on');
    } catch (err) {}

    // Make sure we update twice a second, as close to on-time as we can.
    var delay = 500 - ((currentTime) % 500);
    setTimeout(timer, delay);
  }
  timer();

  (function() {
    var button = document.getElementById("soi_calc_time");
    button.addEventListener("click", function() {

      var offset = document.getElementById("soi_time_correct").value;
      var displaySpan = document.getElementById("adjusted_time_display");
      var eventDateStr = document.getElementById("soi_time_event").value;

      var from = eventDateStr.split("-");
      var eventDateMs = new Date(from[0], from[1] - 1, from[2]).getTime();
      var offsetToMs = offset * 60 * 1000;

      var soiEventDate = Math.floor((eventDateMs + offsetToMs) / 1000);
      displaySpan.innerHTML = "Set <b>config.targetTime</b> to <b>" + soiEventDate + "</b>";

      console.log("Offset", offset);
      console.log("eventDateStr", eventDateStr);
      console.log("eventDateMs", eventDateMs);
      console.log("offsetToMs", offsetToMs);
      console.log("soiEventDate", soiEventDate);
    });
  }());

  function getClockHtml() {
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
          html += getDigitGuts(offset);
          html += '    </g>';
          digitCount++;
        }
        html = replaceAll(html, "#offset", offset + dotWidth / 2);
        html = replaceAll(html, "#digit", ch);
      }
      return html;
    }

    function getDigitGuts(offset) {
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
        var points = d.points.map(function (point) {
          var ret = isChange ? point + offset : point;
          isChange = !isChange;
          return ret;
        });

        line = '      <polygon class="#class" points="#points"  />';
        line = replaceAll(line, "#class", d.class);
        line = replaceAll(line, "#points", points.join(" "));

        html += line;
      }

      return html;
    }

    html += '  <svg id="countdown-timer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 552 88" class="dots-on" data-day="12" data-hour="34" data-minute="56" data-second="78">';
    html += '    <title>Digital clock – time set via data attributes</title>';
    html += '    <style>';
    html += '      .dots, .digit {';
    html += '  		fill:  ' + options.dimColor + ';';
    html += '  	}';
    html += '  	.dots-on .dots {';
    html += '  		fill: ' + options.fillColor + ';';
    html += '  	}';
    html += '';

    if (options.useDays) {
      html += generateLinkage("day", 1);
      html += generateLinkage("hour", 3);
      html += generateLinkage("minute", 5);
      html += generateLinkage("second", 7);
    } else {
      html += generateLinkage("hour", 1);
      html += generateLinkage("minute", 3);
      html += generateLinkage("second", 5);
    }

    var initialPoint = 48;
    html += '  	[data-second$="DUMMY_LINE"] .digit-DUMMY_LINE [class*="DUMMY_LINE"] { fill: ' + options.fillColor + '; }';
    html += '';
    html += '    </style>';

    if (options.useDays) {
      html += drawFace("12:34:56:78");
    } else {
      html += drawFace("12:34:56");
    }
    html += '  </svg>';

    var canDisplayEditor = options.roomOwner === options.currentUser ? "block" : "none";

    html += "<form action='#' style='display:" + canDisplayEditor + "'>";
    html += "  <label>Your time to SOI Time correction (in minutes): <input type='number' id='soi_time_correct'></label>";
    html += "  <br>"
    html += "  <i>Note: This number will change as daylight savings time comes and goes.";
    html += "  <br>This number may not be the same as what you see looking at SOI's clock";
    html += "  <br>"
    html += "  <span id='adjusted_time_display'>[nothing yet]</span>";
    html += "  <br>"
    html += "  <label>Event Date: <input id='soi_time_event' type='date'></label>";
    html += "  <br>"
    html += "  <button id='soi_calc_time' type='button'>Calculate</button>"
    html += "</form>";

    return html;
  }
}
