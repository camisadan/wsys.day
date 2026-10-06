
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

