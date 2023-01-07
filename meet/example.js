/* global $, JitsiMeetJS */
//"//meet-uat.inspify.io//http-bind"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const confID = urlParams.get("meeting");

const conference = confID || "conference";
const domain = "meet.jit.si";
const options = {
  hosts: {
    domain: domain,
    muc: `conference.${domain}`,
  },
  bosh: `//${domain}//http-bind`,
  externalConnectUrl: `https://${domain}/http-pre-bind`,
  enableP2P: true,
  p2p: {
    enabled: true,
    preferH264: true,
    disableH264: true,
    useStunTurn: true,
  },
  useStunTurn: true,
  bosh: `https://${domain}/http-bind?room=liveroom`,
  websocket: `wss://${domain}/xmpp-websocket`,
  clientNode: "http://jitsi.org/jitsimeet",
};
console.error("options", options);
const confOptions = {};

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
const remoteTracks = {};
let videoRemoteCount = 1;
/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
function onLocalTracks(tracks) {
  localTracks = tracks;
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
      (audioLevel) => console.log(`Audio Level local: ${audioLevel}`)
    );
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      () => console.log("local track muted")
    );
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
      () => console.log("local track stoped")
    );
    localTracks[i].addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      (deviceId) =>
        console.log(`track audio output device was changed to ${deviceId}`)
    );
    if (localTracks[i].getType() === "video") {
      $("#video-ele").append(
        `<video autoplay='1' id='localVideo${i}' class='video-back'/>`
      );
      localTracks[i].attach($(`#localVideo${i}`)[0]);
    } else {
      $("#video-ele").append(
        `<audio autoplay='1' muted='true' id='localAudio${i}' />`
      );
      localTracks[i].attach($(`#localAudio${i}`)[0]);
      setTimeout(() => {
        setVideo();
      }, 100);
    }
    if (isJoined) {
      room.addTrack(localTracks[i]);
    }
  }
}

/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
function onRemoteTrack(track) {
  console.error("onRemoteTrack~~~~~", track);
  if (track.isLocal()) {
    return;
  }
  const participant = track.getParticipantId();

  if (!remoteTracks[participant]) {
    remoteTracks[participant] = [];
  }
  const idx = remoteTracks[participant].push(track);
  console.error("onRemoteTrack~~~~~@@~~", remoteTracks);
  track.addEventListener(
    JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
    (audioLevel) => console.log(`Audio Level remote: ${audioLevel}`)
  );
  track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () =>
    console.log("remote track muted")
  );
  track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () =>
    console.log("remote track stoped")
  );
  track.addEventListener(
    JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
    (deviceId) =>
      console.log(`track audio output device was changed to ${deviceId}`)
  );
  const id = participant + track.getType() + idx;

  if (track.getType() === "video") {
    $("#video-ele").append(
      `<video autoplay='1' id='${participant}video${idx}' class='video-back'/>`
    );
  } else {
    $("#video-ele").append(
      `<audio autoplay='1' id='${participant}audio${idx}' />`
    );
  }
  setTimeout(() => {
    setVideo();
  }, 300);
  track.attach($(`#${id}`)[0]);
}

/**
 * That function is executed when the conference is joined
 */
function onConferenceJoined() {
  console.error("conference joined!");
  isJoined = true;
  for (let i = 0; i < localTracks.length; i++) {
    room.addTrack(localTracks[i]);
  }
}

/**
 *
 * @param id
 */
function onUserLeft(id) {
  console.error("user left");
  if (!remoteTracks[id]) {
    return;
  }
  const tracks = remoteTracks[id];

  for (let i = 0; i < tracks.length; i++) {
    tracks[i].detach($(`#${id}${tracks[i].getType()}`));
  }
  setVideo();
}

/**
 * That function is called when connection is established successfully
 */
function onConnectionSuccess() {
  console.error("~~~a~~", conference);
  room = connection.initJitsiConference(conference, confOptions);
  room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
  room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, (track) => {
    delete remoteTracks[track.getParticipantId()];
    console.error(
      remoteTracks,
      `track removed!!!${track}`,
      track.getParticipantId()
    );
    setVideo({ remove: track.getParticipantId() });
  });
  room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
  room.on(JitsiMeetJS.events.conference.USER_JOINED, (id) => {
    console.error("user join");
    remoteTracks[id] = [];
  });
  room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
  room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, (track) => {
    console.log(`${track.getType()} - ${track.isMuted()}`);
  });
  room.on(
    JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
    (userID, displayName) => console.log(`${userID} - ${displayName}`)
  );
  room.on(
    JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
    (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`)
  );
  room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, () =>
    console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`)
  );
  room.on(
    JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED,
    onEndpointMessage
  );

  room.setReceiverVideoConstraint(480);
  room.setSenderVideoConstraint(480);
  room.join();
  room.setDisplayName("user-" + Math.floor(Math.random() * 1000));
}

/**
 * This function is called when the connection fail.
 */
function onConnectionFailed() {
  console.log("~~~c~~", "Connection Failed");
  console.error("Connection Failed!");
}

/**
 * This function is called when the connection fail.
 */
function onDeviceListChanged(devices) {
  console.info("current devices", devices);
}

/**
 * This function is called when we disconnect.
 */
function disconnect() {
  console.log("~~~~~~~~~~d~~~~", "disconnect!");
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess
  );
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    onConnectionFailed
  );
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    disconnect
  );
}

/**
 *
 */
function unload() {
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].dispose();
  }
  room.leave();
  connection.disconnect();
}

let isVideo = true;

/**
 *
 */
function switchVideo() {
  // eslint-disable-line no-unused-vars
  isVideo = !isVideo;
  if (localTracks[1]) {
    localTracks[1].dispose();
    localTracks.pop();
  }
  JitsiMeetJS.createLocalTracks({
    devices: [isVideo ? "video" : "desktop"],
  })
    .then((tracks) => {
      localTracks.push(tracks[0]);
      localTracks[1].addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.error("local track muted")
      );
      localTracks[1].addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => switchVideo()
      );
      localTracks[1].attach($("#localVideo1")[0]);
      room.addTrack(localTracks[1]);
    })
    .catch((error) => switchVideo());
}

/**
 *
 * @param selected
 */
function changeAudioOutput(selected) {
  // eslint-disable-line no-unused-vars
  JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
}

$(window).bind("beforeunload", unload);
$(window).bind("unload", unload);

// JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

const initOptions = {
  disableAudioLevels: true,
};
const initJitsi = () => {
  JitsiMeetJS.init(initOptions);

  connection = new JitsiMeetJS.JitsiConnection(null, null, options);

  console.log("~~~b~~", "yogeshbangar");

  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess
  );
  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    onConnectionFailed
  );
  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    disconnect
  );

  JitsiMeetJS.mediaDevices.addEventListener(
    JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
    onDeviceListChanged
  );

  connection.connect();

  JitsiMeetJS.createLocalTracks({ devices: ["audio", "video"] })
    .then(onLocalTracks)
    .catch((error) => {
      throw error;
    });

  if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable("output")) {
    JitsiMeetJS.mediaDevices.enumerateDevices((devices) => {
      const audioOutputDevices = devices.filter(
        (d) => d.kind === "audiooutput"
      );

      if (audioOutputDevices.length > 1) {
        $("#audioOutputSelect").html(
          audioOutputDevices
            .map((d) => `<option value="${d.deviceId}">${d.label}</option>`)
            .join("\n")
        );

        $("#audioOutputSelectWrapper").show();
      }
    });
  }
};
const sendMessage = () => {
  const msgStr = $("#msg-txt").val();
  $("#msg-txt").val("");
  console.error("room ", msgStr);
  if (msgStr?.trim().length > 0) {
    room.sendEndpointMessage("", {
      msg: msgStr,
    });
    setMsgElement("you", msgStr);
  }
};
const onEndpointMessage = (sender, payload) => {
  setMsgElement(sender?._displayName, payload.msg);
};
const setMsgElement = (name, msg) => {
  $("#chatMessages").append(`<p class="chat-message">💻${name}:${msg}</p>`);
  const $target = $("#chatPanel");
  $target.animate({ scrollTop: $target.height() }, 1000);
};
