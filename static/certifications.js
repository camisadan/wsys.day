// handles loading project cards
// this is just projects.js but reappropriated for the certsys
var DEBUG = false;
async function LoadProjects() {
    const response = await fetch("/accos.json");
    const projects = await response.json();

    return projects;
}

const container = document.getElementById("project-container");
var right = true; // stupid counter var. if left
async function ConstructCard(title, content, id, imagehref, is_bigboy) {
    if (is_bigboy) {
        container.insertAdjacentHTML("beforeend", `
        <!-- Project: ${title} -->
        <div class="panel project-pane p-0 my-4">
            <h1 class="abs project-title font-patd">${title}</h1>
            <p class="abs project-desc font-ornate text-wrap">${content}</p>
            <img class="abs project-image" src="${imagehref}">
            <a class="btn btn-danger abs project-button no-curtains"
                href="javascript:ShowPlaybill('${id}')"
            >View Info</a>
            
        </div>
        
    `);
        right = !right
    } else { // then no bigboy, which means tiny bebeh card
        if (right) {
            container.insertAdjacentHTML("beforeend", `
                            <div class="accolade-right">
                <div class="acco-title font-egyptienne">
                    ${title}
                </div>
                <div class="acco-desc font-ornate">${content}</div>
                <img src="https://placehold.co/400" class="acco-pin"></img>
                <img src="${imagehref}" class="acco-image">
                <div class="btn btn-danger acco-btn" href="javascript:ShowPlaybill(${id})"> <i class="bi bi-info-circle"></i></div>
            </div>
            `)
        } else { // then left
            container.insertAdjacentHTML("beforeend", `
                            <div class="accolade-left">
                <div class="acco-title font-egyptienne">
                    ${title}
                </div>
                <div class="acco-desc font-ornate">${content}</div>
                <img src="https://placehold.co/400" class="acco-pin"></img>
                <img src="${imagehref}" class="acco-image">
                <div class="btn btn-danger acco-btn" href="javascript:ShowPlaybill(${id})">View Info</div>
            </div>
            `)
            right = !right
        }
    }
}

var ProjectJSONs;


function OpenPlaybill(content) {
    const playbill = document.getElementById("playbill");

    playbill.innerHTML = `
        <button class="playbill-close" onclick="ClosePlaybill()">×</button>
        ${content}
    `;

    playbill.classList.add("show");
}

function ClosePlaybill() {
    document.getElementById("playbill").classList.remove("show");
}

LoadProjects().then(projects => {
    ProjectJSONs = projects;

    for (const project of projects) {
        console.log("Adding Project ", project);
        if (project.debug && !DEBUG) {
            continue;
        }
        ConstructCard(
            String(project.title).toUpperCase(),
            project.desc,
            project.id,
            project.imagehref,
            project.is_bigboy
        );
    }
});

document.querySelectorAll(".project-pane").forEach(pane => {
    pane.addEventListener("mouseenter", () => {
        const rotation = Math.random() < 0.5 ? -1 : 1;
        pane.style.setProperty("--rotation", `${rotation}deg`);
    });
});

function ShowPlaybill(projectname) {

    for (const p of ProjectJSONs) {

        if (p.id !== projectname) {
            continue;
        }

        console.log(p);

        OpenPlaybill(p.innerHTML);

        return;
    }
}


// BELOW CODE SHAMELESSLY STOLEN FROM W3SCHOOLS AHAHAHAHA

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
dragElement(document.getElementById("playbill"))
document.addEventListener("mouseenter", (event) => {
    const pane = event.target.closest(".project-pane");

    if (!pane) return;

    const rotation = Math.random() < 0.5 ? -1 : 1;
    pane.style.setProperty("--rotation", `${rotation}deg`);
}, true);