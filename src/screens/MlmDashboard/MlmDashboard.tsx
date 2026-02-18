import MonthlyCommissionPayout from "../../component/MlmDashboard/MonthlyCommissionPayout"
import TopMlmCards from "../../component/MlmDashboard/TopMlmCards"
import TopEarner from "../LocalCompanies/TopEarner"



function MlmDashboard() {
  return (
    <>
      <div className='bg-white rounded-xl p-5'>

        <div className='mb-5'>
          <h1 className="text-lg font-semibold">MLM Dashboard</h1>
        </div>

        {/* Cards Section - Full Width */}
        <div className='mb-6'>
          <TopMlmCards />
        </div>

          {/* Top Earner */}
          <div className="mt-10">
            <TopEarner />
          </div>


          <div className="mt-10">
            <MonthlyCommissionPayout />
          </div>




        </div>
    </>
  )
}

export default MlmDashboard