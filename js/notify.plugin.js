(function ( $ ) {

	$.fn.notify = function(options) {

		// Default settings:
		var defaults = {
			type: "notify",
			info: "success",
			message: "OK",
			position: "top-right",
			callback: null,
			time: 5000
		};

		var settings = $.extend( {}, defaults, options ), el = this;

		this.debug = true;
		this.setTime = {};
		this.count = 0;
		this.DOM = function(info, message, position) {
		  // On vérifie que le container soit présent dans le DOM
		  var container = document.getElementById('notify');
		  if (!container) {
		    // Si il n'est pas présent on le créé
		    // On met à zéro les variables Globales à la création
		    el.count = 0;
		    el.setTime = {};
		    // Création du container
		    container = document.createElement('div');
			container.setAttribute('id', 'notify');
			container.className = position;
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
		  $(cross).on('click', function(e) {
		    $(alert).fadeOut(function() {
		      if (el.setTime[el.count]) clearTimeout(el.setTime[el.count]);
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
		}

		this.alert = function(info, settings) {
			// On définit le temps
			time = settings.time ? settings.time : 5000;
			// On récupère l'objet avec l'alerte créé et le container
			var obj = el.DOM(info, settings.message, settings.position);
			// On montre le container
			$(obj.container).show();
			// On affiche l'alerte
			$(obj.alert).fadeIn(function() {
				// On enregistre dans l'objet setTime le timer
				el.setTime[el.count] = setTimeout(function() {
				// Si le timer est fini on le supprime
				if (el.setTime[el.count]) clearTimeout(el.setTime[el.count]);
				// Si le timer est fini on cache l'alerte
				if (!el.debug) {
					$(obj.alert).fadeOut(function() {
					// Quand le fade est fini
					// On supprime l'alerte
					$(obj.alert).remove();
					// Si il y a une callback on l'execute
					if (settings.callback && typeof(settings.callback) === 'function') settings.callback();
					// On vérifie si il y a encore des alertes sinon on supprime le container
					el.checkAlerts();
					});
				}
				}, time);
				// On met à jour le compteur
				el.count += 1;
			});
		}

		this.checkAlerts = function() {
			if ($('#notify .notify').length == 0) $('#notify').remove();
		}

		if(settings.info === 'success') {
			el.alert('success', settings);
		}

		if(settings.info === 'fail') {
			el.alert('fail', settings);
		}

		return this;

	};

}( jQuery ));