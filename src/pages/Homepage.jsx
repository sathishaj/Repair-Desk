import Customercard from "../components/Customercard"
import Jobcardstatus from "../components/Jobcardstatus"


function Homepage (){

    
    return(
        <>
        <div className="bg-[#E9E9E9] h-dvh p-5 flex flex-col gap-2 " >
          <Customercard/>
          <Jobcardstatus/>
        </div>
          
        </>
    )
}
export default Homepage
