import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

function Tableskeleton() {
  return (
    <TableContainer component={Paper} sx={{ width: 1200 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>

          </TableRow>
        </TableHead>

        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              <TableCell> 
                <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              <TableCell>
                <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
              </TableCell>

              <TableCell>
                <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Tableskeleton;
