const APP_PROPERTIES = {
  env: !process.env.NODE_ENV_SUB ? 'ssr_local' : process.env.NODE_ENV_SUB,
  debug: !process.env.NODE_ENV_SUB && false,
  domain: () =>
    APP_PROPERTIES.env === 'production' ? APP_PROPERTIES.production.domain :
      APP_PROPERTIES.env === 'development' ? APP_PROPERTIES.dev.domain : APP_PROPERTIES.ssr_local.domain
  ,
  ssr_local: {
    domain: {
      mainHost: 'http://localhost:80',
      image: 'https://thumb.share.decompany.io',
      api: 'https://api.share.decompany.io/rest',
      email: 'https://api.share.decompany.io/ve',
      profile: 'https://profile.share.decompany.io/',
      embed: 'https://embed.share.decompany.io/',
      viewer: 'https://viewer.share.decompany.io/',
      bounty: 'https://api.share.decompany.io/bounty/',
    }
  },
  dev: {
    domain: {
      mainHost: 'https://share.decompany.io',
      image: 'https://thumb.share.decompany.io',
      api: 'https://api.share.decompany.io/rest',
      email: 'https://api.share.decompany.io/ve',
      profile: 'https://profile.share.decompany.io/',
      embed: 'https://embed.share.decompany.io/',
      viewer: 'https://viewer.share.decompany.io/',
      bounty: 'https://api.share.decompany.io/bounty/'
    }
  },
  production: {
    domain: {
      mainHost: 'https://www.polarishare.com',
      image: 'https://res.polarishare.com',
      api: 'https://api.polarishare.com/rest',
      email: 'https://api.polarishare.com/ve',
      profile: 'https://res.polarishare.com/',
      viewer: 'https://viewer.polarishare.com/',
      embed: 'https://embed.polarishare.com/',
    }
  }
};

module.exports = APP_PROPERTIES;
