/**
 * Notify 
**/

var Notify = {
  setTime: {},
  count: 0,
  DOM: function(info, message) {
    // On vérifie que le container soit présent dans le DOM
    var container = document.getElementById('notify');
    if (!container) {
      // Si il n'est pas présent on le créé
      // On met à zéro les variables Globales à la création
      Notify.count = 0;
      Notify.setTime = {};
      // Création du container
      container = document.createElement('div');
      container.setAttribute('id', 'notify');
      container.style.display = 'none';
      // On le met à la fin du body
      $('body').append(container);
    }
    // Création de l'alerte
    var alert = document.createElement('div');
    alert.className = 'notify ' + info;
    // Suivant le type d'alerte que l'on souhaite on choisit l'icône FontAwesome
    if (info == 'success') var classes = 'fa-check';
    if (info == 'fail') var classes = 'fa-exclamation-triangle';
    if (info == 'calcul') var classes = 'fa-calculator';
    // On créé l'icône
    var icon = document.createElement('i');
    icon.className = 'fa ' + classes;
    // On l'ajoute à l'alerte
    $(alert).append(icon);
    // On créé le container du message
    var spanMessage = document.createElement('span');
    spanMessage.className = 'notify-message';
    spanMessage.innerHTML = message;
    // On ajoute le message dans l'alerte
    $(alert).append(spanMessage);
    // On ajoute une croix pour supprimer l'alerte
    var cross = document.createElement('span');
    cross.className = 'notify-cross';
    cross.innerHTML = 'x';
    $(cross).on('click', function(e) {
      $(alert).fadeOut(function() {
        if (Notify.setTime[Notify.count]) clearTimeout(Notify.setTime[Notify.count]);
        $(this).remove();
      });
      e.preventDefault();
    });

    $(alert).append(cross);
    $(container).append(alert);
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
    var obj = Notify.DOM(info, message);
    // On montre le container
    $(obj.container).show();
    // On affiche l'alerte
    $(obj.alert).fadeIn(function() {
      // On enregistre dans l'objet setTime le timer
      Notify.setTime[Notify.count] = setTimeout(function() {
        // Si le timer est fini on le supprime
        if (Notify.setTime[Notify.count]) clearTimeout(Notify.setTime[Notify.count]);
        // Si le timer est fini on cache l'alerte
        $(obj.alert).fadeOut(function() {
          // Quand le fade est fini
          // On supprime l'alerte
          $(obj.alert).remove();
          // On vérifie si il y a encore des alertes sinon on supprime le container
          Notify.checkAlerts();
          // Si il y a une callback on l'execute
          if (callback && typeof(callback) === 'function') callback();
        });
      }, time);
      // On met à jour le compteur
      Notify.count += 1;
    });
  },
  checkAlerts: function() {
    if ($('#notify .notify').length == 0) $('#notify').remove();
  },
  success: function(message, callback, time) {
    Notify.alert('success', message, callback, time);
  },
  fail: function(message, callback, time) {
    Notify.alert('fail', message, callback, time);
  }
};
