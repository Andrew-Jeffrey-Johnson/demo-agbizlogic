window.__config = {
      environment: "{{ view.environment }}",
  };

  var onClick = false;
  var mainWidth = 5 / 6 * 100;
  function hideSide(){
    onClick = !onClick;
    if (onClick){
        document.getElementById("sidebar").style.left = '-500px';
        document.getElementById("sidebar").style.transition = 'all 0.8s ease';
        document.getElementById("main").style.width = '100%';
        document.getElementById("main").style.transition = 'all 0.8s ease';
    }
    else {
        document.getElementById("sidebar").style.left = '0';
        document.getElementById("main").style.width = mainWidth + '%';
    }
  }
