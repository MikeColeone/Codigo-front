import { useState } from "react";
import { AuthInput } from "../ui/AuthInput";
import { AuthButton } from "../ui/AuthButton";

interface Props {
  switchMode: () => void;
}

export default function LoginForm({ switchMode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      console.log("Logged in", { email, password });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        <div className="space-y-1">
            <AuthInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            }
            />
            <div className="flex justify-end">
                <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                    Forgot password?
                </button>
            </div>
        </div>
      </div>

      <div className="pt-2">
        <AuthButton type="submit" isLoading={isLoading}>
          Sign In
        </AuthButton>
      </div>

      <div className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={switchMode}
          className="font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
        >
          Sign up now
        </button>
      </div>
    </form>
  );
}
