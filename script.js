document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('survey-form');
    const successMessage = document.getElementById('success-message');

    if (surveyForm) {
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = surveyForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            // 1. Sanitización básica y validación
            const formData = new FormData(surveyForm);
            const rawData = Object.fromEntries(formData.entries());

            // Validar que las puntuaciones sean números entre 1 y 5
            const scores = ['nivel_satisfaccion', 'claridad_contenido', 'aplicabilidad_practica'];
            for (const key of scores) {
                const value = parseInt(rawData[key]);
                if (isNaN(value) || value < 1 || value > 5) {
                    alert('Por favor, completa todas las valoraciones.');
                    return;
                }
            }

            // 2. Preparar payload limpio
            const cleanData = {
                IDEstudiante: rawData.id_estudiante.trim().substring(0, 50), // Limitar longitud
                NivelSatisfaccion: parseInt(rawData.nivel_satisfaccion),
                ClaridadContenido: parseInt(rawData.claridad_contenido),
                AplicabilidadPractica: parseInt(rawData.aplicabilidad_practica),
                ComentariosAdicionales: rawData.comentarios_adicionales.trim().substring(0, 1000),
                timestamp: new Date().toISOString()
            };

            submitBtn.innerHTML = 'Procesando...';
            submitBtn.disabled = true;

            // 3. ENVIAR AL WEBHOOK DE PRODUCCIÓN
            const N8N_WEBHOOK_URL = 'https://n8n.srv960136.hstgr.cloud/webhook/320f43fc-c583-4674-bef6-8eba29bebbdc';

            fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Sent-By': 'Antigravity-Survey-App' // Header simple de validación
                },
                body: JSON.stringify(cleanData)
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error en el servidor de procesado');
                    showSuccess();
                })
                .catch(error => {
                    console.error('Error de seguridad/red:', error);
                    alert('No se pudo enviar la encuesta. Por favor, inténtalo más tarde.');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    function showSuccess() {
        surveyForm.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        surveyForm.style.opacity = '0';
        surveyForm.style.transform = 'translateY(20px)';

        const header = document.querySelector('.header');
        header.style.transition = 'opacity 0.5s ease-out';
        header.style.opacity = '0';

        setTimeout(() => {
            surveyForm.classList.add('hidden');
            header.classList.add('hidden');
            successMessage.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }

    // Efectos visuales de las labels
    document.querySelectorAll('.rating-scale label').forEach(label => {
        label.addEventListener('click', () => {
            label.style.transform = 'scale(1.1)';
            setTimeout(() => label.style.transform = '', 200);
        });
    });
});
