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

  let header = {};
  let params = data.params?data.params:{};
  console.log("post data", data, header);
  if(data.header){
    header = Object.assign(data.header, commonHeader);
    /*
    for(var key in data.header){
      header[key]=data.header[key];
    }
    */
    params = data.params?data.params:{}; 
  } else {
    params = data.params?data.params:data;
  }

  console.log("post header", header,"parameter", params);
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
 
  header = data.header?Object.assign(data.header, commonHeader):Object.assign({}, commonHeader)
  const params = data.params?data.params:null;
  return axios.get(url, params, {headers:header});

}
