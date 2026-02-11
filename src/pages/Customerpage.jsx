import Customercreateform from "../Froms/Customercreateform";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Customerupdateform from "../Froms/Customerupdateform";
import Tableskeleton from "../skeletons/Tableskeleton";

function Customerpage() {
  const [customerlist, setCustomerlist] = useState([]);
  const [page, setPage] = useState(0);
  const [rowperpage, setRowperpage] = useState(5);
  const [isloading, setIsloading] = useState(true);

  // Pagination
  const handlechangepage = (event, newpage) => {
    setPage(newpage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowperpage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 🔥 Firestore Realtime Listener
  useEffect(() => {
    setIsloading(true);

    const unsub = onSnapshot(
      collection(db, "customers"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCustomerlist(list);
        setIsloading(false); // stop loading after data arrives
      },
      (error) => {
        console.error("Error fetching customers:", error);
        setIsloading(false);
      }
    );

    return () => unsub();
  }, []);

  // Delete Customer
  const deletecustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      console.log("Customer deleted:", id);
    } catch (error) {
      console.error("Customer not deleted:", error);
    }
  };

  return (
    <div className="p-5 min-h-screen bg-[#E9E9E9] flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between">
        <div className="text-xl font-bold text-gray-700">
          Customers
        </div>
        <Customercreateform />
      </div>

      {/* 🔥 Loading State */}
      {isloading && customerlist.length === 0 ? (
        <div className="w-full flex justify-center">
          <Tableskeleton />
        </div>
      ) : customerlist.length === 0 ? (
        /* 🔥 Empty State */
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-500 text-xl font-semibold">
            No Customers Found
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Add a new customer to get started
          </p>
        </div>
      ) : (
        /* 🔥 Table */
        <div className="w-full flex justify-center">
          <TableContainer component={Paper} sx={{ width: 1200 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="!font-bold">
                    Customer Name
                  </TableCell>
                  <TableCell className="!font-bold">
                    Phone Number
                  </TableCell>
                  <TableCell className="!font-bold">
                    Edit
                  </TableCell>
                  <TableCell className="!font-bold">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customerlist
                  .slice(
                    page * rowperpage,
                    page * rowperpage + rowperpage
                  )
                  .map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        {customer.customername}
                      </TableCell>
                      <TableCell>
                        {customer.phonenumber}
                      </TableCell>
                      <TableCell>
                        <Customerupdateform customer={customer} />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            deletecustomer(customer.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={customerlist.length}
              rowsPerPage={rowperpage}
              page={page}
              onPageChange={handlechangepage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default Customerpage;
