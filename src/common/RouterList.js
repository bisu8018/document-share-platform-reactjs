import ContentContainer from "../views/body/contents/ContentContainer";
import ContentView from "../views/body/contents/contentsView/ContentView";
import Author from "../views/body/profile/author/Author";
import AudienceTracking from "../views/body/tracking/AudienceTracking";
import AudienceTrackingDetail from "../views/body/tracking/AudienceTrackingDetail";
import Callback from "../views/body/callback/callback";
import NotFoundPage from "../components/common/NotFoundPage";

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
        path: "/callback",
        name: "Callback",
        component: Callback
      },
      {
        path: "/tracking/:identification/:seoTitle",
        name: "tracking",
        component: AudienceTracking
      },
      {
        path: "/trackingDetail/:identification/:seoTitle",
        name: "trackingDetail",
        component: AudienceTrackingDetail
      },
      {
        path: "/NotFoundPage",
        name: "NotFoundPage",
        component: NotFoundPage
      },
      {
        path: "/:identification/:documentId",
        name: "ContentView",
        component: ContentView
      },
      {
        path: "/:identification",
        name: "Author",
        component: Author
      },
      {
        path: '*',
        name: 'NotFoundPage',
        component: NotFoundPage,
      },
    ]
  }
);