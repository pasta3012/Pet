// Khởi tạo thông số ban đầu
let pet = {
    name: "Miu Miu",
    affection: 50,
    happiness: 50,
    energy: 50,
    status: "Đang thức",
    isEating: false,
    isSleeping: false
};

let player = {
    name: "Huy",
    balance: 1000
};

let gameTime = {
    hours: 12,
    minutes: 0,
    day: 1,
    speed: 1 // 1 = 1 phút thật = 1 phút game
};

const foods = {
    fish: { emoji: "🐟", price: 10, energy: 15, happiness: 5 },
    meat: { emoji: "🍖", price: 15, energy: 20, happiness: 7 },
    vegetable: { emoji: "🥕", price: 5, energy: 10, happiness: 3 }
};

// Hàm cập nhật thời gian game
function updateGameTime() {
    gameTime.minutes += gameTime.speed;
    
    if (gameTime.minutes >= 60) {
        gameTime.minutes = 0;
        gameTime.hours++;
        
        if (gameTime.hours >= 24) {
            gameTime.hours = 0;
            gameTime.day++;
        }
    }
    
    // Cập nhật giao diện
    const ampm = gameTime.hours >= 12 ? "PM" : "AM";
    const displayHours = gameTime.hours % 12 || 12;
    document.getElementById("game-time").textContent = 
        `${displayHours}:${gameTime.minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById("game-date").textContent = `Ngày ${gameTime.day}`;
    
    // Kiểm tra chế độ ban đêm
    checkNightMode();
    
    // Tự động gọi lại sau 1 phút thật
    setTimeout(updateGameTime, 60000 / gameTime.speed);
}

// Kiểm tra chế độ ban đêm
function checkNightMode() {
    const isNight = gameTime.hours >= 22 || gameTime.hours < 6;
    
    if (isNight) {
        document.body.classList.add("night-mode");
        if (!pet.isSleeping && Math.random() > 0.3) {
            putPetToSleep();
        }
    } else {
        document.body.classList.remove("night-mode");
        if (pet.isSleeping && gameTime.hours === 8) {
            wakePetUp();
        }
    }
}

// Cho thú cưng ngủ
function putPetToSleep() {
    pet.isSleeping = true;
    pet.status = "Đang ngủ";
    document.getElementById("pet-image").classList.add("sleeping");
    document.getElementById("sleep-effect").classList.add("show-sleep");
    document.getElementById("sleep-text").textContent = "Đánh thức";
    updateStats();
}

// Đánh thức thú cưng
function wakePetUp() {
    pet.isSleeping = false;
    pet.status = "Đang thức";
    document.getElementById("pet-image").classList.remove("sleeping");
    document.getElementById("sleep-effect").classList.remove("show-sleep");
    document.getElementById("sleep-text").textContent = "Cho ngủ";
    updateStats();
}

// Toggle trạng thái ngủ
function toggleSleep() {
    if (pet.isSleeping) {
        wakePetUp();
    } else {
        putPetToSleep();
    }
}

// Cập nhật thông tin lên giao diện
function updateStats() {
    document.getElementById("pet-name").textContent = pet.name;
    document.getElementById("affection").textContent = pet.affection;
    document.getElementById("happiness").textContent = pet.happiness;
    document.getElementById("energy").textContent = pet.energy;
    document.getElementById("status").textContent = pet.status;
    
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("balance").textContent = player.balance.toLocaleString();
    
    // Cập nhật trạng thái nút thức ăn
    document.querySelectorAll(".food-options button").forEach(btn => {
        const foodType = btn.getAttribute("onclick").split("'")[1];
        btn.disabled = player.balance < foods[foodType].price || pet.isEating || pet.isSleeping;
    });
    
    // Cập nhật nút ngủ
    document.getElementById("sleep-button").disabled = pet.isEating;
}

// Tương tác với thú cưng (vuốt ve)
function interactWithPet() {
    if (pet.isEating || pet.isSleeping) return;
    
    pet.happiness = Math.min(100, pet.happiness + 5);
    pet.affection = Math.min(100, pet.affection + 3);
    pet.energy = Math.max(0, pet.energy - 2);
    
    updatePetStatus();
    
    // Hiệu ứng khi chạm
    const petImage = document.getElementById("pet-image");
    petImage.style.transform = "scale(1.1)";
    setTimeout(() => {
        petImage.style.transform = "scale(1)";
    }, 200);
    
    updateStats();
}

// Cho thú cưng ăn
function feedPet(foodType) {
    if (pet.isEating || pet.isSleeping) return;
    
    const food = foods[foodType];
    if (player.balance < food.price) {
        alert(`Không đủ tiền để mua ${foodType}!`);
        return;
    }
    
    player.balance -= food.price;
    pet.isEating = true;
    
    const foodDisplay = document.getElementById("food-display");
    foodDisplay.textContent = food.emoji;
    
    const petImage = document.getElementById("pet-image");
    petImage.classList.add("eating");
    
    updateStats();
    
    setTimeout(() => {
        pet.energy = Math.min(100, pet.energy + food.energy);
        pet.happiness = Math.min(100, pet.happiness + food.happiness);
        pet.isEating = false;
        foodDisplay.textContent = "";
        petImage.classList.remove("eating");
        
        updatePetStatus();
        updateStats();
    }, 2000);
}

// Cập nhật trạng thái thú cưng
function updatePetStatus() {
    if (pet.isSleeping) return;
    
    if (pet.energy < 10) {
        pet.status = "Kiệt sức";
    } else if (pet.energy < 30) {
        pet.status = "Mệt mỏi";
    } else if (pet.happiness > 80) {
        pet.status = "Rất vui";
    } else {
        pet.status = "Đang thức";
    }
}

// Hệ thống tự động giảm các chỉ số theo thời gian
setInterval(() => {
    if (pet.isSleeping) {
        // Phục hồi nhanh hơn khi ngủ
        pet.energy = Math.min(100, pet.energy + 3);
    } else {
        pet.happiness = Math.max(0, pet.happiness - 0.8);
        pet.affection = Math.max(0, pet.affection - 0.3);
        pet.energy = Math.max(0, pet.energy - 0.5);
    }
    
    updatePetStatus();
    updateStats();
}, 30000);

// Khởi chạy ban đầu
updateStats();
updateGameTime();
