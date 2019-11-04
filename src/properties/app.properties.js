export const APP_PROPERTIES = {
  // debug 모드 이용시, true 로 변경
  debug: (process.env.NODE_ENV_SUB === 'local' && false),
  ssr: process.env.APP_ENV === 'server',
  env: (!process.env.NODE_ENV_SUB) ? 'local':process.env.NODE_ENV_SUB,
  domain:function(){
    if(this.env === 'production')
      return APP_PROPERTIES.production.domain;
    else if(this.env === 'development')
      return APP_PROPERTIES.dev.domain;
    else if(this.env === 'ssr_local')
      return APP_PROPERTIES.ssr_local.domain;
    else
      return APP_PROPERTIES.local.domain;
  },
  local:{
    domain:{
      mainHost: 'http://localhost:8000',
      image: 'https://res.share.decompany.io/thumb',
      profile: 'https://res.share.decompany.io/profile/',
      static: 'https://res.share.decompany.io/static',
      api: 'https://api.share.decompany.io/rest',
      email: 'https://api.share.decompany.io/ve',
      embed: 'https://embed.share.decompany.io/',
      viewer: 'https://viewer.share.decompany.io/',
      bounty: 'https://api.share.decompany.io/bounty/',
      graphql: 'https://api.share.decompany.io/graphql/'
    }
  },
  ssr_local:{
    domain:{
      mainHost: 'http://localhost:80',
      image: 'https://res.share.decompany.io/thumb',
      profile: 'https://res.share.decompany.io/profile/',
      static: 'https://res.share.decompany.io/static',
      api: 'https://api.share.decompany.io/rest',
      email: 'https://api.share.decompany.io/ve',
      embed: 'https://embed.share.decompany.io/',
      viewer: 'https://viewer.share.decompany.io/',
      graphql: 'https://api.share.decompany.io/graphql/'
    }
  },
  dev:{
    domain:{
      mainHost: 'https://share.decompany.io',
      image: 'https://res.share.decompany.io/thumb',
      profile: 'https://res.share.decompany.io/profile/',
      static: 'https://res.share.decompany.io/static',
      api: 'https://api.share.decompany.io/rest',
      email: 'https://api.share.decompany.io/ve',
      embed: 'https://embed.share.decompany.io/',
      viewer: 'https://viewer.share.decompany.io/',
      graphql: 'https://api.share.decompany.io/graphql/'
    }
  },
  production:{
    domain:{
      mainHost: 'https://www.polarishare.com',
      image: 'https://res.polarishare.com/thumb',
      profile: 'https://res.polarishare.com/profile/',
      static: 'https://res.polarishare.com/static',
      api: 'https://api.polarishare.com/rest',
      email: 'https://api.polarishare.com/ve',
      viewer: 'https://viewer.polarishare.com/',
      embed: 'https://embed.polarishare.com/',
      graphql: 'https://api.polarishare.com/graphql/'
    }
  }
};
