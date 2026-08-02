import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function SystemStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const setOffline = () => setOnline(false);
    const setBackOnline = () => setOnline(true);
    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setBackOnline);
    return () => {
      window.removeEventListener('offline', setOffline);
      window.removeEventListener('online', setBackOnline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="sticky top-0 z-50 bg-warning text-warning-foreground px-4 py-2 text-xs font-medium flex items-center justify-center gap-2">
      <WifiOff className="w-3.5 h-3.5" />
      Conexão instável. A v3 mantém os dados localmente e sincronizaria quando voltasse ao Firebase.
    </div>
  );
}
