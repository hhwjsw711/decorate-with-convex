import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";
import { toast } from "sonner";

export function PasswordReset({
  onBackToSignIn,
}: {
  onBackToSignIn?: () => void;
}) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  return step === "forgot" ? (
    <form
      key={"forgot"}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = (formData.get("email") as string).toLowerCase();
        formData.set("email", email);
        signIn("password", formData)
          .then(() => {
            toast.success("请查收邮件获取验证码。");
            setStep({ email });
          })
          .catch((error) => {
            console.error(error);
            const errorMessage = error.message || `${error}`;
            toast.error(`发送验证码失败：${errorMessage}`);
          });
      }}
      className="flex flex-col gap-4"
    >
      <label htmlFor="reset-email" className="text-sm font-medium">
        邮箱地址
      </label>
      <InputField
        id="reset-email"
        name="email"
        placeholder="邮箱"
        type="text"
        autoComplete="email"
      />
      <input name="flow" type="hidden" value="reset" />
      <Button type="submit" variant="primary">
        发送验证码
      </Button>
      {onBackToSignIn && (
        <Button
          variant="link"
          type="button"
          onClick={onBackToSignIn}
          className="self-end text-xs"
        >
          返回登录
        </Button>
      )}
    </form>
  ) : (
    <form
      key={"reset"}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
      className="flex flex-col gap-4"
    >
      <label htmlFor="reset-code" className="text-sm font-medium">
        验证码（来自我们发送的邮件）
      </label>
      <InputField
        id="reset-code"
        name="code"
        placeholder="验证码"
        type="text"
      />
      <label htmlFor="reset-password" className="text-sm font-medium">
        新密码
      </label>
      <InputField
        id="reset-password"
        name="newPassword"
        placeholder="新密码"
        type="password"
        autoComplete="new-password"
      />
      <input name="email" value={step.email} type="hidden" />
      <input name="flow" value="reset-verification" type="hidden" />
      <Button type="submit" variant="primary">
        继续
      </Button>
      <Button type="button" variant="link" onClick={() => setStep("forgot")}>
        取消
      </Button>
      {onBackToSignIn && (
        <Button
          variant="link"
          type="button"
          onClick={onBackToSignIn}
          className="self-end text-xs"
        >
          返回登录
        </Button>
      )}
    </form>
  );
}
