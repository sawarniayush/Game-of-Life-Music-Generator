import { Link, useParams } from 'react-router-dom'

function PageLink(props) {

}
export default function NavBar(props) {
  let selectedPage = props.match.params.id ? props.match.params.id : "home"

  const pages = ["home", "about", "blog"]
  return (
    <nav className="bg-transparent fixed top-0 w-full">
      <div className="container flex items-center py-4 px-2 justify-center md:justify-start space-x-8  capitalize">
        {pages.map((page) => page === selectedPage ?
          <Link to={`/${page}`} className="p-2 text-gray-800 rounded-md  border-8 font-semibold \
         border-blue-500  bg-opacity-60  bg-white">{page}</Link>
          : <Link to={`/${page}`} className="p-2 rounded-md hover:border-blue-300 border-8 font-semibold \
          text-gray-800 border-gray-800 bg-opacity-60 bg-white ">{page}</Link>)}
      </div>
    </nav>

  )
}
