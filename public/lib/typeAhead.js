export default class typeAhead {
    constructor (searchField, data, tag) {
        this.searchField = searchField;   
        this.datas = data;
        this.tag = tag;
        this.resultHolder = document.querySelector(tag);
        this.searchField.addEventListener("input", (e)=>{
            this.handleInput();
        });
    }

    handleInput () {   
        const { value } = this.searchField; 
        this.resultHolder.innerHTML = '';
        const strongMatch = new RegExp("^" + value, "i");
        const weakMatch = new RegExp(value, "i");    
        
        let results = this.datas.filter(data => weakMatch.test(data.companyName))
        .sort((a, b) => {  
            if (strongMatch.test(a.companyName) && !strongMatch.test(b.companyName)) return -1;        
            if (!strongMatch.test(a.companyName) && strongMatch.test(b.companyName)) return 1;        
            return a.companyName < b.companyName ? -1 : 1; 
        });    
        
        if (value.length < 1) {
            results = this.datas;
        }     
        
        if ((this.tag=='.jobs-list')) {
            this.resultHolder.innerHTML =  `<h2>All Jobs (${results.length})</h2>` + this.allJobsList(results)
        } else {
            this.resultHolder.innerHTML =  `<h2>Todays Jobs (${results.length})</h2>` + this.allJobs(results)
        }
    }

    allJobs (results) {   
        let rows = '';
        
        for (const job of results) {    
            let reqs = '';
            
            if(typeof job.reqs !== 'undefined') {
                reqs = job.reqs.map (req => `<li>${req}</li>`).join('');
            }
            
            rows += `
                <div class="job-row">
                    <ul>
                        <li class="date">
                            <h3>${ moment(new Date(job.date)).format('MM/D/YYYY') }</h3>
                        </li>
                        <li class="company-name">${job.jobTitle} <span>- ${job.companyName}</span></li>
                        <li class="job-description"><a href="${job.jobLink}" target="_blank">Link to JD</a>
                        </li>
                        <li class="job-notes">${job.notes}</li>
                    
                        <li class="job-requirements">
                            <ul>${reqs}</ul>
                        </li>
                        <li class="job-status">
                            <ul>
                                <li>${job.acts}</li>
                            </ul>
                        </li>
                    </ul>    
                    <div class="edit">
                        <a href="/edit?id=${job._id}">edit</a> | 
                        <a href="/delete?id=${job._id}" onclick="return confirm('Are you sure?')">delete</a>
                    </div>
                </div>`
            ;
        }
        
        return rows;
    }

    allJobsList (results) {   
        let rows = `<div class="jobs-content">
                <table class="job-table">
                    <tr>
                        <th><a href="/list?sort=date">Date</a></th>
                        <th><a href="/list?sort=companyName">Company</a></th>
                        <th><a href="/list?sort=jobTitle">Job Title</a></th>
                    </tr>`
        ;
            
        for (const job of results) {
            rows += `<tr>
                        <td class="date">${ moment(new Date(job.date)).format('MM/D/YYYY') }</td>
                        <td class="company-name"><a href="/edit?id=${ job._id }">${ job.companyName }</a></td>
                        <td class="job-title"><a href="${ job.jobLink }" target="_blank">${ job.jobTitle }</a></td>
                    </tr>`
            ;
        }
                
        rows += `</table></div>`;     
        
        return rows;
    }
    
    handleClick() {    
        window.location.href = this.dataset.permalink; 
    }
    
    clearResults() {  
        while (this.resultHolder.firstChild) {    
            this.resultHolder.removeChild(this.resultHolder.firstChild);  
        }
    }
}