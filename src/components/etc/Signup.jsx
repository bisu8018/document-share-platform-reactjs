import React from "react";
import MainRepository from "../../redux/MainRepository";

class Signup extends React.Component {
  componentWillMount(): void {
    MainRepository.Account.login();
  }
}
export default Signup;