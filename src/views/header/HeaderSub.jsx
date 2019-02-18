/*eslint-disable*/
import React from "react";
//import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import {Search} from "@material-ui/icons";

import CustomInput from "components/custom/CustomInput";
import Button from "components/custom/HeaderButton";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function HeaderSub({...props}) {
    const {classes} = props;
    //console.log(classes);
    return (

        <ul className="subHeader">
            <li>
            <Button href="/" color="transparent">Latest</Button>
            <Button href="/featured" color="transparent">Featured</Button>
            <Button href="/popular" color="transparent">Popular</Button>
            <Button href="https://github.com/decompanyio" color="transparent">Help</Button>
            <div className="sortSearch">
                <CustomInput
                    inputProps={{
                        placeholder: "Search",
                        inputProps: {
                            "aria-label": "Search"
                        }
                    }}
                />
                <Button justIcon color="white">
                    <Search className={classes.searchIcon}/>
                </Button>
            </div>
            </li>
        </ul>

    );
}

export default withStyles(headerLinksStyle)(HeaderSub);
