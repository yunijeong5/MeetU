
export async function loadMeetingJSON() {
    // fetch meeting data from db
    try{
        const res = await fetch(`/private/selectTime`, {
            method: 'GET',
        });
        const data = await res.json();
        const eventData = data.event_json;
        return { eventData };
    } 
    catch (err) {
        return { error: err.message };
    }
}

export async function loadUserMeetingJSON() {
    // fetch user meeting data from db, associated with this event
    try{
        const res = await fetch(`/private/selectTime`, {
            method: 'GET',
        });
        const data = await res.json();
        const prefData = data.pref_json;
        return { prefData };
    } 
    catch (err) {
        return { error: err.message };
    }
    return {};
}