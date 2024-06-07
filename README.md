<br>

<div align="center">

[<img src="./resources/blum-logo.jpg" width="144"/>](https://t.me/BlumCryptoBot)

  <h1 align="center">Auto Bot for Blum</h1>
  
  <p align="center">
    <strong>Bot for automatic click on clovers in Blum.</strong>
  </p>
  <img src="./resources/demo.gif"/>

</div>

## Enable Debug Mode for Mini Apps

### Android
- **[Enable USB-Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)** on your device.
- In Telegram Settings, scroll all the way down, press and hold on the version number two times.
- Choose Enable WebView Debug in the Debug Settings.
- Connect your phone to your computer and open chrome://inspect/#devices in Chrome – you will see your Mini App there when you launch it on your phone.

### Telegram Desktop on Windows and Linux
- Download and launch the **[Beta Version](https://desktop.telegram.org/changelog#beta-version)** of Telegram Desktop on Windows or Linux (not supported on Telegram Desktop for macOS yet).
- Go to Settings > Advanced > Experimental settings > Enable webview inspection.
- Right click in the WebView and choose Inspect.

### Telegram macOS
- Download and launch the **[Beta Version](https://telegram.org/dl/macos/beta)** of Telegram macOS.
- Quickly click 5 times on the Settings icon to open the debug menu and enable “Debug Mini Apps”.

## Launch script

Follow the steps below to launch script:

1. Open the game in Telegram Web App and the web inspector of your browser. You can do this by right-clicking on the page and selecting **"Inspect"** or **"Inspect Element"** (depending on the browser).

2. Switch to the **"Console"** tab. In the console at the bottom of the page, enter the copied script and press the **Enter** key.

```
const minBombClickCount = 2;
const minFreezeClickCount = 2;
const cloverSkipPercentage = 20;

const consoleRed = 'font-weight: bold; color: red;';
const consoleGreen = 'font-weight: bold; color: green;';
const consolePrefix = '%c [AutoBot] ';
const originalConsoleLog = console.log;

console.log = function () {
  if (arguments[0].includes('[AutoBot]') || arguments[0].includes('github.com')) {
    originalConsoleLog.apply(console, arguments);
  }
};

console.error = console.warn = console.info = console.debug = function () { };

console.clear();
console.log(`${consolePrefix}Injecting...`, consoleGreen);

try {
    let totalPoints = 0;
    let bombClickCount = 0;
    let freezeClickCount = 0;
    let skippedClovers = 0;
    let gameEnded = false;
    
    const originalPush = Array.prototype.push;
    Array.prototype.push = function(...args) {
        args.forEach(arg => {
            if (arg && arg.item) {
                if (arg.item.type === "CLOVER") {
                    arg.shouldSkip = Math.random() < (cloverSkipPercentage / 100);
                    if (arg.shouldSkip) {
                        skippedClovers++;
                        console.log(`${consolePrefix}Skipping clover (${skippedClovers})`, consoleRed);
                    } else {
                        console.log(`${consolePrefix}Clicking clover (${totalPoints})`, consoleGreen);
                        totalPoints++;
                        arg.onClick(arg);
                        arg.isExplosion = true;
                        arg.addedAt = performance.now();
                    }
                } else if (arg.item.type === "BOMB" && bombClickCount < minBombClickCount) {
                    console.log(`${consolePrefix}Clicking bomb`, consoleRed);
                    totalPoints = 0;
                    arg.onClick(arg);
                    arg.isExplosion = true;
                    arg.addedAt = performance.now();
                    bombClickCount++;
                } else if (arg.item.type === "FREEZE" && freezeClickCount < minFreezeClickCount) {
                    console.log(`${consolePrefix}Clicking freeze`, consoleGreen);
                    arg.onClick(arg);
                    arg.isExplosion = true;
                    arg.addedAt = performance.now();
                    freezeClickCount++;
                }
            }
        });
        return originalPush.apply(this, args);
    };
    
    function checkGameEnd() {
        const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');
        if (rewardElement && !gameEnded) {
            gameEnded = true;
            console.log(`${consolePrefix}Game Over. Total points earned: ${totalPoints}`, consoleGreen);
            totalPoints = 0;
            bombClickCount = 0;
            freezeClickCount = 0;
            skippedClovers = 0;
            if (window.__NUXT__.state.$s$0olocQZxou.playPasses > 0) {
                setTimeout(() => {
                    const button = document.querySelector("#app > div > div > div.buttons > button:nth-child(2)");
                    if (button) {
                        button.click();
                        console.log(`${consolePrefix}Starting new game...`, consoleGreen);
                    }
                    gameEnded = false;
                }, Math.random() * (5151.2 - 3137.7) + 3137.7);
            } else {
                console.log(`${consolePrefix}No more play passes left`, consoleRed);
            }
        }
    }
    
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkGameEnd();
            }
        }
    });
    
    const targetNode = document.querySelector('#app');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    console.log(`${consolePrefix}Script loaded`, consoleGreen);
    console.log(`${consolePrefix}Code by @clqkx`, consoleGreen);
} catch (e) {
    console.log(`${consolePrefix}An error occurred!`, consoleRed);
    console.log(`${consolePrefix}Please follow the instructions, and you will succeed :*`, consoleRed);
    console.log('https://github.com/clqkx/AutoBot-Blum');
}
```

### That's it! Now you can use Auto Bot in Blum game on Telegram.

## Author

Telegram: [@clqkx](https://t.me/clqkx)
Telegram Channel: [@clqkxdev](https://t.me/clqkxdev)
