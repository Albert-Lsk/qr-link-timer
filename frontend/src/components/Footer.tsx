import { Heart, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            <p className="flex items-center space-x-1">
              <span>© 2024 QR Link Timer. Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by Albert</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Albert-Lsk/qr-link-timer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">源代码</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}