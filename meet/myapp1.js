let api;
function startMeeting () {
    console.log('startMeeting');
    const domain = '146.190.118.136';
    const options = {
        roomName: 'ganesh',
        width: 700,
        height: 700,
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        lang: 'de'
    };
    api = new JitsiMeetExternalAPI(domain, options);
    console.log(api);
}
const getUserMedia = () => {
    console.log(navigator?.mediaDevices,'~~~~~~~~~~~',window.navigator.mediaDevices);
    if (navigator?.mediaDevices?.getUserMedia) {
      return navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(() => ({
          audio: DevicePermissionStatus.GRANTED,
          video: DevicePermissionStatus.GRANTED
        }))
        .catch(() => {
          //Assuming that can't get video permission, retry with audio only
          console.log('DEBUG:: Can not get camera permission');
          return navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: false
            })
            .then(() => ({
              audio: DevicePermissionStatus.GRANTED,
              video: DevicePermissionStatus.REJECTED
            }));
        });
    }
    return Promise.reject(
      new Error('navigator.mediaDevices.getUserMedia is not available')
    );
  };
  getUserMedia();