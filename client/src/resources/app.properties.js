export const APP_PROPERTIES = {

  env: (process.env.NODE_ENV) ? 'local':process.env.NODE_ENV,
  mainHost: 'http://share.decompany.io',
  domain:{
    upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
    image: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/document/get',
    //api: "http://localhost:4000",
    api: 'https://iwzx8ah5xf.execute-api.us-west-1.amazonaws.com/dev'
  },
  local:{
    domain:{
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/document/get',
      api: "http://localhost:4000",
    }
  },
  dev:{
    domain:{
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/document/get',
      //api: "http://localhost:4000",
      api: 'https://iwzx8ah5xf.execute-api.us-west-1.amazonaws.com/dev'
    }
  },
  production:{
    domain:{
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/document/get',
      //api: "http://localhost:4000",
      api: 'https://iwzx8ah5xf.execute-api.us-west-1.amazonaws.com/dev'
    }
  },
  service_endpoint:{

  }

}
