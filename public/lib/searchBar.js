import typeAhead  from "./typeAhead.js";

async function fetchData() {
    const response = await fetch("/api/typeAhead");
    const jobs = await response.json();
    return jobs;
}

fetchData().then(data=>{
    const searchField = document.getElementById("search-field");
    if (!searchField) return;
    new typeAhead(searchField, data, '.jobs-content tbody');
});
