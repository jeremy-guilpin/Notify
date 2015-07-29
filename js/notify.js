/**
 * Notify
**/

// requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// Fade out
function fadeOut(el, callback) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();

  if (typeof(callback) === 'function') callback(el);
}
// Fade in
function fadeIn(el, display, callback) {
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();

  if (typeof(callback) === 'function') callback(el);
}

var Notify = {
  setTime: {},
  count: 0,
  DOM: function(info, message, callback) {
    // On vérifie que le container soit présent dans le DOM
    var container = document.getElementById('notify');
    if (!container) {
      // On met à zéro les variables Globales à la création
      Notify.count = 0;
      Notify.setTime = {};
      // Création du container
      container = document.createElement('div');
      container.setAttribute('id', 'notify');
      container.style.display = 'none';
      // On le met à la fin du body
      document.body.appendChild(container);
    }
    // Création de l'alerte
    var alert = document.createElement('div');
    alert.className = 'notify ' + info;
    alert.setAttribute('data-time', Notify.count);
    // Suivant le type d'alerte que l'on souhaite on choisit l'icône FontAwesome
    if (info == 'success') var classes = 'fa-check';
    if (info == 'fail') var classes = 'fa-exclamation-triangle';
    if (info == 'calcul') var classes = 'fa-calculator';
    // On créé l'icône
    var icon = document.createElement('i');
    icon.className = 'fa ' + classes;
    // On l'ajoute à l'alerte
    alert.appendChild(icon);
    // On créé le container du message
    var spanMessage = document.createElement('span');
    spanMessage.className = 'notify-message';
    spanMessage.innerHTML = message;
    // On ajoute le message dans l'alerte
    alert.appendChild(spanMessage);
    // On ajoute une croix pour supprimer l'alerte
    var cross = document.createElement('span');
    cross.className = 'notify-cross';
    cross.innerHTML = 'x';
    cross.addEventListener('click', function(e) {
      fadeOut(alert, function(el) {
        if (el.getAttribute('data-time')) {
          var dataTime = el.getAttribute('data-time');
          if (Notify.setTime[dataTime]) clearTimeout(Notify.setTime[dataTime]);
          if (el) el.parentNode.removeChild(el);
          Notify.checkAlerts();
          if (callback && typeof(callback) === 'function') callback();
        }
      });
      e.preventDefault();
    });

    alert.appendChild(cross);
    container.appendChild(alert);

    // On stock l'alerte que l'on vient de créé et le container
    var obj = {
      'container': container,
      'alert': alert
    }
    // On envoie l'objet à la fonction suivante
    return obj;
  },
  alert: function(info, message, callback, time) {
    // On définit le temps
    time = time ? time : 5000;
    // On récupère l'objet avec l'alerte créé et le container
    var obj = Notify.DOM(info, message, callback);
    // On montre le container
    obj.container.style.display = 'block';
    // On affiche l'alerte
    fadeIn(obj.alert, 'block', function() {
      var execTime = function() {
        if (obj.alert.getAttribute('data-time')) {
          var dataTime = obj.alert.getAttribute('data-time');
          // Si le timer est fini on le supprime
          if (Notify.setTime[dataTime]) clearTimeout(Notify.setTime[dataTime]);
          // Si le timer est fini on cache l'alerte
          fadeOut(obj.alert, function(el) {
            // On supprime l'alerte
            if (el) el.parentNode.removeChild(el);
            // On vérifie si il y a encore des alertes sinon on supprime le container
            Notify.checkAlerts();
            // Si il y a une callback on l'execute
            if (callback && typeof(callback) === 'function') callback();
          });
        }
      };
      // On enregistre dans l'objet setTime le timer
      if (obj.alert.getAttribute('data-time')) {
        var dataTime = obj.alert.getAttribute('data-time');
        Notify.setTime[dataTime] = window.setTimeout(execTime, time);
      }
    });
    // On met à jour le compteur
    Notify.count += 1;
  },
  checkAlerts: function() {
    if (document.querySelectorAll('#notify .notify').length == 0) {
      var notify = document.querySelector('#notify');
      notify.parentNode.removeChild(notify);
    }
  },
  success: function(message, callback, time) {
    Notify.alert('success', message, callback, time);
  },
  fail: function(message, callback, time) {
    Notify.alert('fail', message, callback, time);
  }
};
