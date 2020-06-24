export default class TagList {
  resultList: [];
  path: null;

  constructor(data) {
    this.resultList = data && data.resultList ? data.resultList.sort(compare) : [
      "art", "beauty","style","literature","culture","entertainment","food","photography","social", "design",
      "business","economy","leadership","marketing", "etc",
      "programming","cybersecurity","academia","science","technology",
      "health","travel","pets","psychology","self","sexuality",
      "education","environment","law","history","language","media","philosophy","politics","religion","society","world"
    ];
    this.path = data && data.path ? data.path : "latest";
  }
}


const compare = (a,b) => {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
};
