export function generateTable(data: {
  heading: string[];
  body: string[][];
  bodyLen: number;
}) {
  const {body, bodyLen, heading} = data;

  //-------------- create table head ---------------//
  const thElementArray: JSX.Element[] = [];
  for (let i = 0; i < heading.length; i++) {
    const currentHeader = heading[i];
    if (i === heading.length - 1) {
      thElementArray[i] = (
        <th style={{borderRight: 'none'}} key={'th' + i}>
          {currentHeader}
        </th>
      );
    } else {
      thElementArray[i] = <th key={'th' + i}>{currentHeader}</th>;
    }
  }

  const theadElement = (
    <thead>
      <tr>{thElementArray}</tr>
    </thead>
  );

  //-------------- create table body ---------------//
  const trElementArray: JSX.Element[] = [];
  for (let i = 0; i < bodyLen; i++) {
    const currentRow = body[i];

    // get all cells of current row
    const cellElementArray: JSX.Element[] = [];
    for (let k = 0; k < currentRow.length; k++) {
      cellElementArray[k] = (
        <td key={'cell' + k + 'ofRow' + i}>{currentRow[k]}</td>
      );
    }

    const rowElement: JSX.Element = <tr>{cellElementArray}</tr>;

    trElementArray[i] = rowElement;
  }

  const tbodyElement = <tbody>{trElementArray}</tbody>;

  //----------- combine to create table ------------//

  const table: JSX.Element = <table>{[theadElement, tbodyElement]}</table>;

  //----------------- return table ------------------//

  return table;
}

export function generateLoadingTable() {
  const skeletonRowArray: JSX.Element[] = [];
  for (let i = 0; i <= 20; i++) {
    // get all cells of current row
    const skeletonCellArray: JSX.Element[] = [];
    for (let k = 0; k <= 7; k++) {
      let width;
      if (k === 0 || k === 7) {
        width = '120px';
      } else if (k === 1 || k === 4 || k === 5) {
        width = '170px';
      } else if (k === 2) {
        width = '50px';
      } else if (k === 3) {
        width = '280px';
      } else {
        width = '230px';
      }

      skeletonCellArray[k] = (
        <td key={'cell' + k + 'ofRow' + i}>
          <svg style={{width: width, height: '20px', borderRadius: '5px'}}>
            <rect
              className="skeletonText"
              width={width}
              height={'20px'}
              fill={'#E6E6E6'}
            />
          </svg>
        </td>
      );
    }

    const skeletonRow: JSX.Element = <tr>{skeletonCellArray}</tr>;

    skeletonRowArray[i] = skeletonRow;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Application number</th>
          <th>Subservice Name</th>
          <th>Type</th>
          <th>Processing Office</th>
          <th>Assigned Person’s Name</th>
          <th>Submitted Date Licence Start Date</th>
          <th>Status</th>
          <th style={{borderRight: 'none'}}>Actions</th>
        </tr>
      </thead>
      <tbody>{skeletonRowArray}</tbody>
    </table>
  );
}
