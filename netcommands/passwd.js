const TTY = document.getElementById("TTY");

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

var ChosenPWD, ChosenPWDConfirm
const camisadoLib = {
    async track5() {
        await PrintTTY("NeTTY Password Utility\nInsert new user password.\n");
        await sleep(100)
        await PrintTTY("> ",0,false)
        ChosenPWD = await Input();
        if (ChosenPWD === "") {
            await PrintTTY("\nInsert a password and try again.")
            return;
        }

        await PrintTTY("\nConfirm Password.\n> ",0,false);
        ChosenPWDConfirm = await Input();

        if (ChosenPWDConfirm !== ChosenPWD) {
            await PrintTTY("\nPasswords do not match.")
            return;
        }

        localStorage.setItem("NETTY-PWD",ChosenPWD)

        await PrintTTY("\nPassword set.")
    }
};

export default camisadoLib;