import { Link } from "react-router";

type HeaderProp = {
	name: string
	ret?: any
}

export default function Header({ name, ret }: HeaderProp) {
	return <header className='text-fujiWhite pl-5 pr-5 p-3 bg-sumiInk4 text-3xl rounded-b-2xl flex h-fit justify-between'>
		<h1> {name} </h1>
		{
			ret !== undefined ? <Link className='' to='/'> Home </Link> : <div />
		}
	</header>;
}
