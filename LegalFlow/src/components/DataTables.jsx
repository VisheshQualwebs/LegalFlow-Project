import { Skeleton } from "boneyard-js/react"

const DataTables = ({name, loading, columns, children, isEmpty = false, emptyMessage = "No Data Found"}) => {
  return (
    <Skeleton name={name} loading={loading}>
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={`p-4 ${column.className || "text-left"}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </Skeleton>
  )
}

export default DataTables
