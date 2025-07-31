let number_of_widgets = 0;
let harvestMultiplier = 1;
let harvestMultiplier_Multiplier = 1;
let score = 100;
let super_gompei_count = 0;

let selling = false;

let widget_container = document.getElementById("widget-container");
let score_element = document.getElementById("score");
let multiplier_element = document.getElementById("multiplier");
let stores = document.getElementsByClassName("store");
let multiplierUpgrade_element = document.getElementById("multiplierUpgrade");
let upgradeCost_element = document.getElementById("upgradeCost");

console.log("game.js loaded");
console.log(harvestMultiplier)
console.log(harvestMultiplier_Multiplier)


/* let sound2 = new Audio("assets/chinesemusic.mp3");
sound2.loop = true;
sound2.play(); */

// Function to play cha-ching sound with overlap support
function playChaChing() {
    const sound = new Audio("assets/chaching.MP3");
    sound.play();
}

// Change the score and update store affordability
function changeScore(amount) {
    score += amount;
    score_element.innerHTML = "Score: " + Math.round(score);

    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));
        if (score < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}

// Toggle selling mode and update widget overlays
function sellFood() {
    selling = !selling;
    sell_food.innerHTML = selling ? "Stop Selling" : "Sell Food";
    sell_widgets();
}

// Show/hide "Click To Sell" overlay — only for harvestable clones
function sell_widgets() {
    let harvestWidgets = widget_container.querySelectorAll('.widget.harvestClone');
    harvestWidgets.forEach(widget => {
        let overlay = widget.querySelector(".box-overlay");

        if (!overlay) return;

        if (selling) {
            overlay.style.display = "flex";
            overlay.innerText = "Click To Sell";
        } else {
            overlay.style.display = "none";
        }
    });
}

// Buy a widget and append it to the container
function buy(store) {
    let cost = parseInt(store.getAttribute("cost"));

    if (cost > score) {
        return;
    }

    if (number_of_widgets < 24) {
        changeScore(-cost);
        playChaChing();
    }

    /*
    let super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
    if (store.getAttribute("name") == "Super-Gompei" && super_gompei != null) {
        let old_yield = parseInt(super_gompei.getAttribute("reap"));
        super_gompei.setAttribute("reap", old_yield + 100);
        super_gompei_count++;
        document.body.style = "--gompei-count:" + super_gompei_count;
        return;
    } */

    let new_widget = store.firstElementChild.cloneNode(true);
    let canBuyScreen = document.querySelector(".screen-overlay");

    new_widget.classList.add("widget", "harvestClone");
    new_widget.setAttribute("cost", store.getAttribute("cost"));

    if (number_of_widgets < 24) {
        new_widget.onclick = () => {
            if (selling) {
                handleWidgetClick(new_widget);
            } else {
                harvest(new_widget);
            }
            console.log("Number of widgets: " + number_of_widgets);
        };
        number_of_widgets++;

        widget_container.appendChild(new_widget);

        if (new_widget.getAttribute("auto") == "true") {
            new_widget.setAttribute("harvesting", "");
            setup_end_harvest(new_widget);
        }
    }
    else {
        canBuyScreen.style.display = "flex";
        setTimeout(() => {
            canBuyScreen.style.display = "none";
        }, 1000);
        return;
    }
}

// Handle cooldown timer for auto-harvest widgets
function setup_end_harvest(widget) {
    setTimeout(() => {
        widget.removeAttribute("harvesting");

        if (widget.getAttribute("auto") == "true") {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

// Harvest a widget manually or automatically
function harvest(widget) {
    if (!widget.isConnected) return;
    if (widget.hasAttribute("harvesting")) return;

    // Harvest normally
    widget.setAttribute("harvesting", "");
    changeScore(harvestMultiplier * (parseInt(widget.getAttribute("reap"))));
    givePoints(widget);
    setup_end_harvest(widget);
}

function handleWidgetClick(widget) {
    if (selling) {
        let selling_cost = Math.floor(parseInt(widget.getAttribute("cost")) / 2);
        changeScore(selling_cost);
        number_of_widgets--;
        playChaChing();
        widget.remove();
        return;
    }
}

// Show floating "+points" animation on harvest
function givePoints(widget) {
    let points_element = document.createElement("span");
    points_element.className = "point";
    points_element.innerHTML = "+" + parseFloat((widget.getAttribute("reap")) * harvestMultiplier.toFixed(10).toString());
    points_element.onanimationend = () => {
        points_element.remove();
    };
    widget.appendChild(points_element);
}

// Initialize score-related UI

changeScore(0);

function upgrade() {
    let upgradeContainer = document.querySelector("#upgrade-container");
    if (document.querySelector("#upgrade-container").style.display == "flex") {
        upgradeContainer.style.display = "none";
    }
    else {
        upgradeContainer.style.display = "flex";
    }
}

function multiplierEffect() {
    console.log("multiplierEffect");
    let cost = 20 * harvestMultiplier_Multiplier;
    if (score > cost) {
        harvestMultiplier += 0.2;

        console.log("Harvest multiplier: " + harvestMultiplier);
        console.log("Harvest multiplier's multiplier: " + harvestMultiplier_Multiplier);

        // exponential doubling every 0.2, starting at 20 when harvestMultiplier = 
        harvestMultiplier_Multiplier = 20 * Math.pow(2, (harvestMultiplier - 1) / 0.2);

        const formattedHM = parseFloat(harvestMultiplier.toFixed(8));
        multiplier_element.innerHTML = "Multiplier: x" + formattedHM;
        multiplierUpgrade_element.innerHTML = "x" + formattedHM + " Upgrade";
        upgradeCost_element.innerHTML = Math.round(20 * harvestMultiplier_Multiplier) + " Social Credits";
    }
}