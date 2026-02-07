document.addEventListener('DOMContentLoaded', function() {
    const juliaAvatar = document.querySelector('.Julia.avatar');
    const modal = document.getElementById('action-modal');
    const closeBtn = document.querySelector('.close-modal');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    
    juliaAvatar.addEventListener('click', function(e) {
        e.stopPropagation();
        openModal('Julia');
        createHearts(this);
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Obsługa przycisków akcji
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            document.querySelectorAll('.avatar').forEach(avatar => {
                avatar.style.display = "none";
            });
            
    
            createHearts(modal);

            if(action === "hand")
            {
                document.querySelector(".reaction").style.display = "block";
                document.getElementById("reactionImg").src = "img/holdHand.png";
                document.getElementById("reactionImg").style.width = "200px";
                setTimeout(function() {
                    document.querySelector(".reaction").style.display = "none";
                    document.getElementById("reactionImg").src = "";


                    document.querySelectorAll('.avatar').forEach(avatar => {
                        avatar.style.display = "block";
                    });
                }, 2000);
            }
            if(action === "kiss")
            {
                document.querySelector(".reaction").style.display = "block";
                document.getElementById("reactionImg").src = "img/kiss.png";
                document.getElementById("reactionImg").style.width = "150px";
                setTimeout(function() {
                    document.querySelector(".reaction").style.display = "none";
                    document.getElementById("reactionImg").src = "";


                    document.querySelectorAll('.avatar').forEach(avatar => {
                        avatar.style.display = "block";
                    });
                }, 2000);
            }
            if(action === "hug")
            {
                document.querySelector(".reaction").style.display = "block";
                document.getElementById("reactionImg").src = "img/hug.png";
                document.getElementById("reactionImg").style.width = "150px";
                setTimeout(function() {
                    document.querySelector(".reaction").style.display = "none";
                    document.getElementById("reactionImg").src = "";


                    document.querySelectorAll('.avatar').forEach(avatar => {
                        avatar.style.display = "block";
                    });
                }, 2000);
            }
            if(action === "kind")
            {
                document.querySelectorAll('.avatar').forEach(avatar => {
                    avatar.style.display = "block";
                });

                document.getElementById("juliaImgAvatar").src = "img/happyJulia.png"

                setTimeout(function() {
                    document.getElementById("juliaImgAvatar").src = "img/JuliaNormal.png"
                }, 2000);
            }
            

            closeModal();
        });
    });
    
    // Funkcje pomocnicze
    function openModal(characterName) {
        modal.style.display = 'flex';
        document.querySelector('.modal-header h2').textContent = characterName;
    
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }

    function createHearts(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.classList.add('heart-effect');
            heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
            heart.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(heart);
            
            
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }
    }
    
    

});