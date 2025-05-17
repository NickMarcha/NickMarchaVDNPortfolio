import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
      <header className="flex gap-2 bg-yellow-600 text-white justify-between items-center">
          <nav className="flex flex-row items-center">
              <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#8B1A1A" stroke="black" stroke-width="1">
                      <path d="M70,50
             C80,30 60,20 50,25
             C40,20 30,25 20,35
             L10,30 L15,50 L10,70 L20,65
             C30,75 40,80 50,75
             C60,80 80,70 70,50 Z" />
                      <circle cx="60" cy="45" r="5" fill="white" />
                      <circle cx="62" cy="45" r="2" fill="black" />
                      <line x1="40" y1="40" x2="35" y2="30" stroke="black" stroke-width="2" />
                      <line x1="37" y1="43" x2="30" y2="35" stroke="black" stroke-width="2" />
                      <line x1="34" y1="46" x2="27" y2="40" stroke="black" stroke-width="2" />
                  </g>
              </svg>

              <p className="text-2xl font-bold">Nick Marcha Portfolio</p>
          </nav>
      </header>
  )
}
