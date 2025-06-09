export default function RootLayout({ children }) {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url(/lock.jpg)" }}
    >
      {children}
    </section>
  );
}
