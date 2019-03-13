import * as React from "react";
import Autosuggest from "react-autosuggest";
import Common from "../../common/Common";

class AutoSuggestInput extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
    };
  }
  getSuggestions = value => {
    const escapedValue = Common.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');
    const suggestions = this.props.dataList.filter(data => regex.test(data._id));

    return suggestions;
  };

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  getSuggestionValue = suggestion => {
    const { type } = this.props;
    if(type === "tag") {
      return suggestion._id;
    }
    return suggestion._id;
  };

  renderSuggestion = suggestion => {
    const { type } = this.props;
    if(type === "tag") {
      return suggestion._id;
    }
    return suggestion._id;
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
  };

  render() {
    const { type } = this.props;
    const { value, suggestions } = this.state;

    let _placeholder = "";

    if(type === "tag") {
      _placeholder = "Tag Search . . .";

    }else if(type === "name") {
      _placeholder = "name Search . . .";
    }

    const inputProps = {
      placeholder: _placeholder,
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
      />
    );
  }
}

export default AutoSuggestInput;
