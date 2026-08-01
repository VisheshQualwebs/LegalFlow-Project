import { Link } from "react-router-dom";

const QuickActions = ({ actions }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
                Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action) => (
                    <Link key={action.title} to={action.url} className="border rounded-lg p-4 hover:bg-gray-50" >
                        <p className="font-semibold">
                            {action.title}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            {action.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;