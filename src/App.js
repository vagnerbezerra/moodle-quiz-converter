import React, { Component } from 'react';
import './App.css';
import moodleXMLtoJson from 'moodlexml-to-json';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: "",
      right :""
    }
  }
  render() {
    return (
      <div className="App">
       <header><h1>MoodleXML to JSON</h1></header>
       <div className="content"> 
          <div className="content-col left">
            <h2>From</h2>
            <textarea onChange={(e)=>{this.onWrite(e,'left')}} value={this.state.left}></textarea>
            <div className="buttons">
              <button onClick={this.convert.bind(this)}>Convert</button>
            </div>
          </div>
          <div className="content-col right">
            <h2>To</h2>
            <textarea ref="right" onChange={(e)=>{this.onWrite(e,'right')}} value={this.state.right}></textarea>
            <div className="buttons">
              <button onClick={()=>{
                this.refs.right.select();
                document.execCommand('copy');
              }}>Copy</button>
              <button onClick={()=>{this.download("quiz.json",this.state.right)}}>Download</button>
            </div>
          </div>
       </div>
      </div>
    );
  }
  convert() {
    moodleXMLtoJson(this.state.left, (res,err)=>{
      console.log(res,err)
      let right = JSON.stringify(res, null, 2)
      this.setState({right});
    })
    
  }
  onWrite(e,side){
    this.setState({ [side]: e.target.value});
  }

  download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


}

export default App;
