interface BrowserViewProps {
  url: string;
}

export default function BrowserView({ url }: BrowserViewProps) {
  if (url) {
    return <div id="browser-view" className="flex-1" style={{ background: "var(--bg-base)" }} />;
  }
  return null;
}
