import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function PageLink(props) {

}
export default function NavBar(props) {
  let selectedPage = props.match.params.id ? props.match.params.id : "home"

  const pages = ["home", "about", "blog"]
  return (
    <nav className="bg-transparent fixed top-0 w-full">
      <div className="container flex items-center justify-start py-4 px-2 mx-auto  capitalize">
        {pages.map((page) => page === selectedPage ?
          <Link to={`/${page}`} className="p-2 text-gray-800 rounded-md  border-8 font-semibold \
         border-blue-500 mx-1.5 sm:mx-6 ">{page}</Link>
          : <Link to={`/${page}`} className="p-2 rounded-md hover:border-blue-300 border-8 font-semibold text-gray-800 border-gray-800 sm:mx-6">{page}</Link>)}
      </div>
    </nav>

  )
}
