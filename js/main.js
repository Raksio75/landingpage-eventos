/**
 * Main Application Script - Enterprise Architecture
 */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openFormBtn');
    const closeBtn = document.getElementById('closeFormBtn');
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');

    if (!modal || !openBtn || !closeBtn) return;

    // Abrir modal
    openBtn.addEventListener('click', () => {
        modal.showModal();
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.close();
    });

    // Cerrar al hacer clic fuera del contenido del modal
    modal.addEventListener('click', (event) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
        if (!isInDialog) {
            modal.close();
        }
    });

    // Envío asíncrono con Fetch API (Sin recargar la página ni alertas feas)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending Request...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                console.log('[Enterprise Log] Form submission successful:', result.message);
                
                // Ocultar formulario y títulos, mostrar mensaje de éxito estilizado
                form.classList.add('hidden');
                modalTitle.textContent = 'Success';
                modalSubtitle.textContent = 'Request processed successfully.';
                successMessage.classList.remove('hidden');
                form.reset();
            } else {
                console.error('[Enterprise Error] Submission error response:', result);
                alert(result.message || 'An error occurred during submission.');
            }
        } catch (error) {
            console.error('[Enterprise Error] Network communication failure:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Botón para reiniciar y enviar otra propuesta
    resetFormBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
        modalTitle.textContent = 'Request Event Proposal';
        modalSubtitle.textContent = 'Direct communication with our production team.';
    });
});