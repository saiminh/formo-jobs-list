import { useEffect, useState } from "@wordpress/element";
import axios from 'axios';

export default function Jobs() {

  const [query, setQuery] = useState([]);
  
  useEffect(() => {
    async function jobsListingQuery() {
      try {
        const jobsdata = await axios.get('https://formo.recruitee.com/api/offers/');
        const dataArray = jobsdata.data.offers.map(job => {
          return {
            title: job.title,
            location: job.location,
          }
        });
        setQuery(dataArray);
      } 
      catch (err) {
        console.error(err);
      }
    }
    jobsListingQuery();
  }, []);
  
  return (
    <>
      <h3 style={{ fontSize: "16px", backgroundColor: "var(--wp--preset--color--formo-blue)", color: "#FFF", display: "inline-block", padding: "1em" }}>Jobs (read-only)</h3>
      <ul className="wp-block-group formo-jobs-listing" style={{ border: "1px solid var(--wp--preset--color--formo-blue)"}}>
        {
          query.map((job, index) => {
            return (
              <li key={index} className="job">
                <div className="job-header">
                  <h3 className="job-header-title">{job.title}</h3>
                  <address className="job-header-location">{job.location}</address>
                </div>
              </li>
            )
          }, [])
        }
      </ul>
    </>
  );
}

