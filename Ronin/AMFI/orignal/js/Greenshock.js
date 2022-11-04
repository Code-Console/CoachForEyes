function set_rad(){
    gsap.to(mGame, {
        duration: 8,
        rad: Math.PI,
        dis:10,
        ease: 'power2'
      })
      gsap.to(mGame.camera.position, {
        duration: 5,
        y: 2,
        ease: 'power2'
      })
}
function set_drgY2(){
    gsap.to(mGame, {
        duration: 6,
        drgY2: -900,
        drgA3: 1,
        ease: 'power1'
      });
}
function setdrgA6(){
     gsap.to(mGame, {
        duration: 5,
        drgA6: 1,
        ease: 'expo'
      })
}
function setdrgA7(val){
  gsap.to(mGame, {
     duration: 1,
     drgA7: val,
     ease: 'circ'
   })
}