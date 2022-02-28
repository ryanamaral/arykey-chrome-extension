/////////////////////
// Click Listeners //
/////////////////////

const connectButton = document.getElementById("connectArykey");
connectButton.addEventListener('click', () => {
    if (navigator.serial) {
        connectSerial();
    } else {
        alert('Web Serial API not supported.');
    }
});
connectButton.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) { // <ENTER> key
        event.preventDefault();
        document.getElementById("connectArykey").click();
    }
});


////////////
// Lottie //
////////////

var animParams = {
    wrapper: document.getElementById('bodymovin'),
    animType: 'html',
    loop: true,
    prerender: false,
    autoplay: true,
    animationData: animUsbRed
};
bodymovin.setQuality(500);
var anim = bodymovin.loadAnimation(animParams);
window.onresize = anim.resize.bind(anim);


//////////////////
// onPageLoaded //
//////////////////

document.addEventListener('DOMContentLoaded', function() {
    const n6Field = document.getElementById('n6');
    const n1Field = document.getElementById('n1');
    n1Field.autofocus = true;
    n1Field.addEventListener('input', function() {
        document.getElementById('n1').nextElementSibling.focus();
    });
    document.getElementById('n2').addEventListener('input', function() {
        document.getElementById('n2').nextElementSibling.focus();
    });
    document.getElementById('n3').addEventListener('input', function() {
        document.getElementById('n3').nextElementSibling.focus();
    });
    document.getElementById('n3').addEventListener('input', function() {
        document.getElementById('n3').nextElementSibling.focus();
    });
    document.getElementById('n4').addEventListener('input', function() {
        document.getElementById('n4').nextElementSibling.focus();
    });
    document.getElementById('n5').addEventListener('input', function() {
        document.getElementById('n5').nextElementSibling.focus();
    });
    document.getElementById('n6').addEventListener('input', function() {
        document.getElementById('n6').nextElementSibling.focus();
    });

    n1Field.addEventListener('focus', function() {
        document.getElementById('n1').value = '';
        document.getElementById('n2').value = '';
        document.getElementById('n3').value = '';
        document.getElementById('n4').value = '';
        document.getElementById('n5').value = '';
        document.getElementById('n6').value = '';
    });
    document.getElementById('n2').addEventListener('focus', function() {
        document.getElementById('n2').value = '';
        document.getElementById('n3').value = '';
        document.getElementById('n4').value = '';
        document.getElementById('n5').value = '';
        document.getElementById('n6').value = '';
    });
    document.getElementById('n3').addEventListener('focus', function() {
        document.getElementById('n3').value = '';
        document.getElementById('n4').value = '';
        document.getElementById('n5').value = '';
        document.getElementById('n6').value = '';
    });
    document.getElementById('n4').addEventListener('focus', function() {
        document.getElementById('n4').value = '';
        document.getElementById('n5').value = '';
        document.getElementById('n6').value = '';
    });
    document.getElementById('n5').addEventListener('focus', function() {
        document.getElementById('n5').value = '';
        document.getElementById('n6').value = '';
    });

    n6Field.addEventListener('focus', function() {
        document.getElementById('n6').value = '';
    });
    n6Field.addEventListener('change', function() {
        document.getElementById("connectArykey").click();
    });

    n1Field.addEventListener("keypress", function(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            // 48-57 for 0-9 numbers; 8 for backspace; 0 for null values;
            evt.preventDefault();
        }
    });
    document.getElementById('n2').addEventListener("keypress", function(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            // 48-57 for 0-9 numbers; 8 for backspace; 0 for null values;
            evt.preventDefault();
        }
    });
    document.getElementById('n3').addEventListener("keypress", function(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            // 48-57 for 0-9 numbers; 8 for backspace; 0 for null values;
            evt.preventDefault();
        }
    });
    document.getElementById('n4').addEventListener("keypress", function(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            // 48-57 for 0-9 numbers; 8 for backspace; 0 for null values;
            evt.preventDefault();
        }
    });
    document.getElementById('n5').addEventListener("keypress", function(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            // 48-57 for 0-9 numbers; 8 for backspace; 0 for null values;
            evt.preventDefault();
        }
    });
    document.getElementById('n6').addEventListener("keypress", function(evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            // 48-57 for 0-9 numbers; 8 for backspace; 0 for null values;
            evt.preventDefault();
        }
    });
});

////////////////
// USB Serial //
////////////////

var port, textEncoder, writableStreamClosed, writer;
let keepReading = true;
let reader;

async function sendSerialLine() {
    chrome.storage.local.get('selectedDomain', function(resultDomain) {
        if (!chrome.runtime.error && resultDomain.selectedDomain != undefined) {
            const domain = resultDomain.selectedDomain;

            chrome.storage.sync.get(domain, function(result) {
                if (!chrome.runtime.error && result[domain] != undefined) {
                    try {
                        const pin = document.getElementById('n1').value += document.getElementById('n2').value += document.getElementById('n3').value += document.getElementById('n4').value += document.getElementById('n5').value += document.getElementById('n6').value;
                        var data = "";
                        data += pin; //ex: 123456
                        data += domain; //ex: "google.com"
                        data += result[domain]; //ex: "test@ryanamaral.com"

                        var sha512 = hex_sha512(data);
                        //alert(sha512);

                        var dataToSend = sha512 += "\n";
                        writer.write(dataToSend);

                    } catch (errorMsg) {
                        alert(errorMsg);
                    }
                }
            });
        }
    });
}

async function connectSerial() {
    try {
        const rpiPico = {
            usbVendorId: 0x2E8A,
            usbProductId: 0x800A
        };
        port = await navigator.serial.requestPort({
            filters: [rpiPico]
        });
        await port.open({
            baudRate: 115200
        });

        readUntilClosed();

        textEncoder = new TextEncoderStream();
        writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        writer = textEncoder.writable.getWriter();

        sendSerialLine();

    } catch (errorMsg) {
        if (errorMsg == 'NotFoundError: No port selected by the user.') {
            alert('Device Not Found\n\nEnter the PIN again, select the AryKey from the device list and press Connect.');
        } else {
            alert(errorMsg);
        }
        window.location.reload(true);
    }
}

async function readUntilClosed() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    var success = false;

    while (port.readable && keepReading) {
        try {
            while (true) {
                const {
                    value,
                    done
                } = await reader.read();
                if (done) {
                    // |reader| has been canceled.
                    break;
                }
                if (value.includes('ERROR')) {
                    keepReading = false;
                    success = false;
                    break;

                } else if (value.includes('OK')) {
                    keepReading = false;
                    success = true;
                    break;
                }
            }
        } catch (error) {
            if (error != 'NetworkError: The device has been lost.') {
                alert(error);
            }
        } finally {
            await reader.releaseLock();
        }
    }
    if (success) {
        alert('SUCCESS: AryKey is ready to fire password!');
        window.close(); // close this tab
    } else {
        alert('ERROR: Please try again.');
        window.location.reload(true); // reload this tab
    }
}

