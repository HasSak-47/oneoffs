import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<div className='flex items-center justify-center h-screen w-fir max-w-4/5 m-auto md:ml-4 md:justify-start'>
			<App />
		</div>
	</StrictMode>
)
