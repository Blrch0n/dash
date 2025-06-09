import Navigation from "../../components/Navigation";

export default function ValidationLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <section
        className="w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url(/lock.jpg)" }}
      >
        {children}
      </section>
    </div>
  );
}
