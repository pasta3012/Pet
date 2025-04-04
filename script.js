// Khởi tạo thông số ban đầu
let pet = {
    name: "Miu Miu",
    closeness: 50,
    happiness: 50,
    energy: 50,
    status: "Đang thức",
    isEating: false
};

let player = {
    name: "Hiếch",
    balance: 1000
};

// Định nghĩa các loại thức ăn
const foods = {
    fish: { emoji: "🐟", price: 10, energy: 15, happiness: 5 },
    meat: { emoji: "🍖", price: 15, energy: 20, happiness: 7 },
    vegetable: { emoji: "🥕", price: 5, energy: 10, happiness: 3 }
};

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
        btn.disabled = player.balance < foods[foodType].price || pet.isEating;
    });
}

// Tương tác với thú cưng (vuốt ve)
function interactWithPet() {
    if (pet.isEating) return;
    
    // Tăng độ hạnh phúc và độ đối
    pet.happiness = Math.min(100, pet.happiness + 5);
    pet.closeness = Math.min(100, pet.closeness + 3);
    
    // Giảm năng lượng
    pet.energy = Math.max(0, pet.energy - 2);
    
    // Kiểm tra trạng thái
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
    if (pet.isEating) return;
    
    const food = foods[foodType];
    if (player.balance < food.price) {
        alert(`Không đủ tiền để mua ${foodType}!`);
        return;
    }
    
    // Trừ tiền
    player.balance -= food.price;
    
    // Đặt trạng thái đang ăn
    pet.isEating = true;
    
    // Hiển thị biểu tượng thức ăn
    const foodDisplay = document.getElementById("food-display");
    foodDisplay.textContent = food.emoji;
    
    // Hiệu ứng ăn
    const petImage = document.getElementById("pet-image");
    petImage.classList.add("eating");
    
    // Cập nhật giao diện
    updateStats();
    
    // Sau khi ăn xong
    setTimeout(() => {
        // Tăng chỉ số
        pet.energy = Math.min(100, pet.energy + food.energy);
        pet.happiness = Math.min(100, pet.happiness + food.happiness);
        
        // Kết thúc trạng thái ăn
        pet.isEating = false;
        foodDisplay.textContent = "";
        petImage.classList.remove("eating");
        
        // Kiểm tra trạng thái
        updatePetStatus();
        
        // Cập nhật giao diện
        updateStats();
    }, 2000); // Thời gian ăn: 2 giây
}

// Cập nhật trạng thái thú cưng
function updatePetStatus() {
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
    pet.happiness = Math.max(0, pet.happiness - 1);
    pet.affection = Math.max(0, pet.closeness - 0.5);
    
    if (pet.status.includes("ngủ")) {
        pet.energy = Math.min(100, pet.energy + 5);
    } else {
        pet.energy = Math.max(0, pet.energy - 1);
    }
    
    updatePetStatus();
    updateStats();
}, 30000); // Mỗi 30 giây

// Khởi chạy ban đầu
updateStats();
