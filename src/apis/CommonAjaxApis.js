import axios from 'axios';

const commonHeader = {
  "Content-Type":"application/json"
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

  let header = Object.assign(data.header?data.header:{}, commonHeader);
  let params = data.params?data.params:{};
  
  if(data.header){
    params = data.params?data.params:{}; 
  } else {
    params = data.params?data.params:data;
  }

  
  return axios.post(url, params, {headers:header});

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
   
  let header = {};
  if(!data) data = {};
  if(data && data.header){
    header = Object.assign(data.header, commonHeader);
  } else {
    header = Object.assign({}, commonHeader);
  }

  const params = (data && data.params)?data.params:data;
  console.log(url, params, header)
  return axios.get(url, {params: params}, {headers:header});

}

function getTrackingCode(){
  //console.log("getTrackingCode");
  //console.log(document.cookie);
  //console.log(localStorage);
  //console.log(sessionStorage);
}
