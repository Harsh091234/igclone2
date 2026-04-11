import { useDispatch } from "react-redux";
import { useGetMeQuery, useLazyGetCsrfTokenQuery } from "./services/authApi";
import type { AppDispatch } from "./store/store";
import { useAppSelector } from "./utils/hooks";
import { useEffect } from "react";
import { setCsrfToken } from "./redux/csrfSlice";
import { connectSocket, disconnectSocket } from "./utils/socket";
import { setConnected, setOnlineUsers } from "./redux/socketSlice";
import CenterLoading from "./components/CenterLoading";
import AppRoutes from "./routes/AppRoutes";
import { setUser } from "./redux/authSlice";
import { Navigate } from "react-router-dom";

const App = () => {
  const { data, isLoading, error} = useGetMeQuery(undefined);
 

  const dispatch = useDispatch<AppDispatch>();
  const { onlineUsers, connected } = useAppSelector((state) => state.socket);
  const [getCsrfToken] = useLazyGetCsrfTokenQuery();
const user = useAppSelector((state) => state.auth.user);




useEffect(() => {
  if (isLoading) return;

  if (error) {
    dispatch(setUser(null)); 
  } else {
    dispatch(setUser(data?.user ?? null)); 
  }
}, [isLoading, error, data]);


  // CSRF
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const res = await getCsrfToken(undefined).unwrap();
        dispatch(setCsrfToken(res.csrfToken));
      } catch {
        console.log("CSRF fetch failed");
      }
    };
    fetchCsrf();
  }, []);

  // Socket
  useEffect(() => {
    if (!user?._id) return;

    const socket = connectSocket(user._id);

    socket.on("connect", () => {
      dispatch(setConnected(true));
    });

    socket.on("getOnlineUsers", (users) => {
      const map: Record<string, number> = {};
      users.forEach((u: any) => (map[u.userId] = u.lastActive));
      dispatch(setOnlineUsers(map));
    });

    socket.on("disconnect", () => {
      dispatch(setConnected(false));
    });

    return () => {
      socket.off("getOnlineUsers");
      disconnectSocket();
    };
  }, [user?._id]);

  if (isLoading) {
  return <CenterLoading />;
}




 

  return <AppRoutes />;
};

export default App;