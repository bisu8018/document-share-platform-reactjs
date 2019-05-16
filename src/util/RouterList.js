import Faq from "../components/body/faq/Faq";
import NotFoundPage from "../components/common/NotFoundPage";
import CallbackContainer from "../container/body/callback/CallbackContainer";
import CreatorContainer from "../container/body/profile/creator/CreatorContainer";
import ContentMainContainer from "../container/body/contents/ContentMainContainer";
import AudienceTrackingContainer from "../container/body/tracking/AudienceTrackingListContainer";
import ContentViewContainer from "../container/body/contents/contentsView/ContentViewContainer";
import AudienceTrackingDetailContainer from "../container/body/tracking/AudienceTrackingDetailContainer";
import Signup from "../components/common/Signup";

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
        component: AudienceTrackingDetailContainer
      },
      {
        path: "/faq",
        name: "faq",
        component: Faq
      },
      {
        path: "/signup",
        name: "signup",
        component: Signup
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
        name: "Creator",
        component: CreatorContainer
      },
      {
        path: '*',
        name: 'NotFoundPage',
        component: NotFoundPage,
      },
    ]
  }
);