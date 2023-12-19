import Paper from "@mui/material/Paper";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const Table = ({ data, columns, search }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const backgroundColor =
    theme.palette.mode === "dark"
      ? theme.palette.primary.main
      : theme.palette.primary.main;

  const hoverColor =
    theme.palette.mode === "dark"
      ? theme.palette.primary.main
      : theme.palette.primary.main;

  return (
    <Paper sx={{ width: "100%", overflow: "hiden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <MUITable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                return (
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={item.id}
                    sx={{ "&:hover": { backgroundColor: hoverColor } }}
                  >
                    {columns.map((column) => {
                      const value = item[column.id];
                      return (
                        <TableCell key={column.id} align="center">
                          {column.format ? column.format(value, item) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </MUITable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Table;
