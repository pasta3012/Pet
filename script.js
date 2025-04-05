// Khởi tạo game state
const gameState = {
    pet: {
        name: "Miu Miu",
        affection: 50,
        happiness: 50,
        energy: 50,
        status: "Đang thức",
        isSleeping: false,
        isEating: false
    },
    player: {
        name: "Hiếch",
        balance: 1000
    },
    darkMode: false
};

// Định nghĩa các loại thức ăn
const foods = {
    fish: {
        emoji: "🐟",
        price: 10,
        energy: 15,
        happiness: 5,
        effect: function() {
            gameState.pet.energy = Math.min(100, gameState.pet.energy + this.energy);
            gameState.pet.happiness = Math.min(100, gameState.pet.happiness + this.happiness);
            showNotification(`Thú cưng ăn cá 🐟 (+${this.energy} năng lượng, +${this.happiness} hạnh phúc)`);
        }
    },
    meat: {
        emoji: "🍖",
        price: 15,
        energy: 20,
        happiness: 7,
        effect: function() {
            gameState.pet.energy = Math.min(100, gameState.pet.energy + this.energy);
            gameState.pet.happiness = Math.min(100, gameState.pet.happiness + this.happiness);
            showNotification(`Thú cưng ăn thịt 🍖 (+${this.energy} năng lượng, +${this.happiness} hạnh phúc)`);
        }
    },
    vegetable: {
        emoji: "🥕",
        price: 5,
        energy: 10,
        happiness: 3,
        effect: function() {
            gameState.pet.energy = Math.min(100, gameState.pet.energy + this.energy);
            gameState.pet.happiness = Math.min(100, gameState.pet.happiness + this.happiness);
            showNotification(`Thú cưng ăn rau 🥕 (+${this.energy} năng lượng, +${this.happiness} hạnh phúc)`);
        }
    }
};

// Khởi tạo game
function initGame() {
    loadFromLocalStorage();
    setupEventListeners();
    setupFoodItems();
    updateUI();
    startGameLoop();
}

// Load từ localStorage
function loadFromLocalStorage() {
    const savedGame = localStorage.getItem('petGame');
    if (savedGame) {
        const parsed = JSON.parse(savedGame);
        Object.assign(gameState, parsed);
    }
    
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Lưu game
function saveGame() {
    localStorage.setItem('petGame', JSON.stringify(gameState));
}

// Thiết lập event listeners
function setupEventListeners() {
    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    
    // Pet interaction
    document.getElementById('pet-image').addEventListener('click', interactWithPet);
}

// Thiết lập sự kiện cho các món ăn
function setupFoodItems() {
    const shopItems = document.querySelectorAll('.shop-item');
    
    shopItems.forEach(item => {
        item.addEventListener('click', function() {
            const foodType = this.getAttribute('data-food');
            feedPet(foodType);
        });
    });
}

// Game loop
function startGameLoop() {
    setInterval(() => {
        if (gameState.pet.isSleeping) {
            gameState.pet.energy = Math.min(100, gameState.pet.energy + 3);
        } else {
            gameState.pet.happiness = Math.max(0, gameState.pet.happiness - 0.5);
            gameState.pet.affection = Math.max(0, gameState.pet.affection - 0.3);
            gameState.pet.energy = Math.max(0, gameState.pet.energy - 0.5);
        }
        
        updatePetStatus();
        updateUI();
        saveGame();
    }, 30000); // Mỗi 30 giây
}

// Cập nhật UI
function updateUI() {
    // Thanh tiến trình
    document.getElementById('affection-bar').style.width = `${gameState.pet.affection}%`;
    document.getElementById('happiness-bar').style.width = `${gameState.pet.happiness}%`;
    document.getElementById('energy-bar').style.width = `${gameState.pet.energy}%`;
    
    // Text
    document.getElementById('affection-text').textContent = `${gameState.pet.affection}%`;
    document.getElementById('happiness-text').textContent = `${gameState.pet.happiness}%`;
    document.getElementById('energy-text').textContent = `${gameState.pet.energy}%`;
    
    // Thông tin
    document.getElementById('pet-name').textContent = gameState.pet.name;
    document.getElementById('pet-status').textContent = gameState.pet.status;
    document.getElementById('player-name').textContent = gameState.player.name;
    document.getElementById('balance').textContent = gameState.player.balance.toLocaleString();
    
    // Nút ngủ
    document.getElementById('sleep-btn').innerHTML = 
        `<i class="fas fa-bed"></i> ${gameState.pet.isSleeping ? "Đánh thức" : "Cho ngủ"}`;
    
    // Cập nhật biểu tượng cảm xúc
    updateMoodIcon();
}

// Cập nhật biểu tượng cảm xúc
function updateMoodIcon() {
    const moodIcon = document.getElementById('pet-mood');
    if (gameState.pet.isSleeping) {
        moodIcon.textContent = "😴";
        return;
    }
    
    if (gameState.pet.happiness < 30) {
        moodIcon.textContent = "😞";
    } else if (gameState.pet.happiness > 80) {
        moodIcon.textContent = "😁";
    } else {
        moodIcon.textContent = "😊";
    }
}

// Tương tác với thú cưng
function interactWithPet() {
    if (gameState.pet.isSleeping || gameState.pet.isEating) return;
    
    gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 5);
    gameState.pet.affection = Math.min(100, gameState.pet.affection + 3);
    gameState.pet.energy = Math.max(0, gameState.pet.energy - 2);
    
    // Hiệu ứng
    const petImage = document.getElementById('pet-image');
    petImage.style.transform = "scale(1.1)";
    setTimeout(() => {
        petImage.style.transform = "scale(1)";
    }, 200);
    
    showNotification("Thú cưng rất thích được vuốt ve!");
    updatePetStatus();
    updateUI();
}

// Cho thú cưng ăn
function feedPet(foodType) {
    if (gameState.pet.isSleeping) {
        showNotification("Thú cưng đang ngủ, không thể cho ăn!", "error");
        return;
    }
    
    if (gameState.pet.isEating) {
        showNotification("Thú cưng đang ăn rồi!", "error");
        return;
    }
    
    const food = foods[foodType];
    
    if (gameState.player.balance < food.price) {
        showNotification(`Không đủ tiền mua ${foodType}!`, "error");
        return;
    }
    
    // Đánh dấu đang ăn
    gameState.pet.isEating = true;
    gameState.player.balance -= food.price;
    
    // Hiệu ứng cho ăn
    const animation = document.getElementById('feeding-animation');
    animation.textContent = food.emoji;
    animation.style.opacity = 1;
    animation.classList.add('feeding-effect');
    
    // Hiệu ứng active cho item
    const activeItem = document.querySelector(`.shop-item[data-food="${foodType}"]`);
    activeItem.classList.add('active');
    
    // Hiệu ứng pet
    const petImage = document.getElementById('pet-image');
    petImage.classList.add('eating');
    
    // Áp dụng hiệu ứng thức ăn sau 0.5s
    setTimeout(() => {
        food.effect();
    }, 500);
    
    // Kết thúc hiệu ứng sau 1s
    setTimeout(() => {
        animation.style.opacity = 0;
        animation.classList.remove('feeding-effect');
        activeItem.classList.remove('active');
        petImage.classList.remove('eating');
        gameState.pet.isEating = false;
        
        updatePetStatus();
        updateUI();
        saveGame();
    }, 1000);
}

// Cho thú cưng ngủ
function toggleSleep() {
    if (gameState.pet.isEating) {
        showNotification("Đợi thú cưng ăn xong đã!", "error");
        return;
    }
    
    gameState.pet.isSleeping = !gameState.pet.isSleeping;
    gameState.pet.status = gameState.pet.isSleeping ? "Đang ngủ" : "Đang thức";
    
    const petImage = document.getElementById('pet-image');
    if (gameState.pet.isSleeping) {
        petImage.classList.add('sleeping');
        showNotification("Thú cưng đã đi ngủ");
    } else {
        petImage.classList.remove('sleeping');
        showNotification("Thú cưng đã thức dậy");
    }
    
    updateMoodIcon();
    updateUI();
    saveGame();
}

// Cập nhật trạng thái thú cưng
function updatePetStatus() {
    if (gameState.pet.isSleeping) return;
    
    if (gameState.pet.energy < 10) {
        gameState.pet.status = "Kiệt sức";
    } else if (gameState.pet.energy < 30) {
        gameState.pet.status = "Mệt mỏi";
    } else if (gameState.pet.happiness > 80) {
        gameState.pet.status = "Rất vui";
    } else {
        gameState.pet.status = "Đang thức";
    }
}

// Hiển thị thông báo
function showNotification(message, type = "success") {
    const notificationArea = document.getElementById('notification-area');
    const notification = document.createElement('div');
    notification.className = `notification ${type === "error" ? "error" : ""}`;
    notification.textContent = message;
    
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Chế độ tối
function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    document.body.classList.toggle('dark-mode');
    
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    darkModeBtn.innerHTML = gameState.darkMode 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    
    saveGame();
}

// Khởi chạy game
document.addEventListener('DOMContentLoaded', initGame);