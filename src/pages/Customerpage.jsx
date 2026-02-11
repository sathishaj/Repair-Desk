
import Customercreateform from "../Froms/Customercreateform"
import { Avatar, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material"
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db } from "../Firebaseconfig"
import { useEffect, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import Customerupdateform from "../Froms/Customerupdateform"
import addcustomerimage from "../assets/addcustomerimage.svg"



function Customerpage() {

  const [customerlist, setCustomerlist] = useState([])
  const [page, setPage] = useState(0)
  const [rowperpage, setRowperpage] = useState(5)

  const handlechangepage = (event, newpage) => {
    setPage(newpage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowperpage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "customers"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomerlist(list);
    });

    return () => unsub();
  }, []);

  const deletecustomer = async (id) => {

    try {
      await deleteDoc(doc(db, "customers", id))
      console.log("Customer deleted:", id);
    } catch (error) {
      console.error("customer is not deleted :", error)
    }
  }

  console.log(customerlist)

  return (<>
    <div className="p-5 min-h-screen bg-[#E9E9E9] flex flex-col gap-10 ">

      <div className=" flex justify-between" >
        <div className="text-xl font-bold text-gray-700 " >Customers</div>
        <Customercreateform />
      </div>

      {customerlist.length === 0 ? (

        <div className="w-[100%] flex justify-center  " >
          <img src={addcustomerimage} alt="" className="w-[100px] h-[100px] " />
        </div>
      ) : (
        <div className="w-[100%]  flex justify-center " >
          <TableContainer component={Paper} sx={{ width: 1200 }} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="!font-bold" >Customer Name</TableCell>
                  <TableCell className="!font-bold" >Phone Number</TableCell>
                  <TableCell className="!font-bold" >Edit</TableCell>
                  <TableCell className="!font-bold">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  customerlist
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.customername}</TableCell>
                        <TableCell>{customer.phonenumber}</TableCell>
                        <TableCell><Customerupdateform customer={customer} /></TableCell>
                        <TableCell><IconButton size="small" onClick={() => deletecustomer(customer.id)} >{<DeleteIcon />}</IconButton></TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>

            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={customerlist.length}
              rowsPerPage={rowperpage}
              page={page}
              onPageChange={handlechangepage}
              onRowsPerPageChange={handleChangeRowsPerPage} />
          </TableContainer>
        </div>
      )}


    </div>

  </>)
}
export default Customerpage