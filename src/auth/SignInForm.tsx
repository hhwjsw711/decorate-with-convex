import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";

export function SignInForm({
  onForgotPassword,
}: {
  onForgotPassword?: () => void;
}) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((_error) => {
            const toastTitle =
              flow === "signIn"
                ? "登录失败，您是否想要注册？"
                : "注册失败，您是否想要登录？";
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <InputField
          type="email"
          name="email"
          placeholder="邮箱"
          required
          autoComplete="email"
        />
        <InputField
          type="password"
          name="password"
          placeholder="密码"
          required
          autoComplete="current-password"
        />
        {flow === "signIn" && onForgotPassword && (
          <Button
            variant="link"
            type="button"
            className="self-end text-xs"
            onClick={onForgotPassword}
          >
            忘记密码？
          </Button>
        )}
        <Button variant="primary" fullWidth type="submit" disabled={submitting}>
          {flow === "signIn" ? "登录" : "注册"}
        </Button>
        <div className="text-center text-sm text-slate-600">
          <span>{flow === "signIn" ? "还没有账号？" : "已有账号？"}</span>
          <Button
            variant="link"
            type="button"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "去注册" : "去登录"}
          </Button>
        </div>
      </form>
      {/*
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow" />
        <span className="mx-4 text-slate-400 ">or</span>
        <hr className="my-4 grow" />
      </div>
      <Button
        variant="secondary"
        fullWidth
        onClick={() => void signIn("anonymous")}
      >
        Sign in anonymously
      </Button> */}
    </div>
  );
}
