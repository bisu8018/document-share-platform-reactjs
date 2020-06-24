import React from "react";
import { Editor } from "slate-react";
import Html from "slate-html-serializer";
import { psString } from "../../../../config/localization";

const initialValue = "<p></p>";


// SET Hot Key
const MarkHotkey = options => {
  const { type, key } = options;

  return {
    onKeyDown(event, editor, next) {
      if (event.key === "Enter") {
        editor.splitBlock();
      } else if (event.ctrlKey && event.key === key) {
        event.preventDefault();   // Prevent the default characters from being inserted.
        editor.toggleMark(type);    // Toggle the mark `type`.
      } else {
        return next();
      }
    }
  };
};


// SET Class
const setClass = list => {
  let initClass = "content-editor-el-p";

  if (!list) return initClass;

  const arr = list.split(" ");
  return (!list || arr.indexOf(initClass) < 0) ? list + " " + initClass : list;
};


// Initialize a plugin for each mark...
const plugins = [
  MarkHotkey({ key: "b", type: "bold" }),
  MarkHotkey({ key: "i", type: "italic" })
];


// Refactor block tags into a dictionary for cleanliness.
const BLOCK_TAGS = {
  p: "paragraph"
};


const MARK_TAGS = {
  em: "italic",
  strong: "bold"
};


// 규칙 정의
const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];

      if (type) {
        return {
          object: "block",
          type: type,
          data: {
            className: setClass(el.getAttribute("class"))
          },
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === "block") {
        switch (obj.type) {
          case "paragraph":
          default :
            return <p className={obj.data.get("className")}>{children}</p>;
        }
      }
    }
  },
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: "mark",
          type: type,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === "mark") {
        switch (obj.type) {
          case "bold":
            return <strong>{children}</strong>;
          case "italic":
            return <em>{children}</em>;
          default :
            return;
        }
      }
    }
  }
];


// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules });


class ContentEditor extends React.Component {

  state = {
    value: html.deserialize(initialValue)
  };


  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    // Save the value to Local Storage.
    if (value.document !== this.state.value.document) {
      const string = html.serialize(value);
      this.props.getDesc(string);
    }

    this.setState({ value });
  };


  // Add a `renderMark` method to render marks.
  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case "bold":
        return <strong>{props.children}</strong>;
      case "italic":
        return <em>{props.children}</em>;
      default:
        return next();
    }
  };


  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case "paragraph":
        return (
          <p {...props.attributes} className={setClass(props.node.data.get("className"))}>
            {props.children}
          </p>
        );
      default:
        return next();
    }
  };


  // Render the editor.
  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        plugins={plugins}
        renderBlock={this.renderNode}
        renderMark={this.renderMark}
        placeholder={psString("content-add-write-contents")}
      />);
  }
}


export default ContentEditor;
