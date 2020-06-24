import React from "react";
import { psString } from "../../../config/localization";
import { Helmet } from "react-helmet";


class Guide extends React.PureComponent {


  render() {

    return (

      <div className="row container mb-5">
        <Helmet>
          <title>{psString("helmet-title-guide") + " | Polaris Share"}</title>
        </Helmet>

        <div className="col-12 mt-3 mb-5">
          <div className="legal-subject mt-3 mb-5">{psString("guide-subj-main")}</div>

          <div className="legal-content mt-4">

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-1")}</div>
            {psString("guide-content-1")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-2")}</div>
            {psString("guide-content-2")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-3")}</div>
            {psString("guide-content-3")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-4")}</div>
            {psString("guide-content-4")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-5")}</div>
            {psString("guide-content-5")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-6")}</div>
            {psString("guide-content-6")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-7")}</div>
            {psString("guide-content-7")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-8")}</div>
            {psString("guide-content-8")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-9")}</div>
            {psString("guide-content-9")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-10")}</div>
            {psString("guide-content-10")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-11")}</div>
            {psString("guide-content-11")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-12")}</div>
            {psString("guide-content-12")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-13")}</div>
            {psString("guide-content-13")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-14")}</div>
            {psString("guide-content-14")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("guide-subj-15")}</div>
            {psString("guide-content-15")}
            <br/>


          </div>
        </div>
      </div>

    );
  }
}

export default Guide;
