'use babel';

export default class ServaView {

  constructor(data) {
    this.servers = data.servers;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('serva');

    let closeButton = document.createElement('button');
    closeButton.classList.add('serva-button', 'float-right', 'icon', 'icon-x');
    closeButton.addEventListener('click', () => {
      this.hide();
    });
    this.element.appendChild(closeButton);

    this.table = document.createElement('table');
    this.element.appendChild(this.table);

    this.refresh();
  }

  // Returns an object that can be retrieved when package is activated
  // serialize() {
  //   return {
  //     data: this.data
  //   };
  // }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  refresh() {
    this.table.innerHTML = '';

    for (let path in this.servers) {
      let row = document.createElement('tr');
      let pathCell = document.createElement('td');
      let portCell = document.createElement('td');
      let portLink = document.createElement('a');
      let reloadCell = document.createElement('td');
      let reloadLink = document.createElement('button');
      let stopCell = document.createElement('td');
      let stopLink = document.createElement('button');

      pathCell.textContent = path;
      row.appendChild(pathCell);
      portLink.href = `http://localhost:${this.servers[path].getOption('port')}`;
      portLink.textContent = `localhost:${this.servers[path].getOption('port')}`;
      portCell.appendChild(portLink);
      row.appendChild(portCell);
      reloadLink.classList.add('serva-button', 'icon', 'icon-sync');
      reloadLink.addEventListener('click', () => {
        this.servers[path].reload();
      });
      reloadLink.textContent = 'Reload';
      reloadCell.appendChild(reloadLink);
      row.appendChild(reloadCell);
      stopLink.classList.add('serva-button', 'icon', 'icon-primitive-square');
      stopLink.addEventListener('click', () => {
        this.servers[path].exit();
        setTimeout(this.refresh, 10);
      });
      stopLink.textContent = 'Stop';
      stopCell.appendChild(stopLink);
      row.appendChild(stopCell);
      this.table.appendChild(row);
    }
  }
}
