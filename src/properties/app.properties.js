
export const APP_PROPERTIES = {

  env: (!process.env.NODE_ENV_SUB) ? 'local':process.env.NODE_ENV_SUB,
  domain:function(){
    if(this.env === 'production'){
      return APP_PROPERTIES.production.domain;
    }else if(this.env === 'development'){
      return APP_PROPERTIES.dev.domain;
    }else {
      return APP_PROPERTIES.local.domain;
    }
  },
  local:{
    domain:{
      mainHost: 'http://localhost:8000',
      image: 'https://thumb.share.decompany.io',
      api: "https://api.share.decompany.io/rest",
      email: "https://api.share.decompany.io/ve",
      profile: "https://profile.share.decompany.io/",
      embed: "https://embed.share.decompany.io/",
      bounty: "https://api.share.decompany.io/bounty/"
    }
  },
  dev:{
    domain:{
      mainHost: 'https://share.decompany.io',
      image: 'https://thumb.share.decompany.io',
      api: "https://api.share.decompany.io/rest",
      email: "https://api.share.decompany.io/ve",
      profile: "https://profile.share.decompany.io/",
      embed: "https://embed.share.decompany.io/",
      bounty: "https://api.share.decompany.io/bounty/"
    }
  },
  production:{
    domain:{
      mainHost: 'https://www.polarishare.com',
      image: 'https://res.polarishare.com',
      api: "https://api.polarishare.com/rest",
      email: "https://api.polarishare.com/ve",
      profile: "https://res.polarishare.com/",
      embed: "https://embed.polarishare.com/",
    }
  }
};
