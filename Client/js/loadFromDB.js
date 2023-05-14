
export async function loadMeetingJSON() {
    // fetch meeting data from db
    try{
        const res = await fetch(`/private/selectTime`, {
            method: 'GET',
        });
        const data = await res.json();
        return { data };
    } 
    catch (err) {
        return { error: err.message };
    }
}

export async function loadUserMeetingJSON() {
    // fetch user meeting data from db, associated with this event
    return {};
}