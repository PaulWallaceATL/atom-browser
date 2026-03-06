import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
import { slideUp, staggerContainer, staggerItem } from "../../lib/motion";
import { useKeychainStore } from "../../stores/keychain";
import { Shield, Search, Lock, AlertTriangle } from "lucide-react";
import { CredentialRow } from "./CredentialRow";

export function KeychainManager() {
  const credentials = useKeychainStore((s) => s.credentials);
  const removeCredential = useKeychainStore((s) => s.removeCredential);
  const loadCredentials = useKeychainStore((s) => s.loadCredentials);
  const loaded = useKeychainStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) loadCredentials();
  }, [loaded, loadCredentials]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return credentials;
    const q = query.toLowerCase();
    return credentials.filter(
      (c) =>
        c.domain.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q),
    );
  }, [credentials, query]);

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full gap-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Atom Keychain</h2>
          <span
            className={cn(
              "inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-medium",
              "bg-success/10 text-success",
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Secured
          </span>
        </div>
      </div>

      <div
        className={cn(
          "relative flex items-center rounded-lg bg-glass border border-border-subtle",
          "h-9 px-3 text-sm",
          "focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--glow-soft)]",
          "transition-all duration-200",
        )}
      >
        <Search className="w-4 h-4 text-muted mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search credentials…"
          className="w-full h-full bg-transparent placeholder:text-muted"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20 text-muted">
          <Lock className="w-10 h-10 opacity-40" />
          <p className="text-sm">No saved credentials</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-0.5 overflow-y-auto flex-1"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((cred) => (
              <motion.div key={cred.id} variants={staggerItem}>
                <CredentialRow
                  credential={cred}
                  onDelete={removeCredential}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div
        className={cn(
          "flex items-start gap-2.5 px-3.5 py-3 rounded-lg",
          "bg-warning/5 border border-warning/20",
        )}
      >
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-warning/80 leading-relaxed">
          Credentials are stored locally. Secure storage will be available in a
          future update.
        </p>
      </div>
    </motion.div>
  );
}
