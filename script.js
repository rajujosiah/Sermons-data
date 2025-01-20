let jsonData = { meetings: [] };

// Fetch JSON
fetch('https://raw.githubusercontent.com/rajujosiah/Sermons-data/refs/heads/main/sermons.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        populateDropdown();
        updateJsonOutput();
    })
    .catch(err => console.error('Error fetching JSON:', err));

// Populate dropdown
function populateDropdown() {
    const dropdown = document.getElementById('eventDropdown');
    dropdown.innerHTML = '<option value="">-- Select an Event --</option>';
    jsonData.meetings.forEach((event, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = event.title;
        dropdown.appendChild(option);
    });
}

// Display videos
function displayEventVideos() {
    const selectedIndex = document.getElementById('eventDropdown').value;
    const videoGrid = document.getElementById('videoGrid');
    videoGrid.innerHTML = '';

    if (selectedIndex === '') return;

    const selectedEvent = jsonData.meetings[selectedIndex];
    selectedEvent.videos.forEach((video, videoIndex) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="${video.thumbnailUrl}" alt="${video.title}">
            <input type="text" value="${video.title}" onchange="editVideo(${selectedIndex}, ${videoIndex}, 'title', this.value)">
            <input type="text" value="${video.thumbnailUrl}" onchange="editVideo(${selectedIndex}, ${videoIndex}, 'thumbnailUrl', this.value)">
            <input type="text" value="${video.videoUrl}" onchange="editVideo(${selectedIndex}, ${videoIndex}, 'videoUrl', this.value)">
        `;
        videoGrid.appendChild(card);
    });
}

// Add new event
function addEvent() {
    const title = document.getElementById('newEventTitle').value;
    const thumbnail = document.getElementById('newEventThumbnail').value;
    const description = document.getElementById('newEventDescription').value;

    if (!title || !thumbnail) {
        alert('Title and Thumbnail are required.');
        return;
    }

    jsonData.meetings.push({ title, description, imageUrl: thumbnail, videos: [] });
    populateDropdown();
    updateJsonOutput();
    toggleAddEventForm(); // Hide form after adding
}

// Add new video
function addVideoToEvent() {
    const selectedIndex = document.getElementById('eventDropdown').value;
    if (selectedIndex === '') {
        alert('Please select an event.');
        return;
    }

    const title = document.getElementById('videoTitle').value;
    const thumbnail = document.getElementById('videoThumbnail').value;
    const url = document.getElementById('videoUrl').value;

    if (!title || !thumbnail || !url) {
        alert('All fields are required.');
        return;
    }

    jsonData.meetings[selectedIndex].videos.push({ title, thumbnailUrl: thumbnail, videoUrl: url });
    displayEventVideos();
    updateJsonOutput();
    toggleAddVideoForm(); // Hide form after adding
}

// Edit video
function editVideo(eventIndex, videoIndex, field, value) {
    jsonData.meetings[eventIndex].videos[videoIndex][field] = value;
    updateJsonOutput();
}

// Toggle add event form
function toggleAddEventForm() {
    const form = document.getElementById('addEventForm');
    form.classList.toggle('hidden');
}

// Toggle add video form
function toggleAddVideoForm() {
    const form = document.getElementById('addVideoForm');
    form.classList.toggle('hidden');
}

// Update JSON output
function updateJsonOutput() {
    document.getElementById('jsonOutput').textContent = JSON.stringify(jsonData, null, 2);
}

// Copy JSON
function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
        .then(() => alert('JSON copied to clipboard!'))
        .catch(err => console.error('Failed to copy JSON:', err));
}
