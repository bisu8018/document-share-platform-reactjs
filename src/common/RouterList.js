import ContentContainer from "../views/body/contents/ContentContainer";
import ContentView from "../views/body/contents/contentsView/ContentView";
import Author from "../views/body/profile/Author";
import SignIn from "../views/body/signIn/SignIn";

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
        component: ContentContainer
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
        path: "/tag/:tag",
        name: "Tag",
        component: ContentContainer
      },
      {
        path: "/sign-in",
        name: "Sign in",
        component: SignIn
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
      },
      {
        path: "/curator/:accountId",
        name: "Curator",
        component: Author
      }
    ]
  }
);