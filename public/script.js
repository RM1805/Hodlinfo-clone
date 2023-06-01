window.addEventListener('DOMContentLoaded', () => {
    fetch('/ticker-data')
      .then(response => response.json())
      .then(data => {
        const tickerDataContainer = document.getElementById('ticker-data');
        const table = document.createElement('div');
        table.classList.add('table');
  
        const headerRow = document.createElement('div');
        headerRow.classList.add('table-row');
        const headerCells = ['Name', 'Last', 'Buy', 'Sell', 'Volume', 'Base Unit']
          .map(text => createTableCell(text, 'table-header'));
        headerCells.forEach(cell => headerRow.appendChild(cell));
        table.appendChild(headerRow);
  
        data.forEach(ticker => {
          const row = document.createElement('div');
          row.classList.add('table-row');
          const cells = [
            ticker.name,
            ticker.last.toFixed(2),
            ticker.buy.toFixed(2),
            ticker.sell.toFixed(2),
            ticker.volume.toFixed(2),
            ticker.base_unit
          ].map(text => createTableCell(text));
          cells.forEach(cell => row.appendChild(cell));
          table.appendChild(row);
        });
  
        tickerDataContainer.appendChild(table);
      })
      .catch(error => {
        console.error('Error fetching ticker data:', error);
      });
  });
  
  function createTableCell(text, className) {
    const cell = document.createElement('div');
    cell.classList.add('table-cell');
    if (className) {
      cell.classList.add(className);
    }
    cell.textContent = text;
    return cell;
  }
  