import React, {Component} from "react";
import ContentList from "./ContentList";

//import ContentList from "views/body/contents/ContentList";


class ContentContainer extends Component {
    state = {loading: true, resultList: [], selected: null, fetching: false};

    componentWillMount() {
        console.log(this.props);
    }

    render() {
        const {...rest} = this.props;
        return (

            <ContentList {...rest}/>

        );
    }
}

export default ContentContainer;
