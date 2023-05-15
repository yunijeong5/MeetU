
export async function loadMeetingJSON() {
    // fetch meeting data from db
    try{
        const res = await fetch(`/readEvent`, {
            method: 'GET',
        });
        const data = await res.json();
        const mid = data.mid;
        const value = data.event_json;
        return { mid, value };
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
        const user = data.username;
        const pref = data.pref_json;
        return { mid, user, pref};
    } 
    catch (err) {
        return { error: err.message };
    }
}