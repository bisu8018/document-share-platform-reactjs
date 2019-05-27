export default class TagList {
  resultList: [];
  path: null;

  constructor(data) {
    this.resultList = data.resultList ? data.resultList.sort(compare) : [
      "Art & Photos", "Automotive", "Business", "Career", "Data & Analytics", "Design", "Devices & Hardware", "Design",
      "Devices & Hardware", "Economy & Finance", "Education", "Engineering", "Entertainment & Humor", "Environment", "Food",
      "Government & Nonprofit", "Health & Medicine", "Healthcare", "Engineering", "Internet", "Investor Relations", "Law",
      "Leadership & Management", "Lifestyle", "Marketing", "Mobile", "News & Politics", "Presentations & Public Speaking", "Real Estate",
      "Recruiting & HR", "Retail", "Sales", "Science", "Self Improvement", "Services", "Small Business & Entrepreneurship", "Social Media",
      "Software", "Spiritual", "Sports", "Technology", "Templates", "Travel"
    ];
    this.path = data.path ? data.path : "latest";
  }

}

function compare(a,b) {
  if (a._id < b._id)
    return -1;
  if (a._id > b._id)
    return 1;
  return 0;
}