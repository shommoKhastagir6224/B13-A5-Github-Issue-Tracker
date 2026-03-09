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
    buttons.forEach((btn) => btn.classList.remove("active"));
};

// load all issues
const loadIssues = async () => {
    manageSpinner(true);

    const res = await fetch(
        "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await res.json();

    allIssues = data.data;

    updateCounts();

    displayIssues(allIssues);

    manageSpinner(false);
};

// update issue counts
const updateCounts = () => {
    const openIssues = allIssues.filter((issue) => issue.status === "open");
    const closeIssues = allIssues.filter((issue) => issue.status === "closed");

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


    issues.forEach((issue) => {
        const card = document.createElement("div");

        const borderColor =
            issue.status === "open" ? "border-green-500" : "text-fuchsia-700";

        const titleColor =
            issue.status === "closed" ? "text-black" : "text-gray-800";

        const statusImage = issue.status === "open"
            ? "../assets/Open-Status.png"
            : "../assets/Closed- Status .png";

        const statusBadge =
            issue.priority === "high"
                ? `<span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[18px] font-semibold">HIGH</span>`
                : issue.priority === "medium"
                    ? `<span class="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-[18px] font-semibold">MEDIUM</span>`
                    : `<span class="bg-gray-100 text-gray-400 p-3 py-1 rounded-full  text-[18px] font-semibold">LOW</span>`;

        card.innerHTML = `
        
        <div onclick="loadSingleIssue(${issue.id})"
        class="cursor-pointer bg-white rounded-xl shadow-md border-t-4 ${borderColor} p-6 space-y-4 hover:shadow-lg transition">

            <div class="flex justify-between items-center">

                <div class="w-12 h-12">
                    <img src="./images/${statusImage}" class="w-full h-full object-contain">
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
            <i class="fa-solid fa-bug text-[14px]"></i> BUG
            </span>

            <span class="px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 font-medium">
            <i class="fa-solid fa-atom text-[18px]"></i> HELP WANTED
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

    const openIssues = allIssues.filter((issue) => issue.status === "open");

    displayIssues(openIssues);
});

// filter close
document.getElementById("btn-close").addEventListener("click", () => {
    removeActive();

    document.getElementById("btn-close").classList.add("active");

    const closeIssues = allIssues.filter((issue) => issue.status === "closed");

    displayIssues(closeIssues);
});

// load single issue
const loadSingleIssue = async (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    const res = await fetch(url);
    const data = await res.json();
    const issue = data.data;

    const detailsBox = document.getElementById("details-container");

    const statusColor =
        issue.status === "open" ? "text-green-800" : "text-gray-600";

    detailsBox.innerHTML = `

    <div class="min-w-15/16 mx-auto m-8 ">

        <!-- Close Button -->
        <button 
        onclick="document.getElementById('issue_modal').close()"
        class="absolute top-4 right-4 btn btn-soft btn-error text-lg">
        x
        </button>

        
        <h2 class="text-xl font-semibold mb-6 mt-4">
        ${issue.title}
        </h2>
        
        <div class="flex gap-[6px] items-center  flex-wrap">
        
        <p class="text-base rounded-full bg-green-300 py-1 px-5 flex items-center justify-center font-semibold ${statusColor}">
        ${issue.status}
        </p>
        
        <p class="text-[4px]  text-gray-400"><i class="fa-solid fa-circle"></i></p>
        
        <p class="text-base font-semibold text-[14px] text-gray-400">
        Opened by Fahim Ahmed
        </p>
        
        <p class="text-[4px] text-gray-400"><i class="fa-solid fa-circle"></i></p>
        
        <p class="text-base font-semibold text-[14px] text-gray-400">
        22/02/2026
        </p>
        
        </div>

        <div class="flex gap-3 py-6 ">

            <span class="px-4 py-1 rounded-full bg-red-100 text-[14px] text-red-500 font-light">
            <i class="fa-solid fa-bug text-[14px]"></i> BUG
            </span>

            <span class="px-3 py-1 rounded-full bg-yellow-100 text-[14px] text-yellow-600 font-light">
            <i class="fa-solid fa-atom text-[18px]"></i> HELP WANTED
            </span>

        </div>

        <p class="mb-6 text-gray-600 text-lg leading-relaxed">
        ${issue.description}
        </p>

        <div class="flex justify-between bg-gray-100 p-6 rounded-lg">

            <div>
                <p class="text-gray-500 text-sm">Assignee:</p>
                <p class="font-semibold text-lg">Fahim Ahmed</p>
            </div>

            <div>
                <p class="text-gray-500 text-sm">Priority:</p>
                <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                HIGH
                </span>
            </div>

        </div>

    </div>

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
