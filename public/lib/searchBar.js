import typeAhead  from "./typeAhead.js";

async function fetchData() {
    const response = await fetch("https://beautiful-blue-hat.cyclic.app/api/typeAhead");
    const jobs = await response.json();
    return jobs;
}

fetchData().then(data=>{
    searchObj.init(data);
});

const searchObj = {
    init: function(data) {
        const searchField = document.getElementById("search-field");
        if (!searchField) return;
        
        let path = document.location.pathname.replace(/^\//g, '')
        if (path=='list') {
            new typeAhead(searchField, data, '.jobs-list');
        } else {
            new typeAhead(searchField, data, '.jobs');
        }
    }
};
  


  