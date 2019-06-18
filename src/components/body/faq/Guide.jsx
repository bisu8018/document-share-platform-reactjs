import React from "react";


class Guide extends React.PureComponent {


  render() {

    return (

      <div className="row mb-5">
        <div className="col-sm-12 col-lg-10 offset-lg-1  u__center-faq">
          <div className="legal-subject mt-3 mt-sm-5 text-center">User Guide</div>


          <div className="font-weight-bold mt-5 mb-2">How do I register and activate my account?</div>
          Once you sign in to polaris share, you will receive an activation email. Just click the link in the activation email
          to active your account. If you can't find the activation email, check your spam folder.
          <br/>
          <br/>
          Note: If your email is already associated with a polaris share account, you will not be able to use it to create a new account.
          <br/>
          <br/>
          <br/>
          <img className="guide-sample-1" src={require("assets/image/common/guide-sample-1.png")} alt="login guide"/>

        </div>
      </div>

    );
  }
}

export default Guide;
