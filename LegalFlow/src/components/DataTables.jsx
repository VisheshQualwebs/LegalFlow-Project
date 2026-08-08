import { Skeleton } from "boneyard-js/react"
import { memo } from "react"

const DataTables = memo(({name, loading, columns, children, isEmpty = false, emptyMessage = "No Data Found"}) => {
  return (
    <Skeleton name={name} loading={loading} color="#e5e5e5" darkColor="#444444" animate="shimmer" shimmerColor="#eeeeee" darkShimmerColor="#555555">
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
});

export default DataTables
