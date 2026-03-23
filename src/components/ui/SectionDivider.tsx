export default function SectionDivider() {
  return (
    <div className="mb-16 flex items-center justify-center">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
      <div className="mx-3 h-1.5 w-1.5 rotate-45 rounded-sm bg-primary/40" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}
