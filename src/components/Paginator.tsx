interface IProps {
  pageNumber: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  isFetching: boolean;
  isLoading: boolean;
}

const Paginator = ({
  pageNumber,
  totalPages,
  nextPage,
  prevPage,
  isFetching,
  isLoading,
}: IProps) => {
  console.log("isLoading: " + isLoading);
  console.log("isFetching: " + isFetching);
  return (
    <div className="flex items-center mt-6">
      <button
        onClick={prevPage}
        disabled={pageNumber === 1 || isFetching || isLoading}
        className={`flex items-center px-4 py-2 rounded-l-md ${
          pageNumber === 1
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        <span className="mr-2">←</span>
        Prev
      </button>
      <p className="text-2xl font-mono mx-4">
        {pageNumber} of {totalPages}
      </p>
      <button
        onClick={nextPage}
        disabled={pageNumber === totalPages || isFetching || isLoading}
        className={`flex items-center px-4 py-2 rounded-r-md ${
          pageNumber === totalPages
            ? "bg-indigo-400 text-gray-300 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-500"
        }`}
      >
        Next
        <span className="ml-2">→</span>
      </button>
    </div>
  );
};

export default Paginator;
