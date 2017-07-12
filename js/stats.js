// General variables for detection
var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
var isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') > -1;
var isPC = ((navigator.userAgent.toUpperCase().indexOf('WINDOWS') > -1) || (navigator.userAgent.toUpperCase().indexOf('LINUX') > -1));

// Browser info
function printDeviceInfo() {
	var content = "";
	var icon = "";
	var warning = "";
	// Device icon
	if ((platform.product == "iPhone") || (platform.product == "iPod")) {
		icon = "<p><span aria-label='iPhone icon' class='material-icons device-icon'>phone_iphone</span></p>";
	} else if (platform.product == "iPad") {
		icon = "<p><span aria-label='iPad icon' class='material-icons device-icon'>tablet_mac</span></p>";
	} else if (isAndroid) {
		icon = "<p><span aria-label='Android icon' class='material-icons device-icon'>phone_android</span></p>";
	} else if (isMac) {
		icon = "<p><span aria-label='Mac icon' class='material-icons device-icon'>desktop_mac</span></p>";
	} else if (isPC) {
		icon = "<p><span aria-label='Windows icon' class='material-icons device-icon'>desktop_windows</span></p>";
	} else {
		icon = "<p><span aria-label='Generic device icon' class='material-icons device-icon'>devices_other</span></p>";
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
	content += "<p><b>Language:</b> " + navigator.language + "</p>";
	if (navigator.onLine == true) {
		content += "<p><b>Connected to internet:</b> <span style='color:green'>Yes</span></p>";
	} else {
		content += "<p><b>Connected to internet:</b> <span style='color:red'>No</span></p>";
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
function printDisplayInfo() {
	var content = "";
	// Use window.devicePixelRatio to calculate actual device resolution
	if (window.devicePixelRatio) {
		var w = Math.round(screen.width * window.devicePixelRatio);
		var h = Math.round(screen.height * window.devicePixelRatio);
		content += "<p aria-label='Display resolution: " + w + " pixels by " + h + " pixels'><b>Display resolution:</b> " + w + " x " + h + "</p>";
		if ((w != screen.width) || (h != screen.height)) {
			var percentage = Math.round(window.devicePixelRatio * 100) + "%";
			// Add warning
			content = "<div class='alert alert-warning'><b>Warning:</b> Due to a bug, the reported screen resolution could be innaccurate. We're working on a fix!</p></div>" + content;
			// Add scaled resolution
			content += "<p aria-label='Scaled resolution: " + screen.width + " pixels by " + screen.height + " pixels, using " + percentage + " scaling'><b>Scaled resolution:</b> " + screen.width + " x " + screen.height + " (" + percentage + " scaling)</p>";
		}
	} else {
		content += "<p aria-label='Display resolution: " + screen.width + " pixels by " + screen.height + "p ixels'><b>Display resolution:</b> " + screen.width + " x " + screen.height + "</p>";
	}
	content += "<p><b>Display color depth:</b> " + screen.colorDepth + "</p>";
	if (printGPUInfo() != null) {
		content += "<p><b>GPU:</b> " + printGPUInfo() + "</p>";
	} else {
		content += "<p><i>GPU information could not be detected because your browser doesn't support WebGL (or the required features of WebGL).</i></p>";
	}

	// Write data to page
	$(".panel-display .panel-body").html(content);
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
	content += "<p><b>Cookies enabled:</b> " + navigator.cookieEnabled + "</p>";
	content += "<p><b>User agent:</b> " + navigator.userAgent + "</p>";
	// Buttons
	if (platform.name === "Chrome") {
		content += "<p><a href='https://support.google.com/chrome/answer/95414' target='_blank'><button type='button' class='btn btn-default'>Check for browser updates</button></a></p>"
	}

	// Write data to page
	$(".panel-browser .panel-body").html(content);
}

// Camera/mic info
function printCameraInfo() {
	if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
		// Keep track of devices
		var cameras = 0;
		var audio = 0;
		navigator.mediaDevices.enumerateDevices().then(function(devices) {
			devices.forEach(function(device) {
				var type = device.kind;
				// Make results more readable
				if (type === "audiooutput") {
					type = "Audio output"
					audio++;
				} else if (type === "audioinput") {
					type = "Audio input"
					audio++;
				} else if (type === "videoinput") {
					type = "Camera"
					cameras++;
				}
				// Determine name of cameras/mics
				var label;
				if (device.label) {
					label = device.label;
				} else {
					label = device.deviceId;
				}
				// Print info for each device
				$(".panel-input .panel-body").append("<p><b>" + type + ":</b> " + label + "</p>");
			});
			$(".panel-input .panel-body").prepend("<p class='title'>" + cameras + " cameras, " + audio + " audio devices</p>");
		})
		.catch(function(err) {
			$(".panel-input .panel-body").append("<div class='alert alert-danger alert-dismissible fade in'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden'true'>&times;</span></button><h4>Error</h4><p>" + err.name + ": " + err.message + "</p></div>");
		});
	} else {
		$(".panel-input .panel-body").html("<p><i>Your browser doesn't support WebRTC, so cameras and microphones cannot be detected.</i></p>");
	}
	$(".panel-input .progress").hide();
}

function prepareTwitterLink() {
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
	$(".twitter").attr("href", "https://twitter.com/intent/tweet?text=" + message);
}

function prepareEmailLink() {
	var message = encodeURIComponent(createReport());
	$(".email").attr("href", "mailto:?to=&body=" + message + "&subject=WhatDevice%20Report");
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
		report += "\nDisplay resolution: " + w + "x" + h;
		if ((w != screen.width) || (h != screen.height)) {
			report += "\nScaled resolution: " + screen.width + "x" + screen.height + "\nScaling ratio: " + Math.round(window.devicePixelRatio * 100) + "%";
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
	// Cameras and microphones
	report += "-- CONNECTED DEVICES --\n";
	var connected = ""; // Keep list of connected devices as a seperate variable
	if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
		navigator.mediaDevices.enumerateDevices().then(function(devices) {
			devices.forEach(function(device) {
				var type = device.kind;
				// Make results more readable
				if (type === "audiooutput") {
					type = "Audio output"
				} else if (type === "audioinput") {
					type = "Audio input"
				} else if (type === "videoinput") {
					type = "Camera"
				}
				// Determine name of cameras/mics
				var label;
				if (device.label) {
					label = device.label;
				} else {
					label = device.deviceId;
				}
				// Print info for each device
				connected += type + ": " + label + "\n";
			});
		})
		.catch(function(err) {
			connected += "Error retrieving list of connected devices:" + err.message + "\n";
		});
	} else {
		connected += "Unable to retrieve list of connected devices due to web browser not supporting the API.";
	}
	if (connected === "") {
		report += "Unable to retrieve list of connected devices due to API limitations.";
	} else {
		report += "connected";
	}

	return report;
}

// Load everything
$(document).ready(function() {
	// Load device info
	printDeviceInfo();
	printDisplayInfo();
	printBrowserInfo();
	printCameraInfo();
	prepareTwitterLink();
	prepareEmailLink();

	// Load Google Analytics for live site, not local testing
	if (window.location.href.includes("what-device.com")) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-59452245-3', 'auto');
		ga('send', 'pageview');
	}

	// Create service worker
	if ('serviceWorker' in navigator) { 
		window.addEventListener('load', function() {   
			navigator.serviceWorker.register('/sw.js').then(
				function(registration) { 
					// Registration was successful
					$(".main-container").prepend("<div class='alert alert-success alert-dismissible fade in'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden'true'>&times;</span></button><b>Good news!</b> Your browser supports Service Workers, so you can open WhatDevice even when your device is offline!</p></div>");
					console.log('ServiceWorker registration successful with scope: ', registration.scope); }, 
				function(err) { 
					// registration failed
					console.log('ServiceWorker registration failed: ', err); 
				}); 
		});
	}
	// Force reload service worker
	self.addEventListener('install', function(event) {
		event.waitUntil(self.skipWaiting());
	});
	self.addEventListener('activate', function(event) {
		event.waitUntil(self.clients.claim());
	});
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
	$('#reportmodal').modal('show');
	$("#report-text").val(createReport());

	var clipboard = new Clipboard(".clipboard-button");
	clipboard.on('success', function(e) {
		e.clearSelection();
		$(".clipboard-button").removeClass("btn-primary");
		$(".clipboard-button").addClass("btn-success");
		$(".clipboard-button").html("Copied!");
		setTimeout(function (){
			$('#reportmodal').modal('hide');
			$(".clipboard-button").removeClass("btn-success");
			$(".clipboard-button").addClass("btn-primary");
			$(".clipboard-button").html("Copy to clipboard");
		}, 1000);
	});
	clipboard.on('error', function(e) {
		e.clearSelection();
		$(".clipboard-button").removeClass("btn-primary");
		$(".clipboard-button").addClass("btn-danger");
		$(".clipboard-button").html("Error!");
		setTimeout(function (){
			$('#reportmodal').modal('hide');
			$(".clipboard-button").removeClass("btn-danger");
			$(".clipboard-button").addClass("btn-primary");
			$(".clipboard-button").html("Copy to clipboard");
		}, 1000);
	});
});