
export async function loadMeetingJSON() {
    // fetch meeting data from db
    try{
        const res = await fetch(`/private/selectTime`, {
            method: 'GET',
        });
        const data = await res.json();
        const midData = data.mid;
        const eventData = data.event_json;
        return { midData, eventData };
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
        const midData = data.mid;
        const userData = data.username;
        const prefData = data.pref_json;
        return { midData, userData, prefData};
    } 
    catch (err) {
        return { error: err.message };
    }
    return {};
}