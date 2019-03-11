import ContentContainer from "../views/body/contents/ContentContainer";
import ContentView from "../views/body/contents/contentsView/ContentView";
import Author from "../views/body/profile/author/Author";
import AudienceTracking from "../views/body/tracking/AudienceTracking";
import AudienceTrackingDetail from "../views/body/tracking/AudienceTrackingDetail";

export default ({
    routes: [
      {
        path: "/",
        name: "Main",
        component: ContentContainer
      },
      {
        path: "/latest",
        name: "Latest",
        component: ContentContainer,
      },
      {
        path: "/latest/:tag",
        name: "LatestTag",
        component: ContentContainer,
      },
      {
        path: "/popular",
        name: "Popular",
        component: ContentContainer
      },
      {
        path: "/featured",
        name: "Featured",
        component: ContentContainer
      },
      {
        path: "/content/view/:documentId",
        name: "Content view",
        component: ContentView
      },
      {
        path: "/author/:accountId",
        name: "Author",
        component: Author
      },/*
      {
        path: "/curator/:accountId",
        name: "Curator",
        component: Author
      }*/
      {
        path: "/tracking/:accountId/:documentId",
        name: "tracking",
        component: AudienceTracking
      },
      {
        path: "/trackingDetail/:accountId/:documentId",
        name: "trackingDetail",
        component: AudienceTrackingDetail
      },
    ]
  }
);