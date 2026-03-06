import { useState } from "react";
import { cn } from "../../lib/cn";
import { Modal } from "../ui/Modal";
import { KeyRound } from "lucide-react";

interface SavePromptProps {
  open: boolean;
  onClose: () => void;
  domain: string;
  username: string;
  onSave: (password: string) => void;
}

export function SavePrompt({
  open,
  onClose,
  domain,
  username,
  onSave,
}: SavePromptProps) {
  const [password, setPassword] = useState("");
  const [usernameValue, setUsernameValue] = useState(username);

  const handleSave = () => {
    if (!password.trim()) return;
    onSave(password);
    setPassword("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Save Credential">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5 text-accent">
          <KeyRound className="w-4 h-4" />
          <span className="text-sm font-medium">
            Save login for {domain}?
          </span>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Domain</span>
          <input
            type="text"
            readOnly
            value={domain}
            className={cn(
              "h-9 px-3 text-sm rounded-lg bg-elevated border border-border-subtle",
              "text-muted cursor-not-allowed",
            )}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Username</span>
          <input
            type="text"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
            className={cn(
              "h-9 px-3 text-sm rounded-lg bg-glass border border-border-subtle",
              "text-primary placeholder:text-muted",
              "focus:border-accent focus:shadow-[0_0_0_3px_var(--glow-soft)]",
              "transition-all duration-200 outline-none",
            )}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={cn(
              "h-9 px-3 text-sm rounded-lg bg-glass border border-border-subtle",
              "text-primary placeholder:text-muted",
              "focus:border-accent focus:shadow-[0_0_0_3px_var(--glow-soft)]",
              "transition-all duration-200 outline-none",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </label>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className={cn(
              "h-9 px-4 text-sm rounded-lg font-medium",
              "text-secondary hover:text-primary hover:bg-elevated",
              "transition-colors cursor-pointer",
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!password.trim()}
            className={cn(
              "h-9 px-4 text-sm rounded-lg font-medium",
              "bg-accent text-base hover:bg-accent-hover",
              "shadow-md hover:shadow-lg hover:shadow-glow-soft",
              "transition-all cursor-pointer",
              "disabled:opacity-40 disabled:pointer-events-none",
            )}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
