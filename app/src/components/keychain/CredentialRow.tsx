import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";
import type { Credential } from "../../stores/keychain";
import { Globe, Copy, Trash2 } from "lucide-react";

interface CredentialRowProps {
  credential: Credential;
  onDelete: (id: string) => void;
}

export function CredentialRow({ credential, onDelete }: CredentialRowProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(credential.password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={spring}
      className={cn(
        "group flex items-center gap-3 px-4 py-3 rounded-lg",
        "hover:bg-elevated transition-colors",
      )}
    >
      <Globe className="w-4 h-4 text-muted shrink-0" />

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-sm text-primary truncate">{credential.domain}</span>
        <span className="text-xs text-muted truncate">{credential.username}</span>
      </div>

      <span className="text-sm text-muted tracking-widest select-none">••••••••</span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={handleCopy}
          className={cn(
            "h-7 px-2.5 rounded-md text-xs font-medium",
            "bg-elevated text-secondary border border-border-subtle",
            "hover:border-accent hover:text-accent transition-colors cursor-pointer",
            "flex items-center gap-1.5",
          )}
        >
          <Copy className="w-3 h-3" />
          Copy
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => onDelete(credential.id)}
          className={cn(
            "h-7 px-2.5 rounded-md text-xs font-medium",
            "text-muted hover:text-error hover:bg-error/10",
            "transition-colors cursor-pointer",
            "flex items-center gap-1.5",
          )}
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}
