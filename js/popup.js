function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(function() {
    window.mdc.autoInit();
});


function getDomainWithoutSubdomain(url) {
    const urlParts = new URL(url).hostname.split('.')
    return urlParts
        .slice(0)
        .slice(-(urlParts.length === 4 ? 3 : 2))
        .join('.')
}


//////////////////
// onPageLoaded //
//////////////////

const onChangeSaveDomainEmail = () => {
    const domainField = document.getElementById('domain');
    const emailField = document.getElementById('email');

    const domainValue = domainField.value;
    const emailValue = emailField.value;

    if (domainValue != undefined && domainValue.length > 0) {
        if (emailValue != undefined && emailValue.length > 0) {
            //console.log(domainValue);
            //console.log(emailValue);

            //>> { [key]: value }
            chrome.storage.sync.set({
                [domainValue]: emailValue
            }, function() {
                // saved Pair< domain, email >
                //console.log('Value is set to: ' + emailValue);
            });
        }
    }
};

const onBlurEmail = () => {
    // The blur event fires when an element has lost focus
};

function isEmpty(str) {
    return (!str || str.length === 0);
}

document.addEventListener('DOMContentLoaded', function() {
    // Domain
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, tabs => {
        if (tabs != undefined && tabs[0] != undefined && tabs[0].url != undefined) {
            const url = tabs[0].url;
            const domain = getDomainWithoutSubdomain(url);
            //console.log('Domain: ' + domain);
            var protocol = url.split(":")[0];
            //console.log('Protocol: ' + protocol);

            // DOMAIN
            const domainField = document.getElementById('domain');
            //if (protocol === 'chrome' || protocol === 'chrome-extension') {
            if (protocol !== 'http' && protocol !== 'https' && protocol !== 'ftp') {
                //ex: chrome://extensions
                //ex: chrome-extension://
                domainField.value = '<< Unsupported Page >>';
                //domainField.value = '';
            } else {
                domainField.value = domain;
                document.getElementById('favicon').src = 'https://s2.googleusercontent.com/s2/favicons?domain=' + url;

                chrome.storage.sync.get(domain, function(result) {
                    if (!chrome.runtime.error) {
                        //console.log(result);

                        var resultDomain = result[domain];
                        console.log('Value currently is ' + resultDomain);

                        if (resultDomain != undefined) {
                            // email found in cache
                            document.getElementById('email').value = resultDomain;
                            document.getElementById('favicon').src = 'https://s2.googleusercontent.com/s2/favicons?domain=' + url;

                        } else {
                            // email NOT found in cache
                            //document.getElementById('email').value = 'NotFound';
                        }
                    }
                });
            }
        } else {
            document.getElementById('domain').value = '<< Domain Not Found >>';
        }
    });

    const domainField = document.getElementById('domain');
    const emailField = document.getElementById('email');
    emailField.addEventListener('change', onChangeSaveDomainEmail);
    emailField.addEventListener('blur', onBlurEmail);
});


/////////////////////
// Update Username //
/////////////////////

const fillInUsername = (username) => {
    return "var passwordInput = document.querySelector('input[type=password]');" +
        "passwordInput.value = '';" +
        "var form = passwordInput.parentElement;" +
        "while (form.tagName != 'FORM') { form = form.parentElement; };" +
        "var usernameInput = form.querySelector('input[type=text]');" +
        "if (usernameInput == undefined) { usernameInput = form.querySelector('input[type=email]'); };" +
        "usernameInput.value = '" + username + "';";
};

function persistEmailDomain(domain) {
    const domainField = document.getElementById('domain');
    const emailField = document.getElementById('email');

    const domainValue = domainField.value;
    const emailValue = emailField.value;

    chrome.storage.sync.set({
        domainValue: emailValue
    }, () => {
        // saved Pair< domain, email >
    });


    chrome.storage.sync.set({
        keyEmail: emailField.value
    }, () => {
        // email saved
    });
}

document.getElementById('loadArykey').addEventListener('click', () => {
    if (document.getElementById('domain').value == undefined) {
        alert('The domain is empty.');
        return;
    }
    if (document.getElementById('email').value == undefined) {
        alert('The username is empty.');
        return;
    }

    if (navigator.serial) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {

            const domainField = document.getElementById('domain');
            chrome.storage.local.set({
                'selectedDomain': domainField.value
            }, () => {
                // selectedDomain saved
            });

            const emailField = document.getElementById('email');
            chrome.tabs.executeScript(
                tabs[0].id, {
                    code: fillInUsername(emailField.value)
                },
                function() {
                    if (chrome.runtime.lastError) {
                        var errorMsg = chrome.runtime.lastError.message
                        if (errorMsg == "Cannot access a chrome:// URL") {
                            alert('This Chrome Extension don\'t have access to the current page.');
                        } else {
                            alert(errorMsg);
                        }
                    }
                }
            );
        });

        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('device.html'));
        }
    } else {
        alert('Web Serial API not supported.');
    }
});
