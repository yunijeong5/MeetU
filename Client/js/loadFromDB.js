
export async function loadMeetingJSON() {
    // fetch meeting data from db
    try{
        const res = await fetch(`/readEvent`, {
            method: 'GET',
        });
        const data = await res.json();
        const mid = data.mid;
        const event = data.event_json;
        return { mid, event };
    } 
    catch (err) {
        return { error: err.message };
    }
}

export async function loadUserMeetingJSON() {
    // // fetch user meeting data from db, associated with this event
    try{
        const res = await fetch(`/readEvent`, {
            method: 'GET',
        });
        const data = await res.json();
        const mid = data.mid;
        const username = data.username;
        const pref = data.pref_json;
        return { mid, username, pref};
    } 
    catch (err) {
        return { error: err.message };
    }
}