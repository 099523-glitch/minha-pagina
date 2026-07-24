document.addEventListener("DOMContentLoaded", () => {
    // Configura o gerador de números inteligentes
    const setupSmartPick = () => {
        const cards = document.querySelectorAll(".lottery-card");
        
        cards.forEach((card) => {
            const btnGenerator = card.querySelector(".btn-generator");
            if (!btnGenerator) return;
            
            btnGenerator.addEventListener("click", () => {
                const lotteryId = card.getAttribute("data-id");
                const hasSpecial = card.getAttribute("data-special") === "true";
                const balls = card.querySelectorAll(".ball-normal");
                const specialBall = card.querySelector(".ball-special");
                const refreshIcon = btnGenerator.querySelector(".icon-refresh");
                
                // 1. Inicia animações
                if (refreshIcon) {
                    refreshIcon.classList.add("animate-spin");
                }
                
                balls.forEach((ball, i) => {
                    // Micro-animação de bounce com atraso progressivo
                    setTimeout(() => {
                        ball.classList.add("animate-bounce");
                    }, i * 80);
                });
                
                if (specialBall) {
                    setTimeout(() => {
                        specialBall.classList.add("animate-bounce");
                    }, balls.length * 80);
                }
                
                // Desabilita temporariamente o botão
                btnGenerator.disabled = true;
                btnGenerator.style.opacity = "0.7";
                
                // 2. Processa a geração dos números após um pequeno delay (750ms)
                setTimeout(() => {
                    // Gerador de números da loteria (exclusivos e ordenados)
                    const generateUniqueNumbers = (count, max) => {
                        const nums = new Set();
                        while (nums.size < count) {
                            nums.add(Math.floor(Math.random() * max) + 1);
                        }
                        return Array.from(nums).sort((a, b) => a - b);
                    };
                    
                    const newNums = generateUniqueNumbers(balls.length, 69);
                    
                    // Atualiza os valores no DOM de forma suave
                    balls.forEach((ball, i) => {
                        const numSpan = ball.querySelector(".ball-number");
                        if (numSpan) {
                            numSpan.textContent = newNums[i];
                        }
                        ball.classList.remove("animate-bounce");
                    });
                    
                    // Atualiza número especial se existir
                    if (specialBall) {
                        const specialNumSpan = specialBall.querySelector(".ball-number");
                        if (specialNumSpan) {
                            specialNumSpan.textContent = Math.floor(Math.random() * 26) + 1;
                        }
                        specialBall.classList.remove("animate-bounce");
                    }
                    
                    // Finaliza animações e reabilita o botão
                    if (refreshIcon) {
                        refreshIcon.classList.remove("animate-spin");
                    }
                    btnGenerator.disabled = false;
                    btnGenerator.style.opacity = "1";
                    
                }, 750);
            });
        });
    };
    
    setupSmartPick();
});
