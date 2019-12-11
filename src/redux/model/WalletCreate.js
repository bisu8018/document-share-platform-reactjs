export default class WalletCreate {
  address: string;

  constructor(data) {
    this.address = data && data.address ? data.address : "";
  }

}
