export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-xl w-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-20 h-20 mx-auto mb-8 opacity-80"
        >
          <path
            fillRule="evenodd"
            d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z"
            clipRule="evenodd"
          />
        </svg>

        <h1 className="text-4xl font-bold mb-5 leading-tight">
          404 - Page Not Found
        </h1>

        <p className="text-lg mb-10 opacity-70 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="px-8 py-3 text-base font-semibold rounded-lg border-none cursor-pointer bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
        >
          Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
