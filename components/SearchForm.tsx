import React, { ChangeEvent } from 'react'

type SearchFormProps = {
    handleAddress: (event: ChangeEvent<HTMLInputElement>) => void
    fetchAbi: () => void
}

const SearchForm = ({ handleAddress, fetchAbi }: SearchFormProps): JSX.Element => {
    return (
        <div className="flex items-center p-4 mx-4">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative w-full">
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Contract"
            onChange={handleAddress}
          />
          <button
            type="submit"
            onClick={fetchAbi}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    )
}

export default SearchForm