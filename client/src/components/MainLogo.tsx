import logo from "../assets/instagram.png"

interface MainLogoProps{
    className?: string;
}

const MainLogo = ({className="h-13 w-13"}: MainLogoProps) => {
  return (
   <img src={logo} className={className}/>
  )
}

export default MainLogo
