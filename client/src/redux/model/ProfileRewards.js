export default class DocumentList {
  last7CreatorReward: any;
  last7CuratorReward: any;
  todayEstimatedCreatorReward: any;
  todayEstimatedCuratorReward: any;

  constructor(data) {
    this.last7CreatorReward = data && data.getLast7CreatorReward ? data.getLast7CreatorReward : [];
    this.last7CuratorReward = data && data.getLast7CuratorReward ? data.getLast7CuratorReward : [];
    this.todayEstimatedCreatorReward = data && data.getTodayEstimatedCreatorReward ? data.getTodayEstimatedCreatorReward : {};
    this.todayEstimatedCuratorReward = data && data.getTodayEstimatedCuratorReward ? data.getTodayEstimatedCuratorReward : {};
  }

}