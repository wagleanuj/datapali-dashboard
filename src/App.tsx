import React from 'react';
import './App.css';
import { DPNavbar } from './ui/Navbar';
import { DPFormItem } from './components/DPFormItem';
import { Row } from 'reactstrap';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div className={"wrapper"}>
        <DPNavbar></DPNavbar>
        <div className="main-panel">
          <div className="content">
            <DPFormItem></DPFormItem>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
