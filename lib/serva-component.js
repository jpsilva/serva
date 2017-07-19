'use babel';

import React, { Component } from 'react';

export default class ServaComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="serva">
        <button className="serva-button float-right icon icon-x" onClick={this.props.hide}></button>
        <table>
          {Object.keys(this.props.servers).map((path) =>
            <tr>
              <td>{path}</td>
              <td>
                <a href={'http://localhost:' + this.props.servers[path].getOption('port')}>localhost:{this.props.servers[path].getOption('port')}</a>
              </td>
              <td>
                <button className="serva-button" onClick={() => this.props.reloadServer(path)}>
                  <span className="icon icon-sync"></span> Reload
                </button>
              </td>
              <td>
                <button className="serva-button" onClick={() => this.props.stopServer(path)}>
                  <span className="icon icon-primitive-square"></span> Stop
                </button>
              </td>
            </tr>
          )}
        </table>
      </div>
    );
  }
}
