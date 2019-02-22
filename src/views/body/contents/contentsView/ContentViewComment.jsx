import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/custom/HeaderButton";
import CustomInput from "components/custom/CustomInput";

const style = {
};

class ContentViewComment extends React.Component {

  addComment = () => {};

  render() {
    //const { classes } = this.props;
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
