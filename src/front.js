function expandButtonTextChange() {
  const allExpandButtons = Array.from( document.querySelectorAll('.job-header-button-expand') );
  allExpandButtons.forEach((button) => {

    if (button.closest('.job').classList.contains('hash-shown')) {
      // button.style.width = button.offsetWidth + 'px';
      button.innerText = 'Close';
      button.classList.add('expanded');
    } 
    else {
      button.innerText = 'Read more';
      button.classList.remove('expanded');
    }
  })
}

function addJobFiltering() {
  const filterLinks = Array.from( document.querySelectorAll(".formo-jobs-listing-filter > a") );

  filterLinks.forEach((link) => {
    
    link.addEventListener('click', () => {
      if (document.querySelector(".hash-shown")) {
        let opendiv = document.querySelector(".hash-shown");
        opendiv.classList.remove("hash-shown");
        opendiv.style.height = opendiv.querySelector('.job-header').offsetHeight + 'px';
        expandButtonTextChange()
      }
      if (link.classList.contains('filter-active')) {
        link.classList.remove('filter-active');
        document.querySelectorAll('.filtered').forEach( (filteredJob) => {
          filteredJob.classList.remove('filtered');
        } )
      } 
      else {
        const filter = link.getAttribute('data-cityfilter');
        const jobs = Array.from( document.querySelectorAll('.job') );
        const filteredObjects = document.querySelectorAll('[data-city="' + filter + '"]');
        jobs.forEach((job) => {
          job.classList.add('filtered');
          job.style.order = 2;
        })
        setTimeout(() => {
          filteredObjects.forEach((filteredObject) => {
            filteredObject.classList.remove('filtered');
            filteredObject.style.order = 1;
          })
         }, 10);
        document.querySelectorAll('.filter-active').forEach( (filter) => {
          filter.classList.remove('filter-active')
        } );
        link.classList.add('filter-active');
      }
    })
  })
}

function addJobExpandability() {
  const jobslist = document.querySelector(".formo-jobs-listing");
  
  //don't do anything if there's no jobs or if the jobs are already clickable
  if (!jobslist || document.querySelector('.formo-jobs-listing-is-interactive')) { return }
  
  //add a class to the jobs list to indicate that it's interactive
  jobslist ? jobslist.classList.add('formo-jobs-listing-is-interactive') : null;
  
  const hash = window.location.hash.replace("#", "");
  const jobs = Array.from( document.querySelectorAll(".job") );
  
  jobs.forEach(function(job) {
  
    const jobHeaderHeight = job.querySelector('.job-header').offsetHeight;
    const jobContentHeight = job.querySelector('.job-content').offsetHeight;
    const jobHeightTotal = jobHeaderHeight + jobContentHeight ;

    job.style.height = jobHeaderHeight + 'px';

    // on page load if there's a hash in the url, show the job with that hash 
    if (job.getAttribute("id") === hash) {
      job.classList.add("hash-shown");
      job.style.height = jobHeightTotal + 'px';
    }
    const expandLinks = job.querySelectorAll('.job-header-button-expand, .job-header-title a');
  
    expandLinks.forEach(function(link) {
      const locationhref = link.getAttribute("href");
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if ( job.classList.contains("hash-shown") ) {
          document.querySelector('#jobs').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
          job.classList.remove("hash-shown");
          job.style.height = jobHeaderHeight + 'px';
        } 
        else {
          if (document.querySelector(".hash-shown")) {
            let jobHashHeaderHeight = document.querySelector(".hash-shown > .job-header").offsetHeight;
            document.querySelector(".hash-shown").style.height = jobHashHeaderHeight + 'px';
            document.querySelector(".hash-shown").classList.remove("hash-shown");
          }
          job.classList.add("hash-shown");
          job.style.height = jobHeightTotal + 'px';
          // job.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
          window.scrollTo({
            top: job.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
          // setTimeout(()=>{
          //   if ( document.body.classList.contains( 'nav-hidden' ) ) {
          //     document.body.classList.remove( 'nav-hidden' );
          //   }
          // }, 800);
        }
        expandButtonTextChange();
      })
    })
  })
  expandButtonTextChange();
}
window.addEventListener('DOMContentLoaded', function() {
  addJobFiltering();
  addJobExpandability();
})