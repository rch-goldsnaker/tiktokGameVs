// This will use the demo backend if you open index.html locally via file://, otherwise your server will be used
let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
let connection = new TikTokIOConnection(backendUrl);

// Counter
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0;

function NewUsers ( id, picture, message){
    this.id = id;
    this.picture = picture;
    this.message = message
}
var arrayUserId = []
var arrayNewUsersLeft = []
var arrayNewUsersRight = []

// These settings are defined by obs.html
if (!window.settings) window.settings = {};

$(document).ready(() => {
    $('#connectButton').click(connect);
    $('#uniqueIdInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            connect();
        }
    });

    if (window.settings.username) connect();
    //connect();
})

function connect() {
    let uniqueId = window.settings.username || $('#uniqueIdInput').val();
    //let uniqueId = "minikitchen686";
    if (uniqueId !== '') {

        $('#stateText').text('Connecting...');

        connection.connect(uniqueId, {
            enableExtendedGiftInfo: true
        }).then(state => {
            $('#stateText').text(`Connected to roomId ${state.roomId}`);

            // reset stats
            viewerCount = 0;
            likeCount = 0;
            diamondsCount = 0;
            updateRoomStats();

        }).catch(errorMessage => {
            $('#stateText').text(errorMessage);

            // schedule next try if obs username set
            if (window.settings.username) {
                setTimeout(() => {
                    connect(window.settings.username);
                }, 30000);
            }
        })

    } else {
        alert('no username entered');
    }
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
    return text.replace(/</g, '&lt;')
}

function updateRoomStats() {
    $('#roomStats').html(`Viewers: <b>${viewerCount.toLocaleString()}</b> Likes: <b>${likeCount.toLocaleString()}</b> Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b>`)
}

function generateUsernameLink(data) {
    return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
}

function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

/**
 * Add a new message to the chat container
 */
function addChatItem(color, data, text, summarize) {
    // let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.chatcontainer');

    // if (container.find('div').length > 500) {
    //     container.find('div').slice(0, 200).remove();
    // }

    // container.find('.temporary').remove();;

    // container.append(`
    //     <div class=${summarize ? 'temporary' : 'static'}>
    //         <img class="miniprofilepicture" src="${data.profilePictureUrl}">
    //         <span>
    //             <b>${generateUsernameLink(data)}:</b> 
    //             <span style="color:${color}">${sanitize(text)}</span>
    //         </span>
    //     </div>
    // `);

    // container.stop();
    // container.animate({
    //     scrollTop: container[0].scrollHeight
    // }, 400);
}

/**
 * Add a new gift to the gift container
 */
function addGiftItem(data) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.giftcontainer');

    if (container.find('div').length > 200) {
        container.find('div').slice(0, 100).remove();
    }

    let streakId = data.userId.toString() + '_' + data.giftId;

    let html = `
        <div data-streakid=${isPendingStreak(data) ? streakId : ''}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> <span>${data.describe}</span><br>
                <div>
                    <table>
                        <tr>
                            <td><img class="gifticon" src="${data.giftPictureUrl}"></td>
                            <td>
                                <span>Name: <b>${data.giftName}</b> (ID:${data.giftId})<span><br>
                                <span>Repeat: <b style="${isPendingStreak(data) ? 'color:red' : ''}">x${data.repeatCount.toLocaleString()}</b><span><br>
                                <span>Cost: <b>${(data.diamondCount * data.repeatCount).toLocaleString()} Diamonds</b><span>
                            </td>
                        </tr>
                    </tabl>
                </div>
            </span>
        </div>
    `;

    let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

    if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
    } else {
        container.append(html);
    }

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 800);
}


// viewer stats
connection.on('roomUser', (msg) => {
    if (typeof msg.viewerCount === 'number') {
        viewerCount = msg.viewerCount;
        updateRoomStats();
    }
})

// like stats
connection.on('like', (msg) => {

    if (!arrayUserId.includes(msg.userId)){
        arrayUserId.push(msg.userId)
        arrayNewUsersLeft.push(new NewUsers (msg.userId, msg.profilePictureUrl))
    }

    // if (typeof msg.totalLikeCount === 'number') {
    //     likeCount = msg.totalLikeCount;
    //     updateRoomStats();
    // }

    // if (window.settings.showLikes === "0") return;

    // if (typeof msg.likeCount === 'number') {
    //     addChatItem('#447dd4', msg, msg.label.replace('{0:user}', '').replace('likes', `${msg.likeCount} likes`))
    // }
})

// Member join
let joinMsgDelay = 0;
connection.on('member', (msg) => {
    if (window.settings.showJoins === "0") return;

    let addDelay = 250;
    if (joinMsgDelay > 500) addDelay = 100;
    if (joinMsgDelay > 1000) addDelay = 0;

    joinMsgDelay += addDelay;

    setTimeout(() => {
        joinMsgDelay -= addDelay;
        addChatItem('#21b2c2', msg, 'joined', true);
    }, joinMsgDelay);
})

// New chat comment received
connection.on('chat', (msg) => {
    // if (window.settings.showChats === "0") return;
    // addChatItem('', msg, msg.comment);

    // if (!arrayUserId.includes(msg.userId)){
    //     for (var i = 0; i < arrayNewUsersRight.length; i++) {
    //         if (arrayNewUsersRight[i].id = msg.userId){
    //             console.log(msg.comment)
    //             arrayNewUsersRight[i].message = msg.comment
    //         }
    //     }
    //     for (var i = 0; i < arrayNewUsersLeft.length; i++) {
    //         if (arrayNewUsersLeft[i].id = msg.userId){
    //             console.log(msg.comment)
    //             arrayNewUsersLeft[i].message = msg.comment
    //         }
    //     }
    // }
})

// New gift received
connection.on('gift', (data) => {
    if (!isPendingStreak(data) && data.diamondCount > 0) {
        diamondsCount += (data.diamondCount * data.repeatCount);
        updateRoomStats();
    }

    if (window.settings.showGifts === "0") return;

    addGiftItem(data);

    console.log(data)
    console.log(data.giftName)
    console.log(data.repeatCount)

    if ( data.giftName == "Rose"){
        console.log("es una rosa")
        for (var i = 0; i < 5; i++){
            poseRaw = loadImage(data.profilePictureUrl,makeCircleLeft,failPictureLoad);
        }
    }
    if ( data.giftName == "TikTok"){
        console.log("es una tiktok")
        for (var i = 0; i < 5; i++){
            poseRaw2 = loadImage(data.profilePictureUrl,makeCircleRight,failPictureLoad);
        }
    }
})

// share, follow
connection.on('social', (data) => {

    if (!arrayUserId.includes(data.userId)){
        arrayUserId.push(data.userId)
        arrayNewUsersRight.push(new NewUsers (data.userId, data.profilePictureUrl))
    }

    if (window.settings.showFollows === "0") return;

    let color = data.displayType.includes('follow') ? '#ff005e' : '#2fb816';
    addChatItem(color, data, data.label.replace('{0:user}', ''));
})

connection.on('streamEnd', () => {
    $('#stateText').text('Stream ended.');

    // schedule next try if obs username set
    if (window.settings.username) {
        setTimeout(() => {
            connect(window.settings.username);
        }, 30000);
    }
})