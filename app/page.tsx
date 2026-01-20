"use client";

import { useState, useEffect } from "react";
import { sendPhoneCode, loginAndFetchUID, loginByPasswordAndFetchUID } from "./actions";

// Extracted Components
const Background = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
  </div>
);

const Header = () => (
  <>
    <div className="relative h-32 w-full overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center select-none">
      {/* Technical Grid Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Radial Gradient Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,160,233,0.15),transparent_70%)]"></div>

      <div className="z-10 flex items-center gap-6">
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          title="View on GitHub"
        >
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 fill-current">
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>

        {/* Vertical Separator */}
        <div className="h-10 w-px bg-white/20"></div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,160,233,0.5)]">ENDFIEID</span>
          <span className="text-xs tracking-widest font-medium text-blue-200/80 uppercase">明日方舟: 终末地 UID</span>
        </div>
      </div>
    </div>
    <div className="h-[2px] w-full bg-[#00A0E9] shadow-[0_0_15px_#00A0E9]"></div>
  </>
);

export default function Home() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState<"code" | "password">("code");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      setError("请输入正确的手机号");
      return;
    }
    setError("");
    const res = await sendPhoneCode(phone);
    if (res.success) {
      setCountdown(10);
    } else {
      setError(res.msg || "发送失败");
    }
  };

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      setError("请输入正确的手机号");
      return;
    }

    setLoading(true);
    setError("");

    let res;
    if (loginMode === "code") {
      if (!code || code.length < 6) {
        setError("请输入正确的验证码");
        setLoading(false);
        return;
      }
      res = await loginAndFetchUID(phone, code);
    } else {
      if (!password) {
        setError("请输入正确的密码");
        setLoading(false);
        return;
      }
      res = await loginByPasswordAndFetchUID(phone, password);
    }

    setLoading(false);

    if (res.success && "uid" in res) {
      setUid(res.uid);
    } else {
      setError(res.msg || "登录失败");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-blue-500/30">
      <Background />

      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl animate-in fade-in">
        <Header />

        <div className="bg-white/95 backdrop-blur-sm p-8 space-y-6 pb-6">
          {uid ? (
            <div className="text-center space-y-6 pb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900">查询成功</h2>
                {/* <p className="text-zinc-500 text-sm">欢迎回来，管理员</p> */}
              </div>
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 shadow-inner">
                <p className="text-zinc-500 text-sm mb-2 font-medium">管理员的 UID</p>
                <p className="text-4xl font-mono font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-zinc-900 to-zinc-600">{uid}</p>
              </div>
              <button
                onClick={() => setUid(null)}
                className="w-full py-3.5 bg-black text-white font-bold rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                返回
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* Phone input */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                  />
                </div>

                {/* Input field switching based on loginMode */}
                {loginMode === "code" ? (
                  <div className="relative group flex items-center animate-in fade-in duration-300">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="请输入验证码"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-12 pr-32 py-3.5 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                    />
                    <button
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      className="absolute right-4 text-blue-500 font-bold text-sm hover:text-blue-600 disabled:text-zinc-400 transition-colors"
                    >
                      {countdown > 0 ? `${countdown}s` : "发送验证码"}
                    </button>
                  </div>
                ) : (
                  <div className="relative group flex items-center animate-in fade-in duration-300">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="请输入密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-xs text-center font-medium animate-in fade-in slide-in-from-top-1">{error}</p>}

              {/* Submit button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-4 bg-black text-white font-bold rounded-full hover:bg-zinc-800 disabled:bg-zinc-400 transition-all transform active:scale-[0.98] shadow-lg shadow-black/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "登录"}
              </button>

              {/* Mode Switch Button */}
              <div className="pt-2 text-center pb-4">
                <button
                  onClick={() => setLoginMode(loginMode === "code" ? "password" : "code")}
                  className="text-zinc-500 text-sm font-medium hover:text-blue-500 transition-colors"
                >
                  {loginMode === "code" ? "密码登录" : "验证码登录"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
