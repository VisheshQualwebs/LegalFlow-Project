import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTables from "../components/DataTables";
import MessageModal from "../components/MessageModal";
import useAuth from "../hooks/useAuth";
import caseService from "../services/caseService";
import socket from "../utils/socket";

const getBadgeColor = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "assigned":
            return "bg-blue-100 text-blue-700";
        case "in_progress":
            return "bg-indigo-100 text-indigo-700";
        case "completed":
            return "bg-green-100 text-green-700";
        case "closed":
            return "bg-gray-200 text-gray-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

function ViewCase() {
    const [status, setStatus] = useState("all");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [deleteCaseId, setDeleteCaseId] = useState(null);
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const loadMoreRef = useRef(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        dir: "asc",
    })

    const [searchParams] = useSearchParams();
    const initialPage = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const columns = useMemo(() => {
        const baseColumns = [
            { label: "Case" }, { label: "Client" }, { label: "Lawyer" }, { label: "Status", className: "text-center" }
        ]
        if (user?.role === "admin" || user?.role === "client") {
            baseColumns.push({ label: "Action" });
        }
        return baseColumns;
    }, [user?.role]);

    const { data, isLoading: loading, isError, isFetchingNextPage, fetchNextPage, hasNextPage, } = useInfiniteQuery({
        queryKey: ["cases", status, initialPage, limit],
        queryFn: async ({ pageParam }) => {
            const params = {
                page: pageParam,
                limit,
            }
            if (status !== "all") {
                params.status = status
            };
            const response = await caseService.list(params);
            return response;
        },
        initialPageParam: initialPage,
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        }
    });

    const cases = data?.pages.flatMap((page) => page.data || []) || [];

    const sortedCases = useMemo(() => {
        if (!sortConfig.key) {
            return cases;
        }

        return [...cases].sort((a, b) => {
            let valueA, valueB;
            switch (sortConfig.key) {
                case "title":
                    valueA = a.title || "";
                    valueB = b.title || "";
                    break;

                case "client":
                    valueA = a.client?.fullName || "";
                    valueB = b.client?.fullName || "";
                    break;

                case "lawyer":
                    valueA = a.lawyer?.fullName || "";
                    valueB = b.lawyer?.fullName || "";
                    break;

                case "status":
                    valueA = a.status || "";
                    valueB = b.status || "";
                    break;

                default: return 0;
            }

            const comp = String(valueA).localeCompare(
                String(valueB),
                undefined,
                { sensitivity: "base" }
            )
            return sortConfig.dir === "asc" ? comp : -comp;
        });
    }, [cases, sortConfig]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, {
            rootMargin: "200px",
        });
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => {
            observer.disconnect();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    useEffect(() => {
        if (!cases.length) return;
        cases.forEach((item) => {
            socket.emit("joinCase", item.id)
        });
        const handleCaseUpdate = (updatedCase) => {
            console.log("Real time case update received:", updatedCase);
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            });
        };
        socket.on("case:updated", handleCaseUpdate);
        return () => {
            cases.forEach((item) => {
                socket.emit("leaveCase", item.id)
            });
            socket.off("case:updated", handleCaseUpdate);
        };
    }, [cases, queryClient]);

    const deletMutation = useMutation({
        mutationFn: (id) => caseService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cases"],
            })
            setDeleteCaseId(null);
            setMessage("Case deleted successfully");
            setMessageType("success");
        },
        onError: () => {
            setMessage("Failed to delete case");
            setMessageType("error");
            setDeleteCaseId(null);
        }
    })

    const handleDelete = async (id) => {
        setDeleteCaseId(id);
        setMessage("Are you sure you want to delete this case?");
        setMessageType("confirm");
    }

    const handleConfirmDelete = () => {
        if (!deleteCaseId) return;
        deletMutation.mutate(deleteCaseId);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Cases</h1>
                    <p className="text-gray-500 mt-1">View all legal cases.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" >
                        <option value="all">All Cases</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select value={sortConfig.key} onChange={(e) => {
                        setSortConfig({ key: e.target.value, dir: "asc" })
                    }} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="">Sort By</option>
                        <option value="title">Case</option>
                        <option value="status">Status</option>
                        {user?.role !== "client" &&
                            <option value="client">Client</option>
                        }
                        {user?.role !== "client" && user?.role !== "lawyer" &&
                            <option value="lawyer">Lawyer</option>
                        }
                    </select>

                    <select value={sortConfig.dir} onChange={(e) => {
                        setSortConfig((prev) => ({
                            ...prev,
                            dir: e.target.value,
                        }));
                    }} disabled={!sortConfig.key} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="asc">A-Z</option>
                        <option value="desc">Z-A</option>
                    </select>
                </div>
            </div>
            <DataTables name="view-cases-page" loading={loading} columns={columns} isEmpty={cases.length === 0} emptyMessage="No Case Found!!">
                {sortedCases.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                            <div className="font-semibold">
                                {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                                {item.caseType}
                            </div>
                        </td>

                        <td className="p-4">
                            {item.client?.fullName}
                        </td>

                        <td className="p-4">
                            {item.lawyer?.fullName || (
                                <span className="text-red-500">Not Assigned</span>
                            )}
                        </td>

                        <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(item.status || "unknown")}`}>
                                {(item.status || "unknown").replaceAll("_", " ")}
                            </span>
                        </td>

                        {(user?.role === "admin" || user?.role === "client") && (
                            <td className="p-4">
                                <button onClick={() => handleDelete(item.id)} disabled={deletMutation.isPending}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                    {deletMutation.isPending && deleteCaseId === item.id ? "Deleting..." : "Delete"}
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                <tr>
                    <td colSpan={columns.length} className="text-center p-6">
                        <div ref={loadMoreRef}>
                            {isFetchingNextPage && (
                                <span className="text-gray-500">Loading more cases...</span>
                            )}
                            {!hasNextPage &&
                                cases.length > 0 && (
                                    <span className="text-gray-400">No more cases</span>
                                )}
                        </div>
                    </td>
                </tr>
            </DataTables>
            {message && (<MessageModal message={message} type={messageType}
                onClose={() => { setMessage(""); setDeleteCaseId(null) }}
                onConfirm={handleConfirmDelete} confirmText="Delete" />)}
        </div>
    );
}

export default ViewCase;