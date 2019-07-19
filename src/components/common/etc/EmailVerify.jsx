import React from "react";
import axios from "axios";
import history from "apis/history/history";
import { APP_PROPERTIES } from "properties/app.properties";
import { ThreeBounce } from "better-react-spinkit";

let url = "email/verifyemail/";

class EmailVerify extends React.Component {

  getRootUrlWithApi = function() {
    return APP_PROPERTIES.domain().email + "/api/";
  };

  getVerifiedValue = (c) => {
    const { setAlertCode } = this.props;
    axios({
      method: "GET",
      url: this.getRootUrlWithApi() + url + c,
      data: {},
      headers: {}
    })
      .then((response) => {
        if (response.data.success && response.data.success === true) setAlertCode(2021);
        else {
          //if(response.data.message === "already verified") setAlertCode(2023);
          //else if(response.data.message === "No Verify Request") setAlertCode(2024);
        }
      })
      .catch((error) => {
        error.log(error);
        setAlertCode(2022);
      }).then(() => {
      history.push("/");
    });
  };

  componentWillMount(): void {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let c = url.searchParams.get("code");
    this.getVerifiedValue(c);
  }

  render() {
    return (
      <div>
        <div className="spinner mt-5"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>
      </div>
    );
  }
}

export default EmailVerify;
