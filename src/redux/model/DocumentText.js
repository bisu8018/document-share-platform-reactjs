export default class Document {
  text;

  constructor(data) {
    this.text = data.text ? data.text :null;
  }

}