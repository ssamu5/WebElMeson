export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin pages don't show the public Navbar/Footer (handled by root layout wrapping)
  // We override with a minimal layout
  return (
    <div className="min-h-screen bg-dark">
      {children}
    </div>
  );
}
