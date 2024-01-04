function setCookie(name, value, minutes) {
    var expires = "";
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    var jsonValue = JSON.stringify(value);
    document.cookie = name + "=" + encodeURIComponent(jsonValue) + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            var jsonValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
            return JSON.parse(jsonValue);
        }
    }
    return null;
}
function testInternetSpeed() {

    var speedData = getCookie('networkInfo');


    if (speedData) {
        console.log(`Internet Speed: ${speedData.speed} Mbps and ${speedData.network}`);
        return;
    }

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
        console.log('Error during test');
    };

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = "https://upload.wikimedia.org/wikipedia/commons/a/a6/Brandenburger_Tor_abends.jpg" + cacheBuster;

    // Set a timeout for the download
    timeoutId =
        setTimeout(function () {
            download.onload = null; // Prevent onload from firing
            classifyNetwork(0); // Classify as 2G since it timed out
            console.log('Network Speed: 2G (Timeout 20 sec)');
        }, timeoutThreshold);

    function calculateSpeed() {
        var duration = (endTime - startTime) / 1000; // Time in seconds
        var bitsLoaded = fileSize * 8; // Total bits downloaded
        var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);

        var networkInfo = { speed: speedMbps, network: '' };

        console.log("networkInfo:", networkInfo)


        setCookie('networkInfo', networkInfo, 30); // Set cookie for 30 minutes
        classifyNetwork(speedMbps);
    }
}

function classifyNetwork(speedMbps) {
    var networkSpeed;
    if (speedMbps === 0 || speedMbps < 0.1) {
        networkSpeed = '2G';
    } else if (speedMbps < 1) {
        networkSpeed = '3G';
    } else if (speedMbps < 10) {
        networkSpeed = '4G';
    } else {
        networkSpeed = '5G';
    }

    // console.log(networkSpeed);
    var networkInfo = getCookie('networkInfo') || {};
    networkInfo.network = networkSpeed;
    setCookie('networkInfo', networkInfo, 30); // Set cookie for 30 minutes

    console.log(`Internet Speed: ${networkInfo.speed} Mbps and ${networkInfo.network}`);
}

testInternetSpeed();

