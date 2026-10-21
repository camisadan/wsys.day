
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function CloseCurtains() {
    document.querySelector(".curtain-left").classList.add("close");
    document.querySelector(".curtain-right").classList.add("close");

    await wait(1000);
}

document.addEventListener("click", async (event) => {
    const a = event.target.closest("a[href]");

    if (!a || event.defaultPrevented || a.classList.contains("no-curtains")) {
        return;
    }
    if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        a.target === "_blank"
    ) {
        return;
    }

    event.preventDefault();

    const href = a.href;

    await CloseCurtains();

    window.location.href = href;
});

const htmlTable = [
    "<img src='/static/cards/card1.png' class='playingcard rot-left'>",
    "<img src='/static/cards/card2.png' class='playingcard rot-left'>",
    "<img src='/static/cards/card1.png' class='playingcard rot-right'>",
    "<img src='/static/cards/card2.png' class='playingcard rot-right'>",
];

async function RandomObjectsFall() {
    const container = document.getElementById("falling-container");

    const html = htmlTable[
        Math.floor(Math.random() * htmlTable.length)
    ];

    const item = document.createElement("div");


    item.className = "falling-item";
    item.innerHTML = html;
    const minOffset = (5 / parseFloat(getComputedStyle(document.documentElement).fontSize)) * 100 / window.innerWidth * 100;
    const edgeBias = minOffset + Math.pow(Math.random(), 5) * (90 - minOffset);

    if (Math.random() < 0.5) {
        item.style.left = edgeBias + "vw";
    } else {
        item.style.right = edgeBias + "vw";
    }


    container.appendChild(item);

    item.addEventListener("animationend", () => {
        setTimeout(() => {
            item.remove();
        }, 6000);
    });
}

setInterval(RandomObjectsFall, 2000);