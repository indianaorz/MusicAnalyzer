document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.getElementById('song-filter');
    const songCards = Array.from(document.querySelectorAll('.song-card'));
    const renderTimes = Array.from(document.querySelectorAll('[data-timestamp]'));

    if (filterInput) {
        filterInput.addEventListener('input', () => {
            const query = filterInput.value.trim().toLowerCase();
            songCards.forEach(card => {
                const haystack = card.dataset.songName || '';
                card.style.display = !query || haystack.includes(query) ? '' : 'none';
            });
        });
    }

    renderTimes.forEach(node => {
        const seconds = Number(node.dataset.timestamp || 0);
        if (!seconds) {
            return;
        }
        const deltaSeconds = Math.max(0, Math.floor(Date.now() / 1000) - seconds);
        node.textContent = formatRelative(deltaSeconds);
    });
});

function formatRelative(deltaSeconds) {
    if (deltaSeconds < 60) {
        return 'Updated just now';
    }
    if (deltaSeconds < 3600) {
        return `Updated ${Math.floor(deltaSeconds / 60)} min ago`;
    }
    if (deltaSeconds < 86400) {
        return `Updated ${Math.floor(deltaSeconds / 3600)} hr ago`;
    }
    return `Updated ${Math.floor(deltaSeconds / 86400)} day ago`;
}