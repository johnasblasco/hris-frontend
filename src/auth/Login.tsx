import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, Eye, EyeOff, Smile } from 'lucide-react'
import { motion } from "framer-motion"
import { CandidatePortal } from '@/client/CandidatePortal'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import api from '@/utils/axios'

const Login = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showIcon, setShowIcon] = useState(false)
    const [showPointingLeft, setShowPointingLeft] = useState(false)
    const [hovered, setHovered] = useState(false)
    useEffect(() => {
        const handleScroll = () => setShowIcon(window.scrollY > 50)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "F12") setShowLogin(true)
        }
        window.addEventListener('scroll', handleScroll)
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await api.post("/login", {
                login: email,
                password,
            })

            if (res.data.isSuccess) {
                toast.success(res.data.message)

                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
                localStorage.setItem("role", res.data.role)

                navigate("/dashboard")
            } else {
                toast.error(res.data.message)
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed")
        } finally {
            setIsLoading(false)
        }
    }


    if (!showLogin) {
        return <CandidatePortal />
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex flex-col bg-white"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8"
                >
                    <div className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.4 }}
                            className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
                        >
                            <Settings className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-semibold text-slate-900">SNL</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex-1 flex items-center justify-center px-8 pb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full max-w-md space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-2"
                        >
                            <h1 className="text-4xl font-bold text-slate-900">Welcome Back</h1>
                            <p className="text-slate-500">Enter your email and password to access your account</p>
                        </motion.div>

                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-6"
                        >
                            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Email or Username</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="salmaadnan@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                                />
                            </motion.div>

                            <motion.div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                                    <button
                                        type="button"
                                        className="text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        Forgot Your Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Sellora.com"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 pr-10 bg-slate-50 border-slate-200 focus:bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.03 }}>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'Log in'}
                                </Button>
                            </motion.div>
                        </motion.form>

                        <Separator />

                        <div className="text-center">
                            <motion.p
                                onClick={() => setShowPointingLeft(true)}
                                className="text-sm text-slate-600 hover:cursor-pointer"
                                whileHover={{ scale: 1.05 }}>
                                Don't Have An Account?

                            </motion.p>
                            <div className="relative inline-block ml-2">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    className={`relative hover:cursor-pointer text-indigo-600 text-xl hover:text-indigo-700 font-medium ${showPointingLeft ? "animate-hidden" : "hidden"}`}
                                >
                                    Register Now
                                </motion.button>

                                <motion.img
                                    src="/pointing-left.png"
                                    alt="pointer"
                                    className={`absolute -bottom-10  -right-25 size-20 ${showPointingLeft ? "block" : "hidden"}`}
                                    animate={{ x: [0, -15, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <motion.p
                                className="text-sm font-semibold mt-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={showPointingLeft ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                First, you need to create an account to get started. <Smile className=' ml-2 inline' />
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="p-8 flex items-center justify-between text-xs text-slate-400"
                >
                    <span>©{new Date().getFullYear()} My Company. All Rights Reserved.</span>
                    <button className="hover:text-slate-600">Privacy Policy</button>
                </motion.div>
            </motion.div>

            {/* Right Side */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="hidden lg:flex flex-1 bg-indigo-600 items-center justify-center p-16 relative overflow-hidden"
            >
                <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 max-w-xl space-y-8"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-4xl font-bold text-white leading-tight"
                    >
                        Effortlessly manage your team and operations.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-indigo-100 text-lg"
                    >
                        Log in to access your CRM dashboard and manage your team efficiently.
                    </motion.p>

                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 }}
                        src="/samplebg.png"
                        alt="Dashboard Preview"
                        className="relative rounded-2xl shadow-2xl w-full"
                    />
                </motion.div>

                {showIcon && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        onClick={() => setShowPointingLeft(true)}
                        className="absolute bottom-0 right-0 z-[100] group"
                    >
                        <motion.img
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            transition={{ duration: 0.3 }}
                            src="icon1.png"
                            alt=""
                            className="size-72 hover:cursor-pointer"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        />

                        {hovered && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute -top-12 right-10 bg-background text-indigo-700 font-extrabold text-lg px-4 py-2 rounded-full shadow-lg border-4 border-indigo-600 animate-bounce"
                            >
                                Click me!
                            </motion.span>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default Login
