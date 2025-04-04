// Khởi tạo thông số ban đầu
let pet = {
    name: "Miu Miu",
    affection: 50, // Giữ nguyên tên biến để không phải sửa logic
    happiness: 50,
    energy: 50,
    status: "Đang thức",
    isEating: false
};

let player = {
    name: "Hiếch",
    balance: 1000
};

const foods = {
    fish: { emoji: "🐟", price: 10, energy: 15, happiness: 5 },
    meat: { emoji: "🍖", price: 15, energy: 20, happiness: 7 },
    vegetable: { emoji: "🥕", price: 5, energy: 10, happiness: 3 }
};

function updateStats() {
    document.getElementById("pet-name").textContent = pet.name;
    document.getElementById("affection").textContent = pet.affection;
    document.getElementById("happiness").textContent = pet.happiness;
    document.getElementById("energy").textContent = pet.energy;
    document.getElementById("status").textContent = pet.status;
    
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("balance").textContent = player.balance.toLocaleString();
    
    document.querySelectorAll(".food-options button").forEach(btn => {
        const foodType = btn.getAttribute("onclick").split("'")[1];
        btn.disabled = player.balance < foods[foodType].price || pet.isEating;
    });
}

function interactWithPet() {
    if (pet.isEating) return;
    
    pet.happiness = Math.min(100, pet.happiness + 5);
    pet.affection = Math.min(100, pet.affection + 3);
    pet.energy = Math.max(0, pet.energy - 2);
    
    updatePetStatus();
    
    const petImage = document.getElementById("pet-image");
    petImage.style.transform = "scale(1.1)";
    setTimeout(() => {
        petImage.style.transform = "scale(1)";
    }, 200);
    
    updateStats();
}

function feedPet(foodType) {
    if (pet.isEating) return;
    
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

setInterval(() => {
    pet.happiness = Math.max(0, pet.happiness - 1);
    pet.affection = Math.max(0, pet.affection - 0.5);
    
    if (pet.status.includes("ngủ")) {
        pet.energy = Math.min(100, pet.energy + 5);
    } else {
        pet.energy = Math.max(0, pet.energy - 1);
    }
    
    updatePetStatus();
    updateStats();
}, 30000);

updateStats();
