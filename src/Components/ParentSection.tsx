export const ParentSecion = ({children, className}: { children: React.ReactNode, className?: string }) => {
  return (
    <section className={`flex flex-col p-4 gap-4 h-full overflow-hidden ${className ? className : ''}`}>
      {children}
    </section>
  )
}