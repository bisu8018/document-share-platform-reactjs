import ContentContainer from "../components/body/contents/ContentContainer";
import ContentView from "../components/body/contents/contentsView/ContentView";
import AudienceTracking from "../components/body/tracking/AudienceTracking";
import AudienceTrackingDetail from "../components/body/tracking/AudienceTrackingDetail";
import Faq from "../components/body/faq/Faq";
import NotFoundPage from "../components/common/NotFoundPage";
import CallbackContainer from "../container/body/callback/CallbackContainer";
import AuthorContainer from "../container/body/profile/author/AuthorContainer";

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
        component: CallbackContainer
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
        path: "/faq",
        name: "faq",
        component: Faq
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
        component: AuthorContainer
      },
      {
        path: '*',
        name: 'NotFoundPage',
        component: NotFoundPage,
      },
    ]
  }
);