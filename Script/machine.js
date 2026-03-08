let allIssues = [];

// spinner control
const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    const container = document.getElementById("issue-container");

    if (status) {
        spinner.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        spinner.classList.add("hidden");
        container.classList.remove("hidden");
    }
};

// remove active button
const removeActive = () => {
    const buttons = document.querySelectorAll(".issue-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
};

// load all issues
const loadIssues = async () => {

    manageSpinner(true);

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    allIssues = data.data;

    updateCounts();

    displayIssues(allIssues);

    manageSpinner(false);
};

// update issue counts
const updateCounts = () => {

    const openIssues = allIssues.filter(issue => issue.status === "open");
    const closeIssues = allIssues.filter(issue => issue.status === "closed");

    document.getElementById("count-all").innerText = allIssues.length;
    document.getElementById("count-open").innerText = openIssues.length;
    document.getElementById("count-close").innerText = closeIssues.length;

};

// display issues
const displayIssues = (issues) => {

    const container = document.getElementById("issue-container");

    container.innerHTML = "";
    
    document.getElementById("count-all").innerText = issues.length;

    if (issues.length === 0) {

        container.innerHTML = `
        <div class="text-center col-span-full py-10">
        <h2 class="text-2xl font-bold">No Issue Found</h2>
        </div>
        `;

        return;
    }

    issues.forEach(issue => {

        const card = document.createElement("div");

        const borderColor = issue.status === "open"
            ? "border-green-500"
            : "text-fuchsia-700";

        const titleColor = issue.status === "closed"
            ? "text-fuchsia-700"
            : "text-gray-800";

        const statusBadge = issue.status === "open"
            ? `<span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">Opened</span>`
            : `<span class="bg-gray-200 text-fuchsia-700 px-3 py-1 rounded-full text-sm font-semibold">Closed</span>`;

        card.innerHTML = `
        
        <div onclick="loadSingleIssue(${issue.id})"
        class="cursor-pointer bg-white rounded-xl shadow-md border-t-4 ${borderColor} p-6 space-y-4 hover:shadow-lg transition">

            <div class="flex justify-between items-center">

                <div class="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                <i class="fa-solid fa-circle text-green-600 text-xl"></i>
                </div>

                ${statusBadge}

            </div>

            <h2 class="text-2xl font-semibold ${titleColor}">
            ${issue.title}
            </h2>

            <p class="text-gray-500">
            ${issue.description}
            </p>

            <div class="flex gap-3">

            <span class="px-4 py-2 rounded-full bg-red-100 text-red-500 font-medium">
            <i class="fa-regular fa-calendar"></i> BUG
            </span>

            <span class="px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 font-medium">
            <i class="fa-regular fa-face-smile"></i> HELP WANTED
            </span>

            </div>

            <div class="border-t pt-4 text-gray-500 flex flex-col gap-1">

            <p>#${issue.id} by john_doe</p>

            <p>1/15/2024</p>

            </div>

        </div>
        
        `;

        container.append(card);

    });
};

// filter all
document.getElementById("btn-all").addEventListener("click", () => {

    removeActive();

    document.getElementById("btn-all").classList.add("active");

    displayIssues(allIssues);

});

// filter open
document.getElementById("btn-open").addEventListener("click", () => {

    removeActive();

    document.getElementById("btn-open").classList.add("active");

    const openIssues = allIssues.filter(issue => issue.status === "open");

    displayIssues(openIssues);

});

// filter close
document.getElementById("btn-close").addEventListener("click", () => {

    removeActive();

    document.getElementById("btn-close").classList.add("active");

    const closeIssues = allIssues.filter(issue => issue.status === "closed");

    displayIssues(closeIssues);

});

// load single issue
const loadSingleIssue = async (id) => {

    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    const res = await fetch(url);

    const data = await res.json();

    const issue = data.data;

    const detailsBox = document.getElementById("details-container");

    const statusColor = issue.status === "open"
        ? "text-green-600"
        : "text-gray-600";

    detailsBox.innerHTML = `

    <h2 class="text-3xl font-semibold mb-3 mt-10">${issue.title}</h2>

    <p class="mb-5 text-gray-600">${issue.description}</p>

    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">

        <div>
        <p class="text-gray-500">Assignee:</p>
        <p class="font-semibold">Fahim Ahmed</p>
        </div>

        <div>
        <p class="text-gray-500">Priority:</p>
        <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">HIGH</span>
        </div>

    </div>

    <p class="mt-4 mb-10 font-semibold ${statusColor}">
    Status : ${issue.status}
    </p>

    `;

    document.getElementById("issue_modal").showModal();

};

// search issue
document.getElementById("btn-search").addEventListener("click", async () => {

    const input = document.getElementById("input-search");

    const value = input.value.trim();

    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`;

    const res = await fetch(url);

    const data = await res.json();

    displayIssues(data.data);

});

// initial load
loadIssues();