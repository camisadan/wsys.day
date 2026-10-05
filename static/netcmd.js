const TTY = document.getElementById("TTY");


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const Number1 = getRandomInt(255);
const Number2 = getRandomInt(255);
const Number3 = getRandomInt(255);
const Number4 = getRandomInt(254) + 1; // 1-254, never 0

const Number5 = getRandomInt(10);

const Password = Math.round((Number1 / Number4) * (Number2 * Number3) * Number5);

const UserChosenPassword = localStorage.getItem("NETTY-PWD")

console.log(Password);
const AllowedUsernames = [
    "joejagger",
    "morrissey",
    "gerardway",
    "aladeen",
    "nuclearnadal"
];
var ChosenUsername = "CheekyBoy";
const FakeIP = `${Number1}.${Number2}.${Number3}.${Number4}`

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function Input() {
    return new Promise(resolve => {
        let input = "";

        function keyHandler(event) {
            if (event.key === "Enter") {
                document.removeEventListener("keydown", keyHandler);
                resolve(input);
            } else if (event.key.length === 1) {
                input += event.key;
                TTY.append(event.key);
            } else if (event.key === "Backspace") {
                input = input.slice(0, -1);
                TTY.textContent = TTY.textContent.slice(0, -1);
            }
        }

        document.addEventListener("keydown", keyHandler);
    });
}

let SpaceHeld = false;

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        location.href = "/";
    }
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        SpaceHeld = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
        SpaceHeld = false;
    }
});

async function PrintTTY(printtext, sleeptime = 10, newline = true) {
    for (const letter of printtext) {
        TTY.textContent += letter;

        if (!SpaceHeld) {
            await sleep(sleeptime);
        }
    }

    if (newline) {
        TTY.append("\n");
    }
}


async function GetAuth() {
    while (true) {
        await PrintTTY("Username: ", 1, false);
        const Username = await Input();

        if (Username === "") {
            await PrintTTY("\n\n");
            continue;
        }

        let ValidUser = false;

        for (const AllowedUsername of AllowedUsernames) {
            if (AllowedUsername === Username) {
                ValidUser = true;
                break;
            }
        }

        if (!ValidUser) {
            await PrintTTY("\nIncorrect Credentials.\n");
            continue;
        }

        await PrintTTY("\nPassword: ", 1, false);
        const InPassword = await Input();

        if (InPassword === "") {
            await PrintTTY("\n\n");
            continue;
        }


        if (InPassword !== String(Password) && InPassword !== UserChosenPassword) {
            await PrintTTY("\nIncorrect Credentials.\n");
            continue;
        }

        TTY.textContent = ""
        await PrintTTY(`
             _  _    _____ _______   __
            | \\| |__|_   _|_   _\\ \\ / /
            | .\` / -_)| |   | |  \\ V / 
            |_|\_\___|  |_|   |_|   |_|  
                                        
              Netbased Teletypewriter
                © Joe Jagger 2026+
        `);
        await PrintTTY("\nAuthentication Success. Welcome to NeTTY.\n");
        ChosenUsername = Username
        break;
    }
}

async function MakeRequest(URI) {
    const response = await fetch(URI);
    return response;
}


var Command, Resp, Mime, Ext;

async function CommandLoop() {
    while (true) {
        TTY.scrollTop = TTY.scrollHeight;
        await PrintTTY(`[${ChosenUsername}@wsys ~]$ `, 1, false);

        Command = await Input();
        await PrintTTY("\n");

        if (["exit", "logoff", "poweroff"].includes(Command)) {
            await PrintTTY("Exiting.");
            await sleep(1000);
            location.href = "/";
        }

        try {
            Resp = await MakeRequest(`/netcommands/${Command}`);
        } catch (e) {
            await PrintTTY(`Request failed: ${e.message}`, 1, false);
            continue;
        }

        if (Resp.status !== 200) {
            await PrintTTY("File / Command not found.", 5);
            continue;
        }

        Mime = Resp.headers.get("Content-Type").split(";")[0];

        if (Mime === "application/x-shockwave-flash") {
            await PrintTTY("Attempting to execute Shockwave Flash via Ruffle.\nCTRL+B TO EXIT.");

            await import("/static/ruffle/ruffle.js");

            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();

            player.classList.add("ruffle-window");
            document.body.appendChild(player);

            await player.ruffle().load({
                url: `/netcommands/${Command}`
            });

            await new Promise(resolve => {
                function ctrlCHandler(event) {
                    if (event.ctrlKey && event.key === "b") {
                        event.preventDefault();

                        document.removeEventListener("keydown", ctrlCHandler);

                        player.remove(); // destroy Ruffle player
                        resolve();
                    }
                }

                document.addEventListener("keydown", ctrlCHandler);
            });
        }
        if (Mime === "application/javascript" || Mime === "text/javascript") {
            try {
                const { default: camisadoLib } = await import(`/netcommands/${Command}`);

                await camisadoLib.track5();

            } catch (e) {
                await PrintTTY(`JS execution failed: ${e.message}`, 1, false);
            }

            continue;
        }
        if (Mime === "application/json") {
            try {
                const response = await fetch(`/netcommands/${Command}`);
                const data = await response.json();
                await PrintTTY(`Located JSON file @ ${Command}`)
                await PrintTTY(JSON.stringify(data, null, 4), 1,true);
            } catch (e) {
                await PrintTTY(`JSON parsing failed: ${e.message}`, 1, false);
            }

            continue;
        }
    }
}
async function RunNetCommandline() {
    TTY.textContent = ""
    await PrintTTY("------------------------------------------------------------------------------", 5);
    await PrintTTY("NeTTY Initialized.")
    await PrintTTY("CTRL + C or 'logoff' or 'poweroff' or 'exit' to return to wsys.day.")
    await sleep(500);
    await PrintTTY(`Connected to RealmD Server @ `, 10, false)
    await PrintTTY(`${FakeIP}`, 30)
    await PrintTTY(`We are on VLAN: ${Number5} via enp14s0.\n\n`)
    await PrintTTY(`Connecting to /var/lib/sss/pipes/private/pam...`)

    await PrintTTY("[.................................] ", 20, false)

    await PrintTTY(` Connection Established.`)
    await PrintTTY(String(Password))
    await PrintTTY("\n\n")
    await PrintTTY("Interactive Authentication Required.")
    await GetAuth();
    await CommandLoop();


}

async function main() {
    await sleep(300);
    await RunNetCommandline();
}

main();