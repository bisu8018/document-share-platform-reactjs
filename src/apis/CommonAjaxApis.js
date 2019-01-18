import axios from 'axios';

const commonHeader = {
  "Content-Type":"application/json",
   'Access-Control-Allow-Origin': '*'
 }

/**
 * call post method
 * @param {*} url : url
 * @param {*} data : 
 *  {
 *   header : header
 *   params : parameter
 *  }
 */
export function post(url, data){

  let header = commonHeader;

  for(var key in data.header){
    header[key]=data.header[key];
  }

  return axios.post(url, data.params?data.params:data, {headers: header});

}
/**
 * call get method
 * @param {*} url : url
 * @param {*} data : 
 *  {
 *   header : header
 *   params : parameter
 *  }
 */
export function get(url, data){
  let header = commonHeader;
  /*
  const config = {
    data: params,
    header: {
      commonHeader
    }
  }
  */
  for(var key in data.header){
    header[key]=data.header[key];
  }

  return axios.get(url, data.params?data.params:data, {headers:header});

}
