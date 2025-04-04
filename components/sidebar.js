import { initMetaWallet } from './metawallet.js';

// Create and initialize the sidebar with three buttons
export function initSidebar(callbacks = {}) {
    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    
    // Create three buttons: Metamask, Gmail, 1inch
    const buttonData = [
        { id: 'metamask-button', text: 'Metamask', color: '#F6851B' },
        { id: 'gmail-button', text: 'Gmail', color: '#EA4335' },
        { id: 'oneinch-button', text: '1inch', color: '#1B314F' }
    ];
    
    buttonData.forEach(data => {
        const button = document.createElement('button');
        button.id = data.id;
        button.textContent = data.text;
        button.style.backgroundColor = data.color;
        button.style.color = (data.id === 'oneinch-button') ? '#FFFFFF' : '#333333'; // White text for dark background
        
        button.addEventListener('click', () => {
            console.log(`${data.text} button clicked`);
            // Call the appropriate callback if it exists
            if (callbacks[data.id]) {
                callbacks[data.id]();
            }
        });
        sidebar.appendChild(button);
    });
    
    // Append sidebar to the document body
    document.body.appendChild(sidebar);
    
    // Add Google Font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Quicksand:wght@400;700&display=swap';
    document.head.appendChild(fontLink);
    
    // Add CSS directly to ensure it's applied
    const style = document.createElement('style');
    style.textContent = `
        #sidebar {
            position: fixed;
            top: 20px;
            right: 20px;
            width: auto;
            height: auto;
            min-width: 120px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-family: 'Nunito', sans-serif;
        }
        
        #sidebar button {
            display: block;
            width: 100%;
            padding: 10px 15px;
            margin-bottom: 8px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Nunito', sans-serif;
            font-weight: 700;
            transition: transform 0.2s, box-shadow 0.2s;
            text-align: center;
            white-space: nowrap;
        }
        
        #sidebar button:last-child {
            margin-bottom: 0;
        }
        
        #sidebar button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        #sidebar button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Make buttons draggable
    const buttons = document.querySelectorAll('#sidebar button');
    buttons.forEach(button => {
        button.setAttribute('draggable', 'true');
        
        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', button.id);
            console.log('Dragging button:', button.id);
        });
    });

    // Add click handler for metamask button
    const metamaskButton = document.getElementById('metamask-button');
    if (metamaskButton) {
        metamaskButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Metamask button clicked, creating draggable icon");
            
            // Remove any existing draggable icon
            const existingIcon = document.getElementById('draggable-metamask-icon');
            if (existingIcon && existingIcon.parentNode) {
                existingIcon.parentNode.removeChild(existingIcon);
            }

            // Create a draggable icon
            const icon = document.createElement('img');
            icon.src = '/icon/metamask.png';
            icon.id = 'draggable-metamask-icon';
            icon.style.position = 'fixed'; // Use fixed instead of absolute
            icon.style.left = `${e.clientX - 25}px`; // Center icon on cursor
            icon.style.top = `${e.clientY - 25}px`;
            icon.style.width = '50px';
            icon.style.height = '50px';
            icon.style.cursor = 'grab';
            icon.style.zIndex = '2000';
            icon.style.pointerEvents = 'auto'; // Make it interactive immediately
            
            // Add the icon to the body
            document.body.appendChild(icon);
            console.log("Icon created and added to body", icon);
            
            // Make the icon draggable
            let isDragging = false;
            let offsetX, offsetY;
            
            icon.addEventListener('mousedown', (mouseDownEvent) => {
                isDragging = true;
                offsetX = mouseDownEvent.clientX - parseInt(icon.style.left);
                offsetY = mouseDownEvent.clientY - parseInt(icon.style.top);
                icon.style.cursor = 'grabbing';
                
                // Prevent default to avoid text selection during drag
                mouseDownEvent.preventDefault();
            });
            
            document.addEventListener('mousemove', (mouseMoveEvent) => {
                if (!isDragging) return;
                
                icon.style.left = `${mouseMoveEvent.clientX - offsetX}px`;
                icon.style.top = `${mouseMoveEvent.clientY - offsetY}px`;
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    icon.style.cursor = 'grab';
                }
            });
            
            // Call the original callback
            if (callbacks && callbacks['metamask-button']) {
                callbacks['metamask-button']();
            }
        });
    } else {
        console.error("Metamask button not found in the DOM");
    }

    return sidebar;
}
