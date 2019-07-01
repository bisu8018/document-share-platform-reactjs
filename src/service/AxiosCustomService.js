import axios from 'axios';

const commonHeader = {
  "Content-Type":"application/json"
};



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
export async function get(url, data){
  let header = {};
  if(!data) data = {};
  if(data && data.header){
    header = Object.assign(data.header, commonHeader);
  } else {
    header = Object.assign({}, commonHeader);
  }
  const params = (data && data.params)?data.params:data;
  //console.log(url, params, header)
  return await axios.get(url, {params: params}, {headers:header});

}




// Get short URL

/*
export function getShortUrl(url: string) {
  return new Promise((resolve, reject) => {
    const url = "https://tinyurl.com/create.php";
    axios.get(url, null).then((res) => {
      console.log(res);
      /!*const regex = /(https?:\/\/tinyurl.com\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;
      const list = body.match(regex).reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);*!/

      //resolve(list[0]);
    }).catch((err) => {
      reject(err);
    });
  })
}*/

