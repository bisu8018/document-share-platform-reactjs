import AudienceTrackingDetail from "../components/body/tracking/AudienceTrackingDetail";
import Faq from "../components/body/faq/Faq";
import NotFoundPage from "../components/common/NotFoundPage";
import CallbackContainer from "../container/body/callback/CallbackContainer";
import AuthorContainer from "../container/body/profile/author/AuthorContainer";
import ContentMainContainer from "../container/body/contents/ContentMainContainer";
import AudienceTrackingContainer from "../container/body/tracking/AudienceTrackingContainer";
import ContentViewContainer from "../container/body/contents/contentsView/ContentViewContainer";

export default ({
    routes: [
      {
        path: "/",
        name: "Main",
        component: ContentMainContainer
      },
      {
        path: "/latest",
        name: "Latest",
        component: ContentMainContainer,
      },
      {
        path: "/latest/:tag",
        name: "LatestTag",
        component: ContentMainContainer,
      },
      {
        path: "/popular",
        name: "Popular",
        component: ContentMainContainer
      },
      {
        path: "/featured",
        name: "Featured",
        component: ContentMainContainer
      },
      {
        path: "/callback",
        name: "Callback",
        component: CallbackContainer
      },
      {
        path: "/tracking/:identification/:seoTitle",
        name: "tracking",
        component: AudienceTrackingContainer
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
        component: ContentViewContainer
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