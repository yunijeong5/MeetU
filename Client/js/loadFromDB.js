
export async function loadMeetingJSON() {
    // fetch meeting data from db
    // const response = await fetch(`/readEvent?id=${id}`, {
    const response = await fetch(`/private/selectTime`, {
        method: 'GET',
    });
    const data = await response.json();
    return {};
}

export async function loadUserMeetingJSON() {
    // fetch user meeting data from db, associated with this event
    return {};
}