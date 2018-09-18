import axios from 'axios';
const domain = "https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";
export function getDocuments(nextKey){
 return axios.get(domain + '/prod/document/list');
}
