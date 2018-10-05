import axios from 'axios';

const commonHeader = {
  "Content-Type":"application/json",
   'Access-Control-Allow-Origin': '*'
 }

export function post(url, params){

  const config = {
    method : "post",
    url : url,
    data:params,
    header: {
      commonHeader
    }
  }

  return axios.post(url, config);

}

export function get(url, params){

  const config = {
    method : "post",
    url : url,
    data:params,
    header: {
      commonHeader
    }
  }

  return axios.get(url, config);

}
