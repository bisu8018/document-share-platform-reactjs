import common from "../../common/common";

export default class WalletBalance {
  deck: number;
  wei: number;

  constructor(data) {
    this.deck = data && data.balance ? common.toDeck(data.balance) : 0;
    this.wei = data && data.balance ? data.balance : 0;
  }
}
