document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu");
  const dropdownMenu = document.querySelector(".display-nav-links");

  // Only initialize menu if elements exist
  if (menuIcon && dropdownMenu) {
    // Initially hide the dropdown
    dropdownMenu.style.display = "none";

    menuIcon.addEventListener("click", function (event) {
      // Toggle dropdown visibility
      if (dropdownMenu.style.display === "none") {
        dropdownMenu.style.display = "block";
      } else {
        dropdownMenu.style.display = "none";
      }

      // Prevent the click from closing the menu immediately
      event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
      if (!dropdownMenu.contains(event.target) && event.target !== menuIcon) {
        dropdownMenu.style.display = "none";
      }
    });
  }
});

// Room controls functionality
document.addEventListener('DOMContentLoaded', function() {
    // Thermostat control - only initialize if element exists
    const thermostatHandle = document.querySelector('.thermostat-handle');
    if (thermostatHandle) {
        const thermostatTemp = document.getElementById('thermostat-temp');
        let isDragging = false;
        let currentRotation = 0;
        let startAngle = 0;

        thermostatHandle.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isDragging = true;
            const rect = thermostatHandle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        }

        function drag(e) {
            if (!isDragging) return;
            
            const rect = thermostatHandle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const rotation = angle - startAngle;
            
            currentRotation += rotation * (180 / Math.PI);
            currentRotation = Math.min(Math.max(currentRotation, -150), 150);
            
            thermostatHandle.style.transform = `rotate(${currentRotation}deg)`;
            
            // Update temperature (18-30°C range)
            const temp = Math.round(24 + (currentRotation / 150) * 6);
            thermostatTemp.textContent = `${temp}°C`;
            
            startAngle = angle;
        }

        function stopDragging() {
            isDragging = false;
        }
    }

    // Light intensity control - only initialize if element exists
    const intensitySlider = document.querySelector('.slider');
    if (intensitySlider) {
        const intensityValue = document.getElementById('intensity-value');
        if (intensityValue) {
            intensitySlider.addEventListener('input', function() {
                intensityValue.textContent = `${this.value}%`;
            });
        }
    }

    // Mode selection - only initialize if elements exist
    const modeList = document.querySelector('.list');
    const arrowUp = document.getElementById('arrow-up');
    const arrowDown = document.getElementById('arrow-down');
    
    if (modeList && arrowUp && arrowDown) {
        let currentPosition = 0;

        arrowUp.addEventListener('click', () => scrollList('up'));
        arrowDown.addEventListener('click', () => scrollList('down'));

        function scrollList(direction) {
            const items = document.querySelectorAll('.list-item');
            if (direction === 'up' && currentPosition > 0) {
                currentPosition--;
            } else if (direction === 'down' && currentPosition < items.length - 1) {
                currentPosition++;
            }
            
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentPosition) {
                    item.classList.add('active');
                }
            });
        }
    }
});
