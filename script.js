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
