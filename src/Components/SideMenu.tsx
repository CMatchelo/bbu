import { Link } from "react-router-dom";

const MenuLink = ({goTo, text}: {goTo: string, text: string}) => {
  return (
    <Link 
      className="py-2 px-6 text-text1 hover:text-text2"
      to={goTo}>
        {text}
      </Link>
  )
}

export const SideMenu = () => {
  return (
    <div className="flex flex-col 
    bg-primary-1 bg-cardbg 
    h-full pt-10
    items-start">
      <MenuLink goTo="/team" text="Team" />
      <MenuLink goTo="/" text="Practice" />
      <MenuLink goTo="/" text="Medical Center" />
      <MenuLink goTo="/" text="Stats" />

      <MenuLink goTo="/" text="Scout" />
      <MenuLink goTo="/" text="Recruiting Board" />
      <MenuLink goTo="/" text="Commitments" />

      <MenuLink goTo="/" text="Calendar" />
      <MenuLink goTo="/" text="Leagues" />
      <MenuLink goTo="/" text="Champions" />
      <MenuLink goTo="/" text="News" />

      <MenuLink goTo="/" text="Facilities" />
      <MenuLink goTo="/" text="University" />
    </div>
  );
};