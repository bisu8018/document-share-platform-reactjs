import * as React from "react";
import Autosuggest from "react-autosuggest";
import Common from "../../util/Common";

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
    let tagList = this.props.getTagList;
    const suggestions = tagList.filter(data => regex.test(data._id));

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

  componentWillMount(): void {
    if(this.props.bindValue){
      this.setState({value : this.props.bindValue});
    }
  }

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
