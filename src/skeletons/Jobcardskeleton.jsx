
function Jobcardskeleton({ count = 6 }) {
  return (
    <div className="flex flex-wrap gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-[360px] bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-200"></div>

              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Phone Info */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-gray-200"></div>

            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-3 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Issues */}
          <div className="mt-4">
            <div className="h-3 w-12 bg-gray-200 rounded mb-2"></div>

            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
              <div className="h-6 w-14 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Jobcardskeleton;
