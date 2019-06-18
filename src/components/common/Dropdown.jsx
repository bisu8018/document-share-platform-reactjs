import React from "react";

class Dropdown extends React.Component {
  state = {
    selected: "",
    mouseOver: false,
  };


  // 마우스 오버 관리
  arrowHover = () => {
    this.setState({ mouseOver: true });
  };


  // 마우스 오버 벗어남 관리
  arrowUnHover = () => {
    this.setState({ mouseOver: false });
  };


  // 클릭 관리
  handleClick = () => {
    this.props.setDropdownShow(true);
  };


  // 드롭다운 선택 관리
  handleSelected = (value) => {
    this.setState({selected : value[1]});   // 값 이름
    this.props.selected(value[0]);    // 값 코드
    this.props.setDropdownShow(false);
  };


  componentWillMount(): void {
    const { dataList } = this.props;
    this.setState({ selected: dataList ? dataList[0][1] : "" }, () => {

    });
  }


  render() {
    const { dataList, getDropdownShow } = this.props;
    const { selected, mouseOver } = this.state;

    return (
      <div className="position-relative">
        <div className="row dropdown-wrapper" onMouseOver={() => this.arrowHover()}
             onMouseLeave={() => this.arrowUnHover()} onClick={() => this.handleClick()}>
          <div className="dropdown-selected mr-4">{selected}</div>
          {mouseOver ?
            <img src={require("assets/image/icon/i-arrow-down-blue.svg")} alt="dropdown"/> :
            <img src={require("assets/image/icon/i-arrow-down.svg")} alt="dropdown"/>
          }
        </div>

        {getDropdownShow &&
          <div className="dropdown-list-wrapper" id="dropdownList">
            {dataList.map((rst) => (
              <div key={rst[0]} className="dropdown-list" onClick={()=>{this.handleSelected(rst)}}>
                {rst[1]}
              </div>
            ))}
          </div>
        }

      </div>
    );
  }
}

export default Dropdown;