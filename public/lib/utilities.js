const months = document.querySelector('#months');
months.addEventListener('change', async (item)=>{
    const response = await fetch("http://localhost:3000/api/month/"+item.target.value);
    const jobList = await response.json();
    const resultHolder = document.querySelector('.jobs-content tbody');
    resultHolder.innerHTML = allJobsList(jobList);

    function allJobsList (jobList) {   

        let rows = '';
            
        for (const job of jobList) {
            rows += `<tr>
                        <td class="date">${ moment(new Date(job.date)).format('MM/D/YYYY') }</td>
                        <td class="company-name"><a href="/edit?id=${ job._id }">${ job.companyName }</a></td>
                        <td class="job-title"><a href="${ job.jobLink }" target="_blank">${ job.jobTitle }</a></td>
                    </tr>`;
        }
        
        return rows;
    }



})