'use babel';

import path from 'path';
import serva from '../lib/serva';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Serva', () => {
  let workspaceElement, activationPromise, ui;
  let fixturesPath = path.join(__dirname, 'fixtures');

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('serva');

    waitsForPromise(() => atom.packages.activatePackage('tree-view'));

    ui = workspaceElement.querySelector('.tree-view');

    serva.activate();
  });

  describe('when serva:start-server is triggered', async () => {
    it('starts a server', () => {
      waitsForPromise(() =>
        serva.start(fixturesPath)
          .then((server) => {
            expect(serva.servers[fixturesPath].server.getOption('port')).toBeGreaterThan(2999);
            expect(serva.servers[fixturesPath].watching).toBe(false);
            serva.stop(fixturesPath);
          })
          .catch((err) => {
            console.error(err)
          })
      );
    });
  });

  describe('when serva:start-watch-server is triggered', () => {
    it('starts a server and watches files for changes', () => {
      waitsForPromise(() => serva.start(fixturesPath, true));

      runs(() => {
        expect(serva.servers[fixturesPath].server.getOption('port')).toBeGreaterThan(2999);
        expect(serva.servers[fixturesPath].watching).toBe(true);
        serva.stop(fixturesPath);
      });
    });
  });

  describe('when serva:stop-server is triggered', () => {
    it('stops the server', () => {
      waitsForPromise(() =>
        serva.start(fixturesPath, true)
          .catch((err) => {
            console.error(err)
          })
      );

      runs(() => {
        serva.stop(fixturesPath);
        expect(serva.servers[fixturesPath]).not.toExist();
      });
    });
  });

  describe('when serva:stop-all-servers is triggered', () => {
    it('stops all servers', () => {
      waitsForPromise(() =>
        serva.start(fixturesPath, true)
          .catch((err) => {
            console.error(err)
          })
      );

      runs(() => {
        atom.commands.dispatch(workspaceElement, 'serva:stop-all-servers');
        expect(serva.servers).toEqual({});
      });
    });
  });

  describe('when serva:toggle-server-list is triggered', () => {
    it('shows and hides list of running servers', () => {
      jasmine.attachToDOM(workspaceElement);

      runs(() => {
        serva.list();
        let servaElement = workspaceElement.querySelector('.serva');
        expect(servaElement).toBeVisible();

        serva.list();
        expect(servaElement).not.toBeVisible();
      });
    });
  });
});
