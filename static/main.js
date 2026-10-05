function RandomQuote() {
    const quotes = [
        "And if a double-decker bus crashes into us...",
        "Please leave all over-coats, canes & top-hats with the doorman.",
        "And if my voice occasionally cracks...", // https://www.youtube.com/watch?v=laZVR3D7dt0&t=14s
        "I have a lovely singing voice."

    ];
    const el = document.getElementById("WittyQuoteBox(R)");
    el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}



RandomQuote();