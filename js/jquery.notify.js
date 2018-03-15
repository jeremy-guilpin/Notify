/********************************************
 * [Notify description]
 * jQuery Plugin for Flash Message and Alert
 * @author Jérémy Guilpin
 * @version [1.3]
 ******************************************/

var Notify = {
  setTime: {},
  count: 0,
  debug: true,
  DOM: function(info, message) {
    
    if ( typeof(info) != 'object' && Notify.debug ) console.log(typeof(info), 'info n\'est pas un Objet !');

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
        alert.className = 'notify ' + info.type;
        alert.close = function() {
          $(alert).fadeOut(function() {
            if (Notify.setTime[Notify.count]) clearTimeout(Notify.setTime[Notify.count]);
            $(this).remove();
          });
        }
    // Suivant le type d'alerte que l'on souhaite on choisit l'icône FontAwesome
    var classes = '';
    switch(info.type) {
        case 'success':
          classes = 'fa-check';
          break;
        case 'fail':
          classes = 'fa-exclamation-triangle';
          break;
        case 'calcul':
          classes = 'fa-calculator';
          break;
        default:
          classes = 'fa-check';
    }
    // On créé le titre
    var h1 = document.createElement('h1');
        h1.innerHTML = info.title;
    // On ajoute le message dans l'alerte
    $(alert).append(h1);
    // On créé le container du message
    var p = document.createElement('p');
        p.innerHTML = info.message;
    // On ajoute le message dans l'alerte
    $(alert).append(p);
    // On créé l'icône
    var icon = document.createElement('i');
        icon.className = 'fa ' + classes;
    // On l'ajoute à l'alerte
    $(alert).append(icon);
    // On créé le button
    var btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerHTML = info.textButton ? info.textButton : 'OK';
        $(btn).on('click', function(e) {
          alert.close();
          e.preventDefault();
        });
    // On l'ajoute à l'alerte
    $(alert).append(btn);
    // On ajoute une croix pour supprimer l'alerte
    var cross = document.createElement('div');
    cross.className = 'cross';
    $(cross).on('click', function(e) {
      alert.close();
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
  alert: function(info, callback, time) {
    // On définit le temps
    time = time ? time : 3000;
    // On récupère l'objet avec l'alerte créé et le container
    var obj = Notify.DOM(info);
    // On montre le container
    $(obj.container).show();
    // On affiche l'alerte
    $(obj.alert).fadeIn(function() {
      // On enregistre dans l'objet setTime le timer
      Notify.setTime[Notify.count] = setTimeout(function() {
        // Si le timer est fini on le supprime
        if (Notify.setTime[Notify.count]) clearTimeout(Notify.setTime[Notify.count]);
        // Si le timer est fini on cache l'alerte
        if (!Notify.debug) {
          $(obj.alert).fadeOut(function() {
            // Quand le fade est fini
            // On supprime l'alerte
            $(obj.alert).remove();
            // Si il y a une callback on l'execute
            if (callback && typeof(callback) === 'function') callback();
            // On vérifie si il y a encore des alertes sinon on supprime le container
            Notify.checkAlerts();
          });
        }
      }, time);
      // On met à jour le compteur
      Notify.count += 1;
    });
  },
  checkAlerts: function() {
    if ($('#notify .notify').length == 0) $('#notify').remove();
  },
  success: function(message, callback, time) {

    Notify.alert({
      type: 'success',
      title: 'Titre Succès',
      message: message
    }, callback, time);

  },
  fail: function(message, callback, time) {

    Notify.alert({
      type: 'fail', 
      title: 'Titre Fail',
      message: message
    }, callback, time);

  }
};
