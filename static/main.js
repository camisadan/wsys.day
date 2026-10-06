function RandomQuote() {
    const quotes = [
        "And if a double-decker bus crashes into us...",
        "Please leave all over-coats, canes & top-hats with the doorman.",
        "And if my voice occasionally cracks...",
        "It's these substandard motels on the Corner of 4th & Fremont St.",
        "This is my first video on Instagram.",
        "A picturesque score of passing HTML."
    ];

    const el = document.getElementById("WittyQuoteBox(R)");
    el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

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

    if (!a || event.defaultPrevented) {
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

RandomQuote();