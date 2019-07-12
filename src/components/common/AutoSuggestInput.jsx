import * as React from "react";
import Autosuggest from "react-autosuggest";
import Common from "../../config/common";
import { psString } from "../../config/localization";

class AutoSuggestInput extends React.Component {

  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: []
    };
  }


  // 자동 완성 리스트 설정
  getSuggestions = value => {
    const { type, getTagList, getNameList } = this.props;

    const escapedValue = Common.escapeRegexCharacters(value.trim());

    if (escapedValue === "") return [];

    const regex = new RegExp("^" + escapedValue, "i");

    switch (type) {
      case "tag":
        return getTagList.filter(data => regex.test(data._id));

      case "name":
        let tempArr =
          getNameList.filter((data, i) =>
            getNameList.findIndex((data2, j) =>
              (data.user ? data.user.e : "Anonymous") === (data2.user ? data2.user.e : "Anonymous")
            ) === i
          );
        return tempArr.filter(data => regex.test(data.user ? data.user.e : "Anonymous"));

      default:
        break;
    }
  };


  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };


  // 보여줄 값 GET
  getSuggestionValue = suggestion => {
    const { type } = this.props;

    switch (type) {
      case "tag":
        return suggestion._id;

      case "name":
        return suggestion.user ? suggestion.user.e : "Anonymous";

      default:
        break;
    }
  };


  //표시할 값 SET
  renderSuggestion = suggestion => {
    const { type } = this.props;

    switch (type) {
      case "tag":
        return suggestion._id;

      case "name":
        return suggestion.user ? suggestion.user.e : "Anonymous";

      default:
        break;
    }
  };


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };


  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };


  onSuggestionSelected = (event, { suggestion }) => {
    this.props.search(suggestion);
    this.setState({
      value: ""
    });
  };


  renderSectionTitle = section => {
    return (
      <strong className="autosuggest-count">{section.value}</strong>
    );
  };


  getSectionSuggestions = section => {
    let arr = new Array(0);
    arr.push(section);
    return arr;
  };


  // placeholder 설정
  getPlaceholder = () => {
    const { type } = this.props;

    let _placeholder;

    switch (type) {
      case "tag":
        _placeholder = psString("auto-placeholder-1");
        break;

      case "name":
        _placeholder = psString("auto-placeholder-2");
        break;

      default:
        _placeholder = "";
        break;
    }

    return _placeholder;
  };


  componentWillMount(): void {
    if (this.props.bindValue) {
      this.setState({ value: this.props.bindValue });
    }
  }


  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: this.getPlaceholder(),
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        highlightFirstSuggestion={true}
        onSuggestionSelected={this.onSuggestionSelected}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}

export default AutoSuggestInput;
