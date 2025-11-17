export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-sm p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}
