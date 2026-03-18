export const ParentSecion = ({children}: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col items-start gap-4 px-4">
      {children}
    </section>
  )
}