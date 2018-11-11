import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

const style = {
};

class ContentViewComment extends React.Component {

  addComment = () => {
  }

  render() {
    const { classes } = this.props;
    //const document = this.state.document;

    return (
      <div>
        <CustomInput
          labelText="Add your comments..."
          id="comment"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "commentText"
          }} />
        <Button onClick={() => this.addComment()} color="rose" size="sm">Add</Button>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewComment);
