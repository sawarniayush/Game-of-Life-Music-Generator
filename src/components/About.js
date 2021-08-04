import GameOfLife from "./GameOfLife"

function Element(props) {
    if (props.position)
        return (
            <div className="flex flex-row-reverse md:contents">
                <div className="col-start-1 col-end-5 p-4 rounded-md my-4 ml-auto border-gray-800 border-4">
                    <h3 className="font-semibold text-lg text-blue-500 mb-1">Lorem ipsum</h3>
                    <p className="leading-tight text-justify">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi,
                        quaerat?
                    </p>
                </div>
                <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                    <div className="h-full w-6 flex items-center justify-center">
                        <div className="h-full w-1 bg-black pointer-events-none" />
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-blue-500 shadow" />
                </div>
            </div>
        )
}

export default function About() {
    //Read Markdown files 
    return (
        <div className="container  w-full mx-auto h-full">
            <div className="bg-blue-50 bg-opacity-90 ">
                <h1 className="text-center">Ayush Sawarni</h1>
                Hi I am Ayush. asfawef asfwaef asdfawef
                 asfdawef asfdawefawefawf afwef 
                 believe visuals can communicate
                  complex ideas in a simple, easy to understand way (and ideally with a little bit of whimsy!). 
My illustrations have brought humor and clarity to readers on topics such as design, research, professional development, and more. Previous clients include Culture Lab, Designer Fund, Fast Company, and the Conscious Business Program with Fred Kofman. 
I also occasionally take on conference, wedding and custom card projects. For illustration work, get in touch.
            </div>
            <div>

            </div>
        </div>
    )
}