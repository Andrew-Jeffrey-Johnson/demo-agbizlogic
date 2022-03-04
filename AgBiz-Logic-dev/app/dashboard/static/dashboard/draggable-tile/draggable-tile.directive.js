(function() {
  'use strict';

  angular
    .module("dashboardModule")
    .directive('draggableTile', draggableTile)
    .directive('dropZone', dropZone);

  function draggableTile() {
    return {
      restrict: 'A',
      bindToController: true,
      link: function(scope, element, attrs) {
        var element = element[0];

        element.setAttribute("draggable", "true");
        element.addEventListener('dragstart', handleDragStart, false);
        element.addEventListener('dragend', handleDragEnd, false);


        /****************************************************************
                             Methods
        ****************************************************************/

        function handleDragStart(event) {
          this.style.opacity = '0.4';
          event.dataTransfer.setData('text/plain', event.target.id);
          // Need to manipulate the DOM after the dragstart event has fired (http://stackoverflow.com/q/14203734)
          var id = event.target.id;
          setTimeout(function() {
            scope.$emit("dragEventStart", {'id': id});
          }, 10);
        }


        function handleDragEnd(event) {
          this.style.opacity = '1.0';
          // Need to manipulate the DOM after the dragstart event has fired (http://stackoverflow.com/q/14203734)
          setTimeout(function() {
            scope.$emit("dragEventEnd");
          }, 10);
        }
      },
    }
  }



  /*
      Every draggable tile has a drop zone above it where other draggable tiles can be dropped. The tile is then
      inserted above the destination tile.
  */
  function dropZone() {
    return {
      restrict: "E",
      bindToController: true,
      link: function(scope, element, attrs) {
        var element = element[0];

        element.position = attrs.position;
        element.addEventListener('drop', handleDrop, false);
        element.addEventListener('dragover', handleDragOver, false);

        element.classList.add("col-md-11");

        // Register event listeners
        scope.$on("dragEventStart", function(event, data) {
          if (data['id'] != element.parentNode.id) {
            element.classList.add("drop-zone-active");
            element.innerHTML = "<span class='glyphicon glyphicon-plus col-md-offset-6' style='margin-top: 15px;'></span>";
          }
        });
        scope.$on("dragEventEnd", function() {
          element.classList.remove("drop-zone-active");
          element.innerHTML = "";
        });


        /****************************************************************
                             Methods
        ****************************************************************/

        function handleDrop(event) {
          var payload = document.getElementById(event.dataTransfer.getData('text/plain'));
          event.preventDefault();
          event.stopPropagation();
          if (event.target.position == "top") {
            this.parentNode.parentNode.insertBefore(payload, this.parentNode);
          }
          else if (event.target.position == "bottom") {
            if (this.parentNode.nextSibling !== null) {
              this.parentNode.parentNode.insertBefore(payload, this.parentNode.nextSibling);
            }
            else {
              this.parentNode.parentNode.appendChild(payload);
            }
          }
        }


        function handleDragOver(event) {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
          return false;
        }
      }
    }
  }

}());
