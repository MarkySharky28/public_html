let widget_container = document.getElementById("widget-container");
let score_element = document.getElementById("score");
let stores = document.getElementsByClassName("store");
let number_of_widgets = 0;
let score = 5;
let super_gompei_count = 0;
let selling = false;
console.log("game.js loaded");

// Function to play cha-ching sound with overlap support
function playChaChing() {
    const sound = new Audio("assets/chaching.MP3");
    sound.play();
}

// Change the score and update store affordability
function changeScore(amount) {
    score += amount;
    score_element.innerHTML = "Score: " + score;

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
    if (widget.hasAttribute("harvesting")) return;

    // Harvest normally
    widget.setAttribute("harvesting", "");
    changeScore(parseInt(widget.getAttribute("reap")));
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
    }
}

// Show floating "+points" animation on harvest
function givePoints(widget) {
    let points_element = document.createElement("span");
    points_element.className = "point";
    points_element.innerHTML = "+" + widget.getAttribute("reap");
    points_element.onanimationend = () => {
        points_element.remove();
    };
    widget.appendChild(points_element);
}

// Initialize score-related UI

changeScore(0);

//PUT SCORE AS NaN AND THEN CHECK HOW TO PAUSE OTHERS TO PREVENT COLLECTING AND OTHER BUGS