import { createContext, useContext } from 'react'
import api from "../api/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const queryClient = useQueryClient();

    const fetchUser = async () => {
        try {
            const res = await api.get("/user/profile")
            return res.data.data || null
        } catch (error) {
            return null
        }
    }

    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["authUser"],
        queryFn: fetchUser,
        retry: false,
        staleTime: Infinity,
    })

    const logout = async () => {
        try {
            await api.post("/auth/logout");

            queryClient.setQueryData(["authUser"], null);
            queryClient.clear();
            // queryClient.invalidateQueries(["authUser"]);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    }

    return (
        <>
            <AuthContext.Provider value={{ user, isLoading, isError, refetch, logout }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
export default AuthProvider;