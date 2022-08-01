let base_url;

let domain = document.domain;

if(domain === 'localhost') base_url = 'http://localhost:5000' 
else base_url = 'https://dreamlife-ayurveda.herokuapp.com';

console.log(base_url);

export default base_url;