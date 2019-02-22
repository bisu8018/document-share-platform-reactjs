import React, {Component} from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import ReactGA from 'react-ga';

import history from 'apis/history/history';
import Auth from 'apis/auth/auth';
import DrizzleApis from 'apis/DrizzleApis';

import Header from "views/header/Header";
import HeaderSub from "./header/HeaderSub";
import HeaderLinks from "./header/HeaderLinks";
import ContentContainer from "./body/contents/ContentContainer";
import SignIn from "./body/signIn/SignIn";
import ContentView from "./body/contents/contentsView/ContentView";
import Author from "./body/profile/Author";
import Callback from "./body/callback/callback";

if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-129300994-1', {
        debug: false,
        gaOptions: {
            env: process.env.NODE_ENV
        }
    });
    //console.log("google analytics on!!!", process.env)
} else {
    //console.log("google analytics off!!!")
}

const auth = new Auth();

const handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
    }
};

const handleLogout = () => {
    auth.logout();
};

//hubspot tracking
let _hsq = window._hsq = window._hsq || [];

class Main extends Component {
    state = {loading: true, drizzleState: null, drizzleApis: null};

    componentWillMount() {
        // subscribe to changes in the store
        //console.log("env", process.env);
        //auth.syncUser();

        const drizzleApis = new DrizzleApis((drizzleApis, drizzle, drizzleState) => {
            //console.log("MainRoutes", drizzleApis, drizzle, drizzleState);
            this.setState({drizzleApis: drizzleApis});
        });
        this.setState({drizzleApis: drizzleApis});
    }

    componentDidMount() {
        this.sendPageView(history.location);
        history.listen(this.sendPageView);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    sendPageView = () => {
        //hubspot tracking
           //console.log("Tracking sendPageView event", window.location.pathname + window.location.search)
           _hsq.push(['setPath', window.location.pathname + window.location.search]);
           _hsq.push(['trackPageView']);

           //hubspot tracking
           ReactGA.pageview(window.location.pathname + window.location.search);
    };

    render() {
        return (

            <Router history={history}>
                <div>
                    <Header
                        brand="decompany.io"
                        rightLinks={<HeaderLinks drizzleApis={this.state.drizzleApis} auth={auth}/>}
                        drizzleApis={this.state.drizzleApis}
                        fixed
                        auth={auth}
                        color="white"
                    />

                    <HeaderSub drizzleApis={this.state.drizzleApis}/>

                    <Switch>
                        <Route exact path="/"
                               render={(props) =>
                                   <ContentContainer drizzleApis={this.state.drizzleApis}
                                        drizzleState={this.state.drizzleState}
                                        auth={auth} {...props} />}/>

                        <Route path="/latest"
                               render={(props) =>
                                   <ContentContainer drizzleApis={this.state.drizzleApis}
                                        drizzleState={this.state.drizzleState}
                                        auth={auth} {...props} />}/>

                        <Route path="/popular"
                               render={(props) =>
                                   <ContentContainer drizzleApis={this.state.drizzleApis}
                                        drizzleState={this.state.drizzleState}
                                        auth={auth} {...props} />}/>

                        <Route path="/featured"
                               render={(props) =>
                                   <ContentContainer drizzleApis={this.state.drizzleApis}
                                        drizzleState={this.state.drizzleState}
                                        auth={auth} {...props} />}/>

                        <Route path="/tag/:tag"
                               render={(props) =>
                                   <ContentContainer drizzleApis={this.state.drizzleApis}
                                        drizzleState={this.state.drizzleState}
                                        auth={auth} {...props} />}/>

                        <Route path="/sign-in"
                               render={(props) =>
                                   <SignIn drizzleApis={this.state.drizzleApis}
                                           drizzleState={this.state.drizzleState}
                                           auth={auth} {...props} />}/>

                        <Route path="/content/view/:documentId" render={(props) =>
                            <ContentView drizzleApis={this.state.drizzleApis}
                                         drizzleState={this.state.drizzleState}
                                         auth={auth} {...props} />}/>

                        <Route path="/author/:accountId" render={(props) =>
                            <Author drizzleApis={this.state.drizzleApis}
                                    drizzleState={this.state.drizzleState}
                                    auth={auth} {...props} />}/>

                        <Route path="/curator/:accountId" render={(props) =>
                            <Author drizzleApis={this.state.drizzleApis}
                                    drizzleState={this.state.drizzleState}
                                    auth={auth} {...props} />}/>

                        <Route path="/callback" render={(props) => {
                            handleAuthentication(props);
                            return <Callback {...props} />;

                        }}/>
                    </Switch>
                </div>
            </Router>

        )
    }
}

export default Main;