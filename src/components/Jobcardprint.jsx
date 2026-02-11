


const Jobcardprint = () => {
  const jobCard = {
    shopName: "Mobile Repair Desk",
    shopAddress: "Pudukkottai, Tamil Nadu",
    phone: "87541 47095",

    jobId: "JOB-1023",
    date: new Date().toLocaleDateString(),

    customerName: "Ramesh Kumar",
    customerPhone: "9876543210",

    brand: "Redmi",
    model: "Note 10",
    imei: "123456789012345",

    problems: ["Display not working", "Battery draining fast"],

    estimatedCost: 2500,
    technician: "Sathish",
    remarks: "Water damage suspected",
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-4 bg-gray-100 min-h-screen print:bg-white">
      {/* Print Button */}
      <div className="mb-4 text-right print:hidden">
        <button
          onClick={handlePrint}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Print Job Card
        </button>
      </div>

      {/* Job Card */}
      <div className="mx-auto max-w-[210mm] bg-white border border-gray-300 p-6 text-sm text-gray-800">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold uppercase">
            {jobCard.shopName}
          </h1>
          <p>{jobCard.shopAddress}</p>
          <p className="font-medium">📞 {jobCard.phone}</p>
        </div>

        <hr className="my-4 border-gray-400" />

        {/* Job Info */}
        <div className="flex justify-between mb-3">
          <p><span className="font-semibold">Job ID:</span> {jobCard.jobId}</p>
          <p><span className="font-semibold">Date:</span> {jobCard.date}</p>
        </div>

        {/* Customer Details */}
        <section className="mb-4">
          <h2 className="font-semibold text-base border-b mb-2">
            Customer Details
          </h2>
          <p><span className="font-medium">Name:</span> {jobCard.customerName}</p>
          <p><span className="font-medium">Phone:</span> {jobCard.customerPhone}</p>
        </section>

        {/* Mobile Details */}
        <section className="mb-4">
          <h2 className="font-semibold text-base border-b mb-2">
            Mobile Details
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <p><span className="font-medium">Brand:</span> {jobCard.brand}</p>
            <p><span className="font-medium">Model:</span> {jobCard.model}</p>
            <p className="col-span-2">
              <span className="font-medium">IMEI:</span> {jobCard.imei}
            </p>
          </div>
        </section>

        {/* Problems */}
        <section className="mb-4">
          <h2 className="font-semibold text-base border-b mb-2">
            Reported Problems
          </h2>
          <ul className="list-disc ml-5">
            {jobCard.problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Repair Info */}
        <section className="mb-4">
          <h2 className="font-semibold text-base border-b mb-2">
            Repair Information
          </h2>
          <p><span className="font-medium">Estimated Cost:</span> ₹{jobCard.estimatedCost}</p>
          <p><span className="font-medium">Technician:</span> {jobCard.technician}</p>
          <p><span className="font-medium">Remarks:</span> {jobCard.remarks}</p>
        </section>

        <hr className="my-6 border-gray-400" />

        {/* Signatures */}
        <div className="flex justify-between mt-10">
          <div className="text-center">
            <div className="w-48 border-b border-gray-500 mb-2"></div>
            <p className="text-xs">Customer Signature</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-gray-500 mb-2"></div>
            <p className="text-xs">Authorized Signature</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 text-gray-500">
          Thank you for choosing our service 🙏
        </p>
      </div>
    </div>
  );
};

export default Jobcardprint;
