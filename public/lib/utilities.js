const months = document.querySelector('#months');
months.addEventListener('change', async (item)=>{
    console.log('%c%o', 'color: red;font-size:12px', 'Here I am 1');
    const response = await fetch("http://localhost:3000/api/month/"+item.target.value);
    const items = await response.json();
    console.log('%citems: %o', 'color: red;font-size:12px', items);
    const resultHolder = document.querySelector('.jobs-list');
    resultHolder.innerHTML =  `<h2>All Jobs (${items.length})</h2>
    
    ` + allJobsList(items);

    function allJobsList (results) {   

        let rows = `<div class="jobs-content">
                <table class="job-table">
                    <tr>
                        <th><a href="/list?sort=date">Date</a></th>
                        <th><a href="/list?sort=companyName">Company</a></th>
                        <th><a href="/list?sort=jobTitle">Job Title</a></th>
                    </tr>`
        ;
            
        for (const job of results) {
            const [year, month, day] = JSON.stringify(job.date).replace(/^"(.*)"$/, '$1').slice(0, 10).split('-');
            let date = `${month}/${day}/${year}`;
            rows += `<tr>
                        <td class="date">${ date }</td>
                        <td class="company-name"><a href="/edit?id=${ job._id }">${ job.companyName }</a></td>
                        <td class="job-title"><a href="${ job.jobLink }" target="_blank">${ job.jobTitle }</a></td>
                    </tr>`
            ;
        }
                
        rows += `</table></div>`;     
        
        return rows;
    }



})