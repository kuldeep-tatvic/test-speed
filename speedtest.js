document.getElementById('testSpeedButton').addEventListener('click', function () {
    testInternetSpeed();
});

function testInternetSpeed() {
    var startTime, endTime;
    var download = new Image();
    var fileSize = 2831155; // Size of the file in bytes
    var timeoutThreshold = 20000; // 20 seconds in milliseconds
    var timeoutId;

    download.onload = function () {
        clearTimeout(timeoutId); // Clear the timeout
        endTime = (new Date()).getTime();
        calculateSpeed();
    };

    download.onerror = function () {
        clearTimeout(timeoutId); // Clear the timeout
        document.getElementById('result').innerText = 'Error during test';
    };

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = "https://upload.wikimedia.org/wikipedia/commons/a/a6/Brandenburger_Tor_abends.jpg" + cacheBuster;

    // Set a timeout for the download
    timeoutId = setTimeout(function () {
        download.onload = null; // Prevent onload from firing
        classifyNetwork(0); // Classify as 2G since it timed out
        document.getElementById('result').innerText = 'Network Speed: 2G (Timeout 20 sec)';
    }, timeoutThreshold);

    function calculateSpeed() {
        var duration = (endTime - startTime) / 1000; // Time in seconds
        var bitsLoaded = fileSize * 8; // Total bits downloaded
        var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);

        classifyNetwork(speedMbps);

        // document.getElementById('result').innerText = `Internet Speed: ${speedMbps} Mbps`;
    }
}

function classifyNetwork(speedMbps) {
    var networkSpeed;
    if (speedMbps === 0 || speedMbps < 0.1) {
        networkSpeed = 'Network Speed: 2G';
    } else if (speedMbps < 1) {
        networkSpeed = 'Network Speed: 3G';
    } else if (speedMbps < 10) {
        networkSpeed = 'Network Speed: 4G';
    } else {
        networkSpeed = 'Network Speed: 5G';
    }

    console.log(networkSpeed);
    document.getElementById('result').innerText = `Internet Speed: ${speedMbps} Mbps and ${networkSpeed}`;
}
