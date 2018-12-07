import React, { Component } from 'react';
import './App.css';
import moodleXMLtoJson from 'moodlexml-to-json';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: "",
      right :"",
      from: 'xml',
      to: 'json'
    }
  }
  render() {
    return (
      <div className="App">
       <header><h1><i className="material-icons">school</i>  MoodleXML to JSON</h1></header>
       <div className="content"> 
          <div className="content-col left">
            <div><h2>From</h2>
            <select onChange={(e)=>{this.setState({from: e.target.value})}} value={this.state.from}>
              <option value="xml" >MoodleXML</option>
              <option disabled value="aiken" >Aiken</option>
              <option disabled value="json" >JSON</option>
            </select>
            </div>
            <textarea onChange={(e)=>{this.onWrite(e,'left')}} value={this.state.left}></textarea>
            <div className="buttons">
              <button onClick={this.convert.bind(this)}>
                <i className="material-icons">play_arrow</i>Convert</button>
            </div>
          </div>
          <div className="content-col right">
            <div><h2>To</h2>
            <select onChange={(e)=>{this.setState({to: e.target.value})}}>
              <option disabled value="xml" >MoodleXML</option>
              <option disabled value="aiken" >Aiken</option>
              <option value="json" >JSON</option>
            </select>
            </div>
            <textarea ref="right" onChange={(e)=>{this.onWrite(e,'right')}} value={this.state.right}></textarea>
            <div className="buttons">
              <button onClick={()=>{
                this.refs.right.select();
                document.execCommand('copy');
              }}>
                <i className="material-icons">file_copy</i>Copy
              </button>
              <button onClick={()=>{this.download("quiz.json", this.state.right)}}>
                <i className="material-icons">cloud_download</i>Download
              </button>
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
      if (err) {
        alert("Not a valid MoodleXML file");
        this.setState({right: ''});
        return;
      }
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
