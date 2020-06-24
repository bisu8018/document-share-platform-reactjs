import AxiosService from "./AxiosService";

let walletBalance = "account/balance";
let walletCreate = "account/create";
let walletWithdraw = "account/withdraw";
let voteDocument = "document/vote";
let claimCreator = "claim/royalty";
let claimCurator = "claim/reward";

export default {
  POST: {
    walletBalance: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithBodyForWallet(walletBalance, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    walletCreate: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBodyForWallet(walletCreate, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    walletWithdraw: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBodyForWallet(walletWithdraw, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    voteDocument: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBodyForWallet(voteDocument, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    claimCreator: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBodyForWallet(claimCreator, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    curatorCurator: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBodyForWallet(claimCurator, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    }
  }
};
