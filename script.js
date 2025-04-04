// Khởi tạo thông số ban đầu
let pet = {
    name: "Miu Miu",
    affection: 50,
    happiness: 50,
    energy: 50,
    status: "Đang thức"
};

let player = {
    name: "Hiếch",
    balance: 1000
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
}

// Tương tác với thú cưng
function interactWithPet() {
    // Tăng độ hạnh phúc và độ đối
    pet.happiness = Math.min(100, pet.happiness + 5);
    pet.affection = Math.min(100, pet.affection + 3);
    
    // Giảm năng lượng
    pet.energy = Math.max(0, pet.energy - 2);
    
    // Kiểm tra trạng thái
    if (pet.energy < 20) {
        pet.status = "Mệt mỏi";
    } else {
        pet.status = "Đang thức";
    }
    
    // Hiệu ứng khi chạm
    const petImage = document.getElementById("pet-image");
    petImage.style.transform = "scale(1.1)";
    setTimeout(() => {
        petImage.style.transform = "scale(1)";
    }, 200);
    
    updateStats();
}

// Hệ thống tự động giảm các chỉ số theo thời gian
setInterval(() => {
    pet.happiness = Math.max(0, pet.happiness - 1);
    pet.affection = Math.max(0, pet.affection - 0.5);
    
    if (pet.status === "Đang ngủ") {
        pet.energy = Math.min(100, pet.energy + 5);
    } else {
        pet.energy = Math.max(0, pet.energy - 1);
    }
    
    updateStats();
}, 30000); // Mỗi 30 giây

// Khởi chạy ban đầu
updateStats();
