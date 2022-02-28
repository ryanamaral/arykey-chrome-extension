<img src="https://github.com/ryanamaral/arykey-chrome-extension/raw/dev/screenshots/popup.png" width="260">

# AryKey - Google Chrome Extension \[ 🚧🧑‍🏭 WIP 🔧🚧 \]

Google Chrome Extension that prepares an hardware device via USB serial port with a specific
password generated deterministically based on three (3) inputs:
the `Domain` we want to `Unlock`, the `User ID` used for login (typically an email address)
and the `PIN` (6 numeric digits) we want to associate with previous inputs.

The hardware being used, during development, is a RPi Pico flashed with a custom firmware. It
implements a key derivation function (KDF) that derives deterministic passwords from the given
elements and a unique key stored in the ROM.

This extension loads the 'hardware key' with the user inputs, and the KDF will derive a password for
it. The password is not transmitted back via USB to eliminate a possible attack vector, instead is
typed by emulating an external keyboard when the user clicks the physical button on the device.

### Features

* Auto-fill domain based on active tab
* Store Pair< Domain, Username >
* Request PIN input with 6 digits from the user
* Communication with hardware device (Raspberry Pi Pico) via Serial USB
* **[EXTRA]** Toggle password visibility of a specific password input field in focus by simply
  pressing the `Ctrl` key.

### TODO

- [ ] Show loading animation while connecting
- [ ] Success/Error screen after loading
- [ ] Input validation
- [ ] Encrypt storage (Pair< Domain, Username >)
- [ ] Auto load image associated to given email address
  from [Gravatar API](https://en.gravatar.com/site/implement/)
- [ ] Add LICENSE
- [ ] More TBD

### How to Install

1. Clone this repository to your computer:

```
$ git clone git@github.com:ryanamaral/arykey-chrome-extension.git
```

2. Go to the Chrome [extensions](chrome://extensions/) page
3. Turn on **Developer mode**
4. Add the extension by clicking **Load Unpacked** button, and select the source directory
5. Done!

### How to Use

1. Go to a Login Web page
    * For example: github.com
2. Click on this Chrome extension icon and a popup will open with the current domain auto-filled
3. Fill in the `User ID` input with an email address, for example.
    * Next time this field will be auto-populated with this value.
4. Click `Unlock`
5. Type your 6 digits `PIN`
5. Choose _Arykey_ device from the popup and click **Connect**
6. Done! _(preparing the device)_

> At this point, by pressing the hardware button of the device it starts typing the password in the current input field with focus.

#### Troubleshoot

If you can't connect, try turn on the serial port connection feature in Chrome:

```
chrome://flags/#enable-experimental-web-platform-features
```

### APIs & Libraries

* Web Serial API: https://web.dev/serial/

* Lottie: https://github.com/airbnb/lottie-web

* Material Design UI components for the
  web: https://github.com/material-components/material-components-web

* Chrome Extensions: https://developer.chrome.com/docs/extensions/

### Sources

* Load favicon image of each domain: https://stackoverflow.com/a/15750809/904907
* JS implementation of SHA-512: http://pajhome.org.uk/crypt/
* UI of PIN input: https://codepen.io/bradeneast/pen/YzzMoGw
* USB Memory Stick Animation: https://lottiefiles.com/20358-usb-memory-stick-animation
* Loading/Success/Error Animation: https://lottiefiles.com/627-loading-success-failed

### Screenshots

<img src="https://github.com/ryanamaral/arykey-chrome-extension/raw/dev/screenshots/1.png" width="693">
<img src="https://github.com/ryanamaral/arykey-chrome-extension/raw/dev/screenshots/2.png" width="693">
<img src="https://github.com/ryanamaral/arykey-chrome-extension/raw/dev/screenshots/3.png" width="693">
<img src="https://github.com/ryanamaral/arykey-chrome-extension/raw/dev/screenshots/4.png" width="693">
