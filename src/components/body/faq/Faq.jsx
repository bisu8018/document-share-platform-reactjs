import React from "react";
import { psString } from "../../../config/localization";


class Faq extends React.PureComponent {


  render() {

    return (

      <div className="row mb-5">

        <div className="col-sm-12 col-lg-10 offset-lg-1 mb-5 u__center-faq">
          <div className="legal-subject mt-3 mt-sm-5 text-center">FAQ</div>

          <div className="legal-content mt-4">

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-1")}</div>
            {psString("faq-answer-1")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-2")}</div>
            {psString("faq-answer-2")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-3")}</div>
            {psString("faq-answer-3")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-4")}</div>
            {psString("faq-answer-4a")}
            <br/>
            {psString("faq-answer-4b")}
            <br/>
            {psString("faq-answer-4c")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-5")}</div>
            {psString("faq-answer-5a")}
            <br/>
            {psString("faq-answer-5b")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-6")}</div>
            {psString("faq-answer-6a")}
            <br/>
            {psString("faq-answer-6b")}
            <br/>
            {psString("faq-answer-6c")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-7")}</div>
            {psString("faq-answer-7")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-8")}</div>
            {psString("faq-answer-8")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-9")}</div>
            {psString("faq-answer-9")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-10")}</div>
            {psString("faq-answer-10")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-11")}</div>
            {psString("faq-answer-11")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-12")}</div>
            {psString("faq-answer-12")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-13")}</div>
            {psString("faq-answer-13")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-14")}</div>
            {psString("faq-answer-14")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-15")}</div>
            {psString("faq-answer-15")}
            <br/>

            <div className="font-weight-bold mt-5 mb-3">{psString("faq-question-16")}</div>
            {psString("faq-answer-16")}
            <br/>

            <div className="font-weight-bold mt-5 mb-2">{psString("faq-question-17")}</div>
            {psString("faq-answer-17")}
            <br/>

          </div>
        </div>
      </div>

    );
  }
}

export default Faq;
