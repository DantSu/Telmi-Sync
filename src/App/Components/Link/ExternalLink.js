const {ipcRenderer} = window.require('electron')

function ExternalLink ({href, className, children}) {
  return <a href={href}
            onClick={(e) => {
              e.preventDefault()
              ipcRenderer.send('new-window', href)
            }}
            className={className}
            target="_blank"
            rel="noreferrer">{children}</a>
}

export default ExternalLink
