function RandomQuote() {
    const quotes = [
        "And if a double-decker bus crashes into us...",
        "Los Angeles, you are too hot!",
        "I am the son, and the heir, of a shyness that is criminally vulgar.",
        "England is mine, and it owes me a living...",
        "We'll let you know...",
        "Keats and yeats are on your side!",
        "What difference does it make?",
        "Succumb to the beat surrender!",
        "I crashed down on the cross-bar...",
        "Alma Matters.",
        "If the lives we live are only golden-plated?",
        "I am the son and heir; of nothing in particular...",
        "And if my voice occasionally cracks...", // https://www.youtube.com/watch?v=laZVR3D7dt0&t=14s
        "I have a lovely singing voice."

    ];
    const el = document.getElementById("WittyQuoteBox(R)");
    el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}



RandomQuote();