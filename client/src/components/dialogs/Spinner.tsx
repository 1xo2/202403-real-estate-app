export default function Spinner() {
  return (
      <svg
          className="animate-spin h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
      >
          <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
          ></circle>
          <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0112 4v4a7.946 7.946 0 00-3 1.373V12H2c0 3.309 2.691 6 6 6v-1.627zM12 20a8 8 0 008-8h-4c0 2.22-.89 4.209-2.343 5.657L12 17.343V20z"
          ></path>
      </svg>
  )
}