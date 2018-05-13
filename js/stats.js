// General variables for detection
var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
var isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') > -1;
var isPC = ((navigator.userAgent.toUpperCase().indexOf('WINDOWS') > -1) || (navigator.userAgent.toUpperCase().indexOf('LINUX') > -1));

// Device info
function printDeviceInfo() {
	var content = "";
	var icon = "";
	var warning = "";
	// Device icon
	if ((platform.product == "iPhone") || (platform.product == "iPod")) {
		icon = "<p><span aria-label='iPhone icon' class='material-icons device-icon'>&#xE325;</span></p>";
	} else if (platform.product == "iPad") {
		icon = "<p><span aria-label='iPad icon' class='material-icons device-icon'>&#xE30B;</span></p>";
	} else if (isAndroid) {
		icon = "<p><span aria-label='Android icon' class='material-icons device-icon'>&#xE30B;</span></p>";
	} else if (isMac) {
		icon = "<p><span aria-label='Mac icon' class='material-icons device-icon'>&#xE30B;</span></p>";
	} else if (isPC) {
		icon = "<p><span aria-label='Windows icon' class='material-icons device-icon'>&#xE30C;</span></p>";
	} else {
		icon = "<p><span aria-label='Generic device icon' class='material-icons device-icon'>&#xE337;</span></p>";
	}
	// Device name
	if (platform.manufacturer && platform.product) {
		// Some devices have the same value for both
		if (platform.manufacturer == platform.product) {
			content += "<p class='title'>Unknown " + platform.manufacturer + " device</p>";
		} else {
			content += "<p class='title'>" + platform.manufacturer + " " + platform.product + "</p>";
		}
	} else if (platform.product) {
		content += "<p class='title'>" + platform.product + "</p>";
	} else if (isAndroid) {
		content += "<p class='title'>Unknown Android device</p>"
	} else {
		// Determine if running a Mac
		if (isMac) {
			content += "<p class='title'>Unknown Mac computer</p>";
		// Anything else is a PC
		} else if (isPC) {
			content += "<p class='title'>Unknown PC</p>";
		} else {
			content += "<p class='title'>Unknown device</p>";
		}
	}
	// Operating system
	if (platform.os) {
		content += "<p><b>Operating system: </b> " + platform.os + "</p>";
	} else {
		content += "<p><b>Operating system: </b> Unknown</p>";
	}
	// Battery
	if (navigator.getBattery) {
		content += "<p><b>Battery level:</b> <span class='device-battery'>Loading...</span></p>";
		// When the promise is returned, add the value to .device-battery
		function updateBattery() {
			navigator.getBattery().then(function(battery) {
				var batterylevel = battery.level * 100;
				$(".device-battery").html(batterylevel + "%");
			});
		}
		updateBattery();
		// Update value every time the level changes
		navigator.getBattery().then(function(battery) {
			battery.addEventListener('chargingchange', updateBattery());
		});
	}
	// Language
	if (navigator.languages) {
		content += "<p><b>Language:</b> " + navigator.languages[0] + "</p>";
	} else if (navigator.language) {
		content += "<p><b>Language:</b> " + navigator.language + "</p>";
	} else {
		content += "<p><b>Language:</b> Unavailable</p>";
	}
	// Warning
	if (platform.os.family.includes("Windows XP") || platform.os.family.includes("Vista")) {
		warning += "<div class='alert alert-danger alert-dismissible fade in'><p>Your operating system (" + platform.os.family + ") is no longer supported by Microsoft. You should upgrade to a more recent version, like Windows 10.</p><p><a class='eol-link' href='";
		if (platform.os.family.includes("Windows XP")) {
			warning += 'https://support.microsoft.com/en-us/help/14223/windows-xp-end-of-support';
		} else if (platform.os.family.includes("Vista")) {
			warning += 'https://support.microsoft.com/en-us/help/22882/windows-vista-end-of-support';
		}
		warning += "' target='_blank'><button type='button' class='btn btn-default'>More info</button></a></p></div>";
	}

	// Write data to page
	$(".device-icon").html(icon);
	$(".device-info").html(content);
	$(".device-warning").html(warning);
	$(".panel-device .progress").hide();
}

// Display info
function printGraphicsInfo() {
	var content = "";
	// Use window.devicePixelRatio to calculate actual device resolution
	if (window.devicePixelRatio) {
		var w = Math.round(screen.width * window.devicePixelRatio);
		var h = Math.round(screen.height * window.devicePixelRatio);
		if ((w != screen.width) || (h != screen.height)) {
			content += "<p><b>Display resolution:</b> " + w + " x " + h + " (<i>may be innaccurate</i>)</p>";
			content += "<p><b>Scaled resolution:</b> " + screen.width + " x " + screen.height + ", " + (window.devicePixelRatio * 100) + "% scaling</p>";
		} else {
			content += "<p><b>Display resolution:</b> " + w + " x " + h + "</p>";
		}
	} else {
		content += "<p aria-label='Display resolution: " + screen.width + " pixels by " + screen.height + "p ixels'><b>Display resolution:</b> " + screen.width + " x " + screen.height + "</p>";
	}
	content += "<p><b>Display color depth:</b> " + screen.colorDepth + "</p>";
	if (printGPUInfo() != null) {
		content += "<p><b>GPU:</b> " + printGPUInfo() + "</p>";
	} else {
		content += "<p>GPU information could not be detected because your browser doesn't support the required WebGL features.</p>";
	}

	// Write data to page
	$(".panel-graphics .panel-body").html(content);
}

// GPU info
function printGPUInfo() {
	if (Modernizr.webgl && Modernizr.webglextensions) {
		var canvas = document.getElementById('glcanvas');
		var gl = canvas.getContext('webgl');
		if (canvas.getContext('webgl')) {
			var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
			var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
			// Try to clean up result
			if (renderer.includes("ANGLE (")) {
				renderer = renderer.slice(7); // Remove "ANGLE (" at start
				renderer = renderer.slice(0, -1); // Remove ending parenthesis
			}
			// Print result
			return renderer;
		} else {
			return null;
		}
	} else {
		return null;
	}
}

// Browser info
function printBrowserInfo() {
	var content = "";
	// Browser name and version
	content += "<p class='title'>" + platform.name + " " + platform.version + "</p>";
	// Rendering engine
	content += "<p><b>Rendering engine:</b> " + platform.layout + "</p>";
	// Misc
	if (navigator.cookieEnabled == true) {
		content += "<p><b>Cookies:</b> Enabled</p>";
	} else {
		content += "<p><b>Cookies:</b> Disabled</p>";
	}
	if (navigator.doNotTrack) {
		if (navigator.doNotTrack == 1) {
			content += "<p><b>Do Not Track:</b> Enabled</p>";
		} else {
			content += "<p><b>Do Not Track:</b> Disabled</p>";
		}
	}
	content += "<p><b>User agent:</b> " + navigator.userAgent + "</p>";
	// Buttons
	if (platform.name === "Chrome") {
		content += "<p><a href='https://support.google.com/chrome/answer/95414' target='_blank'><button type='button' class='btn btn-default'>Check for browser updates</button></a></p>"
	} else if (platform.name === "Firefox") {
		content += "<p><a href='https://support.mozilla.org/en-US/kb/update-firefox-latest-version' target='_blank'><button type='button' class='btn btn-default'>Check for browser updates</button></a></p>"
	}
	// Write data to page
	$(".panel-browser .panel-body").html(content);
}

// Network info
function printNetworkInfo() {
	var content = "";
	if (navigator.connection) {
		// Network type
		if (typeof navigator.connection.type != undefined) {
			if (navigator.connection.type == "none" || navigator.connection.type == undefined) {
				content += "<p class='title'>Unknown network</p>"
			} else {
				content += "<p class='title'>" + navigator.connection.type + " network</p>"
			}
		} else {
			content += "<p class='title'>Unknown network</p>"
		}
		// Effective bandwidth estimate
		content += "<p><b>Downlink:</b> " + navigator.connection.downlink + " Mb/s</p>";
		// Effective round-trip time estimate
		content += "<p><b>Rount-trip time estimate:</b> " + navigator.connection.rtt + " milliseconds</p>";
		// Data saver status
		content += "<p><b>Data saver:</b> " + navigator.connection.saveData + "</p>";
		// Print current time
	} else {
		content += "<p>Your browser doesn't support the <a href='https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API' target='_blank'>Network Information API</a>, so network information cannot be obtained.</p>"
	}
	// Speedtest
	content += "<p><a href='https://fast.com/' target='_blank'><button type='button' class='btn btn-default'>Open speed test</button></a></p>"
	// Write data to page
	$(".panel-network .panel-body").html(content);
}
// Update network status automatically
if (navigator.connection) {
	navigator.connection.addEventListener('change', printNetworkInfo());
}

// Plugin info
function printPluginInfo() {
	var content = '';
	// Check if any plugins are installed
	if (navigator.plugins.length == 0) {
		content += '<p class="title">No plugins detected</p><p><b>Note:</b> Some browsers may hide some (or all) plugins as a security measure.</p>'
	} else {
		var x = navigator.plugins.length;
		content += '<p class="title">' + x + ' plugins installed</p><p>These are all the browser plugins that WhatDevice could detect. Click on a plugin to show more details.</p><p><div class="panel-group" id="plugin-accordion">';
		// forEach doesn't work with navigator.plugins for some reason
		for (var i = 0; i < x; i++) {
			// Accordion panel title
			content += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#plugin-accordion" href="#collapse' + i + '">' + navigator.plugins[i].name + '</a></h4></div>'
			// Accordion panel body
			content += '<div id="collapse' + i + '" class="panel-collapse collapse"><div class="panel-body"><b>Description:</b> ' + navigator.plugins[i].description + '<br /><b>File name:</b> ' + navigator.plugins[i].filename + '</br /><b>Version:</b> ' + navigator.plugins[i].version + '</div></div>'
			// End accordion panel
			content += '</div>'
		}
		// End accordion element
		content += '</div><p><b>Note:</b> Some browsers may hide some (or all) plugins as a security measure.</p>'
	}
	// Write data to page
	$('.panel-plugins .panel-body').html(content);
	$('#plugin-accordion').collapse('hide');
}

// Sensor info
function handleSensorInfo(event) {
	var content = '<p class="title">Accelerometer</p>';
	if (event.alpha == null) {
		content += '<p>Your device does not appear to have an accelerometer.</p>'
	} else {
		content += '<p><b>Z axis value:</b> ' + event.alpha + '&#176;</p>';
		content += '<p><b>X axis value:</b> ' + event.beta + '&#176;</p>';
		content += '<p><b>Y axis value:</b> ' + event.gamma + '&#176;</p>';
	}
	// Write data to page
	$('.panel-sensor .panel-body').html(content);
}
function printSensorInfo() {
	var content = '';
	if (window.DeviceOrientationEvent) {
		// Register listener for sensor changes
		window.addEventListener("deviceorientation", handleSensorInfo, true);
	} else {
		content += '<p>Your browser does not support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent" target="_blank">Device Orientation API</a>, so sensor information cannot be obtained.</p>'
		$('.panel-sensor .panel-body').html(content);
	}
}

function prepareShareLinks() {
	// Email
	$("a[href='#email']").attr("href", "mailto:?to=&body=" + encodeURIComponent(createReport()) + "&subject=WhatDevice%20Report");
	// SMS (from http://blog.julianklotz.de/the-sms-uri-scheme/)
	if (platform.manufacturer == "Apple") {
		// iOS 8+ format
		$("a[href='#sms']").attr("href", "sms:&body=" + encodeURIComponent(createReport()));
	} else {
		// Android format
		$("a[href='#sms']").attr("href", "sms:?body=" + encodeURIComponent(createReport()));
	}
	// Twitter
	// Create message
	var message = "I have a ";
	if (platform.manufacturer && platform.product) {
		// Some devices have the same value for both
		if (platform.manufacturer == platform.product) {
			message += platform.manufacturer + " device";
		} else {
			message += platform.manufacturer + " " + platform.product;
		}
	} else if (platform.product) {
		message += platform.product;
	} else if (isAndroid) {
		message += "Android device"
	} else {
		// Determine if running a Mac
		if (isMac) {
			message += "Mac";
		// Anything else is a PC
		} else if (isPC) {
			message += "PC";
		} else {
			message += "device";
		}
	}
	// Append operating system
	if (platform.os) {
		message += ", running " + platform.os;
	}
	// Append browser info
	message += ", with " + platform.name + " " + platform.version + ". See your results at http://what-device.com."
	// Create links
	message = encodeURIComponent(message);
	$("a[href='#twitter']").attr("href", "https://twitter.com/intent/tweet?text=" + message);
}

// Fill the bottom info box
function writeInfo() {
	var content = "<div class='well'><b>Need more info?</b> "
	if (isMac) {
		content += "Search for the 'System Information' app on your Mac to view more detailed information. <a href='https://support.apple.com/en-us/HT203001' target='_blank'>Need help finding it?</a>"
	} else if (platform.os.family.includes("Chrome OS")) {
		content += "You can <a href='https://chrome.google.com/webstore/detail/cog-system-info-viewer/difcjdggkffcfgcfconafogflmmaadco' target='_blank_'>download Cog from the Chrome Web Store</a> to view more detailed information about your computer. WhatDevice is not affiliated with Cog in any way."
	} else if (isAndroid) {
		content += "You can <a href='https://play.google.com/store/apps/details?id=com.cpuid.cpu_z' target='_blank_'>download CPU-Z from the Google Play Store</a> to view more detailed information about your device. WhatDevice is not affiliated with CPU-Z in any way."
	} else if (isPC) {
		content += "You can <a href='http://www.cpuid.com/softwares/cpu-z.html' target='_blank_'>download CPU-Z</a> to view more detailed information about your computer. WhatDevice is not affiliated with CPU-Z in any way."
	} else if (platform.os.family.includes("iOS")) {
		content += "You can <a href='https://itunes.apple.com/us/app/lirum-device-info-lite-system-monitor/id591660734?mt=8' target='_blank_'>download Lirum Device Info Lite from the App Store</a> to view more detailed information about your device. WhatDevice is not affiliated with Lirum Device Info Lite in any way."
	}
	content += "</div>"
	$(".moreinfo-well").html(content);
}

// Create device report
function createReport() {
	var date = new Date();
	var n = date.toDateString();
	var time = date.toLocaleTimeString();
	// Header
	var report = "---- WHAT-DEVICE.COM RESULTS ----\nGenerated: " + n + " " + time + "\n\n";
	// Device info
	report += "-- DEVICE INFO --\nManufacturer: " + platform.manufacturer + "\nProduct: " + platform.product + "\nOperating system: " + platform.os;
	// Display info
	if (window.devicePixelRatio) {
		var w = Math.round(screen.width * window.devicePixelRatio);
		var h = Math.round(screen.height * window.devicePixelRatio);
		report += "\nDisplay resolution: " + w + "x" + h + " (may be inaccurate)";
		if ((w != screen.width) || (h != screen.height)) {
			report += "\nScaled resolution: " + screen.width + "x" + screen.height + "\nScaling ratio: " + (window.devicePixelRatio * 100) + "%";
		}
	} else {
		report += "\nScreen resolution: " + screen.width + "x" + screen.height + "\nDisplay color depth: " + screen.colorDepth + "\n";
	}
	report += "\nDisplay color depth: " + screen.colorDepth + "\n";
	// GPU info
	if (printGPUInfo() != null) {
		report += "GPU: " + printGPUInfo() + "\n\n";
	} else {
		report += "GPU: Could not be determined\n\n";
	}
	// Browser info
	report += "-- BROWSER INFO --\nBrowser: " + platform.name + " " + platform.version + "\nRendering engine: " + platform.layout + "\nCookies enabled: " + navigator.cookieEnabled + "\nUser agent string: " + navigator.userAgent + "\n\n";
	// Plugin info
	report += "-- PLUGIN INFO --\n"
	if (navigator.plugins.length == 0) {
		report += "No plugins were detected.\n\n"
	} else {
		var x = navigator.plugins.length;
		report += "Plugins list:\n";
		// Generate list
		for (var i = 0; i < x; i++) {
			report += "- " + navigator.plugins[i].name + ", version " + navigator.plugins[i].version + "\n"; 
		}
		report += "\n"
	}
	// Network info
	report += "-- NETWORK INFO --\n";
	if (navigator.connection) {
		// Network type
		report += "Network type: " + navigator.connection.type + "\n";
		// Effective bandwidth estimate
		report += "Downlink: " + navigator.connection.downlink + " Mb/s\n";
		// Effective round-trip time estimate
		report += "Rount-trip time estimate: " + navigator.connection.rtt + " milliseconds\n";
		// Data saver status
		report += "Data saver: " + navigator.connection.saveData + "\n";
		// Print current time
	} else {
		report += "Unable to obtain network information because this browser doesn't support the Network Information API."
	}

	return report;
}

// Load everything
$(document).ready(function() {
	// Load device info
	printDeviceInfo();
	printGraphicsInfo();
	printBrowserInfo();
	printNetworkInfo();
	printPluginInfo();
	printSensorInfo();
	prepareShareLinks();
	writeInfo();
	// Load Google Analytics for live site, not local testing
	if (window.location.href.includes("what-device.com")) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-59452245-3', 'auto');
		ga('send', 'pageview');
	}
});

// About button
$(document).on("click", "a[href='#about']", function() {
	$('#aboutmodal').modal('show');
});

// Save text file menu option
$(document).on("click", "a[href='#savefile']", function() {
	// Generate report
	var data = createReport();
	data = data.replace("\n", "\r\n");
	// Download file
	var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "whatdevice-report.txt");
});

// Clipboard menu option
$(document).on("click", "a[href='#clipboard']", function() {
	$('#sharemodal').modal('hide');
	$('#reportmodal').modal('show');
	$("#report-text").val(createReport());

	var clipboard = new Clipboard(".clipboard-button");
	clipboard.on('success', function(e) {
		e.clearSelection();
		$(".clipboard-button").hide();
		$(".clipboard-success-button").show();
		setTimeout(function (){
			$('#reportmodal').modal('hide');
			$(".clipboard-button").show();
			$(".clipboard-success-button").hide();
		}, 1000);
	});
	clipboard.on('error', function(e) {
		e.clearSelection();
		$(".clipboard-button").hide();
		$(".clipboard-error-button").show();
		setTimeout(function (){
			$(".clipboard-button").show();
			$(".clipboard-error-button").hide();
		}, 1000);
	});
});

// Share button for mobile devices
$(document).on("click", "#share-button", function() {
	if (navigator.share) {
		// If the browser supports the Web Share API, use that
		navigator.share({
			title: 'WhatDevice Report',
			text: createReport(),
		});
	} else {
		// If the browser doesn't support the Web Share API, show a modal with limited share/save options
		$('#sharemodal').modal('show');
	}
});

// Remove tags from URL (like #clipboard) after modals close
$('.modal').on('hide.bs.modal', function (e) {
	if ("pushState" in history) {
		history.pushState('', '', window.location.pathname);
	} else {
		window.location.hash = "";
	}
});