import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/icons/Menu";
import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
        this.headerColorChange = this.headerColorChange.bind(this);
    }

    componentDidMount() {
        if (this.props.changeColorOnScroll) {
            window.addEventListener("scroll", this.headerColorChange);
        }
    }

    componentWillUnmount() {
        if (this.props.changeColorOnScroll) {
            window.removeEventListener("scroll", this.headerColorChange);
        }
    }

    handleDrawerToggle() {
        this.setState({mobileOpen: !this.state.mobileOpen});
    }

    headerColorChange() {

    }

    render() {
        const {
            classes,
            color,
            rightLinks,
            brand,
            fixed,
            absolute
        } = this.props;

        const appBarClasses = classNames({
            [classes.appBar]: true,
            [classes[color]]: color,
            [classes.absolute]: absolute,
            [classes.fixed]: fixed
        });

        const brandComponent = <Button className={classes.title} href="/"><img src={require("assets/image/logo.png")}
                                                                               alt={brand}/> </Button>;


        return (

            <AppBar className={appBarClasses}>
                    <Toolbar className={classes.container}>
                        {brandComponent}
                        <Hidden smDown implementation="css">
                            {rightLinks}
                        </Hidden>
                        <Hidden mdUp>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <Menu/>
                            </IconButton>
                        </Hidden>
                    </Toolbar>

                    <Hidden mdUp implementation="css">
                        <Drawer
                            variant="temporary"
                            anchor={"right"}
                            open={this.state.mobileOpen}
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            onClose={this.handleDrawerToggle}
                        >
                            <div className={classes.appResponsive}>
                                {rightLinks}
                            </div>
                        </Drawer>
                    </Hidden>
            </AppBar>

        );
    }
}

Header.defaultProp = {
    color: "white"
};

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.oneOf([
        "primary",
        "info",
        "success",
        "warning",
        "danger",
        "transparent",
        "white",
        "rose",
        "dark"
    ]),
    rightLinks: PropTypes.node,
    brand: PropTypes.string,
    fixed: PropTypes.bool,
    absolute: PropTypes.bool,
    // this will cause the sidebar to change the color from
    // this.props.color (see above) to changeColorOnScroll.color
    // when the window.pageYOffset is heigher or equal to
    // changeColorOnScroll.height and then when it is smaller than
    // changeColorOnScroll.height change it back to
    // this.props.color (see above)
    changeColorOnScroll: PropTypes.shape({
        height: PropTypes.number.isRequired,
        color: PropTypes.oneOf([
            "primary",
            "info",
            "success",
            "warning",
            "danger",
            "transparent",
            "white",
            "rose",
            "dark"
        ]).isRequired
    })
};

export default withStyles(headerStyle)(Header);