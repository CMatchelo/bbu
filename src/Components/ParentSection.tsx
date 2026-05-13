interface ParentSectionProps {
  children: React.ReactNode;
  className?: string;
  classNameInside?: string;
  backgroundImg?: string | null;
}

export const ParentSecion = ({ children, className, classNameInside, backgroundImg }: ParentSectionProps) => {
  backgroundImg = '/practiceBg.png'
  return (
    <section className={`flex flex-col p-4 h-full relative ${className ?? ''}`}>
      {backgroundImg && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImg}')` }}
          />
          <div className="absolute inset-0 bg-mainbgdark/70 backdrop-blur-sm" />
        </>
      )}
      <div className={`${classNameInside ?? ''} ${backgroundImg ? "relative z-10 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden" : "contents"}`}>
        {children}
      </div>
    </section>
  )
}