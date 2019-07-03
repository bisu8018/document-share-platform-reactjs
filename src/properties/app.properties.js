export const APP_PROPERTIES = {

  env: (!process.env.NODE_ENV) ? 'local':process.env.NODE_ENV,
  domain:function(){
    if(process.env.NODE_ENV === 'production'){
      return APP_PROPERTIES.production.domain;
    }else if(process.env.NODE_ENV === 'dev'){
      return APP_PROPERTIES.local.domain;
    }else {
      return APP_PROPERTIES.local.domain;
    }
  },
  local:{
    domain:{
      mainHost: 'http://localhost:8000',
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://thumb.share.decompany.io',
      api: "https://api.share.decompany.io/rest",
      email: "https://api.share.decompany.io/ve",
      profile: "https://profile.share.decompany.io/",
      embed: "https://embed.share.decompany.io/"
    }
  },
  dev:{
    domain:{
      mainHost: 'https://www.polarishare.com',
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://res.polarishare.com',
      api: "https://api.polarishare.com/rest",
      email: "https://api.polarishare.com/ve",
      profile: "https://res.polarishare.com/",
      embed: "https://embed.polarishare.com/",
    }
  },
  production:{
    domain:{
      mainHost: 'https://share.decompany.io',
      upload: 'https://24gvmjxwme.execute-api.us-west-1.amazonaws.com',
      image: 'https://thumb.share.decompany.io',
      api: "https://api.share.decompany.io/rest",
      email: "https://api.share.decompany.io/ve",
      profile: "https://profile.share.decompany.io/",
      embed: "https://embed.share.decompany.io/",
    }
  }

};
