import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class FullheightIframe extends Component {
  constructor(props) {
    super();
    this.state = {
      onload: true,
      iFrameHeight: "1000px",
    };
  }

  render() {
    return (
      <iframe
        style={{
          width: "100%",
          height: this.state.iFrameHeight,
          overflow: "visible",
        }}
        onLoad={() => {
          const obj = ReactDOM.findDOMNode(this);
          this.setState({
            iFrameHeight:
              obj.contentWindow.document.body.scrollHeight + 20 + "px",
          });
          this.setState({ onload: false });
        }}
        ref="iframe"
        width="100%"
        height={this.state.iFrameHeight}
        scrolling="no"
        frameBorder="0"
        {...this.props}
      />
    );
  }
}
