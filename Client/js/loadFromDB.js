
export async function loadMeetingJSON() {
    // fetch meeting data from db
    try{
        const res = await fetch(`/readEvent`, {
            method: 'GET',
        });
        const obj = await res.json();
        const mid = obj.data.mid;
        const value = obj.data.event_json;
        const username = obj.username;
        return { mid, value, username};
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
        const { data, username, prefs } = await res.json();
        const {mid} = data.mid;
        return { mid, user: username, pref: prefs};
    } 
    catch (err) {
        return { error: err.message };
    }
}