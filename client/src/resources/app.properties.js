export const APP_PROPERTIES = {

  env: (!process.env.NODE_ENV) ? 'local':process.env.NODE_ENV,
  domain:function(){
    if(process.env.NODE_ENV === 'production'){
      return APP_PROPERTIES.production.domain;
    }else {
      return APP_PROPERTIES.local.domain;
    }
  },
  local:{
    mainHost: 'http://localhost:8000',
    domain:{
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      //image: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod',
      image: 'http://dev-ca-document.s3-website-us-west-1.amazonaws.com',
      //api: "http://localhost:4000",
      api: 'https://6chcj5b70g.execute-api.us-west-1.amazonaws.com/dev'
    }
  },
  production:{
    mainHost: 'https://share.decompany.io',
    domain:{
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      //image: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod',
      image: 'http://dev-ca-document.s3-website-us-west-1.amazonaws.com',
      //api: "http://localhost:4000",
      api: 'https://6chcj5b70g.execute-api.us-west-1.amazonaws.com/dev'
    }
  },
  service_endpoint:{

  }

}
