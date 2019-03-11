import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CustomInput from "components/common/CustomInput";

const style = {};

class ContentViewComment extends React.Component {

  addComment = () => {
  };

  render() {
    //const { classes } = this.props;
    //const document = this.state.document;

    return (
      <div className="row">
        <div className="col-10">
          <CustomInput
            labelText="Add your comments..."
            id="comment"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "commentText"
            }}/>
        </div>
        <div className="col-2">
          <div className="claim-btn" onClick={() => this.addComment()}>ADD</div>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewComment);
