import React from 'react'
import logo from "../assets/instagram.png";
import text from "../assets/instagram_text.png";

const LeftSectionStartPage = () => {
  return (
     <div className="relative hidden md:flex md:w-1/2 lg:w-2xl items-center justify-center bg-white">
        {/* Instagram Logo */}
        <div className="absolute flex items-center gap-2 h-12 top-6 left-6 z-10">
          <img className="h-full" src={logo} alt="instagram logo" />
          <img className="h-12" src={text} alt="instagram logo" />
        </div>

        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          alt="Instagram style"
          className="object-cover h-full w-full"
        />
      </div>

  )
}

export default LeftSectionStartPage
