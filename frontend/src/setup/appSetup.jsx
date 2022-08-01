let base_url;

let domain = document.domain;

if(domain === 'localhost') base_url = 'http://localhost:5000';

export default base_url;