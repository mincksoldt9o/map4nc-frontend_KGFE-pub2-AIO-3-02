import React, { useState } from 'react';
import Dialog from '@my/components/atomic/Dialog';
import Grid from '@material-ui/core/Grid';
import { DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { Button } from '@material-ui/core';
import Label from '@my/components/atomic/Label';
import RadioButton from '@my/components/atomic/RadioButton';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import { TextColumnFilter } from '@my/components/molecules/DataGrid/filters';

type Props = {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type DataGridColumnData = EditableGridData & {
  shozoku: string;
  name: string;
};

//###### implementation manually testing
// ## Grid component
// function Grid() {
//   const [rows, setRows] = useState([
//     {
//       checked: false,
//       occupation: "Doctor",
//       familyName: "Smith"
//     },
//     {
//       checked: false,
//       occupation: "Teacher",
//       familyName: "Johnson"
//     },
//     {
//       checked: false,
//       occupation: "Engineer",
//       familyName: "Williams"
//     },
//     {
//       checked: false,
//       occupation: "Artist",
//       familyName: "Brown"
//     }
//   ]);

// useState hook mark

// experiment manually create grid component for testing 01
// return statement of Grid component
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>
//             <input
//               type="checkbox"
//               onChange={() => handleCheckAll()}
//             />
//           </th>
//           <th>
//             Occupation
//             <button onClick={() => handleFilterChange}>Filter</button>
//             <input
//               type="text"
//               name="occupation"
//               value={filters.occupation}
//               onChange={handleFilterChange}
//             />
//           </th>
//           <th>
//             Family Name
//             <button onClick={() => handleFilterChange}>Filter</button>
//             <input
//               type="text"
//               name="familyName"
//               value={filters.familyName}
//               onChange={handleFilterChange}
//             />
//           </th>
//         </tr>
//       </thead>
//       <tbody>
//         {filteredRows.map((row, index) => (
//           <tr key={index}>
//             <td>
//               <input
//                 type="checkbox"
//                 checked={row.checked}
//                 onChange={() => handleCheckboxChange(index)}
//               />
//             </td>
//             <td>{row.occupation}</td>
//             <td>{row.familyName}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// experiment manually create grid component for testing 02
//   return (
//     <div>
//       <Header>
//         <div>
//           <input
//             type="radio"
//             name="selection"
//             value="user"
//             checked={selected === "user"}
//             onChange={handleSelection}
//           />
//           Select User
//           <input
//             type="radio"
//             name="selection"
//             value="loginedStaff"
//             checked={selected === "loginedStaff"}
//             onChange={handleSelection}
//           />
//           Select Logined Staff
//         </div>
//         <button onClick={handleCloseButton}>Close</button>
//       </Header>
//       <Body>
//         <div>
//           <table>
//             <thead>
//               <tr>
//                 <th>
//                   <input
//                     type="checkbox"
//                     onChange={() => handleCheckAll()}
//                   />
//                 </th>
//                 <th>
//                   Occupation
//                   <button onClick={() => handleFilterChange}>Filter</button>
//                   <input
//                     type="text"
//                     name="occupation"
//                     value={filters.occupation}
//                     onChange={handleFilterChange}
//                   />
//                 </th>
//                 <th>
//                   Family Name
//                   <button onClick={() => handle
//                   <button onClick={() => handleFilterChange}>Filter</button>
//                   <input
//                     type="text"
//                     name="familyName"
//                     value={filters.familyName}
//                     onChange={handleFilterChange}
//                   />
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {leftGrid.map((row, index) => (
//                 <tr key={index}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={row.checked}
//                       onChange={() => handleCheckboxChange(index)}
//                     />
//                   </td>
//                   <td>{row.occupation}</td>
//                   <td>{row.familyName}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <button onClick={handleClickMove}>Move</button>
//         <div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Drag Icon</th>
//                 <th>Occupation</th>
//                 <th>Family Name</th>
//                 <th>Delete Row</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rightGrid.map((row, index) => (
//                 <tr key={index}>
//                   <td>Drag Icon</td>
//                   <td>{row.occupation}</td>
//                   <td>{row.familyName}</td>
//                   <td>
//                     <button onClick={() => handleDeleteRow(index)}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Body>
//       <Footer>
//         <button onClick={handleSave}>Save</button>
//       </Footer>
//     </div>
//   );
// }

//######


function setIsDialogOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}


const ShussekishaInyou: React.FC<Props> = (props: Props) => {
  const { setIsDialogOpen } = props;

  // function MoveDataBetweenTwoGrids() {
  // init state
  const [leftGrid, setLeftGrid] = useState([
    {
      checked: false,
      occupation: 'Doctor',
      familyName: 'Smith',
    },
    {
      checked: false,
      occupation: 'Teacher',
      familyName: 'Johnson',
    },
    {
      checked: false,
      occupation: 'Engineer',
      familyName: 'Williams',
    },
    {
      checked: false,
      occupation: 'Artist',
      familyName: 'Brown',
    },
  ]);

  // const [rightGrid, setRightGrid] = useState([]);
  const [rightGrid, setRightGrid] = useState<Array<{ occupation: string; familyName: string }>>([]);

  const [filters, setFilters] = useState({
    occupation: '',
    familyName: '',
  });

  const [selected, setSelected] = useState('');
  const [users, setUsers] = useState([]);
  const [loginedStaff, setLoginedStaff] = useState([]);
  // implement function handleFilterChange
  function handleFilterChange(e: { target: { name: any; value: any } }) {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  }

  // implement function handleCheckboxChange
  function handleCheckboxChange(index: number) {
    setLeftGrid((prevLeftGrid) =>
      prevLeftGrid.map((row, i) => {
        if (i === index) {
          return { ...row, checked: !row.checked };
        }
        return row;
      })
    );
  }

  // implement function handleCheckAll
  function handleCheckAll() {
    setLeftGrid((prevLeftGrid) => prevLeftGrid.map((row) => ({ ...row, checked: true })));
  }

  // implement function handleUncheckAll
  function handleUncheckAll() {
    setLeftGrid((prevLeftGrid) => prevLeftGrid.map((row) => ({ ...row, checked: false })));
  }
  // implement function filterRows
  function filterRows() {
    return leftGrid.filter((row) => {
      return row.occupation.includes(filters.occupation) && row.familyName.includes(filters.familyName);
    });
  }

  // implement function handleClickMove
  // function handleClickMove() {
  //   const filteredRows = filterRows();
  //   setLeftGrid(prevLeftGrid =>
  //     prevLeftGrid.filter(row => !filteredRows.includes(row))
  //   );
  //   setRightGrid(prevRightGrid => [...prevRightGrid, ...filteredRows]);
  // }

  function handleClickMove() {
    // const filteredRows = filterRows();
    const filteredRows: Array<{ occupation: string; familyName: string }> = filterRows();
    setLeftGrid((prevLeftGrid) => prevLeftGrid.filter((row) => !filteredRows.includes(row)));
    setRightGrid((prevRightGrid) => [
      ...prevRightGrid,
      ...filteredRows.map((row) => ({
        occupation: row.occupation,
        familyName: row.familyName,
      })),
    ]);
  }

  // implement function handleSelection
  function handleSelection(e: { target: { value: any } }) {
    const { value } = e.target;
    setSelected(value);
    if (value === 'user') {
      // load users here
    } else if (value === 'loginedStaff') {
      // load logined staff here
    }
  }

  //   function handleCloseButton() {
  //     // close the Dialog here
  //   }

  function handleSave() {
    // save the state of the grids here
    // Save the state of the left and right grids
    // For example, you could make an API call to save the data to a database
    const leftGridData = leftGrid.map((row) => ({
      occupation: row.occupation,
      familyName: row.familyName,
    }));
    const rightGridData = rightGrid.map((row) => ({
      occupation: row.occupation,
      familyName: row.familyName,
    }));
    console.log('Saving left grid data:', leftGridData);
    console.log('Saving right grid data:', rightGridData);

    // Close the Dialog component
    setIsDialogOpen(false);
  }

  // implement function handleDeleteRow
  function handleDeleteRow(index: number) {
    // Delete the row at the specified index from the right grid
    setRightGrid((prevRightGrid) => prevRightGrid.filter((row, i) => i !== index));
  }

  const kakoShussekishaColumns: DataGridColumn<DataGridColumnData>[] = React.useMemo(
    (): DataGridColumn<DataGridColumnData>[] => [
      {
        Header: '所属(職種)',
        accessor: 'shozoku',
        Filter: TextColumnFilter,
        width: 1,
        // minWidth: 220,
        // maxWidth: 400,
      },
      {
        Header: '氏名',
        accessor: 'name',
        Filter: TextColumnFilter,
        width: 1,
        // minWidth: 220,
        // maxWidth: 400,
      },
    ],
    []
  );

  const inyouShussekishaColumns: DataGridColumn<DataGridColumnData>[] = React.useMemo(
    (): DataGridColumn<DataGridColumnData>[] => [
      {
        Header: '所属(職種)',
        accessor: 'shozoku',
        width: 1,
        // minWidth: 220,
        // maxWidth: 400,
      },
      {
        Header: '氏名',
        accessor: 'name',
        width: 1,
        // minWidth: 220,
        // maxWidth: 400,
      },
    ],
    []
  );

  const kakoShussekishaData: DataGridColumnData[] = React.useMemo((): DataGridColumnData[] => {
    return [
      { shozoku: 'B訪問介護事業所', name: 'ヘルパー　太郎' },
      { shozoku: 'C福祉用具貸与事業所', name: '福祉用具　二郎' },
      { shozoku: 'A居宅介護支援事業所', name: 'ケアマネ　花子' },
      { shozoku: 'X病院', name: '医師　進' },
    ];
  }, []);

  const inyouShussekishaData: DataGridColumnData[] = React.useMemo((): DataGridColumnData[] => {
    return [
      { shozoku: 'C福祉用具貸与事業所', name: '福祉用具　二郎' },
      { shozoku: 'X病院', name: '医師　進' },
      { shozoku: 'A居宅介護支援事業所', name: 'ケアマネ　花子' },
    ];
  }, []);

  const kakoShussekishaDataGridValues = useEditableDataGrid<DataGridColumnData>({
    defaultData: kakoShussekishaData,
    rowSelect: 'multiple',
  });
  const inyouShussekishaDataGridValues = useEditableDataGrid<DataGridColumnData>({
    defaultData: inyouShussekishaData,
    draggable: true,
  });

  /** Processing when the close button is clicked DD*/
  const handleClickReturn = () => {
    console.log('close button pressed');
    setIsDialogOpen(false);
  };

  /** Processing when the move button is clicked */
  // const handleClickMove = () => {
  //   console.log('move button pressed');
  // };

  /** Processing when the delete button is clicked */
  // const handleClickDelete = () => {
  //   console.log('press delete button');
  // };

  function handleClickDelete(index: number) {
    console.log('press delete button');
    // Delete the row at the specified index from the right grid
    setRightGrid((prevRightGrid) => prevRightGrid.filter((row, i) => i !== index));
  }

  /** Processing when the OK button is clicked DD*/
  const handleClickDecision = () => {
    console.log('Confirm button pressed');
    setIsDialogOpen(false);
  };

  const DialogActions = (
    <GeneralIconButton icon="register" id="save-button" onClick={handleClickDecision}>
      決定
    </GeneralIconButton>
  );

  return (
    <Dialog open variant="simple" title="出席者引用" onClickReturn={handleClickReturn} fullWidth maxWidth="lg" actions={DialogActions}>
      <Label id="tyushaku">選択利用者・ログインスタッフ単位で過去に入力した出席者から引用が行えます。</Label>
      <Grid container justify="flex-start" direction="row" xs={5}>
        <Grid item>
          <RadioButton
            id="kako-shussekisha-kind"
            name="kakoShussekishaKind"
            radios={[
              { id: 'kako-shussekisha-kind-riyousha', label: '選択利用者', value: '1' },
              { id: 'kako-shussekisha-kind-staff', label: 'ログインスタッフ', value: '2' },
            ]}
            defaultValue="1"
          />
        </Grid>
      </Grid>
      <Grid container justify="flex-start" alignItems="center" direction="row" xs={12}>
        <Grid item xs={5}>
          <DataGrid id="kako-shussekisha-data-grid" columns={kakoShussekishaColumns} {...kakoShussekishaDataGridValues} minHeight={400} />
        </Grid>
        <Grid item xs={1}>
          <Grid container justify="center" direction="row">
            <Grid item>
              <Button id="move-button" variant="outlined" size="large" onClick={handleClickMove}>
                →
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <DataGrid id="inyou-shussekisha-data-grid" columns={inyouShussekishaColumns} onClickDelete={handleClickDelete} {...inyouShussekishaDataGridValues} minHeight={400} />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ShussekishaInyou;
