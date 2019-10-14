import Faq from "../components/body/faq/Faq";
import NotFoundPage from "../components/common/NotFoundPage";
import CallbackContainer from "../container/body/callback/CallbackContainer";
import CreatorContainer from "../container/body/profile/creator/CreatorContainer";
import ContentMainContainer from "../container/body/contents/ContentMainContainer";
import AudienceTrackingContainer from "../container/body/tracking/AudienceTrackingListContainer";
import ContentViewContainer from "../container/body/contents/contentsView/ContentViewContainer";
import AudienceTrackingDetailContainer from "../container/body/tracking/AudienceTrackingDetailContainer";
import ContentListContainer from "../container/body/contents/ContentListContainer";
import Privacy from "../components/body/faq/Privacy";
import About from "../components/body/faq/About";
import Guide from "../components/body/faq/Guide";
import Terms from "../components/body/faq/Terms";
import MoreContainer from "../container/body/more/MoreContainer";
import ContentAddContainer from "../container/body/contents/contentsAdd/ContentAddContainer";

export default ([
    {
      path: "/",
      name: "Main",
      component: ContentMainContainer
    },
    {
      path: "/latest",
      name: "Latest",
      component: ContentListContainer
    },
    {
      path: "/latest/:tag",
      name: "LatestTag",
      component: ContentListContainer
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
      path: "/more",
      name: "More",
      component: MoreContainer
    },
    {
      path: "/callback",
      name: "Callback",
      component: CallbackContainer
    },
    {
      path: "/ca",
      name: "ContentAdd",
      component: ContentAddContainer
    },
    {
      path: "/tr/:identification/:seoTitle",
      name: "tracking",
      component: AudienceTrackingContainer
    },
    {
      path: "/td/:identification/:seoTitle",
      name: "trackingDetail",
      component: AudienceTrackingDetailContainer
    },
    {
      path: "/f",
      name: "faq",
      component: Faq
    },
    {
      path: "/p",
      name: "privacy",
      component: Privacy
    },
    {
      path: "/a",
      name: "about",
      component: About
    },
    {
      path: "/g",
      name: "guide",
      component: Guide
    },
    {
      path: "/t",
      name: "terms",
      component: Terms
    },
    {
      path: "/n",
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
      path: "*",
      name: "NotFoundPage",
      component: NotFoundPage
    }
  ]
);
