let base_url;

let domain = document.domain;

if(domain === 'localhost') base_url = 'http://localhost:5000' 
else base_url = domain;

export default base_url;