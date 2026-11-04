const TTY = document.getElementById("TTY");

if (!TTY) {
    throw new Error("NeTTY: Could not locate terminal element #TTY.");
}

const AllowedUsernames = [
    "joejagger",
    "morrissey",
    "gerardway",
    "petewentz",
    "brendonurie",
    "firstvideooninstagram",
    "aladeen",
    "nuclearnadal",
    "cornerof4thonfremontstreet",
    "olitheguy"
];

let ChosenUsername = "CheekyBoy";
let SpaceHeld = false;

const UserChosenPassword = localStorage.getItem("NETTY-PWD");

const CommandHistory = [];
let HistoryIndex = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const Number1 = getRandomInt(255);
const Number2 = getRandomInt(255);
const Number3 = getRandomInt(255);
const Number4 = getRandomInt(254) + 1;
const Number5 = getRandomInt(10);

const Password = Math.round(
    (Number1 / Number4) * (Number2 * Number3) * Number5
);

const FakeIP = `${Number1}.${Number2}.${Number3}.${Number4}`;

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function ScrollTTY() {
    TTY.scrollTop = TTY.scrollHeight;
}

async function PrintTTY(printtext, sleeptime = 10, newline = true) {
    const output = document.createTextNode("");
    TTY.append(output);

    for (const letter of String(printtext)) {
        output.data += letter;
        ScrollTTY();

        if (!SpaceHeld) {
            await sleep(sleeptime);
        }
    }

    if (newline) {
        TTY.append(document.createTextNode("\n"));
        ScrollTTY();
    }
}

function Input(useHistory = false) {
    return new Promise(resolve => {
        const input = document.createTextNode("");
        TTY.append(input);

        let historyIndex = CommandHistory.length;
        let draft = "";

        function keyHandler(event) {
            if (event.isComposing) return;

            if (event.key === "Enter") {
                event.preventDefault();
                document.removeEventListener("keydown", keyHandler);
                resolve(input.data);
                return;
            }

            if (useHistory && event.key === "ArrowUp") {
                event.preventDefault();

                if (historyIndex === CommandHistory.length) {
                    draft = input.data;
                }

                if (historyIndex > 0) {
                    historyIndex--;
                    input.data = CommandHistory[historyIndex];
                }

                ScrollTTY();
                return;
            }

            if (useHistory && event.key === "ArrowDown") {
                event.preventDefault();

                if (historyIndex < CommandHistory.length) {
                    historyIndex++;

                    input.data = historyIndex === CommandHistory.length
                        ? draft
                        : CommandHistory[historyIndex];
                }

                ScrollTTY();
                return;
            }

            if (event.key === "Backspace") {
                event.preventDefault();
                input.data = input.data.slice(0, -1);
                ScrollTTY();
                return;
            }

            if (
                event.key.length === 1 &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
            ) {
                event.preventDefault();
                input.data += event.key;
                ScrollTTY();
            }
        }

        document.addEventListener("keydown", keyHandler);
    });
}

document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        location.href = "/";
    }

    if (event.code === "Space") {
        SpaceHeld = true;
    }
});

document.addEventListener("keyup", event => {
    if (event.code === "Space") {
        SpaceHeld = false;
    }
});

async function GetAuth() {
    while (true) {
        await PrintTTY("Username: ", 1, false);

        const Username = await Input();

        if (Username.trim() === "") {
            await PrintTTY("\n\n");
            continue;
        }

        if (!AllowedUsernames.includes(Username)) {
            await PrintTTY("\nIncorrect Credentials.\n");
            continue;
        }

        await PrintTTY("\nPassword: ", 1, false);

        const InPassword = await Input();

        if (InPassword === "") {
            await PrintTTY("\n\n");
            continue;
        }

        if (
            InPassword !== String(Password) &&
            InPassword !== UserChosenPassword
        ) {
            await PrintTTY("\nIncorrect Credentials.\n");
            continue;
        }

        TTY.textContent = "";

        await PrintTTY(String.raw`
             _  _    _____ _______   __
            | \| |__|_   _|_   _\ \ / /
            | .\` / -_)| |   | |  \ V /
            |_|\_\___|  |_|   |_|   |_|

              Netbased Teletypewriter
                © Joe Jagger 2026+
        `);

        await PrintTTY("\nAuthentication Success. Welcome to NeTTY.\n");

        ChosenUsername = Username;
        break;
    }
}

function GetCommandURL(command) {
    const encodedPath = command
        .split("/")
        .map(segment => encodeURIComponent(segment))
        .join("/");

    return `/netcommands/${encodedPath}`;
}

async function MakeRequest(URI) {
    return await fetch(URI);
}

const ImageExtensions = new Set([
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
    "bmp",
    "avif",
    "ico",
    "tif",
    "tiff",
    "apng"
]);

const VideoExtensions = new Set([
    "mp4",
    "m4v",
    "webm",
    "ogv",
    "mov",
    "avi",
    "mkv",
    "mpeg",
    "mpg",
    "mpe",
    "m2v",
    "3gp",
    "3g2",
    "ts"
]);

const AudioExtensions = new Set([
    "mp3",
    "mp2",
    "mp1",
    "mpga",
    "m4a",
    "aac",
    "wav",
    "wave",
    "ogg",
    "oga",
    "opus",
    "flac",
    "weba",
    "wma",
    "aiff",
    "aif",
    "mid",
    "midi",
    "amr",
    "ac3",
    "mka",
    "caf"
]);

function GetFileExtension(filename) {
    const cleanName = filename.split(/[?#]/)[0];
    const lastDot = cleanName.lastIndexOf(".");

    if (lastDot === -1) {
        return "";
    }

    return cleanName.slice(lastDot + 1).toLowerCase();
}

function DetectMediaType(mime, filename) {
    mime = (mime || "")
        .split(";")[0]
        .trim()
        .toLowerCase();

    const extension = GetFileExtension(filename);

    if (mime.startsWith("image/")) {
        return "image";
    }

    if (mime.startsWith("audio/")) {
        return "audio";
    }

    if (
        mime.startsWith("video/") ||
        mime === "application/mp4"
    ) {
        return "video";
    }

    if (
        mime === "application/ogg" ||
        mime === "application/octet-stream" ||
        mime === "binary/octet-stream" ||
        mime === ""
    ) {
        if (ImageExtensions.has(extension)) return "image";
        if (AudioExtensions.has(extension)) return "audio";
        if (VideoExtensions.has(extension)) return "video";

        if (mime === "application/ogg") {
            return "video";
        }

        return null;
    }

    if (
        mime === "application/x-photoshop" ||
        mime === "image/x-icon"
    ) {
        return "image";
    }

    return null;
}

const NettyWindows = new Map();

let WindowZIndex = 1050;
let WindowCounter = 0;
let MediaTaskbar = null;

function InitialiseMediaWindowStyles() {
    if (document.getElementById("netty-window-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "netty-window-styles";

    style.textContent = `
        .netty-media-window {
            position: fixed;
            display: flex;
            flex-direction: column;
            width: 720px;
            height: 520px;
            min-width: 240px;
            min-height: 160px;
            max-width: calc(100vw - 16px);
            max-height: calc(100vh - 48px);
            overflow: hidden;
            resize: both;
            background: #171717;
            color: #ffffff;
            border: 1px solid #555;
            border-radius: 7px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.65);
            font-family: Arial, sans-serif;
            box-sizing: border-box;
        }

        .netty-media-window *,
        .netty-media-taskbar * {
            box-sizing: border-box;
        }

        .netty-window-titlebar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            height: 36px;
            min-height: 36px;
            padding: 0 6px 0 12px;
            background: #252525;
            border-bottom: 1px solid #444;
            cursor: grab;
            user-select: none;
            touch-action: none;
        }

        .netty-window-titlebar:active {
            cursor: grabbing;
        }

        .netty-window-title {
            font-size: 12px;
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .netty-window-controls {
            display: flex;
            align-items: center;
            gap: 5px;
            flex-shrink: 0;
        }

        .netty-window-controls button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 27px;
            height: 25px;
            padding: 0;
            border: none;
            border-radius: 4px;
            background: transparent;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }

        .netty-window-controls button:hover {
            background: #454545;
        }

        .netty-window-controls .netty-close:hover {
            background: #c42b2b;
        }

        .netty-window-content {
            display: flex;
            flex: 1;
            min-width: 0;
            min-height: 0;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #090909;
        }

        .netty-window-content img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            user-select: none;
            -webkit-user-drag: none;
        }

        .netty-window-content video {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
        }

        .netty-window-content audio {
            display: block;
            width: calc(100% - 32px);
            max-width: 600px;
        }

        .netty-audio-content {
            flex-direction: column;
            gap: 20px;
            padding: 24px;
            background: linear-gradient(145deg, #202020, #090909);
        }

        .netty-audio-artwork {
            width: 180px;
            height: 180px;
            max-width: 60%;
            object-fit: contain;
            border-radius: 8px;
            display: none;
        }

        .netty-audio-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 110px;
            height: 110px;
            border: 1px solid #555;
            border-radius: 50%;
            background: #252525;
            color: #ddd;
            font-size: 46px;
        }

        .netty-audio-filename {
            max-width: 100%;
            overflow-wrap: anywhere;
            color: #ddd;
            font-size: 13px;
            text-align: center;
        }

        .netty-audio-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
        }

        .netty-audio-controls button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 36px;
            border: 1px solid #555;
            border-radius: 5px;
            background: #292929;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            transition: background 0.15s ease;
        }

        .netty-audio-controls button:hover:not(:disabled) {
            background: #505050;
        }

        .netty-audio-controls button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .netty-media-taskbar {
            position: fixed;
            display: flex;
            align-items: center;
            gap: 6px;
            bottom: 8px;
            left: 8px;
            max-width: calc(100vw - 16px);
            overflow-x: auto;
            padding: 6px;
            background: rgba(20, 20, 20, 0.96);
            border: 1px solid #555;
            border-radius: 7px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 100000;
        }

        .netty-media-taskbar[hidden] {
            display: none;
        }

        .netty-task-item {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            border: 1px solid #444;
            border-radius: 4px;
            background: #292929;
            overflow: hidden;
        }

        .netty-task-restore,
        .netty-task-close {
            height: 30px;
            padding: 0 10px;
            border: none;
            background: transparent;
            color: white;
            cursor: pointer;
        }

        .netty-task-restore {
            max-width: 180px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 11px;
        }

        .netty-task-restore:hover,
        .netty-task-close:hover {
            background: #454545;
        }

        .netty-task-close {
            font-size: 16px;
        }

        @media (max-width: 600px) {
            .netty-media-window {
                width: calc(100vw - 16px);
                height: min(520px, calc(100vh - 60px));
            }
        }
    `;

    document.head.appendChild(style);
}

function GetMediaTaskbar() {
    if (MediaTaskbar && MediaTaskbar.isConnected) {
        return MediaTaskbar;
    }

    MediaTaskbar = document.createElement("div");

    MediaTaskbar.className = "netty-media-taskbar";
    MediaTaskbar.hidden = true;

    document.body.appendChild(MediaTaskbar);

    return MediaTaskbar;
}

function FocusMediaWindow(mediaWindow) {
    WindowZIndex++;
    mediaWindow.style.zIndex = WindowZIndex;
}

function CloseMediaWindow(id) {
    const entry = NettyWindows.get(id);

    if (!entry) return;

    const {
        element,
        media,
        objectURL,
        artworkURL,
        taskItem
    } = entry;

    if (media instanceof HTMLMediaElement) {
        media.pause();
        media.removeAttribute("src");
        media.load();
    }

    if (objectURL) {
        URL.revokeObjectURL(objectURL);
    }

    if (artworkURL) {
        URL.revokeObjectURL(artworkURL);
    }

    if (taskItem) {
        taskItem.remove();
    }

    element.remove();

    NettyWindows.delete(id);

    if (MediaTaskbar && MediaTaskbar.children.length === 0) {
        MediaTaskbar.hidden = true;
    }
}

function MinimiseMediaWindow(id) {
    const entry = NettyWindows.get(id);

    if (!entry || entry.minimised) return;

    const { element, title } = entry;

    const taskbar = GetMediaTaskbar();

    const taskItem = document.createElement("div");
    taskItem.className = "netty-task-item";

    const restoreButton = document.createElement("button");

    restoreButton.className = "netty-task-restore";
    restoreButton.type = "button";
    restoreButton.textContent = title;
    restoreButton.title = `Restore ${title}`;

    restoreButton.addEventListener("click", () => {
        RestoreMediaWindow(id);
    });

    const closeButton = document.createElement("button");

    closeButton.className = "netty-task-close";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.title = `Close ${title}`;

    closeButton.addEventListener("click", () => {
        CloseMediaWindow(id);
    });

    taskItem.append(restoreButton, closeButton);

    taskbar.appendChild(taskItem);
    taskbar.hidden = false;

    entry.taskItem = taskItem;
    entry.minimised = true;

    element.style.display = "none";
}

function RestoreMediaWindow(id) {
    const entry = NettyWindows.get(id);

    if (!entry || !entry.minimised) return;

    entry.minimised = false;

    if (entry.taskItem) {
        entry.taskItem.remove();
        entry.taskItem = null;
    }

    entry.element.style.display = "flex";

    if (MediaTaskbar && MediaTaskbar.children.length === 0) {
        MediaTaskbar.hidden = true;
    }

    FocusMediaWindow(entry.element);
}

function InitialiseWindowDragging(mediaWindow, titlebar) {
    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        if (event.target.closest("button")) return;

        dragging = true;

        const rect = mediaWindow.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        titlebar.setPointerCapture(event.pointerId);

        FocusMediaWindow(mediaWindow);
    });

    titlebar.addEventListener("pointermove", event => {
        if (!dragging) return;

        const maxLeft = Math.max(0, window.innerWidth - 80);
        const maxTop = Math.max(0, window.innerHeight - 36);

        const left = Math.max(
            0,
            Math.min(event.clientX - offsetX, maxLeft)
        );

        const top = Math.max(
            0,
            Math.min(event.clientY - offsetY, maxTop)
        );

        mediaWindow.style.left = `${left}px`;
        mediaWindow.style.top = `${top}px`;
    });

    function StopDragging() {
        dragging = false;
    }

    titlebar.addEventListener("pointerup", StopDragging);
    titlebar.addEventListener("pointercancel", StopDragging);
    titlebar.addEventListener("lostpointercapture", StopDragging);
}

function GetMP3TrackURL(currentURI, direction) {
    const url = new URL(currentURI, window.location.href);

    const match = url.pathname.match(/(^|\/)(\d+)\.mp3$/i);

    if (!match) {
        return null;
    }

    const currentNumber = Number(match[2]);
    const nextNumber = currentNumber + direction;

    if (!Number.isSafeInteger(nextNumber) || nextNumber < 0) {
        return null;
    }

    const nextFilename = `${String(nextNumber).padStart(match[2].length, "0")}.mp3`;

    url.pathname = url.pathname.replace(
        /(^|\/)\d+\.mp3$/i,
        `$1${nextFilename}`
    );

    return url.href;
}

async function CheckAudioTrackExists(uri) {
    try {
        let response = await fetch(uri, {
            method: "HEAD",
            cache: "no-store"
        });

        if (response.status === 405 || response.status === 501) {
            response = await fetch(uri, {
                method: "GET",
                headers: {
                    Range: "bytes=0-0"
                },
                cache: "no-store"
            });

            if (response.body) {
                await response.body.cancel();
            }
        }

        return response.ok;

    } catch (error) {
        console.warn("NeTTY: Could not check audio track:", error);
        return false;
    }
}

function LoadAudioArtwork(entry, uri) {
    if (!window.jsmediatags || !entry) {
        return;
    }

    window.jsmediatags.read(
        new URL(uri, window.location.href).href,
        {
            onSuccess: result => {
                const currentEntry = NettyWindows.get(entry.id);

                if (!currentEntry || currentEntry.sourceURL !== uri) {
                    return;
                }

                const picture = result.tags.picture;

                if (!picture) {
                    return;
                }

                const bytes = new Uint8Array(picture.data);

                const blob = new Blob([bytes], {
                    type: picture.format
                });

                const artworkURL = URL.createObjectURL(blob);

                if (currentEntry.artworkURL) {
                    URL.revokeObjectURL(currentEntry.artworkURL);
                }

                currentEntry.artworkURL = artworkURL;
                currentEntry.artworkElement.src = artworkURL;
                currentEntry.artworkElement.style.display = "block";
            },

            onError: error => {
                console.warn(
                    "NeTTY: Could not read album artwork:",
                    error
                );
            }
        }
    );
}

async function NavigateAudioTrack(id, direction) {
    const entry = NettyWindows.get(id);

    if (!entry || entry.type !== "audio") {
        return;
    }

    const targetURI = GetMP3TrackURL(
        entry.sourceURL,
        direction
    );

    if (!targetURI) {
        await PrintTTY(
            "Track navigation is only supported for numerically named MP3 files."
        );
        return;
    }

    const filename = decodeURIComponent(
        new URL(targetURI).pathname.split("/").pop()
    );

    await PrintTTY(`Searching for track: ${filename}`);

    const exists = await CheckAudioTrackExists(targetURI);

    if (!exists) {
        await PrintTTY(`Track not found: ${filename}`);
        return;
    }

    const currentEntry = NettyWindows.get(id);

    if (!currentEntry) {
        return;
    }

    currentEntry.media.pause();

    currentEntry.sourceURL = targetURI;
    currentEntry.title = filename;

    currentEntry.titleElement.textContent = filename;
    currentEntry.filenameElement.textContent = filename;

    if (currentEntry.artworkURL) {
        URL.revokeObjectURL(currentEntry.artworkURL);
        currentEntry.artworkURL = null;
    }

    currentEntry.artworkElement.removeAttribute("src");
    currentEntry.artworkElement.style.display = "none";

    currentEntry.media.src = targetURI;
    currentEntry.media.load();

    currentEntry.media.play().catch(error => {
        console.warn("NeTTY: Audio autoplay failed:", error);
    });

    if (currentEntry.taskItem) {
        const restoreButton = currentEntry.taskItem.querySelector(
            ".netty-task-restore"
        );

        if (restoreButton) {
            restoreButton.textContent = filename;
            restoreButton.title = `Restore ${filename}`;
        }
    }

    LoadAudioArtwork(currentEntry, targetURI);

    await PrintTTY(`Now playing: ${filename}`);
}

function CreateMediaWindow(title, type, src, objectURL = null) {
    InitialiseMediaWindowStyles();

    const id = `netty-window-${crypto.randomUUID()}`;

    const mediaWindow = document.createElement("section");

    mediaWindow.id = id;
    mediaWindow.className = "netty-media-window";

    const offset = (WindowCounter++ % 8) * 28;

    const width = Math.min(720, window.innerWidth - 16);
    const height = Math.min(520, window.innerHeight - 48);

    const left = Math.max(
        0,
        Math.min(48 + offset, window.innerWidth - width)
    );

    const top = Math.max(
        0,
        Math.min(48 + offset, window.innerHeight - height - 8)
    );

    mediaWindow.style.width = `${width}px`;
    mediaWindow.style.height = `${height}px`;
    mediaWindow.style.left = `${left}px`;
    mediaWindow.style.top = `${top}px`;

    const titlebar = document.createElement("div");

    titlebar.className = "netty-window-titlebar";

    const titleElement = document.createElement("span");

    titleElement.className = "netty-window-title";
    titleElement.textContent = title;

    const controls = document.createElement("div");

    controls.className = "netty-window-controls";

    const minimiseButton = document.createElement("button");

    minimiseButton.type = "button";
    minimiseButton.textContent = "−";
    minimiseButton.title = "Minimise";

    minimiseButton.addEventListener("click", () => {
        MinimiseMediaWindow(id);
    });

    const closeButton = document.createElement("button");

    closeButton.type = "button";
    closeButton.className = "netty-close";
    closeButton.textContent = "×";
    closeButton.title = "Close";

    closeButton.addEventListener("click", () => {
        CloseMediaWindow(id);
    });

    controls.append(minimiseButton, closeButton);
    titlebar.append(titleElement, controls);

    const content = document.createElement("div");

    content.className = "netty-window-content";

    let media;

    const entry = {
        id,
        element: mediaWindow,
        media: null,
        title,
        type,
        sourceURL: src,
        objectURL,
        artworkURL: null,
        artworkElement: null,
        filenameElement: null,
        titleElement,
        taskItem: null,
        minimised: false
    };

    if (type === "image") {
        media = document.createElement("img");

        media.src = src;
        media.alt = title;
        media.draggable = false;

        media.addEventListener("error", () => {
            PrintTTY(`Failed to load image: ${title}`);
        }, { once: true });

    } else if (type === "video") {
        media = document.createElement("video");

        media.src = src;
        media.controls = true;
        media.preload = "metadata";
        media.playsInline = true;

        media.addEventListener("error", () => {
            PrintTTY(`Failed to load video: ${title}`);
        }, { once: true });

    } else if (type === "audio") {
        content.classList.add("netty-audio-content");

        const artwork = document.createElement("img");

        artwork.className = "netty-audio-artwork";
        artwork.alt = "Album artwork";

        const filename = document.createElement("div");

        filename.className = "netty-audio-filename";
        filename.textContent = title;

        media = document.createElement("audio");

        media.src = src;
        media.controls = true;
        media.preload = "metadata";

        const audioControls = document.createElement("div");

        audioControls.className = "netty-audio-controls";

        const previousButton = document.createElement("button");

        previousButton.type = "button";
        previousButton.textContent = "◀";
        previousButton.title = "Previous track";
        previousButton.setAttribute("aria-label", "Previous track");

        const nextButton = document.createElement("button");

        nextButton.type = "button";
        nextButton.textContent = "▶";
        nextButton.title = "Next track";
        nextButton.setAttribute("aria-label", "Next track");

        const isNumberedMP3 = !!GetMP3TrackURL(src, 1);

        previousButton.disabled = !isNumberedMP3;
        nextButton.disabled = !isNumberedMP3;

        previousButton.addEventListener("click", () => {
            NavigateAudioTrack(id, -1);
        });

        nextButton.addEventListener("click", () => {
            NavigateAudioTrack(id, 1);
        });

        audioControls.append(previousButton, nextButton);

        content.append(
            artwork,
            filename,
            audioControls,
            media
        );

        entry.artworkElement = artwork;
        entry.filenameElement = filename;
    }

    if (type !== "audio") {
        content.appendChild(media);
    }

    entry.media = media;

    NettyWindows.set(id, entry);

    mediaWindow.append(titlebar, content);

    document.body.appendChild(mediaWindow);

    InitialiseWindowDragging(mediaWindow, titlebar);

    mediaWindow.addEventListener("pointerdown", () => {
        FocusMediaWindow(mediaWindow);
    });

    FocusMediaWindow(mediaWindow);

    if (type === "audio") {
        LoadAudioArtwork(entry, src);
    }

    return mediaWindow;
}

async function DisplayImage(response, filename) {
    await PrintTTY(`Displaying image: ${filename}`);

    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    CreateMediaWindow(
        filename,
        "image",
        objectURL,
        objectURL
    );
}

async function DisplayVideo(response, filename, URI) {
    await PrintTTY(`Opening video: ${filename}`);

    if (response.body) {
        try {
            await response.body.cancel();
        } catch (error) {
        }
    }

    CreateMediaWindow(
        filename,
        "video",
        URI
    );
}

async function DisplayAudio(response, filename, URI) {
    await PrintTTY(`Opening audio: ${filename}`);

    if (response.body) {
        try {
            await response.body.cancel();
        } catch (error) {
        }
    }

    CreateMediaWindow(
        filename,
        "audio",
        URI
    );
}

async function DisplayFlash(URI) {
    await PrintTTY("Attempting to execute Shockwave Flash via Ruffle.");
    await PrintTTY("CTRL+B TO EXIT.");

    await import("/static/ruffle/ruffle.js");

    if (!window.RufflePlayer) {
        throw new Error("Ruffle failed to initialise.");
    }

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();

    player.classList.add("tty-window");

    document.body.appendChild(player);

    try {
        await player.ruffle().load({
            url: URI
        });

        await new Promise(resolve => {
            function ctrlBHandler(event) {
                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() === "b"
                ) {
                    event.preventDefault();

                    document.removeEventListener(
                        "keydown",
                        ctrlBHandler
                    );

                    resolve();
                }
            }

            document.addEventListener("keydown", ctrlBHandler);
        });

    } finally {
        player.remove();
    }
}

async function ExecuteJavaScript(URI, args) {
    try {
        const { default: camisadoLib } = await import(URI);

        if (typeof camisadoLib?.track5 !== "function") {
            throw new Error("Module does not export track5().");
        }

        await camisadoLib.track5(args);

    } catch (error) {
        await PrintTTY(`JS execution failed: ${error.message}`);
    }
}

async function ProcessJSON(response, filename) {
    try {
        const data = await response.json();

        await PrintTTY(
            `Located JavaScript Object Notation file @ ${filename}`
        );

        await PrintTTY(
            JSON.stringify(data, null, 4)
        );

    } catch (error) {
        await PrintTTY(`JSON parsing failed: ${error.message}`);
    }
}

async function ProcessPlaintext(response) {
    try {
        const text = await response.text();

        await PrintTTY(
            "Received Plaintext file / Oct. Stream:"
        );

        for (const line of text.split(/\r?\n/)) {
            await PrintTTY(line);
        }

    } catch (error) {
        await PrintTTY(`Plaintext Print Failed: ${error.message}`);
    }
}

async function ProcessCommand(commandLine) {
    const args = commandLine.trim().split(/\s+/);

    const commandName = args[0];

    if (!commandName) return;

    if (["exit", "logoff", "poweroff"].includes(commandName)) {
        await PrintTTY("Exiting.");

        await sleep(1000);

        location.href = "/";

        return;
    }

    const URI = GetCommandURL(commandName);

    let response;

    try {
        response = await MakeRequest(URI);

    } catch (error) {
        await PrintTTY(`Request failed: ${error.message}`);
        return;
    }

    if (!response.ok) {
        await PrintTTY(
            `File / Command not found. (HTTP ${response.status})`
        );

        return;
    }

    const Mime = (
        response.headers.get("Content-Type") || ""
    )
        .split(";")[0]
        .trim()
        .toLowerCase();

    await PrintTTY(`Located MimeType: ${Mime || "Unknown"}`);

    if (
        Mime === "application/x-shockwave-flash" ||
        Mime === "application/vnd.adobe.flash.movie"
    ) {
        try {
            await DisplayFlash(URI);

        } catch (error) {
            await PrintTTY(`Flash execution failed: ${error.message}`);
        }

        return;
    }

    if (
        Mime === "application/javascript" ||
        Mime === "text/javascript" ||
        Mime === "application/ecmascript" ||
        Mime === "text/ecmascript"
    ) {
        await ExecuteJavaScript(URI, args);
        return;
    }

    if (Mime === "application/json") {
        await ProcessJSON(response, commandName);
        return;
    }

    const MediaType = DetectMediaType(Mime, commandName);

    if (MediaType === "image") {
        try {
            await DisplayImage(response, commandName);
        } catch (error) {
            await PrintTTY(`Image processing failed: ${error.message}`);
        }

        return;
    }

    if (MediaType === "video") {
        try {
            await DisplayVideo(response, commandName, URI);
        } catch (error) {
            await PrintTTY(`Video processing failed: ${error.message}`);
        }

        return;
    }

    if (MediaType === "audio") {
        try {
            await DisplayAudio(response, commandName, URI);
        } catch (error) {
            await PrintTTY(`Audio processing failed: ${error.message}`);
        }

        return;
    }

    if (
        Mime === "text/plain" ||
        Mime === "application/octet-stream" ||
        Mime === "binary/octet-stream" ||
        Mime === ""
    ) {
        await ProcessPlaintext(response);
        return;
    }

    await PrintTTY(`Unsupported MIME type: ${Mime}`);
}

async function CommandLoop() {
    while (true) {
        ScrollTTY();

        await PrintTTY(
            `[${ChosenUsername}@wsys ~]$ `,
            1,
            false
        );

        const Command = await Input(true);

        await PrintTTY("\n");

        if (Command.trim() === "") {
            continue;
        }

        if (
            CommandHistory[CommandHistory.length - 1] !== Command
        ) {
            CommandHistory.push(Command);
        }

        try {
            await ProcessCommand(Command);

        } catch (error) {
            await PrintTTY(
                `Command execution failed: ${error.message}`
            );
        }
    }
}

async function RunNetCommandline() {
    TTY.textContent = "";

    await PrintTTY(
        "------------------------------------------------------------------------------",
        5
    );

    await PrintTTY("NeTTY Initialized.");

    await PrintTTY(
        "CTRL + C or 'logoff' or 'poweroff' or 'exit' to return to wsys.day."
    );

    await sleep(500);

    await PrintTTY(
        "Connected to RealmD Server @",
        10,
        false
    );

    await PrintTTY(`${FakeIP} `, 30);

    await PrintTTY(
        `We are on VLAN: ${Number5} via enp14s0.\n\n`
    );

    await PrintTTY(
        "Connecting to /var/lib/sss / pipes / private / pam..."
    );

    await PrintTTY(
        "[.................................] ",
        20,
        false
    );

    await PrintTTY(" Connection Established.");

    await PrintTTY("\n\n");

    await PrintTTY("Interactive Authentication Required.");

    await GetAuth();

    await CommandLoop();
}

async function main() {
    await RunNetCommandline();
}

main().catch(error => {
    console.error("NeTTY encountered a fatal error:", error);

    PrintTTY(
        `Fatal Error: ${error.message}`,
        1
    );
});