import Faq from "../components/body/faq/Faq";
import NotFoundPage from "../components/common/NotFoundPage";
import CallbackContainer from "../container/body/callback/CallbackContainer";
import CreatorContainer from "../container/body/profile/creator/CreatorContainer";
import ContentMainContainer from "../container/body/contents/ContentMainContainer";
import AudienceTrackingContainer from "../container/body/tracking/AudienceTrackingListContainer";
import ContentViewContainer from "../container/body/contents/contentsView/ContentViewContainer";
import AudienceTrackingDetailContainer from "../container/body/tracking/AudienceTrackingDetailContainer";
import Signup from "../components/etc/Signup";
import ContentListContainer from "../container/body/contents/ContentListContainer";
import Policies from "../components/body/faq/Policies";
import emailVerifyContainer from "../container/etc/emailVerifyContainer";
import Privacy from "../components/body/faq/Privacy";
import About from "../components/body/faq/About";
import Guide from "../components/body/faq/Guide";

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
        component: ContentListContainer,
      },
      {
        path: "/latest/:tag",
        name: "LatestTag",
        component: ContentListContainer,
      },
      {
        path: "/popular",
        name: "Popular",
        component: ContentListContainer
      },
      {
        path: "/featured",
        name: "Featured",
        component: ContentListContainer
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
        path: "/policies",
        name: "policies",
        component: Policies
      },
      {
        path: "/privacy",
        name: "privacy",
        component: Privacy
      },
      {
        path: "/about",
        name: "about",
        component: About
      },
      {
        path: "/guide",
        name: "guide",
        component: Guide
      },
      {
        path: "/emailverify",
        name: "emailVerify",
        component: emailVerifyContainer
      },
      {
        path: "/signup",
        name: "signup",
        component: Signup
      },
      {
        path: "/404",
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