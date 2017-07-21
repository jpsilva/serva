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
          <tbody>
            {Object.keys(this.props.servers).map((path) =>
              <tr key={path}>
                <td>{path}</td>
                <td>
                  <a href={'http://localhost:' + this.props.servers[path].server.getOption('port')}>localhost:{this.props.servers[path].server.getOption('port')}</a>
                </td>
                <td>
                  { this.props.servers[path].watching ? 'Watching' : '' }
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
          </tbody>
        </table>
      </div>
    );
  }
}
