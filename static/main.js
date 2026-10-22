
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
    "<img src='/static/fallingitems/card1.png' class='playingcard rot-left'>",
    "<img src='/static/fallingitems/card2.png' class='playingcard rot-left'>",
    "<img src='/static/fallingitems/card1.png' class='playingcard rot-right'>",
    "<img src='/static/fallingitems/card2.png' class='playingcard rot-right'>",
    "<img src='/static/fallingitems/tophat.png' class='playingcard rot-right invert'>",
    "<img src='/static/fallingitems/tophat.png' class='playingcard rot-left invert'>",




];

async function RandomObjectsFall() {
    const container = document.getElementById("falling-container");

    const html = htmlTable[
        Math.floor(Math.random() * htmlTable.length)
    ];

    const item = document.createElement("div");


    item.className = "falling-item";
    item.innerHTML = html;
    item.style.left = Math.random() * 100 + "vw";
    item.style.right = "auto";

    container.appendChild(item);

    item.addEventListener("animationend", () => {
        setTimeout(() => {
            item.remove();
        }, 6000);
    });
}

setInterval(RandomObjectsFall, 1000);


