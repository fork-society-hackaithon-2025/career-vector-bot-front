import {api} from "@/common/api";
import {useQuery} from "@tanstack/react-query";

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => api.users.list(),
    });
}