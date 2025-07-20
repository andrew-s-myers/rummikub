// imports
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import axios from 'axios';

// types
export interface User {
    id: number;
    name: string;
    email: string;
}

interface Credentials {
    email: string;
    password: string;
}

interface RegisterData extends Credentials {
    name: string;
    password_confirmation: string;
}

interface AuthContextShape {
    user: User | null;
    token: string | null;
    register: (d: RegisterData) => Promise<void>;
    login: (c: Credentials) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

// context
const AuthContext = createContext<AuthContextShape | undefined>(undefined);

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// attach token automatically
API.interceptors.request.use((cfg) => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export function AuthProvider({ children }: {children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token') || null,
    );

    // fetch user once token exists
    useEffect(() => {
        if (token) refresh().catch(() => logout()); 
    }, []);

    async function register(data: RegisterData) {
        const { data: res } = await API.post('/register', data);
        persist(res.user, res.token);
    }

    async function login(creds: Credentials) {
        const { data: res } = await API.post('/login', creds);
        persist(res.user, res.token);
    }

    async function refresh() {
        const { data } = await API.get<User>('/user');
        setUser(data);
    }

    function persist(u: User, t: string) {
        setUser(u);
        setToken(t);
        localStorage.setItem('token', t);
    }

    async function logout() {
        try {
            await API.post('/logout');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}