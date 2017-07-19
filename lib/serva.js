'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import { allowUnsafeEval } from 'loophole'
// import ServaView from './serva-view.js';
// import ServaElement from './serva-element.js';
import ServaComponent from './serva-component';
import { CompositeDisposable } from 'atom';
import gaze from 'gaze';

export default {
  view: null,
  bottomPanel: null,
  subscriptions: null,
  servers: {},
  config: {
    watchableFileTypes: {
      type: 'string',
      title: 'Watchable file types',
      description: 'Specify file extensions to watch, comma separated.',
      default: 'css,htm,html,js,jpg,jpeg,gif,png,svg',
      order: 1
    },
    watchableExclusions: {
      type: 'string',
      title: 'Excluded folders',
      description: 'Specify folders to ignore, comma separated.',
      default: 'bower_components,jspm_packages,node_modules,.*',
      order: 2
    }
  },

  activate() {
    this.viewElement = document.createElement('div');

    this.bottomPanel = atom.workspace.addBottomPanel({
      item: this.viewElement,
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'serva:toggle-server-list': () => this.list(),
      'serva:stop-all-servers': () => this.stopAll()
    }));

    this.subscriptions.add(atom.commands.add('.tree-view', {
      'serva:start-server': (event) => this.start(event.target.dataset.path),
      'serva:start-watch-server': (event) => this.start(event.target.dataset.path, true),
      'serva:stop-server': (event) => this.stop(event.target.dataset.path)
    }));

    this.browserSync = allowUnsafeEval(() => require("browser-sync"));

    this.refreshView();
  },

  refreshView() {
    ReactDOM.render(
      <ServaComponent servers={this.servers} reloadServer={this.reload.bind(this)} stopServer={this.stop.bind(this)} hide={this.list.bind(this)
      }></ServaComponent>,
      this.viewElement
    );
  },

  deactivate() {
    this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.view.destroy();
  },

  start(path, watch) {
    let server;

    if (this.servers[path]) {
      server = this.servers[path];
      server.exit();
    } else {
      server = this.browserSync.create();
    }

    server.init({
      server: {
        baseDir: path
      }
    });

    atom.notifications.addSuccess(`Serving ${path} on port ${server.getOption('port')}`);

    if (watch) {
      setTimeout(() => {
        // BUG: doesn't watch anything when only 1 file type is specified in settings

        gaze([
          `${path}/**/*.{${atom.config.get('serva.watchableFileTypes')}}`,
          `!${path}/**/{${atom.config.get('serva.watchableExclusions')}}/**/*`
        ], (err, watcher) => {
          console.log('Watching... ', watcher.watched())
          watcher.on('changed', (filepath) => {
            server.reload(filepath);
          });
        });

        atom.notifications.addSuccess(`Watching ${atom.config.get('serva.watchableFileTypes')} files in ${path} for changes`);
      }, 10);
    }

    this.servers[path] = server;

    this.refreshView();
  },

  reload(path) {
    if (this.servers[path]) {
      this.servers[path].reload();
    }

    this.refreshView();
  },

  stop(path) {
    if (this.servers[path]) {
      this.servers[path].exit();
      delete this.servers[path];
      atom.notifications.addSuccess(`Stopped server for ${path}`);
    }

    this.refreshView();
  },

  list() {
    if (this.bottomPanel.isVisible()) {
      this.bottomPanel.hide();
    } else {
      this.refreshView();
      this.bottomPanel.show();
    }
  },

  stopAll() {
    let paths = Object.keys(this.servers);

    for (let path in paths) {
      try {
        this.servers[path].exit();
        delete this.servers[path];
      } catch (e) {
        console.error(e);
      }
    }

    atom.notifications.addSuccess(`Stopped all servers`);

    this.refreshView();
  }
};
