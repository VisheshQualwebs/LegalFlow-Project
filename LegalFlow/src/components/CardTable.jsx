const CaseTable = ({ cases = [] }) => {

    return (

        <div className="bg-white rounded-xl shadow">

            <div className="border-b p-5">

                <h2 className="text-xl font-semibold">
                    Recent Cases
                </h2>

            </div>

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-gray-100">

                        <th className="text-left p-4">
                            Title
                        </th>

                        <th className="text-left p-4">
                            Case Type
                        </th>

                        <th className="text-left p-4">
                            Client
                        </th>

                        <th className="text-left p-4">
                            Lawyer
                        </th>

                        <th className="text-left p-4">
                            Status
                        </th>

                        <th className="text-left p-4">
                            Hearing Date
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        cases.length > 0 ? (

                            cases.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4">

                                        {item.title}

                                    </td>

                                    <td className="p-4">

                                        {item.caseType}

                                    </td>

                                    <td className="p-4">

                                        {item.client?.fullName || "-"}

                                    </td>

                                    <td className="p-4">

                                        {item.lawyer?.fullName || "Not Assigned"}

                                    </td>

                                    <td className="p-4">

                                        <span
                                            className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize"
                                        >

                                            {item.status}

                                        </span>

                                    </td>

                                    <td className="p-4">

                                        {item.hearingDate || "-"}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="text-center p-10"
                                >

                                    No Cases Found

                                </td>

                            </tr>

                        )
                    }

                </tbody>

            </table>

        </div>

    );

};

export default CaseTable;