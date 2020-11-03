import React, { Component } from 'react';
import './App.css';
import moodleXMLtoJson from 'moodlexml-to-json';
import aikenToMoodleXML from 'aiken-to-moodlexml';
import sampleAiken from './sampleAiken';
// import * as Moodle from './moodle';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: sampleAiken,
      right :"",
      from: 'txt',
      to: 'xml',
      es: false,
      nsnc: false,
      penalty: false,
      shuffle: true
    }
  }
  render() {
    return (
      <div className="App">
        <header>
          <h1> <i className="material-icons">school</i> Conversor de QUIZ Moodle</h1>
          <div className="links">
            <a target="_blank" rel="noreferrer noopener" href="https://docs.moodle.org/38/en/Moodle_XML_format">MoodleXML</a>
            <a target="_blank" rel="noreferrer noopener" href="https://docs.moodle.org/38/en/Aiken_format">Aiken</a>
          </div>
        </header>
       <div className="content"> 
          <div className="content-col left">
            <div><h2>De</h2>
            <select onChange={(e)=>{this.setState({from: e.target.value})}} value={this.state.from}>
              <option value="xml" >MoodleXML</option>
              <option value="txt" >Aiken</option>
              {/* <option disabled value="json" >JSON</option> */}
            </select>
            {this.state.from === "txt"? <label className="lc"><input type="checkbox" checked={this.state.nsnc} onChange={()=>this.setState({nsnc: !this.state.nsnc})}/>Opções Vazias</label>: null}
            {this.state.from === "txt"? <label className="lc"><input type="checkbox" checked={this.state.penalty} onChange={()=>this.setState({penalty: !this.state.penalty})}/>Penalizar Proporcionalmente</label>: null}
            {this.state.from === "txt"? <label className="lc"><input type="checkbox" checked={this.state.shuffle} onChange={()=>this.setState({shuffle: !this.state.shuffle})}/>Embaralhar Respostas</label>: null}
            
            </div>
            <textarea onChange={(e)=>{this.onWrite(e,'left')}} value={this.state.left}></textarea>
            <div className="buttons">
              <button onClick={this.convert.bind(this)}>
                <i className="material-icons">play_arrow</i>Converter
              </button>
              <button onClick={this.reset.bind(this)}>
                <i className="material-icons">replay</i>Limpar
              </button>
            </div>
          </div>
          <div className="content-col right">
            <div><h2>Para</h2>
            <select onChange={(e)=>{this.setState({to: e.target.value})}} value={this.state.to}>
              <option value="xml" >MoodleXML</option>
              {/* <option disabled value="txt" >Aiken</option> */}
              <option value="json" >JSON</option>
            </select>
            </div>
            <textarea ref="right" onChange={(e)=>{this.onWrite(e,'right')}} value={this.state.right}></textarea>
            <div className="buttons">
              <button onClick={()=>{
                this.refs.right.select();
                document.execCommand('copy');
              }}>
                <i className="material-icons">file_copy</i>Copiar
              </button>
              <button onClick={()=>{this.download("quiz."+this.state.to, this.state.right)}}>
                <i className="material-icons">cloud_download</i>Download
              </button>
            </div>
          </div>
       </div>
      </div>
    );
  }
  convert() {
    const {from, to, left} = this.state;
    console.log(from, to, left)
    if (from === "xml" && to === "json") {
      moodleXMLtoJson(left, (res,err)=>{
        if (err) {
          console.error(err);
          alert("Not a valid MoodleXML file");
          this.setState({right: ''});
          return;
        }
        let right = JSON.stringify(res, null, 2)
        this.setState({right});
      })
    } else if (from === "txt" && to === "json") {
      aikenToMoodleXML(left, (result, error)=>{
        console.log(result, error)
        moodleXMLtoJson(result.replace(/\t/g, "  "), (res,err)=>{
          if (err) {
            console.error(err);
            alert("Not a valid Aiken file");
            this.setState({right: ''});
            return;
          }
          let right = JSON.stringify(res, null, 2)
          
          this.setState({right});
        })
      }, {lang: this.state.es ? "es": "en", penalty: this.state.penalty, nsnc: this.state.nsnc, shuffle: this.state.shuffle});
    } else if (from === "txt" && to === "xml") {
      aikenToMoodleXML(left, (res, err) => {
        if (err) {
          console.error(err);
          alert("Not a valid Aiken file");
          this.setState({right: ''});
          return;
        }
          let right = (res)
          .replace(/\t/g, "  ");
          
          this.setState({right});
      }, {lang: this.state.es ? "es": "en", penalty: this.state.penalty, nsnc: this.state.nsnc, shuffle: this.state.shuffle});
    } else if (from === "xml" && to === "xml") {
      this.setState({right: left});
    }
  }

  reset() {
    this.setState({left:"", right: ""});
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

  componentDidMount(){
    window.onbeforeunload = (e) => {
      let {left, right, from, to, es, penalty, nsnc, shuffle} = this.state;
      if (left === "") {
        localStorage.removeItem("moodleXMLtoJson");
      } else {
        localStorage.moodleXMLtoJson = JSON.stringify({left, right, from, to, es, penalty, nsnc, shuffle});
      }
    };
    if (localStorage.moodleXMLtoJson) {
      const {left, from, to, es, penalty, nsnc, shuffle} = JSON.parse(localStorage.moodleXMLtoJson);
      this.setState({left, from, to, es, penalty, nsnc, shuffle});
    }
    // window.Moodle = Moodle;
  }


}

export default App;
