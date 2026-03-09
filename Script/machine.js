// store all issues from API
let allIssues = [];


// =======================
// Spinner Control
// =======================
const manageSpinner = (status) => {

    const spinner = document.getElementById("spinner");
    const container = document.getElementById("issue-container");

    if (status) {
        // show spinner
        spinner.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        // hide spinner
        spinner.classList.add("hidden");
        container.classList.remove("hidden");
    }
};


// =======================
// Remove active button style
// =======================
const removeActive = () => {

    const buttons = document.querySelectorAll(".issue-btn");

    buttons.forEach(btn => btn.classList.remove("active"));

};


// =======================
// Load all issues from API
// =======================
const loadIssues = async () => {

    manageSpinner(true); // start loading

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");

    const data = await res.json();

    // store all issues
    allIssues = data.data;

    updateCounts(); // update issue numbers

    displayIssues(allIssues); // show all issues

    manageSpinner(false); // stop loading

};


// =======================
// Update issue counts
// =======================
const updateCounts = () => {

    const openIssues = allIssues.filter(issue => issue.status === "open");

    const closeIssues = allIssues.filter(issue => issue.status === "closed");

    document.getElementById("count-all").innerText = allIssues.length;

    document.getElementById("count-open").innerText = openIssues.length;

    document.getElementById("count-close").innerText = closeIssues.length;

};


// =======================
// Display Issues as Cards
// =======================
const displayIssues = (issues) => {

    const container = document.getElementById("issue-container");

    container.innerHTML = "";

    // if no issue found
    if (issues.length === 0) {

        container.innerHTML = `
        <div class="text-center col-span-full py-10">
        <h2 class="text-2xl font-bold">No Issue Found</h2>
        </div>
        `;

        return;
    }

    // create card for each issue
    issues.forEach(issue => {

        const card = document.createElement("div");

        // border color for open issues
        const borderColor = issue.status === "open"
            ? "border-green-500"
            : "border-gray-300";

        // title color for closed issues
        const titleColor = issue.status === "closed"
            ? "text-fuchsia-700"
            : "text-gray-800";

        // show different image based on status
        const statusImage = issue.status === "open"
            ? "Open-Status.png"
            : "close.png";


        card.innerHTML = `

        <div onclick="loadSingleIssue(${issue.id})"
        class="cursor-pointer bg-white rounded-xl shadow-md border-t-4 ${borderColor} p-6 space-y-4 hover:shadow-lg transition">

            <div class="flex justify-between items-center">

                <!-- status image -->
                <div class="w-12 h-12">
                    <img src="./images/${statusImage}" class="w-full h-full object-contain">
                </div>

                <!-- priority badge -->
                <div class="bg-red-100 text-red-500 px-5 py-2 rounded-full font-semibold">
                HIGH
                </div>

            </div>

            <!-- issue title -->
            <h2 class="text-2xl font-semibold ${titleColor}">
            ${issue.title}
            </h2>

            <!-- issue description -->
            <p class="text-gray-500">
            ${issue.description}
            </p>

            <!-- tags -->
            <div class="flex gap-3">

            <span class="px-4 py-2 rounded-full bg-red-100 text-red-500 font-medium">
            BUG
            </span>

            <span class="px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 font-medium">
            HELP WANTED
            </span>

            </div>

            <!-- issue info -->
            <div class="border-t pt-4 text-gray-500 flex flex-col gap-1">

            <p>#${issue.id} by john_doe</p>

            <p>1/15/2024</p>

            </div>

        </div>

        `;

        container.append(card);

    });

};


// =======================
// Filter ALL issues
// =======================
document.getElementById("btn-all").addEventListener("click", () => {

    removeActive();

    document.getElementById("btn-all").classList.add("active");

    displayIssues(allIssues);

});


// =======================
// Filter OPEN issues
// =======================
document.getElementById("btn-open").addEventListener("click", () => {

    removeActive();

    document.getElementById("btn-open").classList.add("active");

    const openIssues = allIssues.filter(issue => issue.status === "open");

    displayIssues(openIssues);

});


// =======================
// Filter CLOSED issues
// =======================
document.getElementById("btn-close").addEventListener("click", () => {

    removeActive();

    document.getElementById("btn-close").classList.add("active");

    const closeIssues = allIssues.filter(issue => issue.status === "closed");

    displayIssues(closeIssues);

});


// =======================
// Load Single Issue Modal
// =======================
const loadSingleIssue = async (id) => {

    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    const res = await fetch(url);

    const data = await res.json();

    const issue = data.data;

    const detailsBox = document.getElementById("details-container");

    // show issue details in modal
    detailsBox.innerHTML = `

    <h2 class="text-2xl font-bold mb-3">${issue.title}</h2>

    <p class="mb-4">${issue.description}</p>

    <p class="font-semibold">Status : ${issue.status}</p>

    `;

    // open modal
    document.getElementById("issue_modal").showModal();

};


// =======================
// Search Issue
// =======================
document.getElementById("btn-search").addEventListener("click", async () => {

    const input = document.getElementById("input-search");

    const value = input.value.trim();

    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`;

    const res = await fetch(url);

    const data = await res.json();

    displayIssues(data.data);

});


// =======================
// Initial Load
// =======================
loadIssues();