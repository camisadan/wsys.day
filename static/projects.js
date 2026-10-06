// handles loading project cards

async function LoadProjects() {
    const response = await fetch("/projects.json");
    const projects = await response.json();

    return projects;
}

const container = document.getElementById("project-container");

async function ConstructCard(title, content, id, imagehref) {
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
}

var ProjectJSONs;

LoadProjects().then(projects => {
    ProjectJSONs = projects;

    for (const project of projects) {
        console.log("Adding Project ", project);

        ConstructCard(
            String(project.title).toUpperCase(),
            project.desc,
            project.id,
            project.imagehref
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
    console.log(projectname)
}

