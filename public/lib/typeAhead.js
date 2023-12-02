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
        
        this.resultHolder.innerHTML = this.allJobsList(results)
    }

    allJobsList (results) {   
        let rows = '';
            
        for (const job of results) {
            rows += `<tr>
                        <td class="date">${ moment(new Date(job.date)).format('MM/D/YYYY') }</td>
                        <td class="company-name">${ job.companyName }</td>
                        <td class="job-title">${ job.jobTitle }</td>
                        <td class="job-link"><a href="${ job.jobLink }">Link</a></td>
                        <td class="edit">
                            <a href="/edit?id=${ job._id }">edit</a> | 
                            <a href="/delete?id=<${ job._id }" onclick="return confirm('Are you sure?')">delete</a>
                        </td>
                   </tr>`
            ;
        }
                
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