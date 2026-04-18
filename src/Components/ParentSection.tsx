export const ParentSecion = ({children}: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col gap-4 px-4 h-full overflow-auto">
      {children}
    </section>
  )
}