/* Source and licensing information for the line(s) below can be found at http://178.62.34.160/misc/textarea.js. */
(function($){Drupal.behaviors.textarea={attach:function(context,settings){$('.form-textarea-wrapper.resizable',context).once('textarea',function(){var staticOffset=null,textarea=$(this).addClass('resizable-textarea').find('textarea'),grippie=$('<div class="grippie"></div>').mousedown(startDrag);grippie.insertAfter(textarea)
function startDrag(e){staticOffset=textarea.height()-e.pageY;textarea.css('opacity',0.25);$(document).mousemove(performDrag).mouseup(endDrag);return false}
function performDrag(e){textarea.height(Math.max(32,staticOffset+e.pageY)+'px');return false}
function endDrag(e){$(document).unbind('mousemove',performDrag).unbind('mouseup',endDrag);textarea.css('opacity',1)}})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at http://178.62.34.160/misc/textarea.js. */
;/*})'"*/
