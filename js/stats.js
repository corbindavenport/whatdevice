var details;

// Browser info
function printDeviceInfo() {
	var content = "";
	var icon = "";
	var warning = "";
	var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
	var isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') > -1;
	var isPC = ((navigator.userAgent.toUpperCase().indexOf('WINDOWS') > -1) || (navigator.userAgent.toUpperCase().indexOf('LINUX') > -1));
	// Device icon
	if ((platform.product == "iPhone") || (platform.product == "iPod")) {
		icon = "<p><span class='material-icons device-icon'>phone_iphone</span></p>";
	} else if (platform.product == "iPad") {
		icon = "<p><span class='material-icons device-icon'>tablet_mac</span></p>";
	} else if (isAndroid) {
		icon = "<p><span class='material-icons device-icon'>phone_android</span></p>";
	} else if (isMac) {
		icon = "<p><span class='material-icons device-icon'>desktop_mac</span></p>";
	} else if (isPC) {
		icon = "<p><span class='material-icons device-icon'>desktop_windows</span></p>";
	} else {
		icon = "<p><span class='material-icons device-icon'>devices_other</span></p>";
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
		warning += "<div class='alert alert-danger alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden'true'>&times;</span></button><h4>Unsupported OS</h4><p>Your operating system (" + platform.os.family + ") is no longer supported by Microsoft. You should upgrade to a more recent version, like Windows 10.</p><p><button type='button' class='btn btn-default os-info-button'>More info</button></p></div>";
	}
	$(document).on("click", ".os-info-button", function() {
		if (platform.os.family.includes("Windows XP")) {
			window.open('https://support.microsoft.com/en-us/help/14223/windows-xp-end-of-support', '_blank');
		} else if (platform.os.family.includes("Vista")) {
			window.open('https://support.microsoft.com/en-us/help/22882/windows-vista-end-of-support', '_blank');
		}
	});

	// Write data to page
	$(".device-icon").html(icon);
	$(".device-info").html(content);
	$(".device-warning").html(warning);
	$(".panel-device .progress").hide();
}

// Display info
function printDisplayInfo() {
	var content = "<p><b>Display resolution:</b> " + screen.width + " x " + screen.height + "</p>";
	content += "<p><b>Display color depth:</b> " + screen.colorDepth + "</p>";

	// Get OpenGL info
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
			content += "<p><b>GPU:</b> " + renderer + "</p>";
		} else {
			content += "<p><i>GPU information could not be detected because your browser doesn't support the required WebGL extensions.</i></p>";
		}
	} else {
		content += "<p><i>GPU information could not be detected because your browser doesn't support WebGL.</i></p>";
	}

	// Write data to page
	$(".panel-display .panel-body").html(content);
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
		content += "<p><button type='button' class='btn btn-default update-button'>Check for updates</button></p>"
		$(document).on("click", ".update-button", function() {
			window.open('https://support.google.com/chrome/answer/95414', '_blank');
		})
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
			$(".panel-input .panel-body").append("<div class='alert alert-danger alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden'true'>&times;</span></button><h4>Error</h4><p>" + err.name + ": " + err.message + "</p></div>");
		});
	} else {
		$(".panel-input .panel-body").html("<p><i>Your browser doesn't support WebRTC, so cameras and microphones cannot be detected.</i></p>");
	}
	$(".panel-input .progress").hide();
}

// Load everything
$(document).ready(function() {
	printDeviceInfo();
	printDisplayInfo();
	printBrowserInfo();
	printCameraInfo();

	// Create service worker
	if ('serviceWorker' in navigator) { 
		window.addEventListener('load', function() {   
			navigator.serviceWorker.register('/sw.js').then(
				function(registration) { 
					// Registration was successful
					$(".main-container").prepend("<div class='alert alert-success alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden'true'>&times;</span></button><b>Good news!</b> Your browser supports Service Workers, so you can open WhatDevice even when your device is offline!</p></div>");
					console.log('ServiceWorker registration successful with scope: ', registration.scope); }, 
				function(err) { 
					// registration failed
					$(".main-container").prepend("<div class='alert alert-danger alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden'true'>&times;</span></button><p>Your browser doesn't seem to support Service Workers, so you can only use WhatDevice while connected to the internet.</p></div>");
					console.log('ServiceWorker registration failed: ', err); 
				}); 
		});
	}
});

// About button
$(document).on("click", "a[href='#about']", function() {
	$('#aboutmodal').modal('show');
});